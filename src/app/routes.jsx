<<<<<<< HEAD:src/App.jsx
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
import MyPatients from './pages/dashboards/MyPatients';
import DoctorAppointments from './pages/dashboards/DoctorAppointments';
=======
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import DashboardLayout from '../layouts/DashboardLayout';
>>>>>>> db8e1ad (Folder structure changed):src/app/routes.jsx

// Admin Module
import AdminDashboard from '../modules/admin/pages/AdminDashboard';
import StaffRegistrationApproval from '../modules/admin/components/StaffRegistrationApproval';
import DoctorManagement from '../modules/admin/components/DoctorManagement';
import StaffManagement from '../modules/admin/components/StaffManagement';
import DepartmentManagement from '../modules/admin/components/DepartmentManagement';
import PatientRecords from '../modules/admin/components/PatientRecords';
import AppointmentApproval from '../modules/admin/components/AppointmentApproval';
import BillingManagement from '../modules/admin/components/BillingManagement';
import ReportsGeneration from '../modules/admin/components/ReportsGeneration';

// Doctor Module
import DoctorDashboard from '../modules/doctor/pages/DoctorDashboard';

// Patient Module
import PatientDashboard from '../modules/patient/pages/PatientDashboard';
import AppointmentBooking from '../modules/patient/components/AppointmentBooking';
import MedicalRecords from '../shared/components/MedicalRecords';

// Receptionist Module
import ReceptionistDashboard from '../modules/receptionist/pages/ReceptionistDashboard';
import BillingForm from '../modules/receptionist/components/BillingForm';

// Lab Module
import LabTechnicianDashboard from '../modules/lab/pages/LabTechnicianDashboard';
import LabReportUpload from '../modules/lab/components/LabReportUpload';

const AppRoutes = () => (
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
        <Route path="/dashboard/doctor/patients" element={<DashboardLayout role="doctor"><MyPatients /></DashboardLayout>} />
        <Route path="/dashboard/doctor/appointments" element={<DashboardLayout role="doctor"><DoctorAppointments /></DashboardLayout>} />

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
);

export default AppRoutes;
