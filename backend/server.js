require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const axios = require("axios");
const app = express();
const twilio = require('twilio');
const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// ✅ CORS Configuration (Supports Multiple Frontend URLs)
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://yourdomain.com"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());

// ✅ MySQL Connection Configuration for XAMPP
const dbConfig = {
    host: 'localhost',
    port: 3306, // Default MySQL port in XAMPP
    user: 'root',
    password: '', // XAMPP MySQL root has no password by default
    database: 'food_donation_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const JWT_SECRET = "xK8aP2z$Lm7QrT9wY3vE6cJ1nB5gF0dH4sU*jA&fZ@pN";

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ Connected to MySQL Database");
        connection.release();
    } catch (err) {
        console.error("❌ MySQL connection error:", err);
        process.exit(1);
    }
};
testConnection();

// Reverse geocoding function
const reverseGeocode = async (latitude, longitude) => {
    try {
        if (!process.env.OPENCAGE_API_KEY) {
            throw new Error("OpenCage API key not configured");
        }

        console.log("Geocoding request:", { latitude, longitude });

        const response = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.OPENCAGE_API_KEY}`
        );
        
        console.log("Geocoding response:", response.data);

        if (response.data.results.length > 0) {
            return response.data.results[0].formatted;
        }
        return null;
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        throw error;
    }
};

// Phone number formatting function
function formatPhoneNumber(phone) {
    let cleaned = phone.replace(/\D/g, '');
    cleaned = cleaned.replace(/^0+/, '');
    
    if (!cleaned.startsWith('91')) {
        cleaned = '91' + cleaned;
    }
    
    cleaned = '+' + cleaned;
    console.log(`Original number: ${phone}, Formatted number: ${cleaned}`);
    return cleaned;
}

// ==========================
// 🔹 Signup Route
// ==========================
app.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const [existingUsers] = await pool.execute(
            'SELECT id FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert new user
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        const userId = result.insertId;
        const token = jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: "24h" });

        res.status(201).json({ 
            message: "User registered successfully", 
            token, 
            userId 
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Error during registration" });
    }
});

// =========================
// 🔹 Login Route
// =========================
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find user by username or email
        const [users] = await pool.execute(
            'SELECT id, username, email, password FROM users WHERE username = ? OR email = ?',
            [username, username]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "24h" });

        res.status(200).json({ 
            message: "Login successful", 
            token, 
            userId: user.id 
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Error during login" });
    }
});

// =========================
// 🔹 NGO Registration Route
// =========================
app.post("/register-ngo", async (req, res) => {
    try {
        const { ngoName, contact, address, secretKey } = req.body;

        if (!ngoName || !contact || !address || !secretKey) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if NGO already exists
        const [existingNgos] = await pool.execute(
            'SELECT id FROM ngos WHERE ngo_name = ? OR secret_key = ?',
            [ngoName, secretKey.trim().toLowerCase()]
        );

        if (existingNgos.length > 0) {
            return res.status(400).json({
                success: false,
                message: "NGO with this name or secret key already exists"
            });
        }

        // Insert new NGO
        await pool.execute(
            'INSERT INTO ngos (ngo_name, contact, address, secret_key) VALUES (?, ?, ?, ?)',
            [ngoName, contact, address, secretKey.trim().toLowerCase()]
        );

        res.status(201).json({
            success: true,
            message: "NGO registered successfully"
        });
    } catch (error) {
        console.error("NGO Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Error registering NGO",
            error: error.message
        });
    }
});

// 🔹 Verify NGO Secret Key
app.post("/verify-ngo", async (req, res) => {
    try {
        const { secretKey, latitude, longitude } = req.body;
        
        console.log("Verification request received:", { secretKey, latitude, longitude });

        if (!secretKey) {
            return res.status(400).json({ 
                success: false, 
                message: "Secret key is required" 
            });
        }

        if (!latitude || !longitude) {
            return res.status(400).json({ 
                success: false, 
                message: "Location coordinates are required" 
            });
        }

        // Find NGO
        const [ngos] = await pool.execute(
            'SELECT * FROM ngos WHERE secret_key = ?',
            [secretKey.trim().toLowerCase()]
        );

        if (ngos.length === 0) {
            console.log("NGO not found with secret key:", secretKey);
            return res.status(401).json({
                success: false,
                message: "Invalid secret key"
            });
        }

        const ngo = ngos[0];

        try {
            // Get address from coordinates
            const address = await reverseGeocode(latitude, longitude);
            
            if (!address) {
                return res.status(400).json({
                    success: false,
                    message: "Could not determine location address"
                });
            }

            // Update NGO location
            await pool.execute(
                'UPDATE ngos SET current_latitude = ?, current_longitude = ?, current_address = ? WHERE id = ?',
                [latitude, longitude, address, ngo.id]
            );

            res.json({
                success: true,
                message: "Verified successfully",
                ngo: {
                    name: ngo.ngo_name,
                    address: address
                },
                location: {
                    latitude,
                    longitude,
                    address
                }
            });

        } catch (error) {
            console.error("Location update error:", error);
            return res.status(500).json({
                success: false,
                message: "Error updating location",
                error: error.message
            });
        }
    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during verification",
            error: error.message
        });
    }
});

// =========================
// 🔹 Donation Route
// =========================
app.post("/donate", async (req, res) => {
    try {
        const { name, contact, email, foodType, servings, latitude, longitude, preparedTime } = req.body;
        
        // Get address from coordinates
        const address = await reverseGeocode(latitude, longitude);
        if (!address) {
            return res.status(400).json({
                success: false,
                message: "Could not determine address from location"
            });
        }

        // Insert new donation
        await pool.execute(
            'INSERT INTO donors (name, contact, address, email, food_type, servings, prepared_time, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, contact, address, email, foodType, Number(servings), new Date(preparedTime), latitude, longitude]
        );

        // Fetch all registered NGOs
        const [ngos] = await pool.execute('SELECT * FROM ngos');

        // Send SMS notifications to all NGOs
        for (const ngo of ngos) {
            try {
                const formattedPhone = formatPhoneNumber(ngo.contact);
                await client.messages.create({
                    body: `New food donation available!\n\nDonor: ${name}\nFood Type: ${foodType}\nServings: ${servings}\nLocation: ${address}\n\nPlease check your NGO dashboard for more details.`,
                    to: formattedPhone,
                    from: process.env.TWILIO_PHONE_NUMBER
                });
                console.log(`✅ Notification sent to NGO: ${ngo.ngo_name}`);
            } catch (error) {
                console.error(`Failed to send notification to NGO ${ngo.ngo_name}:`, error);
            }
        }
        
        res.status(201).json({
            success: true,
            message: "Donation submitted successfully and NGOs have been notified!",
            address: address
        });
    } catch (error) {
        console.error("Donation submission error:", error);
        res.status(500).json({
            success: false,
            message: "Error submitting donation",
            error: error.message
        });
    }
});

// ✅ Get Donors
app.get("/donors", async (req, res) => {
    try {
        const [donors] = await pool.execute(
            'SELECT * FROM donors ORDER BY created_at DESC'
        );
        console.log("Fetched donors:", donors.length);
        res.status(200).json(donors);
    } catch (error) {
        console.error("Fetch donors error:", error);
        res.status(500).json({ 
            success: false,
            message: "Error fetching donors",
            error: error.message 
        });
    }
});

// Delete donor route
app.delete('/donors/:id', async (req, res) => {
    try {
        const donorId = req.params.id;
        await pool.execute('DELETE FROM donors WHERE id = ?', [donorId]);
        res.json({ success: true, message: 'Donor removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error removing donor', error: error.message });
    }
});

// =========================
// 🔹 Event Routes
// =========================
app.post("/pre-donate", async (req, res) => {
    try {
        const { eventName, eventInfo, donorName, contact, address, endTime } = req.body;
        
        await pool.execute(
            'INSERT INTO events (event_name, event_info, donor_name, contact, address, end_time) VALUES (?, ?, ?, ?, ?, ?)',
            [eventName, eventInfo, donorName, contact, address, new Date(endTime)]
        );
        
        res.status(201).json({ success: true, message: "Event registered successfully" });
    } catch (error) {
        console.error("Event registration error:", error);
        res.status(500).json({ success: false, message: "Error registering event" });
    }
});

app.get("/events", async (req, res) => {
    try {
        const [events] = await pool.execute('SELECT * FROM events ORDER BY end_time ASC');
        res.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Error fetching events" });
    }
});

// =========================
// 🔹 Notification Route
// =========================
app.post("/notify-donors", async (req, res) => {
    try {
        const { donors, ngoSecretKey } = req.body;
        
        if (!donors || donors.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No donors provided"
            });
        }

        // Get NGO details
        const [ngos] = await pool.execute(
            'SELECT * FROM ngos WHERE secret_key = ?',
            [ngoSecretKey.trim().toLowerCase()]
        );

        if (ngos.length === 0) {
            return res.status(400).json({
                success: false,
                message: "NGO not found"
            });
        }

        const ngo = ngos[0];
        const results = [];

        for (const donor of donors) {
            try {
                const formattedPhone = formatPhoneNumber(donor.contact);
                console.log(`Attempting to notify ${donor.name} at ${formattedPhone}`);

                // Send SMS
                const message = await client.messages.create({
                    body: `Dear ${donor.name},\nYour food donation of ${donor.servings} servings has been accepted by:\n\nNGO Name: ${ngo.ngo_name}\nNGO Contact: ${ngo.contact}\nNGO Address: ${ngo.current_address || ngo.address}\n\nThank you for your contribution!`,
                    to: formattedPhone,
                    from: process.env.TWILIO_PHONE_NUMBER
                });

                // Create history entry
                await pool.execute(
                    'INSERT INTO donation_history (donor_name, email, food_type, servings, address, points) VALUES (?, ?, ?, ?, ?, ?)',
                    [donor.name, donor.email, donor.food_type, donor.servings, donor.address, 10]
                );

                // Remove donor from active list
                await pool.execute('DELETE FROM donors WHERE id = ?', [donor.id]);

                results.push({
                    success: true,
                    donorName: donor.name,
                    messageSid: message.sid
                });

                console.log(`✅ Successfully processed donor: ${donor.name}`);
            } catch (error) {
                console.error(`Error processing donor ${donor.name}:`, error);
                results.push({
                    success: false,
                    donorName: donor.name,
                    error: error.message
                });
            }
        }

        const successCount = results.filter(r => r.success).length;

        res.json({
            success: successCount > 0,
            message: `Successfully processed ${successCount} out of ${donors.length} donors`,
            details: results
        });

    } catch (error) {
        console.error("Notification error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to process notifications",
            error: error.message
        });
    }
});

// =========================
// 🔹 Other Routes
// =========================
app.post("/select-donor", async (req, res) => {
    try {
        const { donorId } = req.body;
        
        const [result] = await pool.execute(
            'UPDATE donors SET status = ? WHERE id = ?',
            ['Selected', donorId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Donor not found" });
        }

        res.status(200).json({ message: "Donor has been selected and notified." });
    } catch (error) {
        console.error("Error selecting donor:", error);
        res.status(500).json({ message: "Error selecting donor" });
    }
});

app.post("/send-notifications", async (req, res) => {
    const { donorIds } = req.body;

    try {
        const placeholders = donorIds.map(() => '?').join(',');
        await pool.execute(
            `UPDATE donors SET notified = true WHERE id IN (${placeholders})`,
            donorIds
        );

        res.json({ success: true, message: "Notifications sent successfully!" });
    } catch (error) {
        console.error("Error updating notifications:", error);
        res.status(500).json({ success: false, message: "Error updating notifications" });
    }
});

app.post("/notify-donor/:id", async (req, res) => {
    try {
        const donorId = req.params.id;
        console.log(`Notification sent to donor: ${donorId}`);
        res.json({ success: true, message: "Notification sent!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error sending notification" });
    }
});

app.get("/donation-history", async (req, res) => {
    try {
        const [history] = await pool.execute(
            'SELECT * FROM donation_history ORDER BY donation_date DESC'
        );
        res.json(history);
    } catch (error) {
        console.error("Error fetching donation history:", error);
        res.status(500).json({ message: "Error fetching donation history" });
    }
});

// Debugging middleware
app.use((req, res, next) => {
    console.log('Request body:', req.body);
    next();
});

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    console.error("❌ Twilio credentials missing in environment variables");
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});