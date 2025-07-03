
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NgoDashboard() {
    const [donors, setDonors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    // ✅ Check if NGO is Authenticated
    useEffect(() => {
        const isNgoAuth = localStorage.getItem("ngoAuth");
        if (!isNgoAuth) {
            navigate("/ngo-auth");
        }
    }, [navigate]);

    // ✅ Fetch Donors from Server
    useEffect(() => {
        fetch("http://localhost:5000/donors")
            .then((res) => res.json())
            .then((data) => setDonors(data))
            .catch((error) => console.error("Error fetching donors:", error));
    }, []);

    // ✅ Handle Notifications
    const sendNotification = (donorId) => {
        fetch(`http://localhost:5000/notify-donor/${donorId}`, { method: "POST" })
            .then(() => alert("Notification sent!"))
            .catch((error) => console.error("Error sending notification:", error));
    };

    // ✅ Filter Donors Based on Search Term
    const filteredDonors = donors.filter((donor) =>
        donor.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Donor List</h1>
            <input
                type="text"
                placeholder="Search by Address"
                className="border p-2 mb-4 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Address</th>
                        <th className="border p-2">Food Type</th>
                        <th className="border p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDonors.map((donor) => (
                        <tr key={donor._id} className="border">
                            <td className="border p-2">{donor.name}</td>
                            <td className="border p-2">{donor.address}</td>
                            <td className="border p-2">{donor.foodType}</td>
                            <td className="border p-2">
                                <button
                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                    onClick={() => sendNotification(donor._id)}
                                >
                                    Notify
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default NgoDashboard;
