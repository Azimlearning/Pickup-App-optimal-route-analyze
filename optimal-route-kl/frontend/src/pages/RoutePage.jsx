 
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCar, FaClock, FaRoute, FaArrowLeft } from 'react-icons/fa';

// --- Main Route Page Component ---
const RoutePage = () => {
    const location = useLocation();
    const routeData = location.state?.routeData;

    // --- Safety and Loading Check ---
    if (!routeData || !routeData[0]) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <p className="text-xl text-red-600 mb-4">
                    Error: Could not load route data. Please go back and optimize the route again.
                </p>
                <Link to="/" className="text-indigo-600 hover:underline flex items-center">
                    <FaArrowLeft className="mr-2" />
                    Go Back to Home
                </Link>
            </div>
        );
    }

    const route = routeData[0];
    const legs = route.legs;

    // --- Calculate total distance and duration ---
    const totalDistance = legs.reduce((acc, leg) => acc + leg.distance.value, 0);
    const totalDuration = legs.reduce((acc, leg) => acc + leg.duration.value, 0);

    const formatDistance = (distanceInMeters) => {
        const distanceInKm = distanceInMeters / 1000;
        return `${distanceInKm.toFixed(2)} km`;
    };

    const formatDuration = (durationInSeconds) => {
        const minutes = Math.floor(durationInSeconds / 60);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${remainingMinutes}m`;
        }
        return `${minutes}m`;
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="bg-indigo-800 text-white p-6 rounded-t-lg shadow-lg">
                    <h1 className="text-3xl font-extrabold">Your Optimized Route</h1>
                    <p className="mt-1 text-indigo-200">{route.summary}</p>
                </header>

                <div className="bg-white shadow-lg rounded-b-lg p-6">
                    {/* --- Overall Route Summary --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
                        <div className="p-4 bg-indigo-50 rounded-lg">
                            <FaRoute className="text-indigo-600 text-3xl mx-auto mb-2" />
                            <h3 className="text-lg font-semibold text-gray-800">Total Distance</h3>
                            <p className="text-2xl font-bold text-indigo-800">{formatDistance(totalDistance)}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                            <FaClock className="text-green-600 text-3xl mx-auto mb-2" />
                            <h3 className="text-lg font-semibold text-gray-800">Total Duration</h3>
                            <p className="text-2xl font-bold text-green-800">{formatDuration(totalDuration)}</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <FaCar className="text-blue-600 text-3xl mx-auto mb-2" />
                            <h3 className="text-lg font-semibold text-gray-800">Number of Stops</h3>
                            <p className="text-2xl font-bold text-blue-800">{legs.length + 1}</p>
                        </div>
                    </div>

                    {/* --- Turn-by-Turn Directions for each Leg --- */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Turn-by-Turn Directions</h2>
                        {legs.map((leg, legIndex) => (
                            <div key={legIndex} className="mb-8 p-6 bg-gray-50 rounded-lg shadow-md">
                                <h3 className="text-xl font-bold mb-4 flex items-center text-indigo-700">
                                    <FaMapMarkerAlt className="mr-3" />
                                    Leg {legIndex + 1}: {leg.start_address} to {leg.end_address}
                                </h3>
                                <div className="pl-6 border-l-4 border-indigo-200">
                                    {leg.steps.map((step, stepIndex) => (
                                        <div key={stepIndex} className="py-2 flex items-start">
                                            <div className="mr-4 text-indigo-500 font-bold">{stepIndex + 1}.</div>
                                            <div
                                                className="text-gray-700"
                                                dangerouslySetInnerHTML={{ __html: step.html_instructions }}
                                            />
                                            <div className="ml-auto text-right text-sm text-gray-500">
                                                <p>{step.distance.text}</p>
                                                <p>({step.duration.text})</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 text-right font-semibold text-gray-700">
                                    <p>Leg Distance: {leg.distance.text}</p>
                                    <p>Leg Duration: {leg.duration.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Link to="/" className="text-indigo-600 hover:underline flex items-center justify-center">
                            <FaArrowLeft className="mr-2" />
                            Calculate Another Route
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoutePage;
