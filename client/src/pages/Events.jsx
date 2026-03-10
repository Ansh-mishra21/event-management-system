import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import { Link } from "react-router-dom";
import { FaSearch, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

/*
===================================================
EVENTS PAGE (PREMIUM VERSION)

Features
• Search by title + city
• Checkbox filters
• Upcoming / Past events
• Price sorting
• Premium event cards
• Hover animations
• Seat progress bar
===================================================
*/

const Events = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  const [sort, setSort] = useState({
    upcoming: false,
    past: false,
    low: false,
    high: false,
  });

  const [loading, setLoading] = useState(true);

  /* ================= Fetch Events ================= */

  const fetchEvents = async () => {
    try {
      const { data } = await api.get("/events");

      let filtered = [...data];

      /* Search by title OR city */

      if (search) {
        filtered = filtered.filter(
          (e) =>
            e.title.toLowerCase().includes(search.toLowerCase()) ||
            e.location.toLowerCase().includes(search.toLowerCase()),
        );
      }

      const now = new Date();

      /* Upcoming */

      if (sort.upcoming) {
        filtered = filtered.filter((e) => new Date(e.date) > now);
      }

      /* Past */

      if (sort.past) {
        filtered = filtered.filter((e) => new Date(e.date) < now);
      }

      /* Price Low */

      if (sort.low) {
        filtered.sort((a, b) => a.ticketPrice - b.ticketPrice);
      }

      /* Price High */

      if (sort.high) {
        filtered.sort((a, b) => b.ticketPrice - a.ticketPrice);
      }

      setEvents(filtered);
    } catch (error) {
      console.error("Error fetching events", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [search, sort]);

  if (loading)
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading events...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* ================= Title ================= */}

      <h1 className="text-4xl font-extrabold mb-10">Discover Events</h1>

      {/* ================= Filter Panel ================= */}

      <div className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg p-6 rounded-2xl mb-12">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Search */}

          <div className="relative flex-1">
            <FaSearch className="absolute top-4 left-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search events or cities..."
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 hover:shadow-md pl-10 pr-4 focus:ring-2 focus:ring-purple-500 outline-none transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filters */}

          <div className="flex gap-6 text-sm font-medium">
            {/* Upcoming */}

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={sort.upcoming}
                onChange={() => setSort({ ...sort, upcoming: !sort.upcoming })}
                className="hidden"
              />

              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
        ${sort.upcoming ? "border-purple-600" : "border-gray-300"}`}
              >
                {sort.upcoming && (
                  <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                )}
              </span>

              <span className="group-hover:text-purple-600 transition">
                Upcoming
              </span>
            </label>

            {/* Past */}

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={sort.past}
                onChange={() => setSort({ ...sort, past: !sort.past })}
                className="hidden"
              />

              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
        ${sort.past ? "border-purple-600" : "border-gray-300"}`}
              >
                {sort.past && (
                  <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                )}
              </span>

              <span className="group-hover:text-purple-600 transition">
                Past
              </span>
            </label>

            {/* Price Low */}

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={sort.low}
                onChange={() => setSort({ ...sort, low: !sort.low })}
                className="hidden"
              />

              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
        ${sort.low ? "border-purple-600" : "border-gray-300"}`}
              >
                {sort.low && (
                  <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                )}
              </span>

              <span className="group-hover:text-purple-600 transition">
                Price Low
              </span>
            </label>

            {/* Price High */}

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={sort.high}
                onChange={() => setSort({ ...sort, high: !sort.high })}
                className="hidden"
              />

              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
        ${sort.high ? "border-purple-600" : "border-gray-300"}`}
              >
                {sort.high && (
                  <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                )}
              </span>

              <span className="group-hover:text-purple-600 transition">
                Price High
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* ================= Events Grid ================= */}

      {events.length === 0 ? (
        <p className="text-center text-gray-500">No events found</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => {
            const percent = (event.availableSeats / event.totalSeats) * 100;

            const eventDate = new Date(event.date);
            const now = new Date();

            const isPast = eventDate < now;
            const isSoldOut = event.availableSeats === 0;

            return (
              <Link
                key={event._id}
                to={`/events/${event._id}`}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2 overflow-hidden"
              >
                {/* Image */}

                <div className="relative h-56 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />

                  {/* Gradient */}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Category */}

                  <span className="absolute top-4 left-4 bg-white/90 text-black text-xs font-semibold px-3 py-1 rounded-full">
                    {event.category}
                  </span>

                  {/* Status */}

                  {isSoldOut ? (
                    <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                      Sold Out
                    </span>
                  ) : isPast ? (
                    <span className="absolute top-4 right-4 bg-gray-700 text-white text-xs px-3 py-1 rounded-full">
                      Past
                    </span>
                  ) : (
                    <span className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                      Upcoming
                    </span>
                  )}
                </div>

                {/* Content */}

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>

                  {/* Date */}

                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <FaCalendarAlt />

                    {eventDate.toLocaleDateString()}
                  </div>

                  {/* Location */}

                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <FaMapMarkerAlt />

                    {event.location}
                  </div>

                  {/* Seat Progress */}

                  <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <p className="text-xs text-gray-500 mb-4">
                    {event.availableSeats}/{event.totalSeats} seats left
                  </p>

                  {/* Bottom */}

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">
                      {event.ticketPrice === 0
                        ? "Free"
                        : `₹${event.ticketPrice}`}
                    </span>

                    <span className="text-purple-600 font-semibold group-hover:translate-x-1 transition">
                      View Event →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Events;
