import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
} from "recharts";

import { FaChartLine } from "react-icons/fa";

/*
 RevenueChart Component

 Shows monthly revenue from bookings
*/

const RevenueChart = ({ bookings }) => {
  const revenueMap = {};

  bookings.forEach((booking) => {
    if (booking.status === "confirmed" && booking.paymentStatus === "paid") {
      const date = new Date(booking.bookedAt);

      const month = date.toLocaleString("default", {
        month: "short",
      });

      revenueMap[month] = (revenueMap[month] || 0) + booking.amount;
    }
  });

  const chartData = Object.keys(revenueMap).map((month) => ({
    month,
    revenue: revenueMap[month],
  }));

  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mt-10">
      {/* Header */}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FaChartLine className="text-purple-600" />
          Revenue Overview
        </h2>

        <span className="text-sm text-gray-500">
          Total Revenue
          <span className="ml-2 font-semibold text-purple-600">
            ₹{totalRevenue.toLocaleString()}
          </span>
        </span>
      </div>

      {/* Chart */}

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          {/* Gradient */}

          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />

          <XAxis dataKey="month" tick={{ fill: "#6b7280" }} axisLine={false} />

          <YAxis
            tickFormatter={(value) => `₹${value}`}
            tick={{ fill: "#6b7280" }}
            axisLine={false}
          />

          <Tooltip
            formatter={(value) => [`₹${value}`, "Revenue"]}
            contentStyle={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
            }}
          />

          {/* Gradient Area */}

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="none"
            fill="url(#colorRevenue)"
          />

          {/* Line */}

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#7c3aed"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
