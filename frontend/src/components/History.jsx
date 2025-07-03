import { useState, useEffect } from "react";
import axios from "axios";


const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get("http://localhost:5001/donation-history");
                setHistory(response.data);
            } catch (error) {
                console.error("Error fetching history:", error);
                setError("Failed to load donation history");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Donation History</h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {history.map((donation) => (
                    <div key={donation._id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-semibold">{donation.donorName}</h3>
                                <p className="text-gray-600">{donation.email}</p>
                            </div>
                            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                {donation.points} Points
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p><span className="font-medium">Food Type:</span> {donation.foodType}</p>
                            <p><span className="font-medium">Servings:</span> {donation.servings}</p>
                            <p><span className="font-medium">Address:</span> {donation.address}</p>
                            <p><span className="font-medium">Date:</span> {new Date(donation.donationDate).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            {history.length === 0 && (
                <p className="text-center text-gray-500">No donation history available.</p>
            )}
        </div>
    );
};
export default History;