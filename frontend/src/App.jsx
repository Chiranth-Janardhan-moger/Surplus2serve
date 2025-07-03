
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Donate from "./components/Donate";
import About from "./components/About";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Signup from "./components/signup";
import NgoDashboard from "./components/NgoDashboard";
import NgoRegister from "./components/NgoRegister";
import NgoAuth from "./components/NgoAuth";
import Donors from "./components/Donors";
import Info from "./components/info";
import Display from "./components/display";
import History from "./components/History";

function App() {
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isNgoAuth, setIsNgoAuth] = useState(localStorage.getItem("isNgoAuth") === "true");

    // ✅ Check if user is logged in
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            setIsAuth(!!token);
            setLoading(false);
        };
        checkAuth();
    }, []);

    // ✅ NGO Authentication Handler
    const handleNgoAuthSuccess = () => {
        setIsNgoAuth(true);
        localStorage.setItem("isNgoAuth", "true");
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <Router>
            {isAuth && <Navbar setIsAuth={setIsAuth} />}
            <Routes>
                <Route path="/" element={!isAuth ? <Login setIsAuth={setIsAuth} /> : <Navigate to="/home" />} />
                <Route path="/signup" element={!isAuth ? <Signup setIsAuth={setIsAuth} /> : <Navigate to="/home" />} />
                <Route path="/home" element={isAuth ? <Home /> : <Navigate to="/" />} />
                <Route path="/donate" element={isAuth ? <Donate /> : <Navigate to="/" />} />
                <Route path="/about" element={isAuth ? <About /> : <Navigate to="/" />} />
                <Route path="/contact" element={isAuth ? <Contact /> : <Navigate to="/" />} />
                <Route path="/register-ngo" element={isAuth ? <NgoRegister /> : <Navigate to="/" />} />
                <Route path="/donors" element={isNgoAuth ? <Donors /> : <Navigate to="/ngo-auth" />} />
                 // Add these routes in App.jsx
                 <Route path="/history" element={isAuth ? <History /> : <Navigate to="/" />} />
    {/* ...existing routes... */}
              <Route path="/pre-donate" element={isAuth ? <Info /> : <Navigate to="/" />} />
              <Route path="/events" element={isAuth ? <Display /> : <Navigate to="/" />} />

                {/* ✅ Redirect to NGO Authentication Page if not Authenticated */}
                <Route path="/ngo-auth" element={<NgoAuth onAuthSuccess={handleNgoAuthSuccess} />} />
                <Route path="/ngodashboard" element={isNgoAuth ? <NgoDashboard /> : <Navigate to="/ngo-auth" />} />
            </Routes>
        </Router>
    );
}

export default App;
