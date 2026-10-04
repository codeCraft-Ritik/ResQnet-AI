# RESQNET AI — Complete Codebase & System Architecture Documentation

> **AI-Powered Multi-Source Ocean & Coastal Disaster Intelligence, Verification, Risk Assessment, and Last-Mile Action Platform**  
> *Ministry of Earth Sciences (MoES) — Smart India Hackathon (PS ID: SIH25039)*

---

## 1. Executive Summary & Purpose

India's 7,516 km coastline experiences frequent tropical depressions, severe cyclonic storms, high swell waves, and tidal surges. Coastal disaster management often suffers from:
1. **Disconnected Data Silos**: Government meteorological bulletins, deep-sea buoys, radar, satellite imagery, and citizen ground observations operate in isolation.
2. **Verification Delays**: Social media chatter and crowdsourced reports are noisy, unverified, and prone to panic or misinformation.
3. **Black-Box AI Models**: Incident commanders cannot trust automated predictions if they cannot see *why* a risk score is high or which physical factors drive it.
4. **Generic Last-Mile Alerts**: Evacuation advisories rarely account for real-time flooded roads and dynamic shelter bed availability.

**RESQNET AI** solves this with an end-to-end, interpretable 8-stage operational pipeline:
```
SENSE ──► EXTRACT ──► VERIFY ──► PREDICT ──► SIMULATE ──► DECIDE ──► ACT ──► LEARN
```
Every prediction is cross-corroborated across independent sensor and eyewitness channels, assigned an explainable confidence score (capped at 98% for epistemic humility), decomposed into physical factor weights using **TreeSHAP**, and paired with dynamic **A\* safer route pathfinding** to designated storm shelters.

---

## 2. High-Level Runtime Architecture

```mermaid
flowchart TB
    subgraph ClientEdge ["1. Client Edge & Field Operations"]
        PWA["📱 Citizen SOS & PWA<br/><i>Offline-First / Service Worker</i>"]
        HUD["🖥️ Tactical Operations HUD<br/><i>React 18 / Liquid Glass UI</i>"]
    end

    subgraph CoreBackend ["2. ResQNet AI Mission Core (FastAPI Engine)"]
        AUTH["🔒 Role-Based Access Control (RBAC)<br/><i>JWT / Authority vs Citizen Scopes</i>"]
        GW["🌐 API & WebSocket Gateway<br/><i>Vite Reverse Proxy :8000</i>"]
        CORE["⚡ FastAPI Core Engine<br/><i>Asynchronous REST & WSS /ws/live-feed</i>"]
        DB[("🗄️ Geo-Spatial Data Store<br/><i>Spatial SQLite / PostGIS Compatible</i>")]
        
        subgraph MLSubsystems ["3. Analytical & AI Decision Core"]
            NLP["🧠 Multilingual NLP Parser<br/><i>English, Hindi, Hinglish Extraction</i>"]
            VISION["👁️ Vision Damage Inspector<br/><i>Water Intrusion & Breach Analysis</i>"]
            FUSION["🎯 Bayesian Evidence Fusion<br/><i>Cross-Corroboration Matrix</i>"]
            XAI["📊 Explainable AI (TreeSHAP)<br/><i>Factor Weight Decomposition</i>"]
            ROUTE["🧭 A* Safer Evacuation Pathfinder<br/><i>Hazard Avoidance Routing</i>"]
        end
    end

    subgraph DataFeeds ["4. National Ingestion & Public Dispatch"]
        IMD["📡 IMD Coastal Observatories<br/><i>Radar, Bulletins, 7-Day City Forecast</i>"]
        INCOIS["🌊 INCOIS Ocean Buoys & QuikSCAT<br/><i>Buoy BOB-04 & Wind Stress Curl Grid</i>"]
        SAT["🛰️ MOSDAC & Sentinel SAR<br/><i>INSAT-3DR QPE & Inundation Masks</i>"]
        CBS["📢 Cell Broadcast (CBS) & Relays<br/><i>Zero-Cost Public SMS Relays</i>"]
    end

    IMD --> CORE
    INCOIS --> CORE
    SAT --> CORE

    PWA -- "HTTPS SOS & Offline Sync" --> GW
    HUD -- "WSS Live Telemetry Stream" --> GW
    GW -. "Validate RBAC" .-> AUTH
    GW --> "Reverse Proxy Dispatch" --> CORE

    CORE --> "Spatial Query" --> DB
    CORE --> "Text & Media" --> NLP
    CORE --> "Photo Damage" --> VISION
    CORE --> "Evidence Ingestion" --> FUSION
    FUSION --> "Consensus Risk" --> XAI
    XAI --> "Risk Surface" --> ROUTE
    DB --> "Roads & Shelters" --> ROUTE

    ROUTE -- "Evacuation Corridors" --> CBS
    CBS -. "Broadcast Alerts" .-> PWA
```

