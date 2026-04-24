import React from "react";
import {
  FaChartBar,
  FaCalendarAlt,
  FaPlusCircle,
  FaClipboardList,
  FaSignOutAlt,
  FaQrcode,
} from "react-icons/fa";

const AdminSidebar = ({ activeTab, setActiveTab, handleLogout }) => {
  /* ================= Sidebar Button Style ================= */

  const sidebarButton = (tab) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
      activeTab === tab
        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between">
      {/* ================= Sidebar Top ================= */}

      <div>
        {/* Admin panel title */}

        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>

        {/* Navigation buttons */}

        <nav className="flex flex-col gap-3">
          {/* Dashboard */}

          <button
            onClick={() => setActiveTab("dashboard")}
            className={sidebarButton("dashboard")}
          >
            <FaChartBar />
            Dashboard
          </button>

          {/* Events */}

          <button
            onClick={() => setActiveTab("events")}
            className={sidebarButton("events")}
          >
            <FaCalendarAlt />
            Events
          </button>

          {/* Create Event */}

          <button
            onClick={() => setActiveTab("create")}
            className={sidebarButton("create")}
          >
            <FaPlusCircle />
            Create Event
          </button>

          {/* Bookings */}

          <button
            onClick={() => setActiveTab("bookings")}
            className={sidebarButton("bookings")}
          >
            <FaClipboardList />
            Bookings
          </button>

          {/* ================= Scan Ticket ================= */}

          <button
            onClick={() => setActiveTab("scan")}
            className={sidebarButton("scan")}
          >
            <FaQrcode />
            Scan Ticket
          </button>
        </nav>
      </div>

      {/* ================= Logout Button ================= */}

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 text-red-500 hover:text-red-700 transition"
      >
        <FaSignOutAlt />
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
