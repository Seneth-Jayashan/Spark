import React, { useState } from 'react';
import Logo from '../assets/images/sparklogo-removebg.png';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between fixed top-4 left-4 right-4 z-50 p-4 transition-all duration-300 bg-white/80 text-blue-700 rounded-3xl shadow-xl backdrop-blur-lg">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2">
        <img src={Logo} alt="Spark Logo" className="w-32 md:w-36 h-auto" />
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-8 text-blue-700 font-medium">
        <a href="/" className="hover:text-[#FFB238] transition">Home</a>
        <a href="/pricing" className="hover:text-[#FFB238] transition">Pricing</a>
        <a href="/about" className="hover:text-[#FFB238] transition">About Us</a>
        <a href="/contact" className="hover:text-[#FFB238] transition">Contact</a>
      </nav>

      {/* Desktop Button */}
      <div className="hidden md:block">
        <button className="bg-[#FFB238] text-white rounded-full px-12 py-2 shadow-md hover:bg-orange-500 transition">
          Try Demo
        </button>
      </div>

      {/* Mobile Menu Icon */}
      <button
        className="md:hidden text-3xl text-blue-700 focus:outline-none"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? '✖' : '☰'}
      </button>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t shadow-md flex flex-col items-start px-6 py-4 space-y-3 z-50 md:hidden">
          <a href="/" className="text-blue-700 hover:text-orange-400 transition">Home</a>
          <a href="/pricing" className="text-blue-700 hover:text-orange-400 transition">Pricing</a>
          <a href="/about" className="text-blue-700 hover:text-orange-400 transition">About Us</a>
          <a href="/contact" className="text-blue-700 hover:text-orange-400 transition">Contact</a>
          <button className="bg-orange-400 text-white rounded-full px-4 py-2 shadow-md hover:bg-orange-500 transition mt-2 w-full">
            Try Demo
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