- 🌐 **Interactive Diagram**: [`docs/diagrams/index.html`](file:///r:/All-Prog/Data-Visualization/ResQnet%20AI/docs/diagrams/index.html)
- 📋 **Diagram Spec (JSON)**: [`docs/diagrams/candidate.json`](file:///r:/All-Prog/Data-Visualization/ResQnet%20AI/docs/diagrams/candidate.json)

---

## 3. Frontend Architecture (`frontend/`)

Built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Vite**. The user interface adopts an **Aqua Liquid Glass Design System** optimized for tactical night-vision and high cognitive clarity.

### A. Pages (`frontend/src/pages/`)
1. **`LandingPage.tsx`**: Executive presentation page featuring the interactive 3D particle globe, platform overview, innovation metrics, and quick feature navigation.
2. **`LocationIntelligencePage.tsx`**: Dedicated coastal intelligence dashboard supporting 20+ major Indian maritime ports and districts (Puri, Paradip, Gopalpur, Chandipur, Chennai, Mumbai, Visakhapatnam, Kochi, Kolkata, etc.). Displays localized hazard perimeters, station telemetry, and operational shelters.
3. **`LiveMapPage.tsx`**: Fullscreen tactical GIS operations map using Leaflet.js and CartoDB Dark Matter tiles, rendering animated hazard polygons, ocean buoy vectors, and live crowdsourced SOS alerts.
4. **`CommandCenterPage.tsx`**: Incident Commander Operations HUD featuring the 6-KPI live command bar, Bayesian evidence matrix, XAI feature attribution charts, and real-time report approval controls.
5. **`CitizenReportingPage.tsx`**: Mobile-first crowdsourcing interface with instant AI pre-check for disaster photos and bilingual text reports.
6. **`SimulationPage.tsx`**: Parametric crisis stress-testing studio with real-time sliders (Wave Surge, Wind Speed, Rainfall, Sea Level Rise) and the 8-Stage Disaster Response Lifecycle modal.
7. **`AlertsPage.tsx`**: Unified tripartite alert feed clearly separating Official Government Warnings, AI Predictive Alerts, and Verified Crowdsourced Events.
8. **`NotFoundPage.tsx`**: Custom glassmorphism 404 handler with return navigation.

### B. Core Components (`frontend/src/components/`)
- **`map/`**: `DisasterMap.tsx` (Leaflet GIS map), `MapLayers.tsx` (layer toggles for wind, surge, shelters, radar), `MapLegend.tsx`.
- **`risk/`**: `RiskCard.tsx` (gauge chart), `XAIPanel.tsx` (SHAP decomposition), `RiskBreakdown.tsx`, `RiskAnalyticsChart.tsx`.
- **`evidence/`**: `EvidencePanel.tsx` (Bayesian consensus table detailing source category, reliability, and weight score).
- **`routes/`**: `SaferRouteCard.tsx` (A* pathfinding UI with turn-by-turn navigation and offline SMS copy button).
- **`ocean/`**: `OceanCard.tsx` (buoy metrics), `WindStressCard.tsx` (INCOIS QuikSCAT scatterometer wind stress, curl, and cyclonic pumping state).
- **`weather/`**: `WeatherCard.tsx`, `CityForecastCard.tsx` (IMD 7-day city weather), `LiveIndiaSatelliteModal.tsx` (INSAT-3DR multi-spectral views).
- **`reports/`**: `CitizenReportForm.tsx` (with real-time AI NLP/vision preview), `ReportCard.tsx`.
- **`simulation/`**: `ScenarioSimulator.tsx` (interactive crisis sliders), `PipelineModal.tsx` (8-stage pipeline timeline).
- **`search/`**: `SearchModal.tsx` (Ctrl+K global location intelligence search for 20+ coastal stations).
- **`layout/`**: `Navbar.tsx` (glass navigation with role switcher), `Footer.tsx`, `AuroraBackground.tsx`.

### C. Services & Client APIs (`frontend/src/services/`)
- **`apiClient.ts`**: Axios/Fetch client wrapper handling proxy routes and offline resilience.
- **`hazardService.ts`**: Fetches active hazards, INCOIS ocean grids, and IMD coastal bulletins.
- **`locationService.ts`**: Coordinates, shelters, and hazard queries for 20+ coastal stations.
- **`riskService.ts`**: AI risk score assessments, SHAP factor explanations, and role-based action directives.
- **`routeService.ts`**: Dispatches safe route requests to the A* pathfinder.
- **`reportService.ts`**: Submits crowdsourced reports and triggers real-time pre-check previews.
- **`simulationService.ts`**: Executes parametric simulation runs and pipeline demo playback.
- **`systemService.ts`**: System health status, operational metrics, and zero-cost CBS alert dispatches.

---

## 4. Backend Architecture (`backend/`)

Built with **Python 3.11+**, **FastAPI**, **Pydantic v2**, and **Uvicorn**.

### A. Core Engine (`backend/app.py` & `backend/config.py`)
- **FastAPI Application**: Configures CORS middleware, WebSocket connection manager (`/ws/live-feed`), API routing under `/api/v1`, and health endpoints.
- **Single-Server Production Serving**: Automatically detects the built React frontend (`frontend/dist/`) and mounts static assets with SPA fallback routing so the entire system runs on a single port (`8000`).
- **Configuration (`Settings`)**: Pydantic settings loading `.env` variables, setting data paths, and managing API credentials.

### B. Database & In-Memory Store (`backend/database/`)
- **`schemas.py`**: Strict Pydantic models for request/response validation (`CitizenReportCreate`, `HazardEventOut`, `EvidenceMatrixOut`, `XAIExplanationOut`, `SimulationRequest`, `SafeRouteRequest`, etc.) and Enums (`RoleEnum`, `SeverityEnum`, `VerificationStatus`).
- **`store.py`**: In-memory Geo-Spatial DataStore initialized with `data/pilot_puri.json`. Manages live report updates, dynamic hazard perimeter lookups, and coastal station mappings (`COASTAL_LOCATIONS_MAP`).

### C. API Routers (`backend/routers/`)
| Router Module | Route Prefix | Key Endpoints | Operational Function |
| :--- | :--- | :--- | :--- |
| **`hazards.py`** | `/hazards` | `GET /`<br/>`GET /incois/wind-stress`<br/>`GET /incois/ocean-grid`<br/>`GET /imd/coastal-bulletin`<br/>`GET /imd/city-forecast` | Delivers active hazard perimeters, INCOIS QuikSCAT scatterometer data, and official IMD weather forecasts. |
| **`reports.py`** | `/reports` | `GET /`<br/>`POST /`<br/>`POST /analyze-preview`<br/>`POST /{id}/verify` | Ingests crowdsourced reports, runs instant NLP/vision pre-checks, and enables authority verification. |
| **`evidence.py`** | `/evidence` | `GET /{hazard_id}` | Computes the Bayesian multi-source evidence matrix and consensus confidence score. |
| **`risk.py`** | `/risk` | `GET /assess`<br/>`GET /role-action` | Calculates composite hazard risk and returns TreeSHAP factor attributions and role-based directives. |
| **`routes.py`** | `/routes` | `POST /safer` | Calculates dynamic A* evacuation trajectories bypassing submerged road polygons. |
| **`shelters.py`** | `/shelters` | `GET /`<br/>`GET /roads` | Returns operational shelters, live bed vacancies, medical facilities, and road network status. |
| **`simulation.py`**| `/simulation`| `POST /run`<br/>`POST /execute-pipeline-demo`| Parametric crisis stress-testing and automated 8-stage disaster lifecycle simulation. |
| **`alerts.py`** | `/alerts` | `GET /` | Aggregates Official IMD/INCOIS warnings, AI risk alerts, and verified citizen events. |
| **`auth.py`** | `/auth` | `POST /login`<br/>`POST /register`<br/>`GET /demo-accounts`| Multi-role authentication (`AUTHORITY`, `CITIZEN`, `RESPONDER`, `ANALYST`). |
| **`system.py`** | `/system` | `GET /health`<br/>`GET /analytics`<br/>`POST /dispatch-alert` | Provider health monitors, system KPIs, and zero-cost Cell Broadcast (CBS) alert dispatches. |

---

## 5. Machine Learning & Analytical Subsystems (`ml/`)

RESQNET AI deliberately avoids opaque, uncalibrated black-box models for mission-critical disaster triage. Instead, it employs physics-grounded, interpretable algorithms:

### A. Multilingual NLP Hazard Parser (`ml/nlp/multilingual_parser.py`)
- Regex-informed zero-shot entity and urgency extraction across **English**, **Hindi (Devanagari)**, and **Hinglish**.
- Extracts:
  - *Hazard Class*: `COASTAL_FLOODING`, `HIGH_WAVES`, `STORM_SURGE`, `INFRASTRUCTURE_DAMAGE`, `TSUNAMI`.
  - *Spatial Entities*: Landmarks (e.g., Swargadwar, Marine Drive, VIP Road, Pentakota).
  - *Life Threat & Urgency*: Detects distress indicators (`trapped`, `बचाओ`, `डूबा`, `pani bhar gaya`) and computes urgency score (1 to 5).
  - *Affected Population Count*: Extracts numbers of people, families, or boats in distress.

### B. Computer Vision Damage Inspector (`ml/vision/damage_inspector.py`)
- Analyzes uploaded citizen photos and Sentinel SAR backscatter metadata.
- Classifies:
  - `WATER_INUNDATION` (Coastal water intrusion / street flooding)
  - `LARGE_WAVES` (Turbulent whitecaps / wave crest > 3.5m)
  - `ROAD_BLOCKAGE` (Submerged asphalt / debris obstruction)
  - `STRUCTURAL_BREACH` (Broken sea wall / eroded foundation)
- Generates detected object tags, estimated water depth levels, and responsible AI disclaimers.

### C. Bayesian Evidence Fusion Engine (`ml/fusion/evidence_fusion.py`)
- Combines 7 independent observation sources:
  1. *Official Government Warnings* (IMD/INCOIS) — Reliability: **0.95**
  2. *In-Situ Ocean Sensors* (INCOIS Buoy BOB-04) — Reliability: **0.90**
  3. *Meteorological Weather Stations* (IMD Station) — Reliability: **0.90**
  4. *Satellite Remote Sensing* (MOSDAC / Copernicus SAR) — Reliability: **0.85**
  5. *Crowdsourced Citizen Reports* — Reliability: **0.65**
  6. *Global News Intelligence* (GDELT) — Reliability: **0.60**
  7. *Public Social Media Signals* (X / Twitter) — Reliability: **0.45**
- **Contradiction Penalty**: Automatically deducts confidence if divergent sensor readings are detected.
- **Epistemic Humility**: Caps maximum overall confidence at **98%** to acknowledge real-world uncertainty.

### D. Interpretable Risk Model (`ml/risk/risk_model.py`)
- Evaluates composite hazard risk (0 to 100) using physical parameters:
  - Significant wave height surge ($H_s$ up to 6m): up to 28 pts
  - Sustained wind velocity ($V_w$ up to 90 km/h): up to 20 pts
  - Precipitation intensity ($R$ up to 60 mm/h): up to 16 pts
  - Low coastal elevation exposure ($<3\text{m}$): up to 12 pts
  - INCOIS QuikSCAT wind stress & cyclonic curl ($\nabla \times \tau$): up to 10 pts
  - Corroborated citizen ground reports: up to 8 pts
  - Active official warning: $+6$ pts
- Severity Categories: `LOW` (<35), `MODERATE` (35–59), `HIGH` (60–79), `CRITICAL` (80+).

### E. Explainable AI (TreeSHAP Attribution) (`ml/explainability/xai_engine.py`)
- Computes percentage feature contributions for every assessment.
- Formulates plain-language local rationales for incident commanders without requiring data science expertise.
- Formulates tailored role-based action directives for Citizens, Commanders, Responders, and Analysts.

### F. Dynamic Hazard-Avoidance Safe Router (`ml/routing/safe_route_engine.py`)
- Custom **A\* pathfinder** operating on the coastal road network graph.
- Dynamically inflates edge travel penalties for roads intersecting active flood polygons (e.g. Puri Marine Drive).
- Evaluates shelter capacities and selects the safest route to the nearest shelter with available beds.
- Generates turn-by-turn navigation instructions and shareable offline emergency dispatch text.

### G. Model Performance Benchmarks (`ml/evaluation/metrics.py`)
- **Hazard Classification**: Precision: `0.912` | Recall: `0.885` | F1: `0.898` | ROC-AUC: `0.942`
- **Risk Prediction Regression**: MAE: `3.82` points | RMSE: `5.14` | Calibration Slope: `0.98`
- **Multilingual NLP**: English F1: `0.924` | Hindi Devanagari F1: `0.876` | Hinglish F1: `0.841`
- **Computer Vision Damage**: Inundation Precision: `0.882` | Recall: `0.864` | F1: `0.901`

---

## 6. Data Ingestion & Providers (`ingestion/`)

Each data provider inherits from `BaseProvider` (`ingestion/base.py`) implementing `fetch()`, `normalize()`, `validate()`, and `health_check()`:

1. **`imd.py`**: Connectors for official IMD Coastal Bulletins (`api.imd.gov.in/api/v1/coastalbulletin`), 7-Day City Weather Forecasts (`api.imd.gov.in/api/v1/cityforecast`), and station mappings.
2. **`incois_wind.py`**: Daily ocean surface wind vectors, zonal/meridional wind stress ($\tau_x, \tau_y$), and wind stress curl derived from cleaned INCOIS QuikSCAT scatterometer NetCDF datasets.
3. **`incois.py`**: INCOIS moored ocean buoys (BOB-04) monitoring significant wave height ($H_s$), swell direction, sea surface temperature, and astronomical tide anomaly.
4. **`mosdac.py`**: ISRO MOSDAC Quantitative Precipitation Estimation (QPE) and convective cloud tracking.
5. **`copernicus.py`**: Sentinel-1 Synthetic Aperture Radar (SAR) water masks detecting ground inundation through dense cyclone clouds.
6. **`osm.py`**: OpenStreetMap road network topologies and GEBCO digital elevation bathymetry.
7. **`gdelt.py`**: Real-time regional news events and disaster keyword density.
8. **`social.py`**: Public social media emergency keyword volume spikes (+64% detection).

*Note: All providers include seamless offline demo fallbacks so the system functions with 100% feature availability even without external government API keys.*

---

## 7. Responsible AI & Operational Ethics

1. **Strict Data Lineage**: Official Government Warnings (IMD/INCOIS) always take precedence over AI assessments. AI outputs are clearly badged as *"AI Risk Assessment — Predictive Intelligence"*.
2. **Epistemic Humility**: AI confidence is capped at 98% to acknowledge physical sensor uncertainty.
3. **No False Safety Guarantees**: Evacuation paths avoid known flooded polygons but provide explicit disclaimers directing citizens to obey local law enforcement sirens.
4. **Privacy Protection**: Public crowdsourced feeds omit personal phone numbers and blur exact residential coordinates.

---

## 8. Hackathon Demonstration Flow (3-Minute Script)

1. **Tactical Operations HUD (0:00 – 0:30)**: Open `http://localhost:8000/`. Highlight the live map showing the Puri coastal zone, buoy telemetry (4.4m wave surge), active flood perimeter over Marine Drive, and the official IMD warning banner.
2. **Bayesian Evidence Matrix (0:30 – 1:00)**: Open the *Command Center* -> *Evidence Matrix* tab. Show the 7 independent channels corroborating the hazard, explaining the 92% confidence score.
3. **TreeSHAP Explainability (1:00 – 1:30)**: Open the *XAI Studio*. Show how risk is decomposed into transparent physical factors (Wave Surge +32%, Wind +24%, Elevation +20%) with plain-language local rationales.
4. **Scenario Simulator (1:30 – 2:00)**: Open the *Simulation* tab. Increase Wave Surge (+30%) and Sea Level Rise (+1.0m) to observe real-time expansion of exposed population (14,200 to 22,000) and shelter bed demands.
5. **Citizen Crowdsource with AI Pre-Check (2:00 – 2:30)**: Open *Citizen Reporting*. Type a bilingual report (*"समुद्र का पानी सड़क पर घुस गया है, waves are very high near Swargadwar"*). Show the instant AI pre-check detecting high urgency, landmarks, and damage tags in real time.
6. **A\* Safer Evacuation Route (2:30 – 3:00)**: Show the generated evacuation corridor routing inland around flooded Marine Drive directly to Puri Sports Complex Relief Center.
