import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axios";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const TicketPage = () => {
  /* ================= Get booking ID from URL ================= */

  const { bookingId } = useParams();

  /* ================= State ================= */

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= Ref for PDF generation ================= */

  const ticketRef = useRef();

  /* ================= Fetch booking ticket ================= */

  useEffect(() => {
    fetchTicket();
  }, []);

  const fetchTicket = async () => {
    try {
      const { data } = await api.get(`/bookings/${bookingId}`);

      setBooking(data);
    } catch (error) {
      console.error("Error fetching ticket", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= Download Ticket as PDF ================= */

  const downloadTicket = async () => {
    const ticketElement = ticketRef.current;

    /* Convert ticket UI to canvas */

    const canvas = await html2canvas(ticketElement, {
      scale: 2,
    });

    const imgData = canvas.toDataURL("image/png");

    /* Create PDF */

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

    pdf.save(`event-ticket-${booking._id}.pdf`);
  };

  /* ================= Loading State ================= */

  if (loading)
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading Ticket...
      </div>
    );

  if (!booking)
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Ticket not found
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto">
      {/* ================= Ticket Container ================= */}

      <div
        ref={ticketRef}
        className="bg-white rounded-2xl shadow-xl overflow-hidden border"
      >
        {/* ================= Banner ================= */}

        <div className="relative">
          <img
            src={booking.eventId?.image}
            alt="event"
            className="h-60 w-full object-cover"
          />

          {/* Dark overlay */}

          <div className="absolute inset-0 bg-black/40 flex items-end p-6">
            <h1 className="text-white text-3xl font-bold">
              {booking.eventId?.title}
            </h1>
          </div>
        </div>

        {/* ================= Ticket Body ================= */}

        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Event Info */}

          <div className="space-y-3">
            <p className="text-gray-500 text-sm">Event Date</p>

            <p className="font-semibold text-lg">
              {new Date(booking.eventId?.date).toLocaleDateString()}
            </p>

            <p className="text-gray-500 text-sm mt-4">Location</p>

            <p className="font-semibold text-lg">{booking.eventId?.location}</p>

            <p className="text-gray-500 text-sm mt-4">Booked By</p>

            <p className="font-semibold text-lg">{booking.userId?.name}</p>

            <p className="text-gray-500 text-sm mt-4">Ticket ID</p>

            <p className="font-semibold text-lg">{booking._id}</p>
          </div>

          {/* ================= QR Code ================= */}

          <div className="flex flex-col items-center justify-center">
            <QRCodeCanvas value={booking._id} size={200} />

            <p className="text-gray-500 text-sm mt-4 text-center">
              Scan this QR code at the event entry
            </p>
          </div>
        </div>
      </div>

      {/* ================= Download Button ================= */}

      <div className="flex justify-center mt-8">
        <button
          onClick={downloadTicket}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition"
        >
          Download Ticket (PDF)
        </button>
      </div>
    </div>
  );
};

export default TicketPage;
