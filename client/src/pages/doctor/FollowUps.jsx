import React, { useEffect, useState } from "react";
import API from "../api";

function FollowUps() {
  const [followups, setFollowups] = useState([]);

  useEffect(() => {
    API.get("/doctor/followups")
      .then(res => setFollowups(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Follow Up Patients</h2>

      {followups.map(f => (
        <div key={f.id}>
          <p>Patient: {f.patient_name}</p>
          <p>Date: {f.followup_date}</p>
        </div>
      ))}
    </div>
  );
}

export default FollowUps;
