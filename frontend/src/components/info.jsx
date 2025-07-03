import { useState } from "react";
import axios from "axios";

const Info = () => {
    const [formData, setFormData] = useState({
        eventName: "",
        eventInfo: "",
        donorName: "",
        contact: "",
        address: "",
        endTime: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5001/pre-donate", formData);
            if (response.data.success) {
                setMessage("✅ Event registered successfully!");
                setFormData({
                    eventName: "",
                    eventInfo: "",
                    donorName: "",
                    contact: "",
                    address: "",
                    endTime: "",
                });
            }
        } catch (error) {
            setMessage("❌ Error registering event");
            console.error(error);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">Pre-Donation Event Registration</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="eventName"
                    placeholder="Event Name"
                    value={formData.eventName}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <textarea
                    name="eventInfo"
                    placeholder="Event Information"
                    value={formData.eventInfo}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded h-32"
                />
                <input
                    type="text"
                    name="donorName"
                    placeholder="Donor Name"
                    value={formData.donorName}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="text"
                    name="contact"
                    placeholder="Contact Number"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Event Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <button type="submit" className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Register Event
                </button>
            </form>
            {message && <p className="mt-4 text-center">{message}</p>}
        </div>
    );
};

export default Info;