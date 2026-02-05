
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import DashboardLayout from '../layouts/DashboardLayout';
import AuthGuard from '../shared/components/AuthGuard';

// Doctor New Pages
import MyPatients from '../modules/doctor/pages/MyPatients';
import DoctorAppointments from '../modules/doctor/pages/DoctorAppointments';

// Admin Module
import AdminDashboard from '../modules/admin/pages/AdminDashboard';
import AdminLoginPage from '../modules/admin/pages/AdminLoginPage';
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
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Admin Dashboard Routes */}
        <Route path="/dashboard/admin" element={<AuthGuard requiredRole="admin"><DashboardLayout role="admin"><AdminDashboard /></DashboardLayout></AuthGuard>} />
        <Route path="/dashboard/admin/registrations" element={<AuthGuard requiredRole="admin"><DashboardLayout role="admin"><StaffRegistrationApproval /></DashboardLayout></AuthGuard>} />
        <Route path="/dashboard/admin/doctors" element={<AuthGuard requiredRole="admin"><DashboardLayout role="admin"><DoctorManagement /></DashboardLayout></AuthGuard>} />
        <Route path="/dashboard/admin/staff" element={<AuthGuard requiredRole="admin"><DashboardLayout role="admin"><StaffManagement /></DashboardLayout></AuthGuard>} />
        <Route path="/dashboard/admin/departments" element={<AuthGuard requiredRole="admin"><DashboardLayout role="admin"><DepartmentManagement /></DashboardLayout></AuthGuard>} />
        <Route path="/dashboard/admin/patients" element={<AuthGuard requiredRole="admin"><DashboardLayout role="admin"><PatientRecords /></DashboardLayout></AuthGuard>} />
        <Route path="/dashboard/admin/appointments" element={<AuthGuard requiredRole="admin"><DashboardLayout role="admin"><AppointmentApproval /></DashboardLayout></AuthGuard>} />
        <Route path="/dashboard/admin/billing" element={<AuthGuard requiredRole="admin"><DashboardLayout role="admin"><BillingManagement /></DashboardLayout></AuthGuard>} />
        <Route path="/dashboard/admin/reports" element={<AuthGuard requiredRole="admin"><DashboardLayout role="admin"><ReportsGeneration /></DashboardLayout></AuthGuard>} />

        {/* Doctor Dashboard Routes */}
        <Route path="/dashboard/doctor" element={<AuthGuard requiredRole="doctor"><DashboardLayout role="doctor"><DoctorDashboard /></DashboardLayout></AuthGuard>} />
        <Route path="/dashboard/doctor/prescriptions" element={<AuthGuard requiredRole="doctor"><DashboardLayout role="doctor"><MedicalRecords /></DashboardLayout></AuthGuard>} />
        <Route path="/dashboard/doctor/patients" element={<AuthGuard requiredRole="doctor"><DashboardLayout role="doctor"><MyPatients /></DashboardLayout></AuthGuard>} />
        <Route path="/dashboard/doctor/appointments" element={<AuthGuard requiredRole="doctor"><DashboardLayout role="doctor"><DoctorAppointments /></DashboardLayout></AuthGuard>} />

        {/* Patient Dashboard Routes */}
        <Route path="/dashboard/patient" element={<AuthGuard requiredRole="patient"><DashboardLayout role="patient"><PatientDashboard /></DashboardLayout></AuthGuard>} />
        <Route path="/dashboard/patient/book" element={<AuthGuard requiredRole="patient"><DashboardLayout role="patient"><AppointmentBooking /></DashboardLayout></AuthGuard>} />
        <Route path="/dashboard/patient/records" element={<AuthGuard requiredRole="patient"><DashboardLayout role="patient"><MedicalRecords /></DashboardLayout></AuthGuard>} />

        {/* Receptionist Dashboard Routes */}
        <Route path="/dashboard/receptionist" element={<AuthGuard requiredRole="receptionist"><DashboardLayout role="receptionist"><ReceptionistDashboard /></DashboardLayout></AuthGuard>} />
        <Route path="/dashboard/receptionist/billing" element={<AuthGuard requiredRole="receptionist"><DashboardLayout role="receptionist"><BillingForm /></DashboardLayout></AuthGuard>} />

        {/* Lab Technician Dashboard Routes */}
        <Route path="/dashboard/lab-technician" element={<AuthGuard requiredRole="lab-technician"><DashboardLayout role="lab-technician"><LabTechnicianDashboard /></DashboardLayout></AuthGuard>} />
        <Route path="/dashboard/lab-technician/upload" element={<AuthGuard requiredRole="lab-technician"><DashboardLayout role="lab-technician"><LabReportUpload /></DashboardLayout></AuthGuard>} />
    </Routes>
);

export default AppRoutes;
