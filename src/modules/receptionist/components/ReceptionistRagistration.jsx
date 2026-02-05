import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReceptionistRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log("Registration Data:", formData);

    // Navigate to login page after registration
    navigate("/dashboard/receptionist/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 px-6">

      {/* OUTSIDE HEADING */}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center">
        Welcome Back Receptionist
      </h1>

      {/* TWO BLOCK CONTAINER */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl">

        {/* LEFT BLOCK */}
        <div className="bg-green-50 flex flex-col items-center justify-center p-12 text-center">
          <h2 className="text-4xl font-bold text-green-700 mb-4">
            Already Have an Account?
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to access your dashboard
          </p>
          <button
            onClick={() => navigate("/dashboard/receptionist/login")}
            className="px-8 py-3 border-2 border-green-600 text-green-700 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition"
          >
            Login
          </button>
        </div>

        {/* RIGHT BLOCK */}
        <div className="bg-white p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Register
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="number"
                value={formData.number}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl text-lg font-bold hover:bg-blue-700 transition shadow-md"
            >
              Register
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
