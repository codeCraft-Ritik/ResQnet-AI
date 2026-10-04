# RESQNET AI 🌊🚨
### AI-Powered Multi-Source Ocean & Coastal Disaster Intelligence, Verification, Risk Assessment, and Last-Mile Action Platform

> *"From scattered signals to trusted decisions."*

**Smart India Hackathon Problem Statement**: PS ID: SIH25039  
**Problem Statement Title**: *Integrated Platform for Crowdsourced Ocean Hazard Reporting and Social Media Analytics*  
**Organization**: Ministry of Earth Sciences (MoES) | **Category**: Software | **Theme**: Disaster Management

---

## 1. Project Overview

**RESQNET AI** is a production-grade disaster intelligence and early warning platform designed to convert fragmented, noisy, and unverified coastal observations into verified, explainable, and life-saving emergency actions.

India's 7,516 km coastline is vulnerable to tropical cyclones, astronomical storm surges, swell waves, and flash inundation. During severe weather, emergency managers face three critical challenges:
1. **Data Silos**: Official bulletins, deep-sea buoys, radar, and citizen eyewitnesses live in disconnected systems.
2. **Verification Bottlenecks**: Social chatter and citizen reports contain noise, rumors, or lack actionable coordinates.
3. **Black-Box AI**: Automated risk scores fail to explain *why* an evacuation is recommended or *which* roads are safe.

RESQNET AI solves this by deploying an **8-Stage Real-Time Pipeline**:
```
SENSE ──► EXTRACT ──► VERIFY ──► PREDICT ──► SIMULATE ──► DECIDE ──► ACT ──► LEARN
```
Every prediction is cross-corroborated by independent evidence sources, assigned a transparent confidence score (capped at 98% for epistemic humility), decomposed via **TreeSHAP explainability**, and linked to **A\* safer route pathfinding** to designated cyclone shelters.

---

## 2. Real System Architecture

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

> 📐 **Technical Documentation & Interactive Architecture**:
> - Complete Codebase & System Architecture Guide: [`docs/CODEBASE_DOCUMENTATION.md`](docs/CODEBASE_DOCUMENTATION.md)
> - Windows Installation, Execution & Troubleshooting Guide: [`docs/WINDOWS_SETUP_GUIDE.md`](docs/WINDOWS_SETUP_GUIDE.md)
> - Standalone Interactive Vector Architecture Diagram: [`docs/diagrams/index.html`](docs/diagrams/index.html)

---

## 3. Repository Folder Structure

