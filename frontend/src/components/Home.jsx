import React, { Suspense, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "./Hero";
import Features from "./Features";
import Impact from "./Impact";
import { motion } from "framer-motion";
import { FiUsers, FiLogOut, FiPlusCircle, FiArrowRight, FiHeart, FiStar, FiTrendingUp } from "react-icons/fi";

function Home({ setIsAuth }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [donors, setDonors] = useState([]);
  const [showDonors, setShowDonors] = useState(false);
  const [newDonors, setNewDonors] = useState(0);
  const [showNgoForm, setShowNgoForm] = useState(false);
  const [ngoData, setNgoData] = useState({
    name: "",
    address: "",
    contact: "",
    secretKey: "",
  });

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    // Simulate loading for better UX
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  // Fetch donors function
  const fetchDonors = async () => {
    try {
      const response = await fetch("http://localhost:5001/donors");
      const data = await response.json();
      setDonors(data);
      setShowDonors(true);
    } catch (error) {
      console.error("Error fetching donors:", error);
    }
  };

  // Fetch new donors count when component mounts
  useEffect(() => {
    const checkNewDonors = async () => {
      try {
        const response = await fetch("http://localhost:5001/donors");
        const data = await response.json();
        setNewDonors(data.length); 
      } catch (error) {
        console.error("Error checking new donors:", error);
      }
    };

    checkNewDonors();
  }, []);

  // Handle NGO registration form submission
  const handleNgoRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/register-ngo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ngoData),
      });

      const result = await response.json();
      if (result.success) {
        alert("NGO Registered Successfully!");
        setShowNgoForm(false);
        setNgoData({ name: "", address: "", contact: "", secretKey: "" });
      } else {
        alert("NGO Registration Failed: " + result.message);
      }
    } catch (error) {
      console.error("Error registering NGO:", error);
    }
  };

  // Handle NGO input change
  const handleNgoInputChange = (e) => {
    setNgoData({ ...ngoData, [e.target.name]: e.target.value });
  };

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    navigate("/login");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        </div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center relative z-10"
        >
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gradient-to-r from-pink-500 to-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-2xl"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-yellow-400 border-b-transparent rounded-full animate-spin mx-auto opacity-50" style={{animationDirection: 'reverse', animationDuration: '3s'}}></div>
          </div>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"
          >
            Loading your dashboard...
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-4 flex justify-center space-x-2"
          >
            {[0, 1, 2].map((i) => (
              <div key={i} className={`w-3 h-3 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full animate-bounce`} style={{animationDelay: `${i * 0.2}s`}}></div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 relative z-10">
        {/* Hero Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative bg-gradient-to-br from-pink-500/20 to-violet-500/20 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl hover:shadow-pink-500/20 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-violet-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl flex items-center justify-center">
                  <FiUsers className="text-white text-xl" />
                </div>
                <div className="text-pink-400">
                  <FiTrendingUp className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-white/80 mb-2">Total Donors</h3>
              <p className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent mb-2">{newDonors}</p>
              <p className="text-sm text-white/60">Helping make a difference</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                  <FiTrendingUp className="text-white text-xl" />
                </div>
                <div className="text-emerald-400">
                  <FiStar className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-white/80 mb-2">Recent Activity</h3>
              <p className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">+12%</p>
              <p className="text-sm text-white/60">From last month</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group relative bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <FiHeart className="text-white text-xl" />
                </div>
                <div className="text-cyan-400">
                  <FiStar className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-white/80 mb-2">Community Impact</h3>
              <p className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">24+</p>
              <p className="text-sm text-white/60">NGOs supported</p>
            </div>
          </motion.div>
        </div>

        {/* NGO Registration Form */}
        {showNgoForm && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative bg-white/10 backdrop-blur-2xl p-8 rounded-3xl border border-white/20 shadow-2xl mb-12"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-violet-500/5 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl flex items-center justify-center mr-4">
                  <FiPlusCircle className="text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">Register New NGO</h2>
              </div>
              <form onSubmit={handleNgoRegister}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: "name", label: "NGO Name", type: "text" },
                    { name: "address", label: "Address", type: "text" },
                    { name: "contact", label: "Contact", type: "text" },
                    { name: "secretKey", label: "Secret Key", type: "password" }
                  ].map((field, index) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-white/80 mb-2">{field.label}</label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={ngoData[field.name]}
                        onChange={handleNgoInputChange}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-white/50 transition-all duration-300"
                        required
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setShowNgoForm(false)}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white hover:bg-white/30 transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-2xl hover:from-pink-600 hover:to-violet-600 transition-all duration-300 shadow-lg hover:shadow-pink-500/25"
                  >
                    Register NGO
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Donors List */}
        {showDonors && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-white/10 backdrop-blur-2xl p-8 rounded-3xl border border-white/20 shadow-2xl mb-12"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mr-4">
                    <FiUsers className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Our Generous Donors</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDonors(false)}
                  className="text-sm text-emerald-400 hover:text-emerald-300 px-4 py-2 bg-white/10 rounded-xl transition-colors duration-300"
                >
                  Close
                </motion.button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      {["Name", "Email", "Amount", "Date"].map((header) => (
                        <th key={header} className="px-6 py-4 text-left text-sm font-medium text-white/80 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {donors.map((donor, index) => (
                      <motion.tr 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-white/5 transition-colors duration-300"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{donor.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">{donor.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-400 font-medium">${donor.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">{new Date(donor.date).toLocaleDateString()}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Sections */}
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gradient-to-r from-pink-500 to-violet-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-400 border-b-transparent rounded-full animate-spin opacity-50" style={{animationDirection: 'reverse'}}></div>
            </div>
          </div>
        }>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Hero />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="my-16"
          >
            <Features />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="my-16"
          >
            <Impact />
          </motion.div>
        </Suspense>

        {/* Stunning Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="relative overflow-hidden bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-3xl p-12 mb-12 shadow-2xl"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-pink-600/20 to-transparent"></div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/5 rounded-full animate-pulse animation-delay-2000"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Ready to make a 
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent"> bigger impact?</span>
            </motion.h2>
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="text-xl text-white/90 mb-8 leading-relaxed"
            >
              Join our vibrant community of donors and help us support more NGOs in need. 
              Together, we can create lasting change.
            </motion.p>
            <motion.button
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg flex items-center mx-auto shadow-2xl hover:shadow-white/25 transition-all duration-300"
            >
              Get Started 
              <FiArrowRight className="ml-3 group-hover:translate-x-2 transition-transform duration-300" />
            </motion.button>
          </div>
        </motion.div>
      </main>

      {/* Enhanced Footer */}
      <footer className="relative bg-gradient-to-t from-black/50 to-transparent backdrop-blur-xl border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl flex items-center justify-center mr-3">
                  <FiHeart className="text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">DonationHub</h3>
              </div>
              <p className="text-white/70 mb-6 leading-relaxed">
                Bridging the gap between generous donors and impactful NGOs. 
                Together, we're building a better world, one donation at a time.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: "facebook", path: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" },
                  { icon: "twitter", path: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" },
                  { icon: "instagram", path: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" }
                ].map((social, index) => (
                  <motion.a 
                    key={social.icon}
                    href="#" 
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-gradient-to-r from-pink-500/20 to-violet-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 hover:from-pink-500/30 hover:to-violet-500/30 transition-all duration-300"
                  >
                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d={social.path} clipRule="evenodd" />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">About</h4>
              <ul className="space-y-3">
                {["Our Mission", "Team", "Careers", "Impact Report"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-3">
                {["Help Center", "Contact Us", "FAQ", "Community"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm mb-4 md:mb-0">
              &copy; 2024 DonationHub. All rights reserved. Made with ❤️ for a better world.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <a key={item} href="#" className="text-white/60 hover:text-white transition-colors duration-300">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;