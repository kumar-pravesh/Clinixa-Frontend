import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutGrid,
    FlaskConical,
    FileText,
    Upload,
    Bell,
    LogOut,
    Menu,
    X,
    LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import NotificationDropdown from '../notifications/NotificationDropdown';
import { cn } from '../../utils/cn';
import Logo from '../common/Logo';

const SidebarLink = ({ to, icon: Icon, children, end, onClick }) => {
    const IconComponent = Icon;

    return (
        <NavLink
            to={to}
            end={end}
            onClick={onClick}
            className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-[1.25rem] transition-all duration-300 group",
                isActive
                    ? "bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]"
                    : "text-slate-500 hover:bg-slate-50 hover:text-primary"
            )}
        >
            <IconComponent className={cn("w-5 h-5 transition-transform group-hover:scale-110 group-active:scale-95")} />
            <span className="font-bold text-sm tracking-tight">{children}</span>
        </NavLink>
    );
};

const LabLayout = () => {
    const { logout } = useAuth();
    const { unreadCount } = useNotification();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            navigate('/login');
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 w-72 bg-white flex flex-col z-50 transition-all duration-500 transform lg:translate-x-0 lg:static lg:h-screen border-r border-slate-200",
                isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
            )}>
                <div className="p-8 pb-10 flex items-center justify-between lg:justify-start gap-4">
                    <div className="flex items-center gap-4">
                        <Logo className="scale-90" showText={false} />
                        <div>
                            <h1 className="font-bold text-xl text-slate-900 leading-tight">Clinixa</h1>
                            <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-0.5">Lab Portal</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 lg:hidden text-slate-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <SidebarLink to="/lab" icon={LayoutDashboard} end onClick={() => setIsMobileMenuOpen(false)}>Dashboard</SidebarLink>
                    <SidebarLink to="/lab/queue" icon={FlaskConical} onClick={() => setIsMobileMenuOpen(false)}>Test Queue</SidebarLink>
                    <SidebarLink to="/lab/upload" icon={Upload} onClick={() => setIsMobileMenuOpen(false)}>Upload Reports</SidebarLink>
                    <SidebarLink to="/lab/history" icon={FileText} onClick={() => setIsMobileMenuOpen(false)}>History</SidebarLink>
                </nav>

                <div className="p-6 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-6 py-4 w-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-[1.25rem] transition-all group border border-transparent hover:border-rose-100"
                    >
                        <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        <span className="font-bold text-sm">Sign Out</span>
                    </button>

                    <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-black">
                                LT
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs font-bold text-slate-900 truncate">Lab Technician</p>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Active Now</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-10 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2.5 bg-slate-50 rounded-xl text-slate-600 lg:hidden hover:bg-slate-100 transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="hidden lg:flex items-center gap-2 text-slate-400">
                            <LayoutGrid className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Manager / Overview</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="relative">
                            <button
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className={cn(
                                    "p-2.5 hover:bg-primary/5 rounded-xl transition-all group",
                                    isNotifOpen ? "text-primary bg-primary/5" : "text-slate-400"
                                )}
                            >
                                <Bell className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[8px] font-black text-white flex items-center justify-center">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            <NotificationDropdown
                                isOpen={isNotifOpen}
                                onClose={() => setIsNotifOpen(false)}
                            />
                        </div>

                        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

                        <div className="flex items-center gap-3 pl-2">
                            <div className="hidden lg:block text-right">
                                <p className="text-sm font-black text-slate-900 tracking-tight">Lab Technician</p>
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 rounded-lg">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Active Now</span>
                                </span>
                            </div>
                            <div className="w-11 h-11 bg-slate-900 rounded-[1.25rem] flex items-center justify-center text-white font-black text-sm shadow-xl shadow-slate-900/20 group cursor-pointer hover:scale-105 transition-all">
                                LT
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-10 custom-scrollbar bg-slate-50/50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default LabLayout;
