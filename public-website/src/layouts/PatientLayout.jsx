import { useEffect, useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { patientService } from '../services/patientService';
import { authService } from '../services/authService';
import { User, Calendar, FileText, Home, LogOut, PlusCircle } from 'lucide-react'; // Need lucide-react

const PatientLayout = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const location = useLocation();

    useEffect(() => {
        patientService.getProfile()
            .then(data => {
                setProfile(data);
                setLoading(false);
            })
            .catch(() => {
                // If 401/403, api.js interceptor will redirect, but good to have fallback
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    if (!profile) return <Navigate to="/login" />;

    const navItems = [
        { name: 'Dashboard', path: '/patient/dashboard', icon: <Home size={20} /> },
        { name: 'Book Appointment', path: '/patient/book-appointment', icon: <PlusCircle size={20} /> },
        { name: 'My Appointments', path: '/patient/appointments', icon: <Calendar size={20} /> },
        { name: 'Medical Records', path: '/patient/prescriptions', icon: <FileText size={20} /> },
        { name: 'Profile', path: '/patient/profile', icon: <User size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold text-primary">Patient Portal</h2>
                    <p className="text-sm text-gray-500">Welcome, {profile.name}</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${location.pathname === item.path
                                    ? 'bg-secondary/20 text-primary font-semibold'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <button
                        onClick={authService.logout}
                        className="flex items-center space-x-3 text-red-500 hover:bg-red-50 w-full px-4 py-3 rounded-md transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <Outlet context={{ profile }} />
            </main>
        </div>
    );
};

export default PatientLayout;
