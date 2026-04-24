import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import firebase from "../firebase";
import { getAuth } from "firebase/auth";

const auth = getAuth(firebase);

// Protect routes that require login
const ProtectedRoute = ({ children }) => {

  const { user , authloading } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!auth.currentUser?.emailVerified) {
    return <Navigate to="/VerifyEmail"/>;
  }
  return children;
};

export default ProtectedRoute;