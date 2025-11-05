import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import MapView from "./pages/MapView";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <nav className="bg-white shadow p-4 mb-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">Optimal Route</Link>
          <div className="space-x-4">
            <Link to="/" className="text-sm text-indigo-600">Planner</Link>
            <Link to="/map" className="text-sm text-gray-600">Map</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapView />} />
        </Routes>
      </main>
    </div>
  );
}
