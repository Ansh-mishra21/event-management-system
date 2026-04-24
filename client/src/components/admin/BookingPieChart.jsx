import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/*
 BookingPieChart Component

 Shows booking status distribution
*/

const COLORS = {
  confirmed: "#22c55e",
  pending: "#facc15",
  cancelled: "#ef4444",
};

const BookingPieChart = ({ bookings }) => {
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;

  const total = confirmed + pending + cancelled;

  const data = [
    { name: "Confirmed", value: confirmed, color: COLORS.confirmed },
    { name: "Pending", value: pending, color: COLORS.pending },
    { name: "Cancelled", value: cancelled, color: COLORS.cancelled },
  ];

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mt-10">
      {/* Header */}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Booking Status</h2>

        <span className="text-sm text-gray-500">Total: {total}</span>
      </div>

      {/* Chart */}

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            label={({ percent }) =>
              percent ? `${(percent * 100).toFixed(0)}%` : ""
            }
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>

          <Tooltip />

          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>

      {/* Stats Row */}

      <div className="grid grid-cols-3 gap-4 mt-6 text-center">
        <div>
          <p className="text-green-600 font-semibold text-lg">{confirmed}</p>
          <p className="text-sm text-gray-500">Confirmed</p>
        </div>

        <div>
          <p className="text-yellow-500 font-semibold text-lg">{pending}</p>
          <p className="text-sm text-gray-500">Pending</p>
        </div>

        <div>
          <p className="text-red-500 font-semibold text-lg">{cancelled}</p>
          <p className="text-sm text-gray-500">Cancelled</p>
        </div>
      </div>
    </div>
  );
};

export default BookingPieChart;
