import React, { useState } from "react";
import API from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";

function DoctorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/doctor/login", { email, password });
      localStorage.setItem("doctorToken", res.data.token);
            if (rememberMe) {
              localStorage.setItem("rememberEmail", email);
            }
      navigate("/doctor");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Navigation Bar */}
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
          <button style={{
            padding: "8px 20px",
            backgroundColor: "transparent",
            border: "none",
            color: "#333",
            fontWeight: "500",
            cursor: "pointer"
          }}>
            Login
          </button>
        </div>
      </nav>

      {/* Login Card */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 100px)",
        paddingBottom: "40px"
      }}>
        <div style={{
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "50px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          maxWidth: "400px",
          width: "100%",
          borderTop: "4px solid",
          borderImage: "linear-gradient(90deg, #2a9b8e 0%, #ff6b6b 100%) 1"
        }}>
          {/* Logo/Icon */}
          <div style={{
            textAlign: "center",
            marginBottom: "30px"
          }}>
            <div style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#e8f5f3",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              color: "#2a9b8e",
              fontSize: "30px"
            }}>
              ⚕️
            </div>
          </div>

          {/* Heading */}
          <h1 style={{
            textAlign: "center",
            color: "#2a4a47",
            fontSize: "28px",
            marginBottom: "10px",
            fontWeight: "600"
          }}>
            Doctor's Sign In
          </h1>

          <p style={{
            textAlign: "center",
            color: "#999",
            marginBottom: "30px",
            fontSize: "14px"
          }}>
            Sign in to access your dashboard
          </p>

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: "#ffe8e8",
              color: "#c33",
              padding: "12px",
              borderRadius: "5px",
              marginBottom: "20px",
              fontSize: "14px"
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            {/* Email Input */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#666", fontSize: "14px", fontWeight: "500" }}>
                Email Address
              </label>
              <div style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #e0e0e0",
                borderRadius: "5px",
                paddingLeft: "12px"
              }}>
                <span style={{ color: "#999", fontSize: "16px" }}>✉️</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: "12px 12px",
                    border: "none",
                    outline: "none",
                    fontSize: "14px"
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#666", fontSize: "14px", fontWeight: "500" }}>
                Password
              </label>
              <div style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #e0e0e0",
                borderRadius: "5px",
                paddingLeft: "12px"
              }}>
                <span style={{ color: "#999", fontSize: "16px" }}>🔒</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: "12px 12px",
                    border: "none",
                    outline: "none",
                    fontSize: "14px"
                  }}
                />
              </div>
            </div>

            {/* Remember & Forgot */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
              fontSize: "14px"
            }}>
              <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ marginRight: "6px", cursor: "pointer" }}
                />
                <span style={{ color: "#666" }}>Remember me</span>
              </label>
              <Link to="#" style={{ color: "#2a9b8e", textDecoration: "none", fontWeight: "500" }}>
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#2a9b8e",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: "600",
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Register Link removed - sign in only */}
        </div>
      </div>
    </div>
  );
}

export default DoctorLogin;