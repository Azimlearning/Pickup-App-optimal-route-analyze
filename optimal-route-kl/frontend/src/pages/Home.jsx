import React from "react";
import RoutePlanner from "../components/RoutePlanner";

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Route Planner</h1>
      <p className="mb-4 text-sm text-gray-600">
        Enter pickup locations and get an optimized route. This UI calls the backend API at
        /api/optimize (or VITE_ROUTE_API_BASE_URL).
      </p>

      <RoutePlanner />
    </div>
  );
}
