import { useNavigate } from 'react-router-dom';
import {
    FiHome,
    FiUsers,
    FiCalendar,
    FiFileText,
    FiActivity,
    FiLogOut,
    FiDollarSign,
    FiBarChart2
} from 'react-icons/fi';

const AdminSidebar = ({ activeTab, onSelect, role }) => {
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('isLogged');
        localStorage.removeItem('user');
        localStorage.removeItem('adminIsLogged');
        localStorage.removeItem('adminUser');
        navigate('/login');
    };

    const adminLinks = [
        { id: 'overview', name: 'Overview', icon: <FiHome /> },
        { id: 'doctors', name: 'Doctors', icon: <FiUsers /> },
        { id: 'staff', name: 'Staff', icon: <FiActivity /> },
        { id: 'departments', name: 'Departments', icon: <FiFileText /> },
        { id: 'patients', name: 'Patients', icon: <FiUsers /> },
        { id: 'appointments', name: 'Appointments', icon: <FiCalendar /> },
        { id: 'billing', name: 'Billing Control', icon: <FiDollarSign /> },
    ];

    return (
        <aside className="w-64 bg-[#0d9488] flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] overflow-y-auto">
            <nav className="flex-1 px-0 py-4 space-y-0">
                {adminLinks.map((link) => (
                    <button
                        key={link.id}
                        onClick={() => onSelect(link.id)}
                        className={`w-full flex items-center space-x-3 px-6 py-3.5 transition-all duration-200
                            ${activeTab === link.id
                                ? 'bg-[#0f766e] text-white border-l-4 border-white'
                                : 'text-white hover:bg-[#0f766e]'}
                        `}
                    >
                        <span className="text-lg">{link.icon}</span>
                        <span className="font-medium text-sm">{link.name}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-[#0f766e]">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:bg-[#0f766e] transition-all duration-200"
                >
                    <FiLogOut className="text-lg" />
                    <span className="font-medium text-sm">Log Out</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
