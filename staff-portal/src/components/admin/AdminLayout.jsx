import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Stethoscope,
    Building2,
    CalendarCheck,
    CreditCard,
    BarChart3,
    LogOut,
    Bell,
    Search,
    Menu,
    X,
    LayoutGrid,
    Settings,
    ShieldCheck
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import NotificationDropdown from '../notifications/NotificationDropdown';
import Logo from '../common/Logo';

const SidebarLink = ({ to, icon: Icon, children, end, onClick }) => {
    const IconComponent = Icon;

    return (
        <NavLink
            to={to}
            end={end}
            onClick={onClick}
            className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
        >
            <IconComponent className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="font-bold tracking-tight">{children}</span>
        </NavLink>
    );
};

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { unreadCount } = useNotification();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const notificationRef = useRef(null);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex min-h-screen bg-slate-50/50">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:sticky top-0 left-0 h-screen bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex flex-col z-50 transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none",
                isMobileMenuOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full lg:translate-x-0 lg:w-64"
            )}>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Logo className="scale-90" showText={false} />
                        <div>
                            <h1 className="font-bold text-xl text-slate-800 leading-tight">Clinixa</h1>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Admin
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-400"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <SidebarLink to="/admin" icon={LayoutDashboard} end onClick={() => setIsMobileMenuOpen(false)}>Dashboard</SidebarLink>
                    <SidebarLink to="/admin/doctors" icon={Stethoscope} onClick={() => setIsMobileMenuOpen(false)}>Doctors</SidebarLink>
                    <SidebarLink to="/admin/departments" icon={Building2} onClick={() => setIsMobileMenuOpen(false)}>Departments</SidebarLink>
                    <SidebarLink to="/admin/patients" icon={Users} onClick={() => setIsMobileMenuOpen(false)}>Patients</SidebarLink>
                    <SidebarLink to="/admin/appointments" icon={CalendarCheck} onClick={() => setIsMobileMenuOpen(false)}>Appointments</SidebarLink>
                    <SidebarLink to="/admin/billing" icon={CreditCard} onClick={() => setIsMobileMenuOpen(false)}>Financials</SidebarLink>
                    <SidebarLink to="/admin/reports" icon={BarChart3} onClick={() => setIsMobileMenuOpen(false)}>Reports</SidebarLink>
                </nav>

                <div className="p-4 border-t border-slate-100 space-y-2">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group"
                    >
                        <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        <span className="font-bold tracking-tight">System Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="hidden lg:flex items-center gap-2 text-slate-400">
                            <LayoutGrid className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Management / Command Center</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                className={cn(
                                    "relative p-2.5 transition-all rounded-xl",
                                    isNotificationOpen ? "text-slate-900 bg-slate-100" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                                )}
                            >
                                <Bell className="w-6 h-6" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[8px] font-black text-white flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            <NotificationDropdown
                                isOpen={isNotificationOpen}
                                onClose={() => setIsNotificationOpen(false)}
                            />
                        </div>

                        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

                        <div className="flex items-center gap-3 pl-2">
                            <div className="hidden lg:block text-right">
                                <p className="text-sm font-black text-slate-900 tracking-tight">Super Admin</p>
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-900 rounded-lg">
                                    <span className="w-1 h-1 bg-emerald-400 rounded-full"></span>
                                    <span className="text-[8px] font-black text-white uppercase tracking-widest">Root</span>
                                </span>
                            </div>
                            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-slate-900/10 border-2 border-white">
                                AD
                            </div>
                        </div>
                    </div>
                </header >

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </main>
            </div >
        </div >
    );
};

export default AdminLayout;
