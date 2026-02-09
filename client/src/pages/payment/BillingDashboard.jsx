import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BillingDashboard = () => {
  const navigate = useNavigate();
  const [invoices] = useState([
    { id: 1, date: "2024-01-15", amount: "$150", status: "paid", description: "Consultation Fee" },
    { id: 2, date: "2024-02-10", amount: "$200", status: "pending", description: "Lab Tests" },
    { id: 3, date: "2024-02-05", amount: "$100", status: "paid", description: "Prescription" },
  ]);

  const totalPaid = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + parseInt(inv.amount.replace("$", "")), 0);

  const totalPending = invoices
    .filter((inv) => inv.status === "pending")
    .reduce((sum, inv) => sum + parseInt(inv.amount.replace("$", "")), 0);

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)} style={{ padding: "8px 16px", marginBottom: "20px", cursor: "pointer" }}>
        Back
      </button>
      <h1>Billing & Invoices</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        <div style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "5px", backgroundColor: "#e8f5e9" }}>
          <h3>Total Paid</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>${totalPaid}</p>
        </div>
        <div style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "5px", backgroundColor: "#fff3e0" }}>
          <h3>Total Pending</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>${totalPending}</p>
        </div>
      </div>
      <h2>Recent Invoices</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Date</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Description</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Amount</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Status</th>
              <th style={{ border: "1px solid #ddd", padding: "10px", textAlign: "left" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{inv.date}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{inv.description}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{inv.amount}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "3px",
                    backgroundColor: inv.status === "paid" ? "#4CAF50" : "#FFA500",
                    color: "white",
                    fontSize: "12px",
                  }}>
                    {inv.status}
                  </span>
                </td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  <button
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#2196F3",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    View
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

export default BillingDashboard;