```
ResQnet AI/
├── backend/                        # FastAPI REST API & WebSocket Server
│   ├── app.py                      # Application factory, CORS, SPA fallback & WSS gateway
│   ├── config.py                   # Pydantic v2 Settings, environment loading, URLs
│   ├── database/
│   │   ├── schemas.py              # Pydantic request/response models & Enums
│   │   └── store.py                # In-memory Geo-Spatial DataStore & seed loader
│   └── routers/                    # Modular API route controllers
│       ├── alerts.py               # Official vs AI vs Crowdsourced alert feeds
│       ├── auth.py                 # JWT Authentication & multi-role demo accounts
│       ├── evidence.py             # Bayesian multi-source evidence fusion API
│       ├── hazards.py              # Active hazard polygons, IMD & INCOIS endpoints
│       ├── reports.py              # Crowdsourced citizen report ingest & verification
│       ├── risk.py                 # SHAP XAI risk assessment & role actions
│       ├── routes.py               # A* hazard-avoidance safer route generation
│       ├── shelters.py             # Shelter inventory, capacity, and road networks
│       ├── simulation.py           # Parametric scenario simulator & 8-stage pipeline
│       └── system.py               # Health checks, analytics, and CBS dispatch
├── data/                           # In-situ and satellite datasets
│   ├── pilot_puri.json             # Comprehensive pilot dataset for Puri Coastal Zone
│   ├── incois_coastal_stations_clean.json # Cleaned INCOIS coastal stations
│   ├── incois_coastal_winds_clean.csv     # Ocean surface wind time-series
│   ├── incois_ocean_wind_grid.json        # 200+ spatial wind vectors across Indian waters
│   └── incois_quickscat_daily_*.nc        # Raw NetCDF QuikSCAT scatterometer dataset
├── docker/
│   └── Dockerfile.backend          # Production container build definition
├── docs/                           # Consolidated professional documentation
│   ├── CODEBASE_DOCUMENTATION.md   # Complete codebase guide: Frontend, Backend, ML, and Ingestion
│   ├── WINDOWS_SETUP_GUIDE.md      # Full Windows installation, run instructions & troubleshooting
│   └── diagrams/
│       ├── index.html              # Standalone interactive vector diagram (Netlify deployable)
│       └── candidate.json          # Architecture diagram vector node/edge layout specification
├── frontend/                       # React 18 + TypeScript + Vite Web Application
│   ├── public/                     # PWA manifest, service worker (sw.js), icons
│   ├── src/
│   │   ├── App.tsx                 # Root application layout, offline watcher & routes
│   │   ├── main.tsx                # React DOM entrypoint
│   │   ├── index.css               # Aqua Liquid-Glass design system & Tailwind
│   │   ├── components/
│   │   │   ├── common/             # Badges, Skeletons, RoleGuidanceBanner
│   │   │   ├── evidence/           # EvidencePanel (Bayesian matrix table)
│   │   │   ├── hero/               # HeroGlobeVisual (interactive 3D globe)
│   │   │   ├── layout/             # Navbar, Footer, AuroraBackground
│   │   │   ├── map/                # DisasterMap (Leaflet), MapLayers, MapLegend
│   │   │   ├── ocean/              # OceanCard, WindStressCard (INCOIS QuikSCAT)
│   │   │   ├── reports/            # CitizenReportForm (AI pre-check), ReportCard
│   │   │   ├── risk/               # RiskCard, XAIPanel, RiskBreakdown, AnalyticsChart
│   │   │   ├── routes/             # SaferRouteCard (A* pathfinding UI)
│   │   │   ├── search/             # LocationSearch, SearchModal (20+ Indian ports)
│   │   │   ├── simulation/         # ScenarioSimulator (sliders), PipelineModal
│   │   │   └── weather/            # WeatherCard, CityForecastCard, SatelliteModal
│   │   ├── pages/                  # Top-level view controllers
│   │   │   ├── LandingPage.tsx     # Hero showcase & executive overview
│   │   │   ├── LocationIntelligencePage.tsx # Deep-dive for 20+ coastal ports
│   │   │   ├── LiveMapPage.tsx     # Fullscreen tactical GIS command map
│   │   │   ├── CommandCenterPage.tsx # Authority/NDRF 6-KPI operations console
│   │   │   ├── CitizenReportingPage.tsx # Crowdsourced report feed & submission
│   │   │   ├── SimulationPage.tsx  # Parametric crisis stress-testing studio
│   │   │   ├── AlertsPage.tsx      # Unified Official vs AI vs Citizen alerts
│   │   │   └── NotFoundPage.tsx    # 404 handler
│   │   ├── services/               # Typed API client services
│   │   └── types/                  # TypeScript interfaces (disaster, imd, risk, route)
│   ├── package.json                # Frontend dependencies & scripts
│   ├── tailwind.config.js          # Custom Liquid Glass theme, glow shadows & hues
│   └── vite.config.ts              # Proxy rules, vendor chunking & build optimization
├── ingestion/                      # Multi-source data providers & connectors
│   ├── base.py                     # Abstract BaseProvider with fetch/normalize/health
│   └── providers/                  # Specialized agency adapters
│       ├── copernicus.py           # Sentinel-1 SAR water inundation provider
│       ├── gdelt.py                # Global news intelligence provider
│       ├── imd.py                  # IMD Coastal Bulletin & 7-Day City Forecast
│       ├── incois.py               # INCOIS Buoy (BOB-04) & ocean state provider
│       ├── incois_wind.py          # INCOIS QuikSCAT Scatterometer surface wind provider
│       ├── mosdac.py               # ISRO MOSDAC INSAT-3DR QPE satellite provider
│       ├── osm.py                  # OpenStreetMap road topology & GEBCO elevation
│       └── social.py               # Public social media hazard signal provider
├── ml/                             # Machine Learning & Analytical Subsystems
│   ├── evaluation/metrics.py       # Precision, Recall, F1, and MAE benchmarks
│   ├── explainability/xai_engine.py# TreeSHAP feature attribution & local rationale
│   ├── fusion/evidence_fusion.py   # Multi-source Bayesian consensus matrix
│   ├── nlp/multilingual_parser.py  # Regex & transformer zero-shot distress parser
│   ├── risk/risk_model.py          # Interpretable physical-bounds risk ensemble
│   ├── routing/safe_route_engine.py# Dynamic A* hazard-avoidance pathfinder
│   └── vision/damage_inspector.py  # Computer vision photo damage triage
├── scripts/
│   └── clean_incois_dataset.py     # Parser for raw INCOIS NetCDF ocean wind data
├── tests/                          # Automated test suite (pytest)
│   ├── test_api.py                 # FastAPI route & schema validation tests
│   ├── test_fusion.py              # Evidence fusion math & contradiction tests
│   ├── test_nlp.py                 # Multilingual NLP accuracy & entity tests
│   └── test_routing.py             # A* hazard perimeter avoidance tests
├── .env.example                    # Template environment variables
├── docker-compose.yml              # Multi-container orchestration definition
├── requirements.txt                # Python backend dependencies
└── run.py                          # Unified single-command launcher script
```

