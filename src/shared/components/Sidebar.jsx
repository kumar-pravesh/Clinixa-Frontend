import { NavLink } from 'react-router-dom';
import {
    FiHome,
    FiUsers,
    FiCalendar,
    FiFileText,
    FiActivity,
    FiSettings,
    FiLogOut,
    FiClock,
    FiUploadCloud,
    FiDollarSign,
    FiBarChart2
} from 'react-icons/fi';

const Sidebar = ({ role }) => {
    const adminLinks = [
        { name: 'Overview', icon: <FiHome />, path: '/dashboard/admin' },
        { name: 'Staff Registration', icon: <FiActivity />, path: '/dashboard/admin/registrations' },
        { name: 'Doctors', icon: <FiUsers />, path: '/dashboard/admin/doctors' },
        { name: 'Staff', icon: <FiActivity />, path: '/dashboard/admin/staff' },
        { name: 'Departments', icon: <FiFileText />, path: '/dashboard/admin/departments' },
        { name: 'Patients', icon: <FiUsers />, path: '/dashboard/admin/patients' },
        { name: 'Appointments', icon: <FiCalendar />, path: '/dashboard/admin/appointments' },
        { name: 'Billing Control', icon: <FiDollarSign />, path: '/dashboard/admin/billing' },
        { name: 'Reports', icon: <FiBarChart2 />, path: '/dashboard/admin/reports' },
    ];

    const doctorLinks = [
        { name: 'Dashboard', icon: <FiHome />, path: '/dashboard/doctor' },
        { name: 'My Patients', icon: <FiUsers />, path: '/dashboard/doctor/patients' },
        { name: 'Appointments', icon: <FiCalendar />, path: '/dashboard/doctor/appointments' },
        { name: 'Prescriptions', icon: <FiFileText />, path: '/dashboard/doctor/prescriptions' },
    ];

    const patientLinks = [
        { name: 'My Health', icon: <FiHome />, path: '/dashboard/patient' },
        { name: 'Book Appointment', icon: <FiCalendar />, path: '/dashboard/patient/book' },
        { name: 'My Records', icon: <FiFileText />, path: '/dashboard/patient/records' },
    ];

    const receptionistLinks = [
        { name: 'Reception', icon: <FiHome />, path: '/dashboard/receptionist' },
        { name: 'Tokens', icon: <FiActivity />, path: '/dashboard/receptionist/tokens' },
        { name: 'Regester Walk in', icon: <FiActivity />, path: '/dashboard/receptionist/walkin' },
        { name: 'Billing', icon: <FiFileText />, path: '/dashboard/receptionist/billing' },
    ];

    const labLinks = [
        { name: 'Lab Home', icon: <FiHome />, path: '/dashboard/lab-technician' },
        { name: 'Samples', icon: <FiClock />, path: '/dashboard/lab-technician' },
        { name: 'Upload Reports', icon: <FiUploadCloud />, path: '/dashboard/lab-technician/upload' },
    ];

    const links =
        role === 'admin' ? adminLinks :
            role === 'doctor' ? doctorLinks :
                role === 'patient' ? patientLinks :
                    role === 'receptionist' ? receptionistLinks :
                        labLinks;

    return (
        <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-30 transition-all duration-300">
            <div className="p-6">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-xl">C</span>
                    </div>
                    <span className="text-2xl font-bold font-display text-gradient">Clinixa</span>
                </div>
            </div>

            <nav className="flex-1 mt-4 px-4 space-y-2 overflow-y-auto">
                {links.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        end={link.path.endsWith('dashboard/admin') || link.path.endsWith('dashboard/doctor') || link.path.endsWith('dashboard/patient') || link.path.endsWith('dashboard/receptionist') || link.path.endsWith('dashboard/lab-technician')}
                        className={({ isActive }) => `
                            flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                            ${isActive
                                ? 'bg-primary-50 text-primary-600 shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                        `}
                    >
                        <span className="text-xl">{link.icon}</span>
                        <span className="font-semibold">{link.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <NavLink
                    to="/"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200"
                >
                    <FiLogOut className="text-xl" />
                    <span className="font-semibold">Log Out</span>
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;
