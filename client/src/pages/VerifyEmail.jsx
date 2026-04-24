import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";

const VerifyEmail = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  window.auth = auth;

  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [checking, setChecking] = useState(true);
  const [verified, setVerified] = useState(false);

  // 🔄 Auto check verification every 3 sec
  const verifiedRef = useRef(false);
  const{setUser} = useContext(AuthContext);

useEffect(() => {
  const interval = setInterval(async () => {
    const user = auth.currentUser;
    if (!user || verifiedRef.current) return;

    await user.reload();

    if (user.emailVerified) {
      verifiedRef.current = true;
      setVerified(true);
      clearInterval(interval);
      const token = await user.getIdToken(true);
      const { data } = await api.post("/auth/login", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } else {
      setChecking(false);
    }
  }, 3000);

  return () => clearInterval(interval);
}, []);

  // Resend email
   const handleResend = async () => {
  if (cooldown > 0) return;

  const user = auth.currentUser;
  if (!user) {
    setMessage("User not found. Please login again.");
    return;
  }

  try {
    await sendEmailVerification(user);
    setMessage("Verification email sent again");

    setCooldown(30);

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

  } catch (err) {
    setMessage("Something went wrong");
  }
};

  return (
    <div className="min-h-screen w-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200">

      {/* Glow */}
      <div className="absolute w-[700px] h-[700px] bg-pink-400 opacity-30 blur-[200px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute w-[600px] h-[600px] bg-purple-400 opacity-30 blur-[180px] rounded-full top-[40%] left-[40%]"></div>

      {/* Back */}
      <Link
        to="/"
        className="absolute top-8 left-8 text-gray-700 hover:text-purple-600 font-medium"
      >
        ← Back to Home
      </Link>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-10 text-center"
      >
        {/* Logo */}
        <h1 className="text-4xl font-bold mb-2 eventify-gradient-text">
          Eventify
        </h1>

        {/* Dynamic Content */}
        {!verified ? (
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl mb-4"
            >
              📩
            </motion.div>

            <p className="text-gray-600 text-sm mb-2">
              We sent a verification link to
            </p>

            <p className="font-semibold text-purple-600 mb-4">
              {auth.currentUser?.email}
            </p>

            <p className="text-gray-500 text-xs mb-6">
              Click the link in your email to continue
            </p>

            {/* Status */}
            {checking && (
              <p className="text-purple-500 text-sm mb-3 animate-pulse">
                Checking verification status...
              </p>
            )}

            {message && (
              <div className="bg-purple-100 text-purple-600 text-sm p-3 rounded mb-4">
                {message}
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleResend}
                disabled={cooldown > 0}
                className="w-full border border-gray-200 bg-white hover:bg-gray-50 transition py-3 rounded-xl font-medium shadow-sm"
              >
                {cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : "Resend Email"}
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-6">
              Didn’t receive it? Check spam or wait a bit.
            </p>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-xl font-semibold text-green-600 mb-2">
              Email Verified!
            </h2>
            <p className="text-gray-500 text-sm">
              Redirecting to dashboard...
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;