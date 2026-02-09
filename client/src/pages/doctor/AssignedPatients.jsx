import React, { useEffect, useState } from "react";
import API from "../api";

function AssignedPatients() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    API.get("/doctor/patients")
      .then(res => setPatients(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Assigned Patients</h2>

      {patients.map(p => (
        <div key={p.id}>
          <p>{p.name}</p>
        </div>
      ))}
    </div>
  );
}

export default AssignedPatients;