---

## 4. Key Features & Technologies

### 1. Liquid Glass Tactical Command Console
- **Tech Stack**: React 18, Tailwind CSS, Lucide Icons, Recharts, Leaflet.js, CartoDB Dark Matter.
- **Design Philosophy**: Liquid Glass aesthetic with Aqua/Teal oceanic gradients, glassmorphism backdrop filters, and high-contrast night vision for emergency operations centers.
- **Real-Time 6-KPI Bar**: Live counts of Active Hazards, Critical Warnings, Shelter Beds Available, Exposed Population, Avg Verification Latency (1.4s), and Bayesian Confidence Index.

### 2. Multi-Source Bayesian Evidence Fusion
- **Algorithm**: Cross-corroborates 7 independent channels using calibrated source reliability weights:
  $$\text{Reliability}: \text{Official (0.95)} > \text{Sensor (0.90)} > \text{Satellite (0.85)} > \text{Citizen (0.65)} > \text{News (0.60)} > \text{Social (0.45)}$$
- **Contradiction Penalty**: Automatically deducts confidence if inland vs coastal wind gauges disagree.
- **Epistemic Humility**: Confidence is capped at 98% to acknowledge physical sensor uncertainty.

### 3. Transparent Explainable AI (TreeSHAP)
- Decomposes every composite risk score into exact physical contributing factors:
  - *Wave Surge Height*: $+32\%$
  - *Sustained Wind Velocity*: $+24\%$
  - *Low Elevation Exposure*: $+20\%$
  - *Rainfall Influx*: $+16\%$
  - *Ground Citizen Corroborations*: $+8\%$
- Generates plain-language operational summaries tailored to Incident Commanders, Field Responders, and Civilians.

### 4. Hazard-Avoiding $A^*$ Safer Route Pathfinder
- Ingests active storm surge flood perimeters, submerged road segments, and real-time shelter bed counts.
- Calculates an inland evasion trajectory avoiding blocked coastal causeways (e.g. Puri Marine Drive) to the nearest available safe haven.
- Generates copyable, zero-cost SMS/WhatsApp safety instructions for offline citizen dispatch.

### 5. Multilingual NLP & Vision Damage Pre-Checks
- **NLP**: Extracts disaster type, trapped victims count, urgency score (1-5), and landmarks from English, Hindi (Devanagari: `पानी भर गया`, `मदद चाहिए`), and Hinglish (`pani ghus gaya`).
- **Computer Vision**: Evaluates user-uploaded photos or Sentinel SAR backscatter to classify water inundation, barrier breaches, or submerged vehicles.
- **Instant Preview**: Instant AI feedback on citizen report submission forms before database commit.

### 6. Dynamic Coastal Location Intelligence
- Comprehensive coverage across 20+ strategic ports and maritime districts in India:
  *Puri, Paradip, Gopalpur, Chandipur, Dhamra, Visakhapatnam, Chennai, Mumbai, Kochi, Kolkata, Surat, Bhavnagar, Porbandar, Dwarka, Panaji, Mangaluru, Thiruvananthapuram, Puducherry, Port Blair, New Delhi*.

