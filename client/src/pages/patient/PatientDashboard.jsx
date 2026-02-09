import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1>Patient Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: "10px 20px", cursor: "pointer" }}>
          Logout
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
        <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "5px" }}>
          <h3>My Profile</h3>
          <p>Email: {user?.email || "N/A"}</p>
        </div>
        <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "5px" }}>
          <h3>Book Appointment</h3>
          <button style={{ padding: "8px 16px", cursor: "pointer" }}>Book Now</button>
        </div>
        <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "5px" }}>
          <h3>My Prescriptions</h3>
          <p>View prescriptions from doctors</p>
        </div>
        <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "5px" }}>
          <h3>Appointments</h3>
          <p>Total: {appointments.length}</p>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
