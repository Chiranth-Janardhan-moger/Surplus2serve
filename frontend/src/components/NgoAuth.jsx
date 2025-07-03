


import { useState } from "react";
import { useNavigate } from "react-router-dom";

function NgoAuth({ onAuthSuccess }) {
    const [secretKey, setSecretKey] = useState("");
    const [error, setError] = useState("");
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null
    });
    const navigate = useNavigate();

    const getCurrentLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setError("Could not get your location. Please try again.");
                }
            );
        } else {
            setError("Geolocation is not supported by your browser");
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!location.latitude || !location.longitude) {
            setError("Please allow location access to continue");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:5001/verify-ngo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    secretKey,
                    latitude: location.latitude,
                    longitude: location.longitude
                }),
            });
    
            const data = await response.json();
            console.log("Verification response:", data); // Debug log
    
            if (data.success) {
                localStorage.setItem("isNgoAuth", "true");
                localStorage.setItem("ngoLocation", JSON.stringify({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    address: data.ngo.address
                }));
                onAuthSuccess();
                navigate("/donors");
            } else {
                setError(data.message || "Invalid Secret Key! Access Denied.");
            }
        } catch (error) {
            console.error("Error verifying NGO:", error);
            setError("Server error! Please try again later.");
        }
    };
   
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">Enter Secret Key</h2>
                
                <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="mb-4 bg-blue-500 text-white px-4 py-2 rounded w-full"
                >
                    {location.latitude ? "📍 Location Captured" : "📍 Get Location"}
                </button>

                <input
                    type="password"
                    className="border p-2 w-full mb-3"
                    placeholder="Enter Secret Key"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                />
                {error && <p className="text-red-500">{error}</p>}
                <button 
                    type="submit" 
                    className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                    disabled={!location.latitude}
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default NgoAuth;