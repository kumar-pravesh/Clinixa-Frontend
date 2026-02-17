import { useState, useEffect, useRef } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { User, Calendar, FileText, Home, LogOut, PlusCircle, Bell, Search, Clock, CheckCircle, Info } from 'lucide-react';
import { patientService } from '../services/patientService';

const PatientLayout = () => {
    const location = useLocation();
    const profile = JSON.parse(localStorage.getItem("user"));
    const dropdownRef = useRef(null);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);

    const fetchNotifications = async () => {
        try {
            const data = await patientService.getNotifications();
            setNotifications(data.notifications || []);
            setUnreadCount(data.notifications?.filter(n => !n.read).length || 0);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    useEffect(() => {
        if (!profile) return;
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await patientService.markNotificationAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) { }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await patientService.markAllNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) { }
    };

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
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className={`p-2 rounded-lg transition-all relative ${showDropdown ? 'bg-primary text-white' : 'text-gray-500 hover:bg-white/50'}`}
                            >
                                <Bell size={18} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-accent rounded-full border border-white"></span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showDropdown && (
                                <div className="absolute right-0 mt-3 w-80 glass-panel rounded-2xl shadow-2xl border border-white/30 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-4 border-b border-white/20 flex items-center justify-between bg-white/50">
                                        <h3 className="font-bold text-gray-800 text-sm">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={handleMarkAllAsRead}
                                                className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            <div className="divide-y divide-white/10">
                                                {notifications.map(notification => (
                                                    <div
                                                        key={notification.id}
                                                        className={`p-4 transition-colors hover:bg-white/40 cursor-pointer relative ${!notification.read ? 'bg-primary/5' : ''}`}
                                                        onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                                                    >
                                                        {!notification.read && (
                                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                                                        )}
                                                        <div className="flex items-start space-x-3">
                                                            <div className={`p-2 rounded-lg ${notification.type === 'appointment' ? 'bg-blue-100 text-blue-600' :
                                                                    notification.type === 'payment' ? 'bg-green-100 text-green-600' :
                                                                        'bg-gray-100 text-gray-600'
                                                                }`}>
                                                                {notification.type === 'appointment' ? <Clock size={14} /> :
                                                                    notification.type === 'payment' ? <CheckCircle size={14} /> :
                                                                        <Info size={14} />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className={`text-xs font-bold truncate ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                                                    {notification.title}
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-0.5 max-h-12 overflow-hidden">
                                                                    {notification.message}
                                                                </p>
                                                                <p className="text-[10px] text-gray-400 mt-1.5 font-medium italic">
                                                                    {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notification.timestamp).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-12 px-6 text-center">
                                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
                                                    <Bell size={20} />
                                                </div>
                                                <p className="text-sm font-bold text-gray-400">No notifications yet</p>
                                                <p className="text-[11px] text-gray-400/80 mt-1">We'll alert you here for any updates.</p>
                                            </div>
                                        )}
                                    </div>
                                    {notifications.length > 0 && (
                                        <div className="p-3 border-t border-white/20 bg-gray-50/50 text-center">
                                            <button className="text-[10px] font-bold text-gray-500 hover:text-primary transition-colors uppercase tracking-widest">
                                                View all activity
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

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
