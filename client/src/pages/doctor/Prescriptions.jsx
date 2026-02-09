import React, { useEffect, useState } from "react";
import API from "../api";

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    API.get("/doctor/prescriptions")
      .then(res => setPrescriptions(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Prescriptions</h2>

      {prescriptions.map(p => (
        <div key={p.id}>
          <p>Patient: {p.patient_name}</p>
          <p>Medicine: {p.medicine}</p>
          <p>Date: {p.date}</p>
        </div>
      ))}
    </div>
  );
}

export default Prescriptions;
