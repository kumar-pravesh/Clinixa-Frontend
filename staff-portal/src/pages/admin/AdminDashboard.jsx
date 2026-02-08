import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    CalendarCheck,
    Users,
    TrendingUp,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Stethoscope,
    Building2,
    CheckCircle2
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNotification } from '../../context/NotificationContext';

const DashboardStat = ({ title, value, icon: Icon, color, trend, detail }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-primary/20 transition-all group overflow-hidden relative">
        <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700", color)}></div>

        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={cn("p-4 rounded-2xl text-white shadow-lg", color)}>
                <Icon className="w-6 h-6" />
            </div>
            {trend && (
                <div className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                    trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>
                    {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>

        <div className="relative z-10">
            <h3 className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-1">{title}</h3>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 tracking-tighter">{value}</span>
                <span className="text-xs font-bold text-slate-400">{detail}</span>
            </div>
        </div>
    </div>
);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const [alerts, setAlerts] = useState([
        { id: 1, type: 'New Appointment', patient: 'Rahul Sharma', dept: 'Cardiology', time: '10:30 AM' },
        { id: 2, type: 'New Appointment', patient: 'Nisha Verma', dept: 'Pediatrics', time: '11:45 AM' },
        { id: 3, type: 'Emergency Alert', patient: 'Tejas Kumar', dept: 'Surgery', time: 'ASAP' },
    ]);

    const handleApprove = (id, patient) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
        addNotification({
            type: 'appointment',
            title: 'Appointment Approved',
            message: `Appointment for ${patient} has been successfully approved.`
        });
    };

    const handleReschedule = (id, patient) => {
        // Simple mock behavior: moves it to a "later" state or just notifies
        addNotification({
            type: 'appointment',
            title: 'Reschedule Requested',
            message: `Reschedule request sent to ${patient}.`
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Overview</h1>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Real-time Hospital Command Center</p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardStat
                    title="Daily Appointments"
                    value="42"
                    icon={CalendarCheck}
                    color="bg-sky-500"
                    trend={12}
                    detail="Scheduled Today"
                />
                <DashboardStat
                    title="Active Patients"
                    value="1.2k"
                    icon={Users}
                    color="bg-violet-500"
                    trend={8}
                    detail="This Month"
                />
                <DashboardStat
                    title="Daily Revenue"
                    value="₹1.8L"
                    icon={TrendingUp}
                    color="bg-emerald-500"
                    trend={15}
                    detail="Target: ₹2L"
                />
                <DashboardStat
                    title="Pending Dues"
                    value="₹45k"
                    icon={CreditCard}
                    color="bg-orange-500"
                    trend={-5}
                    detail="12 Invoices"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pending Actions */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-lg font-black text-slate-800">Critical Alerts</h2>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Requires your immediate approval</p>
                            </div>
                            <button className="p-3 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all">
                                <Clock className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {alerts.length > 0 ? alerts.map((alert) => (
                                <div key={alert.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-3xl border border-transparent hover:border-slate-100 hover:bg-white transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:text-amber-500 transition-colors",
                                            alert.dept === 'Surgery' ? 'text-red-500' : 'text-slate-400'
                                        )}>
                                            <CalendarCheck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800 tracking-tight">{alert.type}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Patient: {alert.patient} • Dept: {alert.dept}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleReschedule(alert.id, alert.patient)}
                                            className="px-5 py-2.5 bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 rounded-xl hover:bg-slate-50 transition-all"
                                        >
                                            Reschedule
                                        </button>
                                        <button
                                            onClick={() => handleApprove(alert.id, alert.patient)}
                                            className="px-5 py-2.5 bg-emerald-500 text-[10px] font-black uppercase tracking-widest text-white rounded-xl shadow-lg shadow-emerald-200 hover:scale-105 active:scale-95 transition-all"
                                        >
                                            Approve
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10">
                                    <p className="text-slate-400 font-bold italic text-sm">All clear! No pending alerts.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Staff Quick View */}
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h2 className="text-lg font-black tracking-tight mb-6">Staff Availability</h2>
                            <div className="space-y-6">
                                {[
                                    { name: "Dr. Arun Kumar", dept: "Cardiology", status: "Active", color: "bg-emerald-400" },
                                    { name: "Dr. Sarah Paul", dept: "Pediatrics", status: "On Leave", color: "bg-amber-400" },
                                    { name: "Dr. James Bond", dept: "Surgery", status: "In Surgery", color: "bg-sky-400" },
                                ].map((doc, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black border border-slate-700">
                                                {doc.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold tracking-tight">{doc.name}</p>
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{doc.dept}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={cn("w-2 h-2 rounded-full animate-pulse", doc.color)}></span>
                                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">{doc.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => navigate('/admin/doctors')}
                                className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all"
                            >
                                Manage All Doctors
                            </button>
                        </div>
                        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 text-center">
                        <div className="w-16 h-16 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-4 text-primary">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-sm font-black text-slate-800">System Pulse</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">All modules functional</p>
                        <div className="mt-6 flex justify-center gap-4">
                            <div className="text-center">
                                <p className="text-xl font-black text-slate-900 tracking-tighter">98%</p>
                                <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">Uptime</p>
                            </div>
                            <div className="w-px h-8 bg-slate-100"></div>
                            <div className="text-center">
                                <p className="text-xl font-black text-slate-900 tracking-tighter">2ms</p>
                                <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">Latency</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
