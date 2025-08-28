import React from "react";
import { FaInstagram, FaLinkedinIn, FaFacebookF, FaXTwitter, FaTiktok } from "react-icons/fa6";
import Logo from '../assets/images/sparklogo.png';

export default function Footer() {
  return (
    <footer className="bg-white text-black py-10 px-6 border-t">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        
        {/* Left: Logo and Social */}
        <div className="flex flex-col items-start">
          <div className="flex flex-col items-center mb-4">
            <img src={Logo} alt="VolunteerIX Logo" className="w-36 h-auto" />
            <div>
            <span className="text-xs text-gray-500">Est. 2025</span>
            </div>
          </div>
          <div className="flex space-x-4 text-xl text-black mt-2">
            <FaInstagram />
            <FaLinkedinIn />
            <FaFacebookF />
            <FaXTwitter />
            <FaTiktok />
          </div>
        </div>

        {/* Center: Links */}
        <div className="flex flex-col text-sm space-y-1">
          <h4 className="font-semibold text-black">SPARK</h4>
          <a href="/" className="hover:underline">Home</a>
          <a href="/pricing" className="hover:underline">Pricing</a>
          <a href="/about" className="hover:underline">About Us</a>
          <a href="/contact" className="hover:underline">Contact Us</a>
        </div>

        {/* Right: Newsletter */}
        <div className="w-full md:w-1/3">
          <h4 className="font-semibold mb-2">Join our newsletter</h4>
          <div className="flex shadow-md rounded-full overflow-hidden">
            <input
              type="email"
              placeholder="Email Address"
              className="flex-1 px-4 py-2 outline-none text-sm"
            />
            <button className="bg-orange-400 hover:bg-FFB238  text-white px-6 font-bold text-sm">
              SUBMIT
            </button>
          </div>
          <div className="text-xs mt-2 text-gray-500">
            <a href="/privacy" className="hover:underline">Privacy Policy</a> | <a href="/terms" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-4 text-center text-xs text-gray-600">
        © 2025 STYCODE (Pvt) Ltd. All rights reserved.
      </div>
    </footer>
  );
}
