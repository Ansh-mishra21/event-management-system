const Event = require("../models/Event");

exports.getEvents = async (req, res) => {
  try {
    const { search, category, location, limit } = req.query;

    let filters = {};

    /* ================= Search ================= */

    if (search) {
      filters.title = { $regex: search, $options: "i" };
    }

    /* ================= Category Filter ================= */

    if (category) {
      filters.category = category;
    }

    /* ================= Location Filter ================= */

    if (location) {
      filters.location = location;
    }

    /* ================= Query ================= */

    let query = Event.find(filters).sort({ createdAt: -1 });

    /* ================= Home Page Limit ================= */

    if (limit) {
      query = query.limit(Number(limit));
    }

    const events = await query;

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      category,
      totalSeats,
      ticketPrice,
      image,
    } = req.body;
    const event = await Event.create({
      title,
      description,
      date,
      location,
      category,
      totalSeats,
      availableSeats: totalSeats,
      ticketPrice: ticketPrice || 0,
      image: image || "",
      createdBy: req.user.id,
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    /* Calculate already booked seats */

    const bookedSeats = event.totalSeats - event.availableSeats;

    /* Update fields */

    event.title = req.body.title || event.title;
    event.description = req.body.description || event.description;
    event.date = req.body.date || event.date;
    event.location = req.body.location || event.location;
    event.category = req.body.category || event.category;
    event.ticketPrice = req.body.ticketPrice ?? event.ticketPrice;
    event.image = req.body.image || event.image;

    /* Handle seat update properly */

    if (req.body.totalSeats) {
      const newTotalSeats = Number(req.body.totalSeats);

      event.totalSeats = newTotalSeats;

      event.availableSeats = newTotalSeats - bookedSeats;

      if (event.availableSeats < 0) {
        event.availableSeats = 0;
      }
    }

    const updatedEvent = await event.save();

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