### 7. Official Ingestion Adapters (IMD & INCOIS)
- **IMD**: Connectors for Coastal Bulletins (`/api/v1/coastalbulletin`), 7-Day City Weather Forecasts (`/api/v1/cityforecast`), and Station Mappings.
- **INCOIS QuikSCAT**: Scatterometer wind velocity, zonal/meridional wind stress, and cyclonic wind stress curl ($\nabla \times \tau$).

---

## 5. Getting Started (Installation & Execution)

### Prerequisites
- **Python**: Version 3.10, 3.11, or 3.12 installed.
- **Node.js**: Version 18+ and `npm` installed.

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-org/resqnet-ai.git
cd "ResQnet AI"
```

---

### Step 2: Set Up Backend (Python)

1. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure Environment Variables:
   ```bash
   # Copy sample environment configuration
   cp .env.example .env
   ```
   *(The default `.env` is pre-configured to run out of the box in `live` operational mode).*

---

### Step 3: Set Up Frontend (React + Vite)

```bash
cd frontend
npm install
npm run build
cd ..
```
*(Building the frontend compiles the React assets into `frontend/dist`, allowing the FastAPI server to host the entire web application and API on a single port).*

---

### Step 4: Run the Application

Run the unified launcher:
```bash
python run.py
```

The system will start and provide local access:
- 🚀 **Tactical Command Center Web App**: [http://localhost:8000/](http://localhost:8000/)
- 📚 **Interactive Swagger / OpenAPI Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- 🧭 **Alternative Redoc API Explorer**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- 📡 **Live WebSocket Telemetry Gateway**: `ws://localhost:8000/ws/live-feed`

---

## 6. Development Workflow (Hot-Reloading)

If you are developing frontend components and want instant Vite hot-module replacement (HMR):

1. **Terminal 1 (Backend)**:
   ```bash
   python run.py
   ```
2. **Terminal 2 (Frontend Dev Server)**:
   ```bash
   cd frontend
   npm run dev
   ```
