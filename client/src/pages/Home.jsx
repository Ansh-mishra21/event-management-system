import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaRegClock,
  FaTicketAlt,
  FaShieldAlt,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaInstagram,
} from "react-icons/fa";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const handleDashboard = () => {
    // user login nahi hai
    if (!user) {
      navigate("/login");
      return;
    }

    // admin login hai
    if (user.role === "admin") {
      navigate("/admin");
    } else {
      // normal user
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get(`/events?search=${search}`);
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
     {/* Hero Section */}
{/* ================= HERO SECTION ================= */}
{/* Main landing hero with background image + gradient overlay */}

<div className="relative text-white rounded-3xl overflow-hidden mb-16 shadow-2xl min-h-[85vh] flex items-center justify-center">

  {/* Background Image */}
  <div
    className="absolute inset-0 
    bg-[url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=3000&auto=format&fit=crop')]
    bg-cover bg-center bg-no-repeat"
  ></div>

  {/* Purple Pink Lighting Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-purple-700/30 to-pink-500/40"></div>

  {/* Extra radial spotlight glow */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_60%)]"></div>

  {/* Dark overlay for readability */}
  <div className="absolute inset-0 bg-black/35"></div>

  {/* Content Container */}
  <div className="relative p-10 md:p-24 text-center flex flex-col items-center z-10">

    {/* Small label badge */}
    <span className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase border border-white/20 mb-6 shadow-md">
      Welcome to Eventify
    </span>

    {/* Main heading */}
    <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 tracking-tight drop-shadow-xl">
      Find Your Next <br />

      {/* Gradient highlighted word */}
      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-pink-500 bg-clip-text text-transparent">
        Unforgettable Experience
      </span>
    </h1>

    {/* Subtitle */}
    <p className="text-gray-200 text-lg md:text-xl mb-10 max-w-2xl font-light">
      Discover the best tech conferences, music festivals and workshops
      happening near you.
    </p>

    {/* ================= SEARCH BAR ================= */}
    {/* Premium glass search box */}

    <div
      className="w-full max-w-2xl mx-auto backdrop-blur-xl 
      bg-white/10 border border-white/30 rounded-full flex items-center 
      px-4 py-2 shadow-[0_15px_50px_rgba(236,72,153,0.35)]"
    >
      <FaSearch className="text-gray-200 ml-2 mr-3" />

      <input
        type="text"
        placeholder="Search events, workshops, concerts..."
        className="flex-1 bg-transparent text-white placeholder-gray-300 outline-none px-2 py-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Search Button */}
      <button
        className="bg-gradient-to-r from-purple-500 to-pink-500 
        px-6 py-2 rounded-full text-sm font-semibold 
        hover:scale-105 transition shadow-lg"
      >
        Search
      </button>
    </div>

    {/* ================= CTA BUTTONS ================= */}

    <div className="flex gap-4 mt-8">

      <Link
        to="/events"
        className="px-7 py-3 rounded-full 
        bg-black/70 border border-white/40
        hover:bg-white hover:text-black 
        transition shadow-lg"
      >
        Explore Events
      </Link>

      <button
        onClick={handleDashboard}
        className="px-7 py-3 rounded-full 
        bg-gradient-to-r from-purple-500 to-pink-500 
        hover:scale-105 transition shadow-[0_8px_25px_rgba(236,72,153,0.4)]"
      >
        My Dashboard
      </button>

    </div>

    {/* ================= STATS ================= */}
    {/* Floating stat cards for platform credibility */}

    <div className="flex gap-6 mt-12 flex-wrap justify-center">

      <div className="bg-white/10 backdrop-blur-lg px-6 py-4 rounded-xl border border-white/20 shadow-lg">
        <h3 className="text-3xl font-bold">500+</h3>
        <p className="text-gray-200 text-sm">Events Hosted</p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg px-6 py-4 rounded-xl border border-white/20 shadow-lg">
        <h3 className="text-3xl font-bold">10K+</h3>
        <p className="text-gray-200 text-sm">Tickets Sold</p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg px-6 py-4 rounded-xl border border-white/20 shadow-lg">
        <h3 className="text-3xl font-bold">20+</h3>
        <p className="text-gray-200 text-sm">Organizers</p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg px-6 py-4 rounded-xl border border-white/20 shadow-lg">
        <h3 className="text-3xl font-bold">100+</h3>
        <p className="text-gray-200 text-sm">Happy Attendees</p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg px-6 py-4 rounded-xl border border-white/20 shadow-lg">
        <h3 className="text-3xl font-bold">50+</h3>
        <p className="text-gray-200 text-sm">Cities Covered</p>
      </div>

    </div>

  </div>
</div>

      {/* Features */}
      {/* ================= FEATURES SECTION ================= */}
      {/* Platform key features */}
      <div className="py-16 px-6 mb-20 bg-gray-50 rounded-3xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* ================= FEATURE 1 ================= */}
          <div className="group bg-white p-10 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition duration-300 text-center">
            {/* Icon */}
            <div
              className="w-16 h-16 mx-auto mb-6 rounded-xl flex items-center justify-center
      bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl
      group-hover:scale-110 transition"
            >
              <FaRegClock />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Fast Booking
            </h3>

            <p className="text-gray-500 text-sm leading-relaxed">
              Secure your tickets instantly with our fast booking
              infrastructure.
            </p>
          </div>

          {/* ================= FEATURE 2 ================= */}
          <div className="group bg-white p-10 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition duration-300 text-center">
            <div
              className="w-16 h-16 mx-auto mb-6 rounded-xl flex items-center justify-center
      bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl
      group-hover:scale-110 transition"
            >
              <FaTicketAlt />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Seamless Access
            </h3>

            <p className="text-gray-500 text-sm leading-relaxed">
              Download tickets instantly or manage them directly from your
              dashboard.
            </p>
          </div>

          {/* ================= FEATURE 3 ================= */}
          <div className="group bg-white p-10 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition duration-300 text-center">
            <div
              className="w-16 h-16 mx-auto mb-6 rounded-xl flex items-center justify-center
      bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl
      group-hover:scale-110 transition"
            >
              <FaShieldAlt />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Secure Platform
            </h3>

            <p className="text-gray-500 text-sm leading-relaxed">
              All payments and registrations are protected with advanced
              security.
            </p>
          </div>
        </div>
      </div>

      {/* ================= EVENTS HEADING ================= */}
      <div className="flex items-center justify-between mb-10 px-2">
        {/* Section Title */}
        <h2 className=" events text-4xl font-bold text-gray-900 flex items-center gap-2">
          Trending Events
        </h2>

        {/* Results Count */}
        <div className="text-gray-500 font-medium">
          {events.length} results found
        </div>
      </div>

      {/* ================= EVENTS GRID ================= */}
      {loading ? (
        /* Loading State */
        <div className="text-center py-20 text-xl font-semibold text-gray-600">
          Loading events...
        </div>
      ) : events.length === 0 ? (
        /* No Results */
        <div className="text-center py-20 text-xl text-gray-500">
          No events found matching your search.
        </div>
      ) : (
        /* Events Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...(events || [])]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 6)
            .map((event) => (
              <div
                key={event._id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:border-purple-200 transition duration-300 flex flex-col"
              >
                {/* ================= EVENT IMAGE ================= */}
                <div className="relative h-52 overflow-hidden">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold text-xl">
                      {event.category || "Event"}
                    </div>
                  )}

                  {/* Image Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>

                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                    {event.ticketPrice === 0 ? "FREE" : `₹${event.ticketPrice}`}
                  </div>

                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold rounded-full shadow">
                    {event.category}
                  </div>
                </div>

                {/* ================= EVENT CONTENT ================= */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Event Title */}
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    {event.title}
                  </h2>

                  {/* Date & Location */}
                  <div className="flex flex-col gap-2 mb-4 text-gray-600 text-sm">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>

                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-400" />
                      {event.location}
                    </div>
                  </div>

                  {/* ================= SEATS INFO ================= */}
                  <div className="mt-auto">
                    {/* Seats Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{
                          width: `${(event.availableSeats / event.totalSeats) * 100}%`,
                        }}
                      ></div>
                    </div>

                    {/* Seats Remaining */}
                    <p className="text-xs text-gray-500 mb-4">
                      {event.availableSeats} of {event.totalSeats} seats
                      remaining
                    </p>

                    {/* View Details Button */}
                    <Link
                      to={`/events/${event._id}`}
                      className="block w-full text-center bg-gray-900 hover:bg-black text-white font-semibold py-2.5 rounded-lg transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ================= FOOTER ================= */}

      <footer className="mt-24 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
          {/* ================= LOGO + DESCRIPTION ================= */}

          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              🎟 Eventify
            </h2>

            <p className="text-sm opacity-90">
              Discover and book amazing events near you with Eventify. Concerts,
              tech meetups, workshops and festivals all in one place.
            </p>

            {/* SOCIAL ICONS */}

            <div className="flex gap-4 mt-6 text-2xl">
              <a
                href="https://github.com/"
                target="_blank"
                className="hover:scale-110 hover:text-black transition"
              >
                <FaGithub />
              </a>

              <a
                href="https://linkedin.com/"
                target="_blank"
                className="hover:scale-110 hover:text-blue-200 transition"
              >
                <FaLinkedin />
              </a>

              <a
                href="https://twitter.com/"
                target="_blank"
                className="hover:scale-110 hover:text-sky-200 transition"
              >
                <FaTwitter />
              </a>

              <a
                href="https://instagram.com/"
                target="_blank"
                className="hover:scale-110 hover:text-pink-200 transition"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* ================= QUICK LINKS ================= */}

          <div>
            <h3 className="font-semibold mb-4 text-lg">Quick Links</h3>

            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-yellow-300 transition">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/events" className="hover:text-yellow-300 transition">
                  Explore Events
                </Link>
              </li>

              <li>
                <Link to="/admin" className="hover:text-yellow-300 transition">
                  Admin Dashboard
                </Link>
              </li>

              <li>
                <Link to="/login" className="hover:text-yellow-300 transition">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* ================= EVENT CATEGORIES ================= */}

          <div>
            <h3 className="font-semibold mb-4 text-lg">Event Categories</h3>

            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/?category=music"
                  className="hover:text-yellow-300 transition"
                >
                  Music
                </Link>
              </li>

              <li>
                <Link
                  to="/?category=tech"
                  className="hover:text-yellow-300 transition"
                >
                  Tech
                </Link>
              </li>

              <li>
                <Link
                  to="/?category=comedy"
                  className="hover:text-yellow-300 transition"
                >
                  Comedy
                </Link>
              </li>

              <li>
                <Link
                  to="/?category=festival"
                  className="hover:text-yellow-300 transition"
                >
                  Festivals
                </Link>
              </li>
            </ul>
          </div>

          {/* ================= NEWSLETTER ================= */}

          <div>
            <h3 className="font-semibold mb-4 text-lg">Subscribe Newsletter</h3>

            <p className="text-sm mb-4 opacity-90">
              Get updates about upcoming events.
            </p>

            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 py-2 rounded-l-md text-black w-full outline-none"
              />

              <button className="bg-black px-4 py-2 rounded-r-md hover:bg-gray-900 transition">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM ================= */}

        <div className="border-t border-white/20 text-center py-4 text-sm">
          © {new Date().getFullYear()} Eventora Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
