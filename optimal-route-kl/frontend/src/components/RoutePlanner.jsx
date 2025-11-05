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
  const [locations, setLocations] = useState(["", ""]);
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
                placeholder={`Location ${idx + 1} (address or lat,lng)`}
                className="flex-1 p-2 border rounded"
              />
              {locations.length > 1 && (
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
            <div className="mt-4 p-3 bg-gray-50 border rounded text-sm">
              <strong>Route result:</strong>
              <pre className="text-xs mt-2 overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