3. Open [http://localhost:5173/](http://localhost:5173/).  
   *(Vite is pre-configured to proxy all `/api/*` and `/ws/*` calls to FastAPI on `127.0.0.1:8000`).*

---

## 7. Environment Variables Reference

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `DATA_MODE` | `live` | Operational mode (`live` for real sensors & bulletins, `demo` for offline synthetic simulation). |
| `PORT` | `8000` | Port for the FastAPI backend server. |
| `HOST` | `127.0.0.1` | Bind address (`127.0.0.1` for Windows local dev, `0.0.0.0` for Docker/cloud). |
| `SECRET_KEY` | `resqnet-ai-default-dev-secret-key-2025` | Secret key used to sign session tokens. |
| `IMD_API_KEY` | `""` | Optional API key for official IMD Coastal Bulletin and City Forecast access. |
| `INCOIS_API_KEY` | `""` | Optional API key for INCOIS Ocean State and Tsunami early warning access. |
| `MOSDAC_API_KEY` | `""` | Optional API key for ISRO MOSDAC INSAT-3DR satellite products. |
| `COPERNICUS_CLIENT_ID` | `""` | Optional Client ID for Copernicus Sentinel-1 SAR flood imagery. |
| `TWITTER_BEARER_TOKEN` | `""` | Optional token for live social keyword stream tracking. |

*Note: All data ingestion providers include intelligent fallback mechanisms. If external government API keys are absent, the system seamlessly operates on calibrated local baseline datasets with full feature parity.*

---

## 8. Automated Testing & Verification

The repository includes a comprehensive automated test suite verifying all critical AI pipelines, API schemas, and mathematical calculations:

```bash
# Run all backend unit & integration tests
python -m pytest

# Run frontend type-check & production build verification
cd frontend
npm run build
```

### Test Coverage Highlights:
- `tests/test_api.py`: Validates all 10 router modules, health checks, schemas, and error responses.
- `tests/test_fusion.py`: Tests Bayesian evidence accumulation and contradiction penalties.
- `tests/test_nlp.py`: Tests multilingual text parsing across English, Hindi, and Hinglish.
- `tests/test_routing.py`: Validates A* pathfinding around flooded coastal perimeters.

---

## 9. Major API Endpoints

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **System** | `GET` | `/api/health` | Root health check and operational mode status. |
| **System** | `GET` | `/api/v1/system/health` | Live availability check for all 7 ingestion providers. |
| **System** | `GET` | `/api/v1/system/analytics` | District-level operational KPI summary. |
| **System** | `POST` | `/api/v1/system/dispatch-alert` | Zero-cost Cell Broadcast (CBS) emergency alert trigger. |
| **Hazards** | `GET` | `/api/v1/hazards` | Active hazard polygons (supports `?location=` filtering). |
| **Hazards** | `GET` | `/api/v1/hazards/incois/wind-stress` | INCOIS QuikSCAT scatterometer wind stress & curl. |
| **Hazards** | `GET` | `/api/v1/hazards/imd/coastal-bulletin`| Official IMD coastal bulletin text and warnings. |
| **Hazards** | `GET` | `/api/v1/hazards/imd/city-forecast` | Official IMD 7-day city weather forecast. |
| **Reports** | `GET` | `/api/v1/reports` | List crowdsourced citizen reports with status filters. |
| **Reports** | `POST` | `/api/v1/reports` | Submit a citizen report with automatic AI verification. |
| **Reports** | `POST` | `/api/v1/reports/analyze-preview` | Real-time multilingual NLP and photo damage pre-check. |
| **Evidence**| `GET` | `/api/v1/evidence/{hazard_id}` | Complete Bayesian evidence matrix & confidence breakdown. |
| **Risk** | `GET` | `/api/v1/risk/assess` | SHAP-style factor attribution decomposition. |
| **Risk** | `GET` | `/api/v1/risk/role-action` | Safety-first action directives by user role. |
| **Routes** | `POST` | `/api/v1/routes/safer` | Dynamic A* hazard-avoidance shelter pathfinding. |
| **Shelters**| `GET` | `/api/v1/shelters` | Relief shelter capacities and operational status. |
| **Simulation**| `POST` | `/api/v1/simulation/run` | Parametric surge crisis stress-testing. |
| **Simulation**| `POST` | `/api/v1/simulation/execute-pipeline-demo` | Automated 8-stage disaster response lifecycle demo. |

---

## 10. Role-Based Access Control (RBAC)

The platform supports four operational role profiles with tailored interfaces:

| Role | Target User | Capabilities |
| :--- | :--- | :--- |
| **Authority** (`AUTHORITY`) | NDRF, ODRAF, District Magistrates | Full Command Center HUD, 6-KPI metrics, CBS dispatch trigger, shelter activation. |
| **Citizen** (`CITIZEN`) | Coastal Residents, Fisherfolk | Offline-ready SOS, crowdsourced reporting form, nearest shelter route guidance. |
| **Responder** (`RESPONDER`) | Field Rescue Battalions, Coast Guard | Tactical hazard perimeters, vehicle impassability overlays, live report triage. |
| **Analyst** (`ANALYST`) | Ocean Modelers, Meteorologists | Raw INCOIS QuikSCAT scatterometer data, SHAP waterfall charts, simulation studio. |

*Quick test accounts with password `password123`: `authority@resqnet.gov.in`, `citizen@resqnet.gov.in`, `responder@resqnet.gov.in`, `analyst@resqnet.gov.in`.*

---

## 11. Responsible AI & Operational Ethics

1. **Strict Data Lineage**: Official Government Warnings (IMD/INCOIS) are highlighted with legal priority. AI assessments are badged as *"AI Risk Assessment — Predictive Intelligence"* to prevent public confusion.
2. **Epistemic Humility**: AI confidence scores are intentionally capped at 98% to prevent over-reliance on automated models during extreme meteorological anomalies.
3. **No False Safety Guarantees**: Evacuation paths avoid known flooded polygons but provide explicit disclaimers directing citizens to obey local law enforcement sirens.
4. **Privacy Protection**: Public crowdsourced feeds omit personal citizen phone numbers and blur sensitive residential coordinates.

---

## 12. License

This project is licensed under the terms of the **MIT License**. See [LICENSE](LICENSE) for details.
