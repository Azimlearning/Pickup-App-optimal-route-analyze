```md
# optimal-route-kl backend (mock)

This is a lightweight FastAPI mock backend for the Optimal Route project.

Endpoints
- POST /optimize
  - Body: { "locations": [ "address or lat,lng", ... ] }
  - Response: { "route": [ { input, coord: { lat, lng } }, ... ], "summary": "..." }

Local development
1. Create a venv:
   python -m venv .venv
   source .venv/bin/activate
2. Install:
   pip install -r requirements.txt
3. Run:
   uvicorn main:app --reload --port 8000

Docker (for Cloud Run)
- See Dockerfile in this directory.

Notes
- This is a mock implementation. Replace parse_location with real geocoding or routing logic later.
- Keep secrets (real API keys) out of the repo. Use environment variables or Cloud Secret Manager.
```