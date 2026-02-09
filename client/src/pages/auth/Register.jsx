import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userType: "patient",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
      setLoading(true);
    try {
      await register(formData);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 50px",
        backgroundColor: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            backgroundColor: "#2a9b8e",
            borderRadius: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold"
          }}>
            M
          </div>
          <div>
            <div style={{ fontWeight: "bold", color: "#2a9b8e", fontSize: "16px" }}>MEDICARE</div>
            <div style={{ fontSize: "11px", color: "#666" }}>SPECIALIST HOSPITAL</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
          <a href="#" style={{ textDecoration: "none", color: "#333", fontWeight: "500" }}>HOME</a>
          <a href="#" style={{ textDecoration: "none", color: "#333", fontWeight: "500" }}>ABOUT US</a>
          <a href="#" style={{ textDecoration: "none", color: "#333", fontWeight: "500" }}>DEPARTMENTS</a>
          <a href="#" style={{ textDecoration: "none", color: "#333", fontWeight: "500" }}>DOCTORS</a>
        </div>
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <button style={{ padding: "8px 20px", backgroundColor: "transparent", border: "none", color: "#333", fontWeight: "500", cursor: "pointer" }}>Login</button>
        </div>
      </nav>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 100px)", paddingBottom: "40px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "10px", padding: "50px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", maxWidth: "450px", width: "100%", borderTop: "4px solid", borderImage: "linear-gradient(90deg, #2a9b8e 0%, #ff6b6b 100%) 1" }}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <div style={{ width: "60px", height: "60px", backgroundColor: "#e8f5f3", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", color: "#2a9b8e", fontSize: "30px" }}>⚕️</div>
          </div>
          <h1 style={{ textAlign: "center", color: "#2a4a47", fontSize: "28px", marginBottom: "10px", fontWeight: "600" }}>Create Account</h1>
          <p style={{ textAlign: "center", color: "#999", marginBottom: "30px", fontSize: "14px" }}>Join us to book appointments and manage health</p>
          {error && (
            <div style={{ backgroundColor: "#ffe8e8", color: "#c33", padding: "12px", borderRadius: "5px", marginBottom: "20px", fontSize: "14px" }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#666", fontSize: "14px", fontWeight: "500" }}>Email</label>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", borderRadius: "5px", paddingLeft: "12px" }}>
                <span style={{ color: "#999", fontSize: "16px" }}>✉️</span>
                <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required style={{ flex: 1, padding: "10px", border: "none", outline: "none", fontSize: "14px" }} />
              </div>
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#666", fontSize: "14px", fontWeight: "500" }}>User Type</label>
              <select name="userType" value={formData.userType} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "1px solid #e0e0e0", borderRadius: "5px", fontSize: "14px", outline: "none" }}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#666", fontSize: "14px", fontWeight: "500" }}>Password</label>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", borderRadius: "5px", paddingLeft: "12px" }}>
                <span style={{ color: "#999", fontSize: "16px" }}>🔒</span>
                <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required style={{ flex: 1, padding: "10px", border: "none", outline: "none", fontSize: "14px" }} />
              </div>
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#666", fontSize: "14px", fontWeight: "500" }}>Confirm Password</label>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #e0e0e0", borderRadius: "5px", paddingLeft: "12px" }}>
                <span style={{ color: "#999", fontSize: "16px" }}>🔒</span>
                <input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required style={{ flex: 1, padding: "10px", border: "none", outline: "none", fontSize: "14px" }} />
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px", backgroundColor: "#2a9b8e", color: "white", border: "none", borderRadius: "5px", cursor: loading ? "not-allowed" : "pointer", fontSize: "16px", fontWeight: "600", opacity: loading ? 0.7 : 1, marginTop: "10px" }}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: "20px", color: "#666", fontSize: "14px" }}>
            Already have an account?{" "}
            <a href="/" style={{ color: "#2a9b8e", textDecoration: "none", fontWeight: "600" }}>
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
