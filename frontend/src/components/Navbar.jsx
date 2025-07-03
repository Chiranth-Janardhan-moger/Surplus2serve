import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Bell, Info, Mail, Shield, LogOut, User, Settings, ChevronDown } from "lucide-react";
import axios from "axios";
import { Calendar } from 'lucide-react';
import { History as HistoryIcon } from 'lucide-react';

function Navbar({ setIsAuth }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [donorNotifications, setDonorNotifications] = useState(0);
    const [hasNewNotifications, setHasNewNotifications] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

    // Polling for New Donor Notifications with Animation Trigger
    useEffect(() => {
        let previousCount = 0;
        
        const fetchDonorCount = async () => {
            try {
                const response = await axios.get("http://localhost:5001/donors");
                const currentCount = response.data.length;
                
                if (currentCount > previousCount) {
                    setHasNewNotifications(true);
                    setTimeout(() => setHasNewNotifications(false), 2000);
                }
                
                setDonorNotifications(currentCount);
                previousCount = currentCount;
            } catch (error) {
                console.error("Failed to fetch donor notifications:", error);
                setDonorNotifications(0);
            }
        };

        fetchDonorCount();
        const interval = setInterval(fetchDonorCount, 5000);
        return () => clearInterval(interval);
    }, []);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isProfileOpen]);

    const handleLogout = () => {
        setIsAuth(false);
        localStorage.removeItem("token");
        localStorage.removeItem("ngoAuth");
        setIsProfileOpen(false);
        navigate("/");
    };

    const verifyNgoAccess = () => {
        const ngoAuth = localStorage.getItem("ngoAuth");
        if (!ngoAuth) {
            navigate("/ngo-auth");
        } else {
            navigate("/ngodashboard");
        }
    };

    return (
        <header className="bg-white/95 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-gray-100/50">
            <nav className="max-w-[1990px] mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Enhanced Logo */}
                    <Link 
                        to="/home" 
                        className="group flex items-center space-x-3 transition-all duration-300 hover:scale-105"
                    >
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-6">
                                <span className="text-white text-2xl font-bold">S</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 text-transparent bg-clip-text group-hover:from-emerald-500 group-hover:to-lime-500 transition-all duration-300">
                                Surplus2Serve
                            </span>
                            <span className="text-xs text-gray-500 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                Connecting surplus to service
                            </span>
                        </div>
                    </Link>
                    
                    {/* Centered Navigation Links */}
                    <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
                        <div className="flex items-center space-x-1 bg-gray-50/80 backdrop-blur-sm rounded-2xl p-2 border border-gray-200/50 shadow-sm">
                            <Link 
                                to="/events" 
                                className={`group flex items-center px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                                    isActive("/events") 
                                        ? "text-lime-700 bg-lime-100/80 shadow-sm" 
                                        : "text-gray-600 hover:text-lime-600 hover:bg-lime-50/80"
                                }`}
                            >
                                <Calendar className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                                <span>Events</span>
                            </Link>

                            <Link 
                                to="/history" 
                                className={`group flex items-center px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                                    isActive("/history") 
                                        ? "text-lime-700 bg-lime-100/80 shadow-sm" 
                                        : "text-gray-600 hover:text-lime-600 hover:bg-lime-50/80"
                                }`}
                            >
                                <HistoryIcon className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                                <span>History</span>
                            </Link>
                            
                            <Link 
                                to="/about" 
                                className={`group flex items-center px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                                    isActive("/about") 
                                        ? "text-lime-700 bg-lime-100/80 shadow-sm" 
                                        : "text-gray-600 hover:text-lime-600 hover:bg-lime-50/80"
                                }`}
                            >
                                <Info className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                                <span>About</span>
                            </Link>
                            
                            <Link 
                                to="/contact" 
                                className={`group flex items-center px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                                    isActive("/contact") 
                                        ? "text-lime-700 bg-lime-100/80 shadow-sm" 
                                        : "text-gray-600 hover:text-lime-600 hover:bg-lime-50/80"
                                }`}
                            >
                                <Mail className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                                <span>Contact</span>
                            </Link>
                        </div>
                    </div>

                    {/* Right Side Action Buttons */}
                    <div className="flex items-center space-x-3">
                        {/* NGO Dashboard with Notification */}
                        <div className="relative">
                            <button 
                                onClick={verifyNgoAccess}
                                className="group relative flex items-center bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-600 hover:to-lime-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                <Shield className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                                <span className="hidden sm:inline">NGO Dashboard</span>
                                <span className="sm:hidden">NGO</span>
                                {donorNotifications > 0 && (
                                    <div className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] flex items-center justify-center shadow-lg ${hasNewNotifications ? 'animate-bounce' : 'animate-pulse'}`}>
                                        {donorNotifications}
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Register NGO */}
                        <Link 
                            to="/register-ngo" 
                            className="group flex items-center bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            <span className="hidden sm:inline">Register NGO</span>
                            <span className="sm:hidden">Register</span>
                        </Link>

                        {/* Profile Dropdown */}
                        <div className="relative profile-dropdown">
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="group flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-sm">
                                    <User className="h-4 w-4 text-white" />
                                </div>
                                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Profile Dropdown Menu */}
                            <div className={`absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden transition-all duration-300 ${
                                isProfileOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                            }`}>
                                <div className="p-4 border-b border-gray-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-sm">
                                            <User className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">User Profile</p>
                                            <p className="text-sm text-gray-500">Welcome back!</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="py-2">
                                    <button 
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            // Add profile settings navigation here
                                        }}
                                        className="group flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                                    >
                                        <Settings className="mr-3 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                                        <span>Settings</span>
                                    </button>
                                    
                                    <button 
                                        onClick={handleLogout}
                                        className="group flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200"
                                    >
                                        <LogOut className="mr-3 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button 
                        onClick={() => setIsOpen(!isOpen)} 
                        className="md:hidden relative p-3 rounded-xl text-gray-700 hover:text-lime-600 hover:bg-lime-50 transition-all duration-300 group"
                    >
                        <div className="relative w-6 h-6">
                            <Menu 
                                size={24} 
                                className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`} 
                            />
                            <X 
                                size={24} 
                                className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`} 
                            />
                        </div>
                    </button>
                </div>

                {/* Enhanced Mobile Menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="mt-4 mb-6 bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200/50 overflow-hidden">
                        <div className="p-6 space-y-3">
                            {/* Mobile Navigation Links */}
                            <Link 
                                to="/events" 
                                onClick={() => setIsOpen(false)}
                                className={`group flex items-center px-4 py-4 rounded-xl transition-all duration-300 ${
                                    isActive("/events") 
                                        ? "text-lime-700 bg-lime-100 shadow-sm" 
                                        : "text-gray-600 hover:text-lime-600 hover:bg-lime-50"
                                }`}
                            >
                                <Calendar className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                                <span className="font-medium">Events</span>
                            </Link>

                            <Link 
                                to="/history" 
                                onClick={() => setIsOpen(false)}
                                className={`group flex items-center px-4 py-4 rounded-xl transition-all duration-300 ${
                                    isActive("/history") 
                                        ? "text-lime-700 bg-lime-100 shadow-sm" 
                                        : "text-gray-600 hover:text-lime-600 hover:bg-lime-50"
                                }`}
                            >
                                <HistoryIcon className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                                <span className="font-medium">History</span>
                            </Link>
                            
                            <Link 
                                to="/about" 
                                onClick={() => setIsOpen(false)}
                                className={`group flex items-center px-4 py-4 rounded-xl transition-all duration-300 ${
                                    isActive("/about") 
                                        ? "text-lime-700 bg-lime-100 shadow-sm" 
                                        : "text-gray-600 hover:text-lime-600 hover:bg-lime-50"
                                }`}
                            >
                                <Info className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                                <span className="font-medium">About Us</span>
                            </Link>
                            
                            <Link 
                                to="/contact" 
                                onClick={() => setIsOpen(false)}
                                className={`group flex items-center px-4 py-4 rounded-xl transition-all duration-300 ${
                                    isActive("/contact") 
                                        ? "text-lime-700 bg-lime-100 shadow-sm" 
                                        : "text-gray-600 hover:text-lime-600 hover:bg-lime-50"
                                }`}
                            >
                                <Mail className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                                <span className="font-medium">Contact</span>
                            </Link>
                            
                            {/* Mobile Action Buttons */}
                            <div className="pt-4 border-t border-gray-200/50 space-y-3">
                                <button 
                                    onClick={() => {
                                        verifyNgoAccess();
                                        setIsOpen(false);
                                    }}
                                    className="group flex items-center justify-between w-full px-4 py-4 bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-600 hover:to-lime-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg"
                                >
                                    <div className="flex items-center">
                                        <Shield className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                                        <span>NGO Dashboard</span>
                                    </div>
                                    {donorNotifications > 0 && (
                                        <div className={`bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] flex items-center justify-center ${hasNewNotifications ? 'animate-pulse' : ''}`}>
                                            {donorNotifications}
                                        </div>
                                    )}
                                </button>

                                <Link 
                                    to="/register-ngo" 
                                    onClick={() => setIsOpen(false)}
                                    className="group block w-full text-center px-4 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg"
                                >
                                    Register NGO
                                </Link>

                                {/* Mobile Profile Section */}
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                    <div className="flex items-center space-x-3 pb-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-sm">
                                            <User className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">Profile</p>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => {
                                            setIsOpen(false);
                                            // Add profile settings navigation here
                                        }}
                                        className="group flex items-center w-full px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-all duration-200"
                                    >
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </button>
                                    
                                    <button 
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                        className="group flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;