import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MapboxMap from "../components/MapboxMap";

/**
 * Map view loads route from location.state or fetches it from backend (if an ID were provided).
 * This version uses the route object passed directly from the planner.
 */
export default function MapView() {
  const { state } = useLocation();
  const route = state?.route ?? null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Map View</h2>

      {route ? (
        <div className="bg-white rounded shadow p-4">
          <MapboxMap route={route} />
        </div>
      ) : (
        <div className="bg-white rounded shadow p-6">
          <p className="text-sm text-gray-600">No route provided. Run a route optimization from the Planner to see results here.</p>
        </div>
      )}
    </div>
  );
}
