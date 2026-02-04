import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import DoctorDashboard from './pages/dashboards/DoctorDashboard';
import PatientDashboard from './pages/dashboards/PatientDashboard';
import ReceptionistDashboard from './pages/dashboards/ReceptionistDashboard';
import LabTechnicianDashboard from './pages/dashboards/LabTechnicianDashboard';

// Feature Views
import AppointmentBooking from './components/dashboard/features/AppointmentBooking';
import BillingForm from './components/dashboard/features/BillingForm';
import MedicalRecords from './components/dashboard/features/MedicalRecords';
import LabReportUpload from './components/dashboard/features/LabReportUpload';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard/admin" element={<DashboardLayout role="admin"><AdminDashboard /></DashboardLayout>} />
        <Route path="/dashboard/doctor" element={<DashboardLayout role="doctor"><DoctorDashboard /></DashboardLayout>} />
        <Route path="/dashboard/doctor/prescriptions" element={<DashboardLayout role="doctor"><MedicalRecords /></DashboardLayout>} />

        <Route path="/dashboard/patient" element={<DashboardLayout role="patient"><PatientDashboard /></DashboardLayout>} />
        <Route path="/dashboard/patient/book" element={<DashboardLayout role="patient"><AppointmentBooking /></DashboardLayout>} />
        <Route path="/dashboard/patient/records" element={<DashboardLayout role="patient"><MedicalRecords /></DashboardLayout>} />

        <Route path="/dashboard/receptionist" element={<DashboardLayout role="receptionist"><ReceptionistDashboard /></DashboardLayout>} />
        <Route path="/dashboard/receptionist/billing" element={<DashboardLayout role="receptionist"><BillingForm /></DashboardLayout>} />

        <Route path="/dashboard/lab-technician" element={<DashboardLayout role="lab-technician"><LabTechnicianDashboard /></DashboardLayout>} />
        <Route path="/dashboard/lab-technician/upload" element={<DashboardLayout role="lab-technician"><LabReportUpload /></DashboardLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
