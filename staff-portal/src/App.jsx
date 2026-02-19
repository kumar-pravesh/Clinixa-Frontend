import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueueProvider } from './context/QueueContext';
import { NotificationProvider } from './context/NotificationContext';
import { LabProvider } from './context/LabContext';
import './App.css';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import AssignedPatients from './pages/doctor/AssignedPatients';
import Prescriptions from './pages/doctor/Prescriptions';
import AddPrescription from './pages/doctor/AddPrescription';
import LabReports from './pages/doctor/LabReports';
import FollowUps from './pages/doctor/FollowUps';
import DoctorLayout from './components/doctor/DoctorLayout';
import NotFound from './pages/NotFound';

// Auth & Protected Routes
import ProtectedRoute from './components/auth/ProtectedRoute';

// Reception Module
import ReceptionLayout from './components/reception/ReceptionLayout';
import ReceptionDashboard from './pages/reception/ReceptionDashboard';
import WalkInRegistration from './pages/reception/WalkInRegistration';
import TokenManagement from './pages/reception/TokenManagement';
import BillingManagement from './pages/reception/BillingManagement';
import RecentReceipts from './pages/reception/RecentReceipts';
import InvoiceDetails from './pages/reception/InvoiceDetails';

// Lab Module
import LabLayout from './components/lab/LabLayout';
import LabDashboard from './pages/lab/LabDashboard';
import ReportUpload from './pages/lab/ReportUpload';
import TestQueue from './pages/lab/TestQueue';
import LabHistory from './pages/lab/LabHistory';

// Admin Module
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorManagement from './pages/admin/DoctorManagement';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import PatientRecords from './pages/admin/PatientRecords';
import AppointmentApproval from './pages/admin/AppointmentApproval';
import BillingControl from './pages/admin/BillingControl';
import ReportGeneration from './pages/admin/ReportGeneration';

import NotificationDropdown from './components/notifications/NotificationDropdown';
import ToastContainer from './components/notifications/ToastContainer';

function App() {
  return (
    <NotificationProvider>
      <ToastContainer />
      <AuthProvider>
        <QueueProvider>
          <LabProvider>
            <Router>
              <div className="app-container">
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  <Route
                    path="/doctor"
                    element={
                      <ProtectedRoute allowedRoles={['doctor']}>
                        <DoctorLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<DoctorDashboard />} />
                    <Route path="patients" element={<AssignedPatients />} />
                    <Route path="prescriptions" element={<Prescriptions />} />
                    <Route path="prescriptions/new" element={<AddPrescription />} />
                    <Route path="lab-reports" element={<LabReports />} />
                    <Route path="appointments" element={<FollowUps />} />
                  </Route>



                  {/* Reception Module Routes */}
                  <Route
                    path="/reception"
                    element={
                      <ProtectedRoute allowedRoles={['receptionist']}>
                        <ReceptionLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<ReceptionDashboard />} />
                    <Route path="register" element={<WalkInRegistration />} />
                    <Route path="tokens" element={<TokenManagement />} />
                    <Route path="billing" element={<BillingManagement />} />
                    <Route path="receipts" element={<RecentReceipts />} />
                    <Route path="receipts/:id" element={<InvoiceDetails />} />
                  </Route>

                  {/* Lab Module Routes */}
                  <Route
                    path="/lab"
                    element={
                      <ProtectedRoute allowedRoles={['lab_technician']}>
                        <LabLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<LabDashboard />} />
                    <Route path="upload" element={<ReportUpload />} />
                    <Route path="queue" element={<TestQueue />} />
                    <Route path="history" element={<LabHistory />} />
                  </Route>

                  {/* Admin Module Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="doctors" element={<DoctorManagement />} />
                    <Route path="departments" element={<DepartmentManagement />} />
                    <Route path="patients" element={<PatientRecords />} />
                    <Route path="appointments" element={<AppointmentApproval />} />
                    <Route path="billing" element={<BillingControl />} />
                    <Route path="reports" element={<ReportGeneration />} />
                    <Route path="settings" element={<div>System Settings</div>} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </Router>
          </LabProvider>
        </QueueProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
