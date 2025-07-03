

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
};

const formatPrepTime = (prepTime) => {
    const date = new Date(prepTime);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const Donors = () => {
    const [ngoLocation, setNgoLocation] = useState(null);
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDonors, setSelectedDonors] = useState([]);
    const [notificationStatus, setNotificationStatus] = useState("");

    useEffect(() => {
        const savedLocation = localStorage.getItem("ngoLocation");
        if (savedLocation) {
            setNgoLocation(JSON.parse(savedLocation));
        }

        const fetchDonors = async () => {
            try {
                const response = await axios.get("http://localhost:5001/donors");
                setDonors(response.data);
            } catch (error) {
                console.error("Error fetching donors:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDonors();
    }, []);

    const filteredDonors = donors.filter(donor => {
        const matchesSearch = donor.address.toLowerCase().includes(searchQuery.toLowerCase());
        if (!ngoLocation || !donor.latitude || !donor.longitude) return matchesSearch;
        const distance = calculateDistance(
            ngoLocation.latitude,
            ngoLocation.longitude,
            donor.latitude,
            donor.longitude
        );
        return distance <= 5 && matchesSearch; // Only show donors within 5km
    });

    const handleDonorSelection = (donorId) => {
        setSelectedDonors(prev => prev.includes(donorId) 
            ? prev.filter(id => id !== donorId) 
            : [...prev, donorId]
        );
    };

    const notifySelectedDonors = useCallback(async () => {
        if (selectedDonors.length === 0) {
            setNotificationStatus("Please select at least one donor");
            return;
        }
    
        setNotificationStatus("Processing notifications...");
        
        try {
            const ngoSecretKey = localStorage.getItem("ngoSecretKey");
            if (!ngoSecretKey) {
                setNotificationStatus("❌ NGO authentication required");
                return;
            }
    
            const selectedDonorDetails = donors.filter(donor => 
                selectedDonors.includes(donor._id)
            );
    
            const response = await axios.post("http://localhost:5001/notify-donors", {
                donors: selectedDonorDetails,
                ngoSecretKey
            });
    
            if (response.data.success) {
                // Remove processed donors from the list
                setDonors(prevDonors => 
                    prevDonors.filter(donor => !selectedDonors.includes(donor._id))
                );
                setSelectedDonors([]);
                setNotificationStatus(`✅ ${response.data.message}`);
            } else {
                setNotificationStatus(`⚠️ ${response.data.message}`);
            }
        } catch (error) {
            console.error("Notification error:", error);
            setNotificationStatus(`❌ Error: ${error.response?.data?.message || error.message}`);
        }
    }, [selectedDonors, donors]);
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Donors List</h2>

            <input
                type="text"
                placeholder="Search by address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
            />

            {notificationStatus && (
                <div className={`p-3 mb-4 rounded ${notificationStatus.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {notificationStatus}
                </div>
            )}

   {loading ? (
                <p>Loading donors...</p>
            ) : filteredDonors.length > 0 ? (
                <>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Select</th>
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Contact</th>
                                <th className="border p-2">Food Type</th>
                                <th className="border p-2">Servings</th>
                                <th className="border p-2">Prepared Time</th>
                                <th className="border p-2">Address</th>
                                <th className="border p-2">Distance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDonors.map((donor) => (
                                <tr key={donor._id}>
                                    <td className="border p-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedDonors.includes(donor._id)}
                                            onChange={() => handleDonorSelection(donor._id)}
                                            className="h-4 w-4"
                                        />
                                    </td>
                                    <td className="border p-2">{donor.name}</td>
                                    <td className="border p-2">{donor.contact}</td>
                                    <td className="border p-2">{donor.foodType}</td>
                                    <td className="border p-2">{donor.servings}</td>
                                    <td className="border p-2">
                                        {donor.preparedTime ? formatPrepTime(donor.preparedTime) : 'N/A'}
                                    </td>
                                    <td className="border p-2">{donor.address}</td>
                                    <td className="border p-2">
                                        {ngoLocation && donor.latitude && donor.longitude
                                            ? `${calculateDistance(
                                                ngoLocation.latitude,
                                                ngoLocation.longitude,
                                                donor.latitude,
                                                donor.longitude
                                            ).toFixed(1)} km`
                                            : "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {selectedDonors.length > 0 && (
                        <button
                            onClick={notifySelectedDonors}
                            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            Notify Selected Donors ({selectedDonors.length})
                        </button>
                    )}
                </>
            ) : (
                <p>No donors found.</p>
            )}
        </div>
    );
};

export default Donors;
