"""
ResQNet AI - Mission Core Application Factory.

Configures the FastAPI application, CORS middleware, WebSocket live feed,
modular REST API routers, and single-port SPA static distribution.
"""

from __future__ import annotations

import json
import logging
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from backend.config import settings
from backend.routers import (
    alerts,
    auth,
    evidence,
    hazards,
    reports,
    risk,
    routes,
    shelters,
    simulation,
    system,
)

logger = logging.getLogger("resqnet.core")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("ResQNet AI operational core initialized [Mode: %s]", settings.DATA_MODE)
    yield
    logger.info("ResQNet AI operational core shutdown complete")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Policy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Subsystem Routers under /api/v1
for router_module in (
    auth,
    reports,
    hazards,
    evidence,
    risk,
    simulation,
    routes,
    shelters,
    alerts,
    system,
):
    app.include_router(router_module.router, prefix=settings.API_V1_PREFIX)


class ConnectionManager:
    """Manages active WebSocket telemetry subscribers and event fanout."""

    def __init__(self) -> None:
        self._active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self._active_connections.append(websocket)
        logger.debug("Telemetry subscriber connected. Total active: %d", len(self._active_connections))

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self._active_connections:
            self._active_connections.remove(websocket)
            logger.debug("Telemetry subscriber disconnected. Total active: %d", len(self._active_connections))

    async def broadcast(self, payload: dict[str, Any]) -> None:
        disconnected: list[WebSocket] = []
        for connection in self._active_connections:
            try:
                await connection.send_json(payload)
            except Exception:
                disconnected.append(connection)

        for stale in disconnected:
            self.disconnect(stale)


ws_manager = ConnectionManager()


@app.websocket("/ws/live-feed")
async def websocket_live_feed(websocket: WebSocket) -> None:
    await ws_manager.connect(websocket)
    try:
        await websocket.send_json({
            "type": "SYSTEM_CONNECTED",
            "region": settings.DEFAULT_REGION_NAME,
            "mode": settings.DATA_MODE.upper(),
            "status": "OPERATIONAL",
        })
        while True:
            raw_text = await websocket.receive_text()
            try:
                payload = json.loads(raw_text)
                if payload.get("action") == "TRIGGER_SIMULATION":
                    await ws_manager.broadcast({
                        "type": "SIMULATION_PULSE",
                        "event": "Surge escalation triggered across Puri Marine Drive",
                        "risk_score": 86,
                        "confidence": 92,
                    })
            except json.JSONDecodeError:
                logger.warning("Discarded non-JSON telemetry frame: %s", raw_text[:80])
    except (WebSocketDisconnect, Exception):
        ws_manager.disconnect(websocket)


@app.get("/api/health")
async def root_health() -> dict[str, str]:
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "tagline": settings.TAGLINE,
        "mode": settings.DATA_MODE,
        "status": "OPERATIONAL",
    }


# Static Asset Distribution & Single-Page Application (SPA) Routing
frontend_dir = Path(__file__).resolve().parent.parent / "frontend"
dist_dir = frontend_dir / "dist"

if dist_dir.exists():
    assets_dir = dist_dir / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/")
    async def serve_root() -> FileResponse:
        return FileResponse(dist_dir / "index.html")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str) -> FileResponse:
        target = dist_dir / full_path
        if target.is_file():
            return FileResponse(target)
        return FileResponse(dist_dir / "index.html")

elif frontend_dir.exists():
    app.mount("/static", StaticFiles(directory=str(frontend_dir)), name="static")

    @app.get("/")
    async def serve_index() -> FileResponse:
        return FileResponse(frontend_dir / "index.html")
