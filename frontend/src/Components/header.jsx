import React, { useState } from 'react';
import Logo from '../assets/images/sparklogo.png';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white flex items-center justify-between px-6 py-4 shadow-sm relative">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2">
        <img src={Logo} alt="Spark Logo" className="w-32 md:w-36 h-auto" />
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-8 text-blue-700 font-medium">
        <a href="/" className="hover:text-orange-400 transition">Home</a>
        <a href="/pricing" className="hover:text-orange-400 transition">Pricing</a>
        <a href="/about" className="hover:text-orange-400 transition">About Us</a>
        <a href="/contact" className="hover:text-orange-400 transition">Contact</a>
      </nav>

      {/* Desktop Button */}
      <div className="hidden md:block">
        <button className="bg-orange-400 text-white rounded-full px-5 py-2 shadow-md hover:bg-orange-500 transition">
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
