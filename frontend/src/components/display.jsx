import { useState, useEffect } from "react";
import axios from "axios";

const Display = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get("http://localhost:5001/events");
                setEvents(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching events:", error);
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) {
        return <div className="text-center p-4">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Upcoming Events</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                    <div key={event._id} className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-2">{event.eventName}</h3>
                        <p className="text-gray-600 mb-2">{event.eventInfo}</p>
                        <div className="border-t pt-2 mt-2">
                            <p><strong>Donor:</strong> {event.donorName}</p>
                            <p><strong>Contact:</strong> {event.contact}</p>
                            <p><strong>Address:</strong> {event.address}</p>
                            <p><strong>End Time:</strong> {new Date(event.endTime).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Display;