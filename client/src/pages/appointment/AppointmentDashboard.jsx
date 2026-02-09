import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AppointmentDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([
    { id: 1, doctor: "Dr. Smith", date: "2024-02-15", time: "10:00 AM", status: "confirmed" },
    { id: 2, doctor: "Dr. Johnson", date: "2024-02-20", time: "2:00 PM", status: "pending" },
  ]);

  const handleCancel = (id) => {
    setAppointments(appointments.filter((apt) => apt.id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Appointments</h1>
      <button onClick={() => navigate(-1)} style={{ padding: "8px 16px", marginBottom: "20px", cursor: "pointer" }}>
        Back
      </button>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Doctor</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Date</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Time</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Status</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt.id}>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{apt.doctor}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{apt.date}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{apt.time}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "3px",
                    backgroundColor: apt.status === "confirmed" ? "#4CAF50" : "#FFA500",
                    color: "white",
                    fontSize: "12px",
                  }}>
                    {apt.status}
                  </span>
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  <button
                    onClick={() => handleCancel(apt.id)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentDashboard;
