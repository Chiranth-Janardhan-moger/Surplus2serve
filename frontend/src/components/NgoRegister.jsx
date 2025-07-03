

import { useState } from "react";
import axios from "axios";

const NgoRegister = () => {
    const [formData, setFormData] = useState({
        ngoName: "",
        address: "",
        contact: "",
        secretKey: ""
    });
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await axios.post("http://localhost:5001/register-ngo", formData);

            if (response.data.success) {
                setIsSuccess(true);
                setMessage(response.data.message);
                localStorage.setItem("ngoSecretKey", formData.secretKey);
                setFormData({
                    ngoName: "",
                    address: "",
                    contact: "",
                    secretKey: ""
                });
            } else {
                setIsSuccess(false);
                setMessage(response.data.message || "Registration failed");
            }
        } catch (error) {
            setIsSuccess(false);
            setMessage(error.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">NGO Registration</h2>
            {message && (
                <p className={`mb-4 text-center ${isSuccess ? "text-green-600" : "text-red-500"}`}>
                    {message}
                </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="ngoName"
                    placeholder="NGO Name"
                    value={formData.ngoName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                />
                <input
                    type="text"
                    name="contact"
                    placeholder="Contact Number"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                />
                <input
                    type="password"
                    name="secretKey"
                    placeholder="Secret Key"
                    value={formData.secretKey}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Register NGO
                </button>
            </form>
        </div>
    );
};

export default NgoRegister;