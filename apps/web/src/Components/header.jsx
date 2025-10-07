import React, { useState } from "react";
import Logo from "../assets/images/sparklogo-removebg.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import DefaultAvatar from "../assets/images/about us images/person1.png";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigation = useNavigate();
  const { user, logout } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || "";
  // Derive uploads base (strip any path like /api/v1)
  let uploadsBase = "";
  try {
    const u = new URL(API_URL);
    uploadsBase = `${u.protocol}//${u.host}`;
  } catch {
    // Fallback if API_URL is relative or invalid
    uploadsBase = API_URL.split("/").slice(0, 3).join("/");
  }

  const buildProfileSrc = (raw) => {
    if (!raw) return DefaultAvatar;
    // Absolute URL
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    // Remove leading slash
    let key = raw.replace(/^\/+/, "");
    // Remove any leading 'uploads/' to avoid double path
    key = key.replace(/^uploads\//, "");
    return `${uploadsBase}/uploads/${key}`;
  };

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
        <a href="/" className="hover:text-[#FFB238] transition">
          Home
        </a>
        <a href="/events" className="hover:text-[#FFB238] transition">
          Events
        </a>
        <a href="/about" className="hover:text-[#FFB238] transition">
          About Us
        </a>
        <a href="/contact" className="hover:text-[#FFB238] transition">
          Contact
        </a>

        {/* ✅ Role-based Dashboard link */}
        {user && (
          <a
            href={getDashboardLink()}
            className="hover:text-[#FFB238] transition"
          >
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
                src={buildProfileSrc(user?.user_profile_picture)}
                alt="Profile"
                className="w-8 h-8 rounded-full border cursor-pointer"
                onError={(e) => { e.currentTarget.src = DefaultAvatar; }}
                onClick={() => navigation(getDashboardLink())} // navigate on click
              />
              <span
                className="hidden md:inline font-medium cursor-pointer"
                onClick={() => navigation(getDashboardLink())} // navigate on click
              >
                {user.user_first_name}
              </span>
            </div>
            <button
              className="rounded-full bg-white/50 border-2 py-2 px-4 whitespace-nowrap ml-4"
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

      

      {/* Mobile Menu Icon */}
      <button
        className="md:hidden text-3xl text-blue-700 focus:outline-none"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? "✖" : "☰"}
      </button>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t shadow-md flex flex-col items-start px-6 py-4 space-y-3 z-50 md:hidden">
          <a
            href="/"
            className="text-blue-700 hover:text-orange-400 transition"
          >
            Home
          </a>
          <a
            href="/events"
            className="text-blue-700 hover:text-orange-400 transition"
          >
            Events
          </a>
          <a
            href="/about"
            className="text-blue-700 hover:text-orange-400 transition"
          >
            About Us
          </a>
          <a
            href="/contact"
            className="text-blue-700 hover:text-orange-400 transition"
          >
            Contact
          </a>

          {user && (
            <a
              href={getDashboardLink()}
              className="text-blue-700 hover:text-orange-400 transition"
            >
              Dashboard
            </a>
          )}

          

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
