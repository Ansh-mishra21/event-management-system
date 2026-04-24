import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/axios";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

import { getAuth, sendPasswordResetEmail } from "firebase/auth";


const Login = () => {
  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth();

  // Show/hide password
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password modal states
  const [showForgot, setShowForgot] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  // ================= LOGIN HANDLER =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await login(email, password);

      console.log("Logged user:", data);

      // redirect based on role
      if (data?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      if (err.needsVerification) {
        navigate("/VerifyEmail");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ================= FORGOT PASSWORD =================

  // Reset password after OTP verification
  const resetPassword = () => {
    navigate("/ForgotPassword");
  };

  return (
    // ================= AUTH PAGE BACKGROUND =================

    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200">
      <div className="absolute w-[700px] h-[700px] bg-pink-400 opacity-30 blur-[200px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute w-[600px] h-[600px] bg-purple-400 opacity-30 blur-[180px] rounded-full top-[40%] left-[40%]"></div>

      {/* BACK TO HOME BUTTON */}

      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 hover:text-purple-600 hover:shadow-md transition"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>

      {/* ================= AUTH CARD ================= */}

      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-10 shadow-[0px_10px_30px_rgba(0,0,0,0.1)]">

        {/* LOGO */}

        <h1 className="text-4xl font-bold text-center mb-2 eventify-gradient-text">
          Eventify
        </h1>

        <p className="text-center text-gray-500 text-sm mb-6">
          Sign in to manage your events
        </p>

        {/* GOOGLE LOGIN BUTTON */}



        {/* <button
          type="button"
          className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 transition py-3 rounded-xl font-medium shadow-sm"
          onClick={handleGoogleLogin}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
            alt="google"
          />
          Continue with Google
        </button> */}

        {/* divider */}

        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-200"></div>

          <span className="px-3 text-gray-400 text-sm">Sign In</span>

          <div className="flex-1 h-px bg-gray-200"></div>
        </div>



        {/* ERROR MESSAGE */}

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* ================= LOGIN FORM ================= */}

        <form onSubmit={handleSubmit} className="space-y-4">


          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 text-white font-semibold py-3 rounded-xl shadow-md transition 
  hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>


        </form>

        {/* Forgot password button */}

        <p className="text-sm text-gray-500 mt-2 text-right">
          <button
            onClick={resetPassword}
            className="text-purple-600"
          >
            Forgot Password?
          </button>
        </p>

        {/* Signup redirect */}

        <p className="text-sm text-gray-500 mt-6 text-center">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-purple-600 hover:underline"
          >
            Sign up
          </Link>
        </p>

      </div>

      

  
    </div>
  );
};

export default Login;