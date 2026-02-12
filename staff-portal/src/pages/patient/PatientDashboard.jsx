import React from 'react';
import {
    LayoutDashboard,
    CalendarPlus,
    Calendar,
    FileText,
    User,
    LogOut,
    ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SidebarLink = ({ icon: Icon, label, active }) => {
    const IconComponent = Icon;

    return (
        <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
            <IconComponent className={`w-5 h-5 ${active ? 'text-teal-600' : 'text-slate-400'}`} />
            <span>{label}</span>
        </button>
    );
};

const PatientDashboard = () => {
    return (
        <div className="flex min-h-screen bg-white font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0">
                <div className="p-8">
                    <h1 className="text-2xl font-bold text-teal-600">Patient Portal</h1>
                    <p className="text-sm text-slate-400 mt-1">Welcome, Tejas</p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <SidebarLink icon={LayoutDashboard} label="Dashboard" active />
                    <SidebarLink icon={CalendarPlus} label="Book Appointment" />
                    <SidebarLink icon={Calendar} label="My Appointments" />
                    <SidebarLink icon={FileText} label="Medical Records" />
                    <SidebarLink icon={User} label="Profile" />
                </nav>

                <div className="p-4 border-t border-slate-50">
                    <button className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-lg transition-colors font-medium">
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-12 bg-slate-50/30">
                <h2 className="text-3xl font-bold text-slate-800 mb-8">Dashboard</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Book Appointment Card */}
                    <div className="bg-teal-600 rounded-3xl p-8 text-white shadow-xl shadow-teal-900/10 flex flex-col justify-between h-80 group hover:shadow-2xl hover:shadow-teal-900/20 transition-all duration-300">
                        <div>
                            <h3 className="text-2xl font-bold mb-3">Book Appointment</h3>
                            <p className="text-teal-100 leading-relaxed opacity-90">Find a doctor and book a slot instantly.</p>
                        </div>
                        <button className="bg-white text-teal-700 font-bold py-3 px-6 rounded-xl w-fit flex items-center gap-2 group-hover:gap-4 transition-all shadow-lg">
                            Book Now <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Upcoming Appointments Card */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col justify-between h-80 hover:border-blue-200 transition-all duration-300 group">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">Upcoming Appointments</h3>
                            <p className="text-slate-500 leading-relaxed">Check your schedule bookings.</p>
                        </div>
                        <button className="text-blue-500 font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                            View Schedule <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Prescriptions & Reports Card */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col justify-between h-80 hover:border-orange-200 transition-all duration-300 group">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">Prescriptions & Reports</h3>
                            <p className="text-slate-500 leading-relaxed">View your medical history.</p>
                        </div>
                        <button className="text-orange-500 font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                            View Records <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PatientDashboard;
