import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import api from "../utils/axios";

const ValidateTicket = () => {
  /* ================= States ================= */

  const [scanResult, setScanResult] = useState(null);
  const [scanStatus, setScanStatus] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false,
    );

    scanner.render(onScanSuccess);

    async function onScanSuccess(decodedText) {
      // stop scanner immediately after scan
      await scanner.clear();

      validateTicket(decodedText);
    }

    return () => {
      scanner.clear();
    };
  }, []);

  /* ================= Validate Ticket ================= */

  const validateTicket = async (bookingId) => {
    try {
      const { data } = await api.put(`/bookings/validate/${bookingId}`);

      setScanStatus("success");
      setScanResult(data.message);
    } catch (error) {
      setScanStatus("error");
      setScanResult(error.response?.data?.message || "Invalid Ticket");
    }

    // Reload scanner after 3 seconds
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 text-center">
      <h1 className="text-3xl font-bold mb-8">Scan Event Ticket</h1>

      {/* ================= Scanner Box ================= */}

      <div className="bg-white shadow-xl rounded-2xl p-6">
        <div id="reader"></div>

        <p className="text-gray-500 text-sm mt-4">
          Point camera at the QR code on the ticket
        </p>
      </div>

      {/* ================= Scan Result ================= */}

      {scanResult && (
        <div
          className={`mt-6 p-4 rounded-xl font-semibold
          ${
            scanStatus === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {scanStatus === "success" ? "✅ " : "❌ "}
          {scanResult}
        </div>
      )}
    </div>
  );
};

export default ValidateTicket;
