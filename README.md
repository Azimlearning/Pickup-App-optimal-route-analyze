# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Project docs

- Architecture and deployment notes: see ARCHITECTURE.md
- Environment example: see .env.example
- Security checklist: see SECURITY_CHECKS.md

## Running locally

- Frontend:
  - cd optimal-route-kl/frontend
  - npm ci
  - npm run dev
- Backend (Python routing engine), if present:
  - cd optimal-route-kl
  - python -m venv .venv
  - source .venv/bin/activate
  - pip install -r requirements.txt
  - run the API as documented in ARCHITECTURE.md
