import React, { useState } from "react";
import API from "../api";

function AddPrescription() {
  const [patientId, setPatientId] = useState("");
  const [medicine, setMedicine] = useState("");

  const submit = async () => {
    await API.post("/doctor/prescription", {
      patientId,
      medicine
    });

    alert("Prescription Added");
  };

  return (
    <div>
      <h2>Add Prescription</h2>

      <input
        placeholder="Patient ID"
        onChange={e => setPatientId(e.target.value)}
      />

      <input
        placeholder="Medicine"
        onChange={e => setMedicine(e.target.value)}
      />

      <button onClick={submit}>Submit</button>
    </div>
  );
}

export default AddPrescription;
