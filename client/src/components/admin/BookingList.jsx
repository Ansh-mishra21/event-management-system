import React from "react";
import { FaUserCircle, FaCalendarAlt } from "react-icons/fa";

const BookingList = ({
  bookings,
  handleConfirmBooking,
  handleCancelBooking,
}) => {
  return (
    <div className="space-y-6">
      {bookings.length === 0 && (
        <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
          No booking requests
        </div>
      )}

      {bookings.map((booking) => {
        const event = booking.eventId;

        return (
          <div
            key={booking._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border"
          >
            {/* Event Banner */}

            {event?.image && (
              <div className="h-40 overflow-hidden">
                <img
                  src={event.image}
                  alt="event"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
            )}

            {/* Booking Content */}

            <div className="p-6 space-y-4">
              {/* Event Title */}

              <h3 className="text-lg font-semibold text-gray-800">
                {event?.title || "Deleted Event"}
              </h3>

              {/* User Info */}

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FaUserCircle className="text-xl text-gray-400" />

                <div>
                  <p className="font-medium">
                    {booking.userId?.name || "Unknown User"}
                  </p>

                  <p className="text-xs text-gray-400">
                    {booking.userId?.email}
                  </p>
                </div>
              </div>

              {/* Booking Date */}

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaCalendarAlt />
                {new Date(booking.createdAt).toLocaleString()}
              </div>

              {/* Amount */}

              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-800">₹{booking.amount}</p>

                {/* Status badges */}

                <div className="flex gap-2">
                  <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600 font-medium">
                    {booking.status}
                  </span>

                  <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-medium">
                    {booking.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}

              {booking.status === "pending" && (
                <div className="flex gap-3 pt-3">
                  <button
                    onClick={() => handleConfirmBooking(booking._id, "paid")}
                    className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookingList;
