import React, { useState } from "react";
import { FaSearch, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

/*
  EventsTable Component

  Purpose:
  Modern admin event cards
  Includes search + event status + edit + delete
*/

const EventsTable = ({ events, handleDeleteEvent, handleEditEvent }) => {
  const [search, setSearch] = useState("");

  /* Filter events for search */

  const filteredEvents = events.filter((event) => {
    const query = search.toLowerCase();

    return (
      event.title.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query)
    );
  });

  /* Event status logic */

  const getEventStatus = (event) => {
    const today = new Date();
    const eventDate = new Date(event.date);

    if (event.availableSeats === 0) {
      return { label: "Sold Out", color: "bg-red-100 text-red-600" };
    }

    if (eventDate < today) {
      return { label: "Completed", color: "bg-gray-200 text-gray-700" };
    }

    return { label: "Upcoming", color: "bg-green-100 text-green-700" };
  };

  return (
    <div className="space-y-6">
      {/* Search */}

      <div className="flex justify-end">
        <div className="relative w-72">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />

          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Events Grid */}

      {filteredEvents.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
          No events found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const status = getEventStatus(event);

            return (
              <div
                key={event._id}
                className="bg-white rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition duration-300 overflow-hidden border flex flex-col"
              >
                {/* Image */}

                <div className="h-44 bg-gray-200 relative overflow-hidden">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-110 transition duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 font-semibold">
                      No Image
                    </div>
                  )}

                  {/* Category */}

                  <span className="absolute top-3 left-3 bg-white/90 px-3 py-1 text-xs font-semibold rounded-full shadow">
                    {event.category}
                  </span>

                  {/* Status */}

                  <span
                    className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${status.color}`}
                  >
                    {status.label}
                  </span>
                </div>

                {/* Card Body */}

                <div className="p-5 flex flex-col flex-grow space-y-3">
                  {/* Title */}

                  <h3 className="text-lg font-semibold text-gray-800">
                    {event.title}
                  </h3>

                  {/* Date */}

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCalendarAlt className="text-gray-400" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>

                  {/* Location */}

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaMapMarkerAlt className="text-gray-400" />
                    {event.location}
                  </div>

                  {/* Seats Progress */}

                  <div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{
                          width: `${(event.availableSeats / event.totalSeats) * 100}%`,
                        }}
                      />
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      {event.availableSeats}/{event.totalSeats} seats remaining
                    </p>
                  </div>

                  {/* Bottom Row */}

                  <div className="flex justify-between items-center pt-3 mt-auto">
                    {/* Price */}

                    <div className="font-semibold text-gray-800">
                      {event.ticketPrice === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₹${event.ticketPrice}`
                      )}
                    </div>

                    {/* Actions */}

                    <div className="flex gap-2">
                      {/* Edit */}

                      <button
                        onClick={() => handleEditEvent(event)}
                        className="text-sm font-semibold text-blue-600 hover:text-white hover:bg-blue-600 px-3 py-1 rounded transition"
                      >
                        Edit
                      </button>

                      {/* Delete */}

                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="text-sm font-semibold text-red-500 hover:text-white hover:bg-red-500 px-3 py-1 rounded transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventsTable;
