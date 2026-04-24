import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaTicketAlt } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  /* ================= Nav Link Style ================= */

  const navLinkStyle =
    "relative text-gray-600 hover:text-purple-600 transition duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-purple-600 after:transition-all after:duration-300";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-md hover:shadow-lg transition">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* ================= Logo ================= */}

          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold group"
          >
            <FaTicketAlt className="text-purple-600 group-hover:rotate-12 transition" />

            {/* Animated Gradient Logo */}

            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent animate-gradient-x">
              Eventify
            </span>
          </Link>

          {/* ================= Navigation ================= */}

          <div className="flex items-center gap-8 text-sm font-medium">
            {/* Home */}

            <Link
              to="/"
              className={`${navLinkStyle} ${
                isActive("/")
                  ? "text-purple-600 after:w-full"
                  : "after:w-0 hover:after:w-full"
              } hover:drop-shadow-[0_0_6px_rgba(168,85,247,0.6)]`}
            >
              Home
            </Link>

            {/* Events */}

            {(!user || user.role === "user") && (
              <Link
                to="/events"
                className={`${navLinkStyle} ${
                  isActive("/events")
                    ? "text-purple-600 after:w-full"
                    : "after:w-0 hover:after:w-full"
                } hover:drop-shadow-[0_0_6px_rgba(168,85,247,0.6)]`}
              >
                Events
              </Link>
            )}

            {user ? (
              <>
                {/* User Dashboard */}

                {user.role === "user" && (
                  <Link
                    to="/dashboard"
                    className={`${navLinkStyle} ${
                      isActive("/dashboard")
                        ? "text-purple-600 after:w-full"
                        : "after:w-0 hover:after:w-full"
                    } hover:drop-shadow-[0_0_6px_rgba(168,85,247,0.6)]`}
                  >
                    My Dashboard
                  </Link>
                )}

                {/* Admin Dashboard */}

                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className={`${navLinkStyle} ${
                      isActive("/admin")
                        ? "text-purple-600 after:w-full"
                        : "after:w-0 hover:after:w-full"
                    } hover:drop-shadow-[0_0_6px_rgba(168,85,247,0.6)]`}
                  >
                    Admin Dashboard
                  </Link>
                )}

                {/* Logout */}

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transition shadow-sm hover:shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login */}

                <Link
                  to="/login"
                  className={`${navLinkStyle} ${
                    isActive("/login")
                      ? "text-purple-600 after:w-full"
                      : "after:w-0 hover:after:w-full"
                  } hover:drop-shadow-[0_0_6px_rgba(168,85,247,0.6)]`}
                >
                  Login
                </Link>

                {/* Sign Up */}

                <Link
                  to="/register"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:scale-105 transition shadow-md"
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
