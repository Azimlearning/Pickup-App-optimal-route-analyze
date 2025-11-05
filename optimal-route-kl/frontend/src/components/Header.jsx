import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow p-4 mb-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">Optimal Route</Link>
        <div className="space-x-4">
          <Link to="/" className="text-sm text-indigo-600">Planner</Link>
          <Link to="/map" className="text-sm text-gray-600">Map</Link>
        </div>
      </div>
    </header>
  );
}
