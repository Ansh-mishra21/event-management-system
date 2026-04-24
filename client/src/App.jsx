import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import TicketPage from "./pages/TicketPage";
import Events from "./pages/Events";
import ValidateTicket from "./pages/ValidateTicket";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";




function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hide navbar on auth pages */}
      {location.pathname !== "/login" && location.pathname !== "/register" && location.pathname !== "/VerifyEmail" && location.pathname !== "/ForgotPassword" && (
        <Navbar />
      )}

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/ticket/:bookingId" element={<TicketPage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/admin/validate-ticket" element={<ValidateTicket />} />
          <Route path="/VerifyEmail" element={<VerifyEmail />} />
          <Route path="/ForgotPassword" element={<ForgotPassword/>}/>
          {/* User Protected Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Route */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <h1 className="text-3xl font-bold text-center mt-20">
                404 - Page Not Found
              </h1>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
