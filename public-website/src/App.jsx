import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout.jsx";
import PatientLayout from "./layouts/PatientLayout.jsx";

import HomePage from "./pages/public/HomePage.jsx";
import AboutPage from "./pages/public/AboutPage.jsx";
import DepartmentsPage from "./pages/public/DepartmentsPage.jsx";
import DoctorsPage from "./pages/public/DoctorsPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage.jsx";

import PatientDashboard from "./pages/patient/Dashboard.jsx";
import BookAppointment from "./pages/patient/BookAppointment.jsx";
import AppointmentReview from "./pages/patient/AppointmentReview.jsx";
import MyAppointments from "./pages/patient/MyAppointments.jsx";
import Prescriptions from "./pages/patient/Prescriptions.jsx";
import Profile from "./pages/patient/Profile.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
        </Route>

        {/* PATIENT ROUTES (PROTECTED) */}
        <Route path="/patient" element={<PatientLayout />}>
          <Route index element={<Navigate to="/patient/dashboard" replace />} />
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="book-appointment" element={<BookAppointment />} />
          <Route path="appointment-review" element={<AppointmentReview />} />
          <Route path="appointments" element={<MyAppointments />} />
          <Route path="prescriptions" element={<Prescriptions />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
