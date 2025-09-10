// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user"); // ✅ check login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}