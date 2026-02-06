import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import AppointmentDashboard from './pages/appointment/AppointmentDashboard';
import BillingDashboard from './pages/payment/BillingDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/appointments" element={<AppointmentDashboard />} />
            <Route path="/billing" element={<BillingDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
