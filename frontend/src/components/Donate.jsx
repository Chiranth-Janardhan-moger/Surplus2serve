

import { useState } from "react";
import axios from "axios";

const Donate = () => {
    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        address: "",
        email: "",
        foodType: "",
        servings: "",
        preparedTime: "",
        latitude: null,
        longitude: null
    });
    const [message, setMessage] = useState("");
    const [locationLoading, setLocationLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState("");

    const getCurrentLocation = () => {
        setLocationLoading(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    
                    // Get address from coordinates using reverse geocoding
                    reverseGeocode(latitude, longitude);
                    
                    setFormData(prev => ({
                        ...prev,
                        latitude,
                        longitude
                    }));
                    setLocationLoading(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setMessage("❌ Could not get your location. Please enter address manually.");
                    setLocationLoading(false);
                }
            );
        } else {
            setMessage("❌ Geolocation is not supported by your browser");
            setLocationLoading(false);
        }
    };

    const reverseGeocode = async (latitude, longitude) => {
        try {
            const response = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${import.meta.env.OPENCAGE_API_KEY}`
            );
            if (response.data.results.length > 0) {
                const address = response.data.results[0].formatted;
                setFormData(prev => ({ ...prev, address }));
            }
        } catch (error) {
            console.error("Reverse geocoding error:", error);
            setMessage("❌ Could not get address from location");
        }
    };
    // ✅ Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setSubmitStatus("");

        if (!formData.latitude || !formData.longitude) {
            setMessage("❌ Please share your location first");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5001/donate", formData);

            if (response.data.success) {
                setMessage("✅ " + response.data.message);
                setSubmitStatus("submitted");
                setFormData({
                    name: "",
                    contact: "",
                    address: "",
                    email: "",
                    foodType: "",
                    servings: "",
                    preparedTime: "",
                    latitude: null,
                    longitude: null
                });
                
                // Show additional message about notification
                setTimeout(() => {
                    setMessage("✅ Your donation has been submitted. You will receive an SMS when an NGO accepts your donation.");
                }, 2000);
            } else {
                setMessage("❌ " + response.data.message);
            }
        } catch (error) {
            console.error("Error submitting donation:", error);
            const errorMessage = error.response?.data?.message || "Failed to submit donation";
            setMessage("❌ " + errorMessage);
        }
    };
    return (
        <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">Donate Food</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded" />
                <input type="text" name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} required className="w-full p-2 border rounded" />
                 
                <div className="relative">
                    <input 
                        type="text" 
                        name="address" 
                        placeholder="Address" 
                        value={formData.address} 
                        onChange={handleChange} 
                        required 
                        className="w-full p-2 border rounded pr-10" 
                    />
                    <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="absolute right-2 top-2 text-blue-500 hover:text-blue-700"
                        disabled={locationLoading}
                    >
                        {locationLoading ? "📍..." : "📍"}
                    </button>
                </div>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded" />
                <input type="text" name="foodType" placeholder="Food Type" value={formData.foodType} onChange={handleChange} required className="w-full p-2 border rounded" />
                <input type="number" name="servings" placeholder="Number of Servings" value={formData.servings} onChange={handleChange} required className="w-full p-2 border rounded" />
                <input
                    type="datetime-local"
                    name="preparedTime"
                    value={formData.preparedTime}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">Submit</button>
            </form>
 {message && (
                <div className={`mb-4 p-3 rounded-lg text-center ${
                    message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default Donate;

