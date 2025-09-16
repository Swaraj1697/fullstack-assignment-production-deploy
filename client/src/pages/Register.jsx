import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required.";
    if (!validateEmail(email)) newErrors.email = "Enter a valid email address.";
    if (!validatePassword(password))
      newErrors.password =
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await axios.post("http://localhost:5000/auth/register", {
        name,
        email,
        password,
      });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(120deg, #89f7fe, #66a6ff)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#2a5298", textAlign: "center" }}>
          Create Account
        </h2>

        <form onSubmit={handleRegister}>
          {/* Name */}
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: errors.name ? "1px solid red" : "1px solid #ccc",
                borderRadius: "6px",
                outline: "none",
              }}
            />
            {errors.name && <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>}
          </div>

          {/* Email */}
          <div style={{ marginBottom: "15px" }}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: errors.email ? "1px solid red" : "1px solid #ccc",
                borderRadius: "6px",
                outline: "none",
              }}
            />
            {errors.email && <p style={{ color: "red", fontSize: "12px" }}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div style={{ marginBottom: "15px" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: errors.password ? "1px solid red" : "1px solid #ccc",
                borderRadius: "6px",
                outline: "none",
              }}
            />
            {errors.password && (
              <p style={{ color: "red", fontSize: "12px" }}>{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#2a5298",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#1e3c72")}
            onMouseLeave={(e) => (e.target.style.background = "#2a5298")}
          >
            Register
          </button>
          <p style={{ marginTop: "15px", textAlign: "center", fontSize: "14px" }}>
          Already have a account?{" "}
          <Link to="/" style={{ color: "#007bff", textDecoration: "none" }}>
            Go back to Login Page
          </Link>
        </p>
        </form>
      </div>
    </div>
  );
}
