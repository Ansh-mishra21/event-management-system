import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

import { FaFire } from "react-icons/fa";

const EventPopularityChart = ({ bookings }) => {
  const eventMap = {};

  bookings.forEach((booking) => {
    const eventName = booking.eventId?.title || "Unknown";
    eventMap[eventName] = (eventMap[eventName] || 0) + 1;
  });

  /* ================= Create Chart Data ================= */

  const chartData = Object.keys(eventMap)
    .map((event) => ({
      event,
      bookings: eventMap[event],
    }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5); // show only top 5 events

  const totalBookings = bookings.length;

  const topEvent = chartData.length > 0 ? chartData[0] : null;

  const COLORS = ["#7c3aed", "#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd"];

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mt-10">
      {/* ================= Header ================= */}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FaFire className="text-purple-600" />
          Event Popularity
        </h2>

        <span className="text-sm text-gray-500">
          Total Bookings
          <span className="ml-2 font-semibold text-purple-600">
            {totalBookings}
          </span>
        </span>
      </div>

      {/* ================= Top Event Card ================= */}

      {topEvent && (
        <div className="mb-6 bg-purple-50 border border-purple-100 rounded-xl p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Most Popular Event</p>

            <p className="font-semibold text-purple-700">{topEvent.event}</p>
          </div>

          <span className="text-lg font-bold text-purple-600">
            {topEvent.bookings} bookings
          </span>
        </div>
      )}

      {/* ================= Chart ================= */}

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />

          <XAxis dataKey="event" tick={{ fill: "#6b7280" }} axisLine={false} />

          <YAxis tick={{ fill: "#6b7280" }} axisLine={false} />

          <Tooltip
            formatter={(value) => [`${value}`, "Bookings"]}
            contentStyle={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
            }}
          />

          <Bar dataKey="bookings" radius={[8, 8, 0, 0]} animationDuration={900}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EventPopularityChart;
