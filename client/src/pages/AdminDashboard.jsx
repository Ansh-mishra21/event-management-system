import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";

/* Admin Components */

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminStats from "../components/admin/AdminStats";
import EventsTable from "../components/admin/EventsTable";
import BookingList from "../components/admin/BookingList";
import RevenueChart from "../components/admin/RevenueChart";
import BookingPieChart from "../components/admin/BookingPieChart";
import EventPopularityChart from "../components/admin/EventPopularityChart";
import ValidateTicket from "../pages/ValidateTicket";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  /* Active sidebar tab */

  const [activeTab, setActiveTab] = useState("dashboard");

  /// Search term for events

  const [searchTerm, setSearchTerm] = useState("");

  /* Admin data */

  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  /* Store editing event id */

  const [editingEventId, setEditingEventId] = useState(null);

  /* Event form data */

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    totalSeats: "",
    ticketPrice: "",
    image: "",
  });

  /* ================= Protect Admin Route ================= */

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    fetchData();

    // Auto refresh every 10 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  /* ================= Fetch Events + Bookings ================= */

  const fetchData = async () => {
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        api.get("/events"),
        api.get("/bookings/my"),
      ]);

      setEvents(eventsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error("Error fetching admin data", error);
    } finally {
      setLoading(false);
    }
  };


  /* ================= Edit Event ================= */

  

  const handleEditEvent = (event) => {
    /* Fill form with event data */

    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split("T")[0],
      location: event.location,
      category: event.category,
      totalSeats: event.totalSeats,
      ticketPrice: event.ticketPrice,
      image: event.image,
    });

    setEditingEventId(event._id);

    /* Switch to create tab */

    setActiveTab("create");
  };

  /* ================= Create / Update Event ================= */

  const isFormValid = () => {
  return (
    formData.title.trim() &&
    formData.description.trim() &&
    formData.date &&
    formData.location.trim() &&
    formData.category.trim() &&
    formData.totalSeats > 0 &&
    formData.ticketPrice >= 0 &&
    formData.image.trim()
  );
};

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
    alert("Please fill all fields before publishing");
    return;
    }

    try {
      if (editingEventId) {
        /* Update existing event */

        await api.put(`/events/${editingEventId}`, formData);

        setEditingEventId(null);
      } else {
        /* Create new event */
        await api.post("/events", formData);
      }

      /* Reset form */

      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "",
        totalSeats: "",
        ticketPrice: "",
        image: "",
      });

      setActiveTab("events");

      fetchData();
    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || "Error saving event");
    }
  };

  /* ================= Delete Event ================= */

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await api.delete(`/events/${id}`);

      fetchData();
    } catch {
      alert("Error deleting event");
    }
  };

  /* ================= Confirm Booking ================= */

  const handleConfirmBooking = async (id, paymentStatus) => {
    try {
      await api.put(`/bookings/${id}/confirm`, { paymentStatus });

      fetchData();
    } catch {
      alert("Error confirming booking");
    }
  };

  /* ================= Cancel Booking ================= */

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Cancel booking?")) return;

    try {
      await api.delete(`/bookings/${id}`);

      fetchData();
    } catch {
      alert("Error cancelling booking");
    }
  };

  /// Filter bookings based on search term (event title, user name or email)

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.eventId?.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  /* ================= Loading State ================= */

  if (loading)
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading admin panel...
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ================= Sidebar ================= */}

      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ================= Main Content ================= */}

      <main className="flex-1 p-10 max-w-7xl mx-auto w-full">
        {/* ================= Dashboard ================= */}

        {activeTab === "dashboard" && (
          <>
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            {/* Stats Cards */}

            <AdminStats events={events} bookings={bookings} />

            {/* Charts */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
              <RevenueChart bookings={bookings} />
              <BookingPieChart bookings={bookings} />
            </div>

            {/* Event Popularity */}

            <div className="mt-10">
              <EventPopularityChart bookings={bookings} />
            </div>
          </>
        )}

        {/* ================= Events ================= */}

        {activeTab === "events" && (
          <>
            <h1 className="text-3xl font-bold mb-6">All Events</h1>

            <EventsTable
              events={events}
              handleDeleteEvent={handleDeleteEvent}
              handleEditEvent={handleEditEvent}
            />
          </>
        )}

        {/* ================= Create / Edit Event ================= */}

        {activeTab === "create" && (
          <>
            <h1 className="text-3xl font-bold mb-6">
              {editingEventId ? "Edit Event" : "Create Event"}
            </h1>

            {/* Premium Event Form */}

            <form
              onSubmit={handleCreateEvent}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-3xl space-y-6"
            >
              {/* Event Title */}

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Event Title
                </label>

                <input
                  type="text"
                  placeholder="Enter event title"
                  className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              {/* Category */}

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Category
                </label>

                <input
                  type="text"
                  placeholder="Tech / Music / Comedy"
                  className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
              </div>

              {/* Date + Location */}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Event Date
                  </label>

                  <input
                    type="date"
                    className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Location
                  </label>

                  <input
                    type="text"
                    placeholder="City name"
                    className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Seats + Price */}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Total Seats
                  </label>

                  <input
                    type="number"
                    placeholder="100"
                    className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    value={formData.totalSeats}
                    onChange={(e) =>
                      setFormData({ ...formData, totalSeats: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Ticket Price
                  </label>

                  <input
                    type="number"
                    placeholder="₹500"
                    className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    value={formData.ticketPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, ticketPrice: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Image URL */}

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Event Image URL
                </label>

                <input
                  type="text"
                  placeholder="Paste image URL"
                  className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />
              </div>

              {/* Image Preview */}

              {formData.image && (
                <div className="rounded-xl overflow-hidden border">
                  <img
                    src={formData.image}
                    alt="Event Preview"
                    className="w-full h-56 object-cover"
                  />
                </div>
              )}

              {/* Description */}

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Description
                </label>

                <textarea
                  rows="4"
                  placeholder="Write event description..."
                  className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* Submit */}

              <button
                disabled={!isFormValid()}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold transition 
  hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingEventId ? "Update Event" : "Publish Event"}
              </button>
            </form>
          </>
        )}

        {/* ================= Bookings ================= */}

        {activeTab === "bookings" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Bookings</h1>

              <input
                type="text"
                placeholder="Search bookings..."
                className="border px-4 py-2 rounded-lg w-72 focus:ring-2 focus:ring-purple-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <BookingList
              bookings={filteredBookings}
              handleConfirmBooking={handleConfirmBooking}
              handleCancelBooking={handleCancelBooking}
            />
          </>
        )}

        {/* ================= Scan Ticket ================= */}

        {activeTab === "scan" && (
          <>
            <h1 className="text-3xl font-bold mb-6">Scan Ticket</h1>

            <ValidateTicket />
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
