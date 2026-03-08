import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaTicketAlt } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/90 shadow-lg border-b border-gray-800">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-white text-2xl font-bold flex items-center gap-2 tracking-wide hover:scale-105 transition"
          >
            <FaTicketAlt className="text-white text-2xl" />
            Eventora
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6 text-sm md:text-base">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition font-medium"
            >
              Events
            </Link>

            {user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="text-gray-300 hover:text-white transition font-medium"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-lg transition font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition font-medium"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-white text-gray-900 hover:bg-gray-200 px-4 py-2 rounded-lg font-semibold transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
