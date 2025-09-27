import React, { useState } from 'react';
import Logo from '../assets/images/sparklogo-removebg.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigation = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation("/login");
  };

  // ✅ Role-based dashboard link
  const getDashboardLink = () => {
    if (!user) return "/login";

    switch (user.user_role) {
      case "organizer":
        return "/dashboard/organizer";
      case "volunteer":
        return "/dashboard/volunteer";
      case "admin":
        return "/dashboard/admin";
      default:
        return "/dashboard";
    }
  };

  return (
    <header className="flex items-center justify-between fixed top-4 left-4 right-4 z-50 p-4 transition-all duration-300 bg-white/50 text-blue-700 rounded-3xl shadow-xl backdrop-blur-lg">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2">
        <img src={Logo} alt="Spark Logo" className="w-32 md:w-36 h-auto" />
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-8 text-blue-700 font-medium">
        <a href="/" className="hover:text-[#FFB238] transition">Home</a>
        <a href="/events" className="hover:text-[#FFB238] transition">Events</a>
        <a href="/about" className="hover:text-[#FFB238] transition">About Us</a>
        <a href="/contact" className="hover:text-[#FFB238] transition">Contact</a>

        {/* ✅ Role-based Dashboard link */}
        {user && (
          <a href={getDashboardLink()} className="hover:text-[#FFB238] transition">
            Dashboard
          </a>
        )}
      </nav>

      {/* Auth Buttons */}
      <div className="flex items-center justify-center gap-4">
        {user ? (
          <>
            {/* ✅ Show profile pic + name */}
            <div className="flex items-center gap-2">
              <img
                src={`/uploads/${user.user_profile_picture}`} // adjust path if needed
                alt="Profile"
                className="w-8 h-8 rounded-full border"
              />
              <span className="hidden md:inline font-medium">
                {user.user_first_name}
              </span>
            </div>
            <button
              className="w-full h-wrap rounded-full bg-white/50 border-2 py-2 px-4 whitespace-nowrap"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="w-full h-wrap rounded-full bg-white/50 border-2 py-2 px-4 whitespace-nowrap"
              onClick={() => navigation("/login")}
            >
              Log in
            </button>
            <button
              className="w-full h-wrap rounded-full bg-white/50 border-2 py-2 px-4 whitespace-nowrap"
              onClick={() => navigation("/signup")}
            >
              Sign Up
            </button>
          </>
        )}
      </div>

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
          <a href="/events" className="text-blue-700 hover:text-orange-400 transition">Events</a>
          <a href="/about" className="text-blue-700 hover:text-orange-400 transition">About Us</a>
          <a href="/contact" className="text-blue-700 hover:text-orange-400 transition">Contact</a>

          {user && (
            <a href={getDashboardLink()} className="text-blue-700 hover:text-orange-400 transition">
              Dashboard
            </a>
          )}

          <button className="bg-orange-400 text-white rounded-full px-4 py-2 shadow-md hover:bg-orange-500 transition mt-2 w-full">
            Try Demo
          </button>

          {user ? (
            <button
              className="w-full rounded-full border-2 py-2 px-4 mt-2"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <>
              <button
                className="w-full rounded-full border-2 py-2 px-4 mt-2"
                onClick={() => navigation("/login")}
              >
                Log in
              </button>
              <button
                className="w-full rounded-full border-2 py-2 px-4 mt-2"
                onClick={() => navigation("/signup")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
