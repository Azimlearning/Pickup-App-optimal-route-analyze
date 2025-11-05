import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

/**
 * Simple Route Planner UI:
 * - Add/remove addresses
 * - Submit to POST /api/optimize with { locations: [ ... ] }
 * - Displays simple results and links to Map view
 *
 * Backend contract assumed: POST /api/optimize returns { route: {...} } or { error }
 */

export default function RoutePlanner() {
  const [locations, setLocations] = useState(["", "", ""]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function updateLocation(idx, value) {
    const copy = [...locations];
    copy[idx] = value;
    setLocations(copy);
  }

  function addLocation() {
    setLocations((s) => [...s, ""]);
  }

  function removeLocation(idx) {
    setLocations((s) => s.filter((_, i) => i !== idx));
  }

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const payload = { locations: locations.filter(Boolean) };
      const res = await api.post("/optimize", payload);
      if (res?.data?.route) {
        setResult(res.data.route);
      } else {
        setError("Unexpected response from server");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  function openMap() {
    if (result) {
      navigate("/map", { state: { route: result } });
    }
  }

  // Helper function to get appropriate placeholder text
  function getPlaceholder(idx) {
    if (idx === 0) {
      return "Starting point (address or lat,lng)";
    } else if (idx === locations.length - 1 && locations.length > 1) {
      return "Destination (address or lat,lng)";
    } else {
      return `Pickup point ${idx} (address or lat,lng)`;
    }
  }

  return (
    <div className="bg-white rounded shadow p-6">
      <form onSubmit={submit}>
        <div className="space-y-3">
          {locations.map((loc, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                value={loc}
                onChange={(e) => updateLocation(idx, e.target.value)}
                placeholder={getPlaceholder(idx)}
                className="flex-1 p-2 border rounded"
              />
              {locations.length > 2 && idx !== 0 && idx !== locations.length - 1 && (
                <button
                  type="button"
                  onClick={() => removeLocation(idx)}
                  className="px-2 py-1 text-sm text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={addLocation}
              className="px-3 py-2 bg-indigo-600 text-white rounded"
            >
              Add Location
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-3 py-2 bg-green-600 text-white rounded"
            >
              {loading ? "Optimizing..." : "Optimize Route"}
            </button>

            <button
              type="button"
              onClick={openMap}
              disabled={!result}
              className="px-3 py-2 bg-gray-200 text-gray-800 rounded"
            >
              View on Map
            </button>
          </div>

          {error && <div className="text-sm text-red-600 mt-2">{error}</div>}

          {result && (
            <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-200 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-900 mb-3">✓ Optimized Route</h3>
              
              {/* Optimized Order */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">📍 Route Order:</p>
                <div className="space-y-1">
                  {result.route && result.route.map((point, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-gray-800 font-medium">{point.input}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leg-by-Leg Breakdown */}
              {result.legs && result.legs.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">🚗 Travel Breakdown:</p>
                  <div className="space-y-2">
                    {result.legs.map((leg, idx) => (
                      <div key={idx} className="bg-white p-3 rounded border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">
                              Step {leg.step}: {leg.from} → {leg.to}
                            </p>
                          </div>
                          <div className="flex gap-3 text-xs text-gray-600">
                            <span className="font-semibold">{leg.distance_km} km</span>
                            <span className="font-semibold">{leg.time_minutes} min</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total Summary */}
              <div className="pt-3 border-t border-indigo-200">
                <div className="flex items-center justify-between bg-indigo-100 p-3 rounded">
                  <span className="text-sm font-bold text-indigo-900">Total Journey:</span>
                  <div className="flex gap-4 text-sm font-bold text-indigo-900">
                    <span>📏 {result.total_distance_km} km</span>
                    <span>⏱️ {result.total_time_minutes} mins</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
