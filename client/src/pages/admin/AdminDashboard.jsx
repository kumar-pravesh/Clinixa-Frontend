import { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminOverview from './AdminOverview';
import DoctorManagement from './DoctorManagement';
import PatientRecords from './PatientRecords';
import AppointmentApproval from './AppointmentApproval';
import BillingManagement from './BillingManagement';
import StaffManagement from './StaffManagement';
import DepartmentManagement from './DepartmentManagement';
import AdminLoginPage from './AdminLoginPage';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isAdminLogged, setIsAdminLogged] = useState(localStorage.getItem('adminIsLogged') === 'true');

    // Sync login state if it changes
    useEffect(() => {
        const checkLogin = () => {
            setIsAdminLogged(localStorage.getItem('adminIsLogged') === 'true');
        };
        window.addEventListener('storage', checkLogin);
        // Also check on interval for this tab
        const interval = setInterval(checkLogin, 1000);
        return () => {
            window.removeEventListener('storage', checkLogin);
            clearInterval(interval);
        };
    }, []);

    if (!isAdminLogged) {
        return <AdminLoginPage onLoginSuccess={() => setIsAdminLogged(true)} />;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <AdminOverview />;
            case 'doctors': return <DoctorManagement />;
            case 'patients': return <PatientRecords />;
            case 'appointments': return <AppointmentApproval />;
            case 'billing': return <BillingManagement />;
            case 'staff': return <StaffManagement />;
            case 'departments': return <DepartmentManagement />;
            default: return <AdminOverview />;
        }
    };

    return (
        <div className="flex flex-col bg-gray-100 min-h-screen">
            {/* Top Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">+</span>
                        </div>
                        <span className="text-2xl font-bold text-teal-600">MediCare</span>
                    </div>
                    <div className="flex items-center space-x-6">
                        <button className="text-gray-400 hover:text-gray-600 relative">
                            <span className="text-2xl">🔔</span>
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center space-x-3">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">John Admin</p>
                                <p className="text-xs text-gray-500">Admin</p>
                            </div>
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                <AdminSidebar activeTab={activeTab} onSelect={setActiveTab} role="admin" />
                <main className="flex-1 ml-64 p-8 bg-gray-100">
                    <div className="max-w-7xl mx-auto">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
