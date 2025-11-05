
import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaMapMarkerAlt, FaCar, FaClock, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

// Component to display the final optimized route and advisory
const RoutePage = () => {
    const location = useLocation();
    const routeData = location.state?.routeData; // Safely access nested state

    // --- Safety and Loading Check ---
    if (!routeData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p className="text-xl text-red-600">
                    Error: Could not load route data. Please go back and optimize the route again.
                </p>
            </div>
        );
    }

    // --- Destructure Data for Cleaner Access ---
    const { 
        optimal_sequence, 
        total_time_minutes, 
        llm_analysis, 
        llm_buffer_minutes 
    } = routeData;

    const totalTimeWithBuffer = (total_time_minutes || 0) + (llm_buffer_minutes || 0);

    // --- Helper function for dynamic route labels ---
    const getRouteLabel = (index, totalLength) => {
        if (index === 0) return { label: "STARTING POINT", color: "text-green-600", icon: <FaCheckCircle /> };
        if (index === totalLength - 1) return { label: "FINAL DESTINATION", color: "text-red-600", icon: <FaMapMarkerAlt /> };
        return { label: `PICKUP POINT ${index}`, color: "text-blue-600", icon: <FaCar /> };
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
                <header className="bg-indigo-700 text-white p-5">
                    <h1 className="text-3xl font-extrabold tracking-tight">Your Optimized Route</h1>
                    <p className="mt-1 text-indigo-200">The most efficient path based on real-time KL traffic.</p>
                </header>

                {/* --- 🗺️ Optimized Route List --- */}
                <section className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                        <FaMapMarkerAlt className="mr-2 text-indigo-500" /> Route Details ({optimal_sequence.length} Stops)
                    </h2>
                    
                    <ol className="list-none pl-0 space-y-4">
                        {optimal_sequence.map((locationName, index) => {
                            const { label, color, icon } = getRouteLabel(index, optimal_sequence.length);
                            return (
                                <li 
                                    key={index} 
                                    className="flex items-center p-3 border border-gray-200 rounded-lg bg-white"
                                >
                                    <div className={`mr-4 text-lg ${color}`}>{icon}</div>
                                    <div className="flex flex-col">
                                        <span className={`text-xs font-bold uppercase ${color}`}>{label}</span>
                                        <span className="text-base text-gray-700 font-semibold">{locationName}</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </section>

                {/* --- ⏱️ Time Summary --- */}
                <section className="p-6 border-b border-gray-100 bg-indigo-50">
                    <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                        <FaClock className="mr-2 text-indigo-700" /> Estimated Travel Time
                    </h2>
                    <div className="space-y-3">
                        <p className="text-lg text-gray-700 flex justify-between">
                            <span>Base Optimal Time:</span>
                            <span className="font-semibold">{total_time_minutes ? `${total_time_minutes.toFixed(1)} min` : 'N/A'}</span>
                        </p>
                        <p className="text-lg text-gray-700 flex justify-between">
                            <span className="font-medium text-red-600">AI Suggested Traffic Buffer:</span>
                            <span className="font-bold text-red-600">{llm_buffer_minutes ? `+${llm_buffer_minutes} min` : '0 min'}</span>
                        </p>
                        <div className="border-t pt-3 mt-3">
                            <p className="text-2xl font-extrabold flex justify-between text-indigo-800">
                                <span>TOTAL ESTIMATED TIME:</span>
                                <span>{totalTimeWithBuffer.toFixed(1)} min</span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- 🗣️ Travel Advisory (LLM Output) --- */}
                <section className="p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
                        <FaExclamationTriangle className="mr-2 text-yellow-600" /> AI Travel Advisory
                    </h2>
                    <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg shadow-inner">
                        <p className="text-gray-700 leading-relaxed italic">
                            {llm_analysis || "LLM Advisory is currently unavailable or still processing."}
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RoutePage;
