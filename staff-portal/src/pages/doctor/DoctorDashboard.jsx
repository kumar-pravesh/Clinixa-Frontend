import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Calendar,
    FileText,
    Activity,
    Clock,
    ChevronRight,
    TrendingUp,
    AlertCircle,
    X
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useDoctor } from '../../context/DoctorContext';
import { useAuth } from '../../context/AuthContext';

import { SimpleChart } from '../../components/common/SimpleChart';

const StatCard = ({ title, value, icon: Icon, color, trend, chartData }) => {
    const IconComponent = Icon;

    return (
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-white/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all group overflow-hidden relative cursor-default">
            <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700", color)}></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`p-3.5 rounded-2xl ${color} text-white shadow-lg shadow-primary/20`}>
                    <IconComponent className="w-5 h-5" />
                </div>
                {trend && (
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        {trend}
                    </span>
                )}
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-1">{title}</p>
                        <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{value}</h3>
                    </div>
                    {chartData && (
                        <div className="w-24 h-12 -mb-2">
                            <SimpleChart data={chartData} color={color.replace('bg-', 'text-')} height={40} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { appointments, labReports, getPatientStats } = useDoctor();
    const stats = getPatientStats();
    const [selectedAppointment, setSelectedAppointment] = React.useState(null);

    // Filter appointments for today
    const todaysAppointments = appointments.filter(
        apt => apt.date === new Date().toISOString().split('T')[0]
    );

    const pendingReports = labReports.filter(r => r.status === 'Pending');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Section */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name || 'Doctor'}!</h1>
                <p className="text-slate-500">Here's your schedule and activity overview for today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Patients"
                    value={stats.totalPatients}
                    icon={Users}
                    color="bg-blue-500"
                    trend="+4%"
                    chartData={[50, 52, 55, 58, 60, stats.totalPatients]}
                />
                <StatCard
                    title="Appointments Today"
                    value={stats.appointmentsToday}
                    icon={Calendar}
                    color="bg-emerald-500"
                    chartData={[2, 4, 3, 5, 4, stats.appointmentsToday]}
                />
                <StatCard
                    title="Pending Reports"
                    value={stats.pendingReports}
                    icon={FileText}
                    color="bg-amber-500"
                    chartData={[5, 4, 6, 3, 2, stats.pendingReports]}
                />
                <StatCard
                    title="Critical Cases"
                    value={stats.criticalCases}
                    icon={Activity}
                    color="bg-red-500"
                    chartData={[1, 0, 1, 2, 1, stats.criticalCases]}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Appointments List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800">Today's Appointments</h2>
                        <button onClick={() => navigate('/doctor/appointments')} className="text-primary text-sm font-bold flex items-center hover:underline">
                            View Calendar <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {todaysAppointments.length > 0 ? todaysAppointments.map((apt) => (
                                        <tr key={apt.id} className="group hover:bg-slate-50/50 transition-all">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                                                    <Clock className="w-4 h-4 text-slate-400" />
                                                    {apt.time}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-800">
                                                {apt.patient}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-sm font-medium">
                                                {apt.type}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${apt.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    apt.status === 'Waiting' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        'bg-slate-100 text-slate-500 border-slate-200'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${apt.status === 'In Progress' ? 'bg-blue-500 animate-pulse' :
                                                        apt.status === 'Waiting' ? 'bg-amber-500' :
                                                            'bg-slate-400'
                                                        }`}></span>
                                                    {apt.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setSelectedAppointment(apt)}
                                                    className="text-primary text-xs font-bold hover:underline"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                                No appointments for today.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Quick Actions & Notifications */}
                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-slate-800">Actions & Alerts</h2>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <button onClick={() => navigate('/doctor/prescriptions/new')} className="w-full btn-primary flex items-center justify-between py-3">
                            <span className="flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Write Prescription
                            </span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        <button onClick={() => navigate('/doctor/lab-reports')} className="w-full btn-secondary flex items-center justify-between py-3">
                            <span className="flex items-center gap-2">
                                <Activity className="w-4 h-4" /> Review Lab Reports
                            </span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-amber-800 mb-1">Pending Lab Reviews</h3>
                                <p className="text-xs text-amber-700/80 mb-3">You have {pendingReports.length} lab reports waiting for review.</p>
                                <div className="space-y-2">
                                    {pendingReports.map(report => (
                                        <div key={report.id} className="bg-white/60 p-2 rounded-lg text-xs flex justify-between items-center">
                                            <span className="font-bold text-amber-900">{report.patient}</span>
                                            <span className="text-amber-700">{report.test}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Appointment Details Modal */}
            {selectedAppointment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Appointment Details</h2>
                                <p className="text-sm text-slate-500">{selectedAppointment.id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedAppointment(null)}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                    <Users className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">{selectedAppointment.patient}</h3>
                                    <p className="text-slate-500">{selectedAppointment.type}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Time</p>
                                    <div className="flex items-center gap-2 font-bold text-slate-700">
                                        <Clock className="w-4 h-4 text-primary" />
                                        {selectedAppointment.time}
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${selectedAppointment.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                        selectedAppointment.status === 'Waiting' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                            'bg-slate-100 text-slate-500 border-slate-200'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${selectedAppointment.status === 'In Progress' ? 'bg-blue-500' :
                                            selectedAppointment.status === 'Waiting' ? 'bg-amber-500' :
                                                'bg-slate-400'
                                            }`}></span>
                                        {selectedAppointment.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedAppointment(null)}
                                className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => navigate(`/doctor/appointments`)}
                                className="btn-primary px-4 py-2"
                            >
                                Manage in Calendar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;
