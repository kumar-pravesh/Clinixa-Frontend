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

// Admin Features
import DoctorManagement from './components/dashboard/features/DoctorManagement';
import DepartmentManagement from './components/dashboard/features/DepartmentManagement';
import StaffManagement from './components/dashboard/features/StaffManagement';
import PatientRecords from './components/dashboard/features/PatientRecords';
import AppointmentApproval from './components/dashboard/features/AppointmentApproval';
import BillingManagement from './components/dashboard/features/BillingManagement';
import ReportsGeneration from './components/dashboard/features/ReportsGeneration';
import StaffRegistrationApproval from './components/dashboard/features/StaffRegistrationApproval';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Admin Dashboard Routes */}
        <Route path="/dashboard/admin" element={<DashboardLayout role="admin"><AdminDashboard /></DashboardLayout>} />
        <Route path="/dashboard/admin/registrations" element={<DashboardLayout role="admin"><StaffRegistrationApproval /></DashboardLayout>} />
        <Route path="/dashboard/admin/doctors" element={<DashboardLayout role="admin"><DoctorManagement /></DashboardLayout>} />
        <Route path="/dashboard/admin/staff" element={<DashboardLayout role="admin"><StaffManagement /></DashboardLayout>} />
        <Route path="/dashboard/admin/departments" element={<DashboardLayout role="admin"><DepartmentManagement /></DashboardLayout>} />
        <Route path="/dashboard/admin/patients" element={<DashboardLayout role="admin"><PatientRecords /></DashboardLayout>} />
        <Route path="/dashboard/admin/appointments" element={<DashboardLayout role="admin"><AppointmentApproval /></DashboardLayout>} />
        <Route path="/dashboard/admin/billing" element={<DashboardLayout role="admin"><BillingManagement /></DashboardLayout>} />
        <Route path="/dashboard/admin/reports" element={<DashboardLayout role="admin"><ReportsGeneration /></DashboardLayout>} />

        {/* Doctor Dashboard Routes */}
        <Route path="/dashboard/doctor" element={<DashboardLayout role="doctor"><DoctorDashboard /></DashboardLayout>} />
        <Route path="/dashboard/doctor/prescriptions" element={<DashboardLayout role="doctor"><MedicalRecords /></DashboardLayout>} />

        {/* Patient Dashboard Routes */}
        <Route path="/dashboard/patient" element={<DashboardLayout role="patient"><PatientDashboard /></DashboardLayout>} />
        <Route path="/dashboard/patient/book" element={<DashboardLayout role="patient"><AppointmentBooking /></DashboardLayout>} />
        <Route path="/dashboard/patient/records" element={<DashboardLayout role="patient"><MedicalRecords /></DashboardLayout>} />

        {/* Receptionist Dashboard Routes */}
        <Route path="/dashboard/receptionist" element={<DashboardLayout role="receptionist"><ReceptionistDashboard /></DashboardLayout>} />
        <Route path="/dashboard/receptionist/billing" element={<DashboardLayout role="receptionist"><BillingForm /></DashboardLayout>} />

        {/* Lab Technician Dashboard Routes */}
        <Route path="/dashboard/lab-technician" element={<DashboardLayout role="lab-technician"><LabTechnicianDashboard /></DashboardLayout>} />
        <Route path="/dashboard/lab-technician/upload" element={<DashboardLayout role="lab-technician"><LabReportUpload /></DashboardLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
