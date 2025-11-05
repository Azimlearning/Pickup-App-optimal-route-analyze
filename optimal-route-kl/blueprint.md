# Project Blueprint: Pickup App - Optimal Route Analyzer

## 1. Overview

This document outlines the strategic plan for the "Pickup App," a web application designed to solve the real-world challenge of finding the most time-efficient route to pick up multiple friends before heading to a final destination.

The application will function as a specialized Vehicle Routing Problem (VRP) solver, leveraging real-time traffic data, weather predictions, and AI-driven analysis to provide not just a route, but actionable travel advice.

## 2. Core Problem & Objective

- **Problem**: When a driver needs to pick up several friends from scattered locations, determining the optimal pickup order to minimize travel time is a complex, manual task.
- **Objective**: To automate this process by calculating the fastest sequence of pickups, thereby saving time, reducing fuel consumption, and minimizing stress.
- **Primary Metric**: The core efficiency metric will be **total travel time**.

## 3. Project Phases

### Phase 1: Data Acquisition & API Integration (Python Backend)

1.  **Node Identification**: The system will require the following inputs:
    - **You (Start Point)**: The driver's starting location.
    - **Friends (Pickup Points)**: A list of all friend locations.
    - **Destination (End Point)**: The final, shared destination.
2.  **Mapping API Integration (Google Maps)**:
    - **Geocoding**: Convert all string addresses (e.g., "KLCC, Kuala Lumpur") into precise GPS coordinates (Latitude, Longitude).
    - **Time Matrix Calculation**: Use the Google Maps Distance Matrix API to calculate the travel time between every pair of locations. This will be an `(N+2) x (N+2)` matrix, which is the foundational data for the optimization algorithm. This will use `departure_time='now'` to account for real-time traffic.
3.  **Weather API Integration**:
    - Fetch the weather forecast for the KL area for the travel period. This data will be used by the AI analysis layer to assess risks.
4.  **AI Analysis API Integration (OpenRouter)**:
    - Set up a client to send the final, optimized route and weather data to an LLM (via OpenRouter) for qualitative analysis.

### Phase 2: Core Algorithm Development (Python Backend)

- **Algorithm Strategy**: The backend will be designed to support both exact and heuristic algorithms to solve this TSP-variant problem.
  - **Heuristic Algorithm (Initial)**: Start with a simple, fast algorithm like **Nearest Neighbor** to quickly get a functional baseline.
  - **Exact Algorithm (Advanced)**: Implement a more complex but optimal solver using a library like **Google OR-Tools**, which can handle the constraints of the VRP.
- **Solver Logic**: The Python code will take the time matrix from Phase 1, apply the start/end constraints, and pass it to the chosen algorithm to determine the most efficient pickup sequence.

### Phase 3: Application Development (Web App)

1.  **Platform Choice**: A Web Application is chosen for its universal accessibility across devices.
2.  **Tech Stack**:
    - **Frontend**: **React.js** for building a dynamic and interactive user interface, styled with **Tailwind CSS** for a modern look.
    - **Backend**: **Python (Flask)** to serve a REST API that exposes the optimization logic.
3.  **User Interface (UI)**:
    - **Input Screen**: A clean form for users to enter their start location, friend locations (with the ability to add/remove fields), and the final destination.
    - **Map & Results View**: A view to display the optimized route sequence on an interactive map, along with the AI-generated travel advisory.

## 4. Deployment Strategy

- **Frontend**: The React application will be deployed as a static site using **Firebase Hosting**.
- **Backend**: The Python Flask API will be containerized using **Dockerfile** and deployed as a serverless microservice using **Google Cloud Run**.
- **Routing**: **Firebase Hosting** will be configured to act as a proxy, forwarding all API requests (e.g., `/api/...`) to the Cloud Run backend service, creating a seamless full-stack experience.
