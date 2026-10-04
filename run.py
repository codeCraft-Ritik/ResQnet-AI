"""
ResQNet AI - Mission Core Server Launcher.

Initializes the Uvicorn ASGI server hosting the FastAPI backend,
WebSocket live telemetry gateway, and single-port SPA static asset server.
"""

from __future__ import annotations

import logging
import os
import sys
from pathlib import Path
import uvicorn

ROOT_DIR = Path(__file__).resolve().parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("resqnet.launcher")


def main() -> None:
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    reload_enabled = os.getenv("APP_ENV", "production").lower() == "development"

    logger.info("Initializing ResQNet AI Mission Core on http://%s:%d", host, port)
    logger.info("OpenAPI Documentation: http://%s:%d/docs", host, port)

    uvicorn.run(
        "backend.app:app",
        host=host,
        port=port,
        reload=reload_enabled,
        log_level="info",
        access_log=True,
    )


if __name__ == "__main__":
    main()
