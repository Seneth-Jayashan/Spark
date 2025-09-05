// GuestSidebar.jsx
import { NavLink } from "react-router-dom";

const GuestSidebar = () => {
  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col p-4">
      {/* Logo */}
      <div className="text-2xl font-bold mb-6">SPARK</div>

      {/* Navigation */}
      <nav className="flex-1">
        <NavLink to="/" className="block px-4 py-2 hover:bg-gray-800 rounded-lg">
          Home
        </NavLink>
        <NavLink to="/about" className="block px-4 py-2 hover:bg-gray-800 rounded-lg">
          About
        </NavLink>
        <NavLink to="/login" className="block px-4 py-2 hover:bg-gray-800 rounded-lg">
          Login
        </NavLink>
        <NavLink to="/register" className="block px-4 py-2 hover:bg-gray-800 rounded-lg">
          Register
        </NavLink>
      </nav>
    </div>
  );
};

export default GuestSidebar;
