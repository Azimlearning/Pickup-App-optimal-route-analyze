import React from "react";
import { useLocation } from "react-router-dom";

/**
 * Placeholder Map view.
 * Integrate Mapbox/Leaflet here later. The view will read route data passed via location.state
 * or fetch from the backend (e.g., /api/route/{id}).
 */
export default function MapView() {
  const { state } = useLocation();
  const route = state?.route ?? null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Map View</h2>

      {route ? (
        <div className="bg-white rounded shadow p-4">
          <p className="mb-2">Route summary (preview):</p>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(route, null, 2)}</pre>
          <div className="mt-4 text-sm text-gray-600">
            Replace this placeholder with a Map component (Mapbox GL or Leaflet) and visualize the route.
          </div>
        </div>
      ) : (
        <div className="bg-white rounded shadow p-6">
          <p className="text-sm text-gray-600">
            No route provided. Run a route optimization from the Planner to see results here.
          </p>
        </div>
      )}
    </div>
  );
}
