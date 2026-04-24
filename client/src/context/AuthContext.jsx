import React, { createContext, useState, useEffect } from "react";
import api from "../utils/axios";

import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup
} from "firebase/auth"
import firebase from "../firebase";

const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();

// Create authentication context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authloading, setLoading] = useState(true);

  // Load user from localStorage when app starts
  useEffect(() => {
    try {
    const storedUser = localStorage.getItem("user");

    // FIRST RUN → null
    if (!storedUser || storedUser === "undefined") {
      setUser(null);
    } else {
      setUser(JSON.parse(storedUser));
    }

  } catch (err) {
    console.error("Parse error:", err);
    setUser(null);
  }

  setLoading(false);
  }, []);




  // ================= LOGIN =================
  const login = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;

      await user.reload();

      if (!user.emailVerified) {
        throw { message: "Please verify your email", needsVerification: true };
      }
      // call backend
      const { data } = await api.post("/auth/login");
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      
      return data;

    } catch (error) {

      if (error?.needsVerification) {
        throw error;
      }
      const firebaseCode = error?.code;
      console.log(firebaseCode);
      //  Firebase errors
      if (firebaseCode === "auth/invalid-credential") {
        throw new Error("User not found.Please check email and password");
      }
      //  fallback
      throw new Error(
        "Something went wrong"
      );
    }
  };

  // ================= REGISTER =================

  const register = async (name, email, password, role) => {
    let firebaseUser = null;
  try {
    //  1. Create Firebase user
    const res = await createUserWithEmailAndPassword(auth, email, password);
    firebaseUser = res.user;

    //  3. Call backend
    const { data } = await api.post("/auth/register",{ name, role });

    //  4. Save user
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);

    //  5. Send verification email
    await sendEmailVerification(firebaseUser);

    return { message: "Verification email sent" };

  } catch (error) {
    const firebaseCode = error?.code;
    console.error("Firebase error:", firebaseCode);
    //  Firebase: email exists
    if (firebaseCode === "auth/email-already-in-use") {
      throw new Error("User already exists. Please login.");
    }
    else if(firebaseCode === "auth/weak-password"){
      throw new Error("Make a strong password.Length Greater than 5")
    }
    //  Optional safe rollback (only if backend failed AFTER Firebase creation)
    if (firebaseUser) {
      try {
        await firebaseUser.delete();
      } catch (deleteError) {
        console.error("Rollback failed:", deleteError);
      }
    }
    throw new Error(
      "Registration failed"
    );
  }
};
  // ================= VERIFY OTP =================

  const verifyOTP = async (email, otp) => {
    try {
      const { data } = await api.post("/auth/verify-otp", { email, otp });

      // Save verified user
      setUser(data);

      localStorage.setItem("userInfo", JSON.stringify(data));
      localStorage.setItem("token", data.token);

      return data;
    } catch (error) {
      throw error.response?.data?.message || "OTP verification failed";
    }
  };

  // ================= LOGOUT =================

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("userInfo");

      // optional redirect handled in component
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        verifyOTP,
        logout,
        authloading,
        setUser
      }}
    >
      {!authloading && children}
    </AuthContext.Provider>
  );
};
