import React, { useEffect, useState } from "react";
import API from "../api";

function LabReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    API.get("/doctor/labreports")
      .then(res => setReports(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Lab Reports</h2>

      {reports.map(r => (
        <div key={r.id}>
          <p>Patient: {r.patient_name}</p>
          <p>Report: {r.report_type}</p>
          <p>Status: {r.status}</p>
        </div>
      ))}
    </div>
  );
}

export default LabReports;
