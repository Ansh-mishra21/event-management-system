import React from "react";
import {
  FaCalendarAlt,
  FaTicketAlt,
  FaMoneyBillWave,
  FaClock,
} from "react-icons/fa";

/*
  AdminStats Component

  Shows main dashboard statistics
*/

const AdminStats = ({ events, bookings }) => {
  /* ================= Calculate Stats ================= */

  const totalEvents = events.length;

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter((b) => b.status === "pending").length;

  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed" && b.paymentStatus === "paid")
    .reduce((sum, booking) => sum + booking.amount, 0);

  /* ================= Card Data ================= */

  const stats = [
    {
      title: "Total Events",
      value: totalEvents,
      icon: <FaCalendarAlt />,
      color: "from-indigo-500 to-purple-600",
    },
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: <FaTicketAlt />,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue}`,
      icon: <FaMoneyBillWave />,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Pending Requests",
      value: pendingBookings,
      icon: <FaClock />,
      color: "from-amber-400 to-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-between hover:shadow-xl transition duration-300 hover:-translate-y-1"
        >
          {/* Left Content */}

          <div>
            <p className="text-sm text-gray-500 mb-1">{stat.title}</p>

            <h2 className="text-3xl font-bold text-gray-800">{stat.value}</h2>
          </div>

          {/* Icon */}

          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg bg-gradient-to-r ${stat.color}`}
          >
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
