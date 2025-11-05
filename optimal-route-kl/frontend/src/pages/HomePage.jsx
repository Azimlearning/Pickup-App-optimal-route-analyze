import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [locations, setLocations] = useState(['', '']);
    const navigate = useNavigate();

    const handleAddLocation = () => {
        setLocations([...locations, '']);
    };

    const handleLocationChange = (index, value) => {
        const newLocations = [...locations];
        newLocations[index] = value;
        setLocations(newLocations);
    };

    const handleOptimizeRoute = async () => {
        const cleanLocations = locations.filter(loc => loc.trim() !== '');

        if (cleanLocations.length < 2) {
            alert("Please enter at least a start and destination location.");
            return;
        }

        const payload = {
            start_location: cleanLocations[0],
            friend_locations: cleanLocations.slice(1, -1),
            final_destination: cleanLocations[cleanLocations.length - 1],
        };

        try {
            const response = await axios.post('/api/optimize_route', payload);
            const { optimized_route, directions } = response.data;
            navigate('/route', { state: { optimized_route, directions, origin: cleanLocations[0] } });
        } catch (error) {
            console.error('Error optimizing route:', error);
            alert('Failed to optimize route. Please check the console for more details.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold text-center mb-8">Optimal Route KL</h1>
            <div className="flex flex-col items-center">
                {locations.map((location, index) => (
                    <input
                        key={index}
                        type="text"
                        value={location}
                        onChange={(e) => handleLocationChange(index, e.target.value)}
                        placeholder={`Enter location ${index + 1}`}
                        className="w-1/2 p-2 mb-4 border rounded"
                    />
                ))}
                <button onClick={handleAddLocation} className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded mb-4">
                    Add Location
                </button>
                <button onClick={handleOptimizeRoute} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Optimize Route
                </button>
            </div>
        </div>
    );
};

export default HomePage;
