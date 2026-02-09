import React, { useEffect, useState } from "react";
import API from "../api";

function DoctorProfile() {
  const [doctor, setDoctor] = useState({});

  useEffect(() => {
    API.get("/doctor/profile")
      .then(res => setDoctor(res.data));
  }, []);

  return (
    <div>
      <h2>Doctor Profile</h2>
      <p>Name: {doctor.name}</p>
      <p>Email: {doctor.email}</p>
      <p>Specialization: {doctor.specialization}</p>
    </div>
  );
}

export default DoctorProfile;
