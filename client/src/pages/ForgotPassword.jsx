import { useState, useEffect } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(() => {
    const saved = localStorage.getItem("resetCooldown");
    return saved ? parseInt(saved) : 0;
  });
  const [success, setSuccess] = useState(false);

  //  Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          localStorage.removeItem("resetCooldown");
          clearInterval(timer);
          return 0;
        }
        localStorage.setItem("resetCooldown", prev - 1);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  //  Redirect after success
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, [success, navigate]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    if (cooldown > 0) return;

    try {
      await sendPasswordResetEmail(auth, email);

      setMessage("Reset link sent 📩");
      setSuccess(true);

      setCooldown(30);
      localStorage.setItem("resetCooldown", 30);

    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setMessage("No user found with this email");
      } else if (err.code === "auth/invalid-email") {
        setMessage("Invalid email");
      } else if (err.code === "auth/too-many-requests") {
        setMessage("Too many requests. Try again later");
      } else {
        setMessage("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200">

      {/* Glow */}
      <div className="absolute w-[700px] h-[700px] bg-pink-400 opacity-30 blur-[200px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute w-[600px] h-[600px] bg-purple-400 opacity-30 blur-[180px] rounded-full top-[40%] left-[40%]"></div>

      {/* Back */}
      <Link
        to="/login"
        className="absolute top-8 left-8 text-gray-700 hover:text-purple-600 font-medium"
      >
        ← Back to Login
      </Link>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-10 text-center"
      >
        <h1 className="text-4xl font-bold mb-2 eventify-gradient-text">
          Eventify
        </h1>

        {!success ? (
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl mb-4"
            >
              🔑
            </motion.div>

            <p className="text-gray-600 text-sm mb-6">
              Enter your email to receive a reset link
            </p>

            <form onSubmit={handleReset}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />

              <button
                type="submit"
                disabled={cooldown > 0}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl font-medium transition"
              >
                {cooldown > 0
                  ? `Wait ${cooldown}s`
                  : "Send Reset Link"}
              </button>
            </form>

            {message && (
              <p className="text-sm text-gray-600 mt-4">{message}</p>
            )}
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-xl font-semibold text-green-600 mb-2">
              Email Sent!
            </h2>
            <p className="text-gray-500 text-sm">
              Redirecting to login...
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;