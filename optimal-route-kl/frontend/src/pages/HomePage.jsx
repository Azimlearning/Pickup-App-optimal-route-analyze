
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// --- Main Home Page Component ---
const HomePage = () => {
    const [locations, setLocations] = useState(['', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // --- Adds a new, empty input field for an address ---
    const handleAddLocation = () => {
        setLocations([...locations, '']);
    };

    // --- Removes an input field by its index ---
    const handleRemoveLocation = (index) => {
        const newLocations = locations.filter((_, i) => i !== index);
        setLocations(newLocations);
    };

    // --- Updates the state when the user types in an address field ---
    const handleLocationChange = (index, value) => {
        const newLocations = locations.map((loc, i) => (i === index ? value : loc));
        setLocations(newLocations);
    };

    // --- Handles the form submission to the backend ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const filledLocations = locations.filter(loc => loc.trim() !== '');
        if (filledLocations.length < 2) {
            setError('Please provide at least two locations.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/optimize_route', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ locations: filledLocations }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: "An unknown error occurred." }));
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            const routeData = await response.json();
            
            // --- Navigate to the RoutePage with the data ---
            navigate('/route', { state: { routeData } });

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-lg mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
                <header className="bg-indigo-800 text-white p-6">
                    <h1 className="text-4xl font-extrabold text-center">Optimal Route KL</h1>
                    <p className="text-center text-indigo-200 mt-2">Find the fastest multi-stop route in Kuala Lumpur</p>
                </header>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {locations.map((location, index) => (
                        <div key={index} className="flex items-center space-x-3">
                            <label className="font-semibold text-gray-700 w-10">{index + 1}.</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => handleLocationChange(index, e.target.value)}
                                placeholder={`Enter Location ${index + 1}`}
                                className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => handleRemoveLocation(index)} 
                                className="p-2 text-red-500 hover:bg-red-100 rounded-full transition duration-300"
                                disabled={locations.length <= 2}
                            >
                                &times; {/* A simple 'X' for remove */}
                            </button>
                        </div>
                    ))}

                    <div className="flex justify-center pt-4">
                        <button type="button" onClick={handleAddLocation} className="text-indigo-600 font-semibold hover:underline">
                            + Add Another Location
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-center font-semibold">{error}</p>}

                    <div className="pt-5">
                        <button 
                            type="submit" 
                            className={`w-full p-4 text-lg font-bold text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-transform transform hover:scale-105 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Calculating...' : 'Optimize Route'}
                        </button>
                    </div>
                    <div className="text-center pt-4">
                        <Link to="/data">
                            <button className="w-full p-4 text-lg font-bold text-white bg-gray-700 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-transform transform hover:scale-105">
                                View Sample Data
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HomePage;
