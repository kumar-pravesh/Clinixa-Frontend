import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { User, Calendar, FileText, Home, LogOut, PlusCircle, Bell, Search } from 'lucide-react';

const PatientLayout = () => {
    const location = useLocation();
    const profile = JSON.parse(localStorage.getItem("user"));

    if (!profile) {
        return <Navigate to="/login" replace />;
    }

    const navItems = [
        { name: 'Dashboard', path: '/patient/dashboard', icon: <Home size={18} /> },
        { name: 'Book Appointment', path: '/patient/book-appointment', icon: <PlusCircle size={18} /> },
        { name: 'My Appointments', path: '/patient/appointments', icon: <Calendar size={18} /> },
        { name: 'Medical Records', path: '/patient/prescriptions', icon: <FileText size={18} /> },
        { name: 'Profile', path: '/patient/profile', icon: <User size={18} /> },
    ];

    return (
        <div className="flex h-screen bg-health-flow overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 glass-panel m-3 mr-0 rounded-2xl flex flex-col shadow-xl transition-all duration-300">
                <div className="p-6 border-b border-white/20">
                    <div className="flex items-center space-x-2 mb-1">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
                            C
                        </div>
                        <h2 className="text-xl font-bold text-gradient tracking-tight">Clinixa</h2>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Patient Portal</p>
                </div>

                <nav className="flex-1 p-3 mt-2 space-y-1 overflow-y-auto">
                    {navItems.map(item => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-5 py-3 rounded-xl transition-all duration-300 group ${isActive
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20 translate-x-1'
                                        : 'text-gray-500 hover:bg-white/50 hover:text-primary'
                                    }`}
                            >
                                <span className={`${isActive ? 'text-white' : 'group-hover:text-primary transition-colors'}`}>
                                    {item.icon}
                                </span>
                                <span className="font-semibold text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/20">
                    <button
                        onClick={() => {
                            localStorage.removeItem("user");
                            window.location.href = "/login";
                        }}
                        className="flex items-center space-x-3 text-red-500 hover:bg-red-50/50 w-full px-5 py-3 rounded-xl transition-colors duration-300"
                    >
                        <LogOut size={18} />
                        <span className="font-semibold text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 glass-nav m-3 mb-0 rounded-2xl flex items-center justify-between px-6 shadow-sm">
                    <div className="flex items-center space-x-4 flex-1 max-w-md">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search records..."
                                className="w-full bg-white/50 border border-white/30 rounded-lg py-1.5 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-xs"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-500 hover:bg-white/50 rounded-lg transition-colors relative">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-accent rounded-full border border-white"></span>
                        </button>

                        <div className="h-6 w-[1px] bg-white/30 mx-1"></div>

                        <Link to="/patient/profile" className="flex items-center space-x-2.5 group">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-gray-800 tracking-tight group-hover:text-primary transition-colors">{profile.name}</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter leading-none">Verified</p>
                            </div>
                            <div className="w-8 h-8 bg-secondary rounded-full border border-white shadow-sm flex items-center justify-center text-primary font-bold text-xs overflow-hidden transition-transform group-hover:scale-105">
                                {profile.name.charAt(0)}
                            </div>
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 scroll-smooth">
                    <div className="bg-white/30 backdrop-blur-sm rounded-2xl min-h-full p-6 shadow-inner border border-white/20">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PatientLayout;
