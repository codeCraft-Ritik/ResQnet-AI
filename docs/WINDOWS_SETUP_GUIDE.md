# RESQNET AI — Windows Setup & Run Guide

> **A foolproof, step-by-step installation and execution manual for any Windows 10 or Windows 11 system.**

---

## 1. System Requirements

- **Operating System**: Windows 10 or Windows 11 (64-bit).
- **RAM**: 4 GB minimum (8 GB recommended).
- **Disk Space**: ~1.5 GB free disk space.
- **Terminal**: PowerShell (recommended) or Command Prompt (CMD).

---

## 2. Prerequisites (One-Time Setup)

Before running the project, ensure you have the following installed on your Windows PC:

### A. Python (Version 3.10, 3.11, or 3.12)
1. Download from: [python.org/downloads](https://www.python.org/downloads/)
2. ⚠️ **IMPORTANT**: During installation, check the box that says:  
   ☑️ **"Add Python to PATH"** (at the bottom of the installer window).
3. Verify in PowerShell:
   ```powershell
   python --version
   ```

### B. Node.js (Version 18 or higher)
1. Download the LTS version from: [nodejs.org](https://nodejs.org/)
2. Run the installer with default settings.
3. Verify in PowerShell:
   ```powershell
   node -v
   npm -v
   ```

### C. Git (Optional, for cloning)
1. Download from: [git-scm.com](https://git-scm.com/download/win)
2. Verify in PowerShell:
   ```powershell
   git --version
   ```

---

## 3. Quick Start (Single-Command Run)

If you already have your virtual environment and frontend compiled, simply run:

```powershell
cd "R:\All-Prog\Data-Visualization\ResQnet AI"
python run.py
```

Then open your browser at:
👉 **[http://localhost:8000/](http://localhost:8000/)**

---

## 4. Complete Step-by-Step Setup from Scratch

Follow these steps if you are setting up the project for the first time on a new Windows computer:

### Step 1: Open PowerShell as User
Open Windows Terminal or PowerShell and navigate to the project directory:
```powershell
cd "R:\All-Prog\Data-Visualization\ResQnet AI"
```

### Step 2: Enable Script Execution in PowerShell
If you see a security error when activating Python environments, run:
```powershell
Set-ExecutionPolicy -Scope Process RemoteSigned
```
*(This allows the current PowerShell session to run local scripts safely without changing permanent Windows system policies).*

### Step 3: Create & Activate Python Virtual Environment
```powershell
# Create virtual environment named 'venv'
python -m venv venv

# Activate the virtual environment
.\venv\Scripts\Activate.ps1
```
*(You will see `(venv)` appear at the beginning of your PowerShell prompt).*

### Step 4: Install Backend Dependencies
```powershell
pip install --upgrade pip
pip install -r requirements.txt
```

### Step 5: Configure Environment Variables
Copy the template `.env.example` file to `.env`:
```powershell
Copy-Item .env.example .env
```
*(The default `.env` is already configured for live operational mode with intelligent local fallbacks, so no manual editing is required to start immediately).*

### Step 6: Install Frontend Dependencies & Build
```powershell
# Navigate to frontend directory
cd frontend

# Install Node packages
npm install

# Compile the production React bundle into frontend/dist/
npm run build

# Return to project root
cd ..
```

### Step 7: Launch the Server
```powershell
python run.py
```

The unified console will start:
```
======================================================================
                      RESQNET AI                         
   AI-Powered Multi-Source Ocean & Coastal Disaster Intelligence  
   'From scattered signals to trusted decisions.'         
   Problem Statement: SIH25039 (Ministry of Earth Sciences)   
======================================================================

  🚀 ACCESS THE TACTICAL COMMAND CENTER IN YOUR BROWSER:
  👉 http://localhost:8000/
  👉 http://127.0.0.1:8000/

  📚 OpenAPI / Swagger API Specs: http://localhost:8000/docs
  📍 Pilot Region: Puri Coastal Belt, Odisha, India
  🛡️ Mode: LIVE OPERATIONAL (Multi-Source Sensor Network & Real Telemetry)
======================================================================
```

---

## 5. Development Mode (Frontend Hot-Reloading)

If you are modifying frontend UI components and want instant Hot Module Replacement (HMR) without rebuilding:

1. **Terminal 1 (Backend Server)**:
   ```powershell
   cd "R:\All-Prog\Data-Visualization\ResQnet AI"
   .\venv\Scripts\Activate.ps1
   python run.py
   ```
2. **Terminal 2 (Frontend Vite Dev Server)**:
   ```powershell
   cd "R:\All-Prog\Data-Visualization\ResQnet AI\frontend"
   npm run dev
   ```
3. Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.  
   *(Vite is pre-configured to proxy all `/api/*` and `/ws/*` calls to FastAPI on `127.0.0.1:8000` automatically).*

---

## 6. Verification & Automated Testing

Verify that your system is functioning correctly with 0 errors:

### Run Backend Tests (Pytest)
```powershell
python -m pytest -v
```
**Expected Result**: All 20 tests pass in ~0.5 seconds:
- ✅ API health checks
- ✅ Active hazard polygons
- ✅ Bayesian evidence fusion math
- ✅ TreeSHAP risk assessments
- ✅ Scenario simulation models
- ✅ Multilingual NLP extraction (English, Hindi, Hinglish)
- ✅ A* safe route perimeter avoidance
- ✅ IMD coastal bulletins & 7-day city weather
- ✅ INCOIS QuikSCAT scatterometer wind stress

### Run Frontend Production Build Check
```powershell
cd frontend
npm run build
cd ..
```
**Expected Result**: Compiles cleanly with `✓ built in ~5s` and 0 errors.

---

## 7. Troubleshooting Common Windows Issues

### Issue 1: `Activate.ps1 cannot be loaded because running scripts is disabled`
- **Cause**: Windows PowerShell default security policy restricts `.ps1` script execution.
- **Solution**: Run this in PowerShell before activating:
  ```powershell
  Set-ExecutionPolicy -Scope Process RemoteSigned
  .\venv\Scripts\Activate.ps1
  ```

### Issue 2: `Port 8000 is already in use`
- **Cause**: A previous server session is still running in the background.
- **Solution**: Kill the process using port 8000:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process -Force
  ```
  Or change the port in PowerShell before starting:
  ```powershell
  $env:PORT="8080"
  python run.py
  ```

### Issue 3: Browser shows `ERR_ADDRESS_INVALID` when clicking `0.0.0.0:8000`
- **Cause**: Windows does not route `0.0.0.0` as an IP address in Chrome/Edge.
- **Solution**: Always use `http://localhost:8000/` or `http://127.0.0.1:8000/`. `run.py` defaults to `127.0.0.1` on Windows.

### Issue 4: `python : The term 'python' is not recognized`
- **Cause**: Python was installed without checking "Add Python to PATH".
- **Solution**: Re-run the Python Windows installer, select **Modify**, and check **Add Python to environment variables**.

### Issue 5: Windows Defender Firewall Prompt
- **Cause**: Windows Firewall asks for permission when Uvicorn starts listening on local ports.
- **Solution**: Click **"Allow access"** for Private networks.

---

## 8. Key URLs & Access Points

| Resource | URL | Description |
| :--- | :--- | :--- |
| **Tactical Command Center Web App** | [http://localhost:8000/](http://localhost:8000/) | Full React Operations HUD, live maps, and simulations. |
| **Interactive OpenAPI / Swagger Docs**| [http://localhost:8000/docs](http://localhost:8000/docs) | Live interactive API test console. |
| **Alternative ReDoc API Explorer** | [http://localhost:8000/redoc](http://localhost:8000/redoc) | Clean API schema reference. |
| **Live WebSocket Gateway** | `ws://localhost:8000/ws/live-feed` | Real-time crisis telemetry stream. |
| **Interactive Architecture Diagram** | [`docs/diagrams/index.html`](file:///r:/All-Prog/Data-Visualization/ResQnet%20AI/docs/diagrams/index.html) | Standalone vector architecture viewer. |
