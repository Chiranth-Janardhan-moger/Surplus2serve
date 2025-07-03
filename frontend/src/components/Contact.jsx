
import React, { useState } from "react";
import { Mail, Phone, MapPin, Twitter, Linkedin, Github, Send, CheckCircle2 } from "lucide-react";

const Contact = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    // Hide the message after 3 seconds
    setTimeout(() => setFormSubmitted(false), 3000);

    // Optional: Reset form fields (uncomment if needed)
    e.target.reset();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Contact Us</h2>

        {/* Success Message */}
        {formSubmitted && (
          <div className="flex items-center justify-center text-green-600 font-semibold bg-green-100 p-3 rounded-md mb-4 transition-opacity duration-500">
            <CheckCircle2 className="w-5 h-5 mr-2" /> Thank you for your valuable response!
          </div>
        )}

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Message</label>
            <textarea
              placeholder="Your Message"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="4"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md flex items-center justify-center"
          >
            <Send className="w-5 h-5 mr-2" /> Send Message
          </button>
        </form>

        {/* Contact Details */}
        <div className="mt-6 text-center text-gray-600 space-y-2">
          <p className="flex items-center justify-center gap-2"><Mail className="w-5 h-5 text-blue-600" />Surplus2serve@mail.com</p>
          <p className="flex items-center justify-center gap-2"><Phone className="w-5 h-5 text-blue-600" /> +91 98765 43210</p>
          <p className="flex items-center justify-center gap-2"><MapPin className="w-5 h-5 text-blue-600" /> India</p>

          {/* Social Links */}
          <div className="flex justify-center gap-4 mt-3">
            <a href="#" className="text-blue-500 hover:text-blue-700"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-blue-500 hover:text-blue-700"><Linkedin className="w-5 h-5" /></a>
            <a href="#" className="text-blue-500 hover:text-blue-700"><Github className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
