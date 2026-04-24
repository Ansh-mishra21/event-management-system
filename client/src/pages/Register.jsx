import React, { useState, useContext } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
import firebase from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);

  const {googleRegister,register } = useContext(AuthContext);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const auth = getAuth(firebase);

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    setError("");
    setLoading(true); // 🔥 START loading

    try {
      await register(name, email, password, role);

      navigate("/VerifyEmail");

    } catch (err) {
      const errMsg = err;
      //console.log("errMsg " + errMsg.message);
      if (errMsg.message === "User already exists. Please login.") {
        setError("User already exists. Please login.");
      }
      else if(errMsg.message === "Make a strong password.Length Greater than 5"){
        setError("Make a strong password.Length Greater than 5")
      }
       else {
        setError("Registration failed. Try again.");
      }
    } finally {
      setLoading(false); // STOP loading ALWAYS
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200">
      {/* Pink glow background */}
      <div className="absolute w-[700px] h-[700px] bg-pink-400 opacity-30 blur-[200px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute w-[600px] h-[600px] bg-purple-400 opacity-30 blur-[180px] rounded-full top-[40%] left-[40%]"></div>
      {/* BACK HOME */}

      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-gray-600 hover:text-purple-600 hover:shadow-md transition"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>

      {/* AUTH CARD */}

      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg rounded-3xl p-10">
        {/* LOGO */}

        <h1 className="text-4xl font-bold text-center mb-2 eventify-gradient-text">
          Eventify
        </h1>

        <p className="text-center text-gray-500 text-sm mb-6">
          Create your account to start exploring events
        </p>

        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-gray-400 text-sm">Sign Up</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError("");
            }}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
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
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {/* ROLE SELECT */}
          <div>
            <p className="text-sm text-gray-500 mb-2">I want to join as</p>

            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setRole("user")}
                className={`cursor-pointer rounded-xl p-4 border text-center transition ${role === "user"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-purple-400"
                  }`}
              >
                <h3 className="font-semibold">Attendee</h3>
                <p className="text-xs text-gray-500">Browse events</p>
              </div>

              <div
                onClick={() => setRole("admin")}
                className={`cursor-pointer rounded-xl p-4 border text-center transition ${role === "admin"
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-purple-400"
                  }`}
              >
                <h3 className="font-semibold">Organizer</h3>
                <p className="text-xs text-gray-500">Create events</p>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500 text-white font-semibold py-3 rounded-xl shadow-md transition 
  hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-6 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-purple-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
