import React, { useState, useEffect, useCallback } from 'react';
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
    Building2
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNotification } from '../../context/NotificationContext';
import { SimpleChart } from '../../components/common/SimpleChart';
import api from '../../api/axios';

const DashboardStat = ({ title, value, icon: Icon, color, trend, detail, chartData }) => {
    const IconComponent = Icon;

    return (
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-white/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all group overflow-hidden relative">
            <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700", color)}></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={cn("p-3.5 rounded-2xl text-white shadow-lg shadow-primary/20", color)}>
                    <IconComponent className="w-5 h-5" />
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
                <div className="flex justify-between items-end">
                    <div>
                        <h3 className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-1">{title}</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-900 tracking-tighter">{value}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-400 mt-1 block">{detail}</span>
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

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        doctors: 0,
        patients: 0,
        todayAppointments: 0,
        pendingTokens: 0,
        todayRevenue: 0
    });
    const [recentDoctors, setRecentDoctors] = useState([]);
    const [todayAppointmentsList, setTodayAppointmentsList] = useState([]);

    const fetchDashboardData = useCallback(async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const [statsRes, appointmentsRes, doctorsRes] = await Promise.all([
                api.get('/admin/dashboard'),
                api.get(`/admin/appointments?date=${today}&limit=10`),
                api.get('/admin/doctors?limit=3')
            ]);

            console.log('[AdminDashboard] Data fetched successfully:', {
                stats: statsRes.data,
                appointments: appointmentsRes.data.length,
                doctors: doctorsRes.data.length
            });

            setDashboardData(statsRes.data);
            setTodayAppointmentsList(appointmentsRes.data);
            setRecentDoctors(doctorsRes.data.slice(0, 3));
        } catch (error) {
            console.error('[AdminDashboard] Error fetching data:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            addNotification({
                type: 'error',
                title: 'Data Load Error',
                message: error.response?.data?.message || error.message || 'Failed to load dashboard data'
            });
        } finally {
            setLoading(false);
        }
    }, [addNotification]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleApprove = async (id, patient) => {
        try {
            await api.put(`/admin/appointments/${id}/approve`);
            setTodayAppointmentsList(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
            addNotification({
                type: 'appointment',
                title: 'Appointment Approved',
                message: `Appointment for ${patient} has been successfully approved.`
            });
        } catch (error) {
            addNotification({
                type: 'error',
                title: 'Approval Failed',
                message: error.response?.data?.message || 'Failed to approve appointment'
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

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
                    value={(dashboardData?.todayAppointments || 0).toString()}
                    icon={CalendarCheck}
                    color="bg-sky-500"
                    trend={12}
                    detail="Scheduled Today"
                    chartData={[10, 25, 18, 30, 22, dashboardData?.todayAppointments || 0]}
                />
                <DashboardStat
                    title="Active Patients"
                    value={(dashboardData?.patients || 0).toString()}
                    icon={Users}
                    color="bg-violet-500"
                    trend={8}
                    detail="Total Registered"
                    chartData={[800, 900, 950, 1100, 1150, dashboardData?.patients || 0]}
                />
                <DashboardStat
                    title="Daily Revenue"
                    value={`₹${((dashboardData?.todayRevenue || 0) / 1000).toFixed(1)}K`}
                    icon={TrendingUp}
                    color="bg-emerald-500"
                    trend={15}
                    detail="Target: ₹2L"
                    chartData={[1.2, 1.3, 1.5, 1.4, 1.6, (dashboardData?.todayRevenue || 0) / 100000]}
                />
                <DashboardStat
                    title="Total Doctors"
                    value={(dashboardData?.doctors || 0).toString()}
                    icon={Stethoscope}
                    color="bg-orange-500"
                    trend={5}
                    detail="Medical Staff"
                    chartData={[10, 12, 14, 15, 16, dashboardData?.doctors || 0]}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pending Actions */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-lg font-black text-slate-800">Today's Appointments</h2>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Clinical schedule for {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <button
                                onClick={() => navigate('/admin/appointments')}
                                className="p-3 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
                            >
                                <CalendarCheck className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {todayAppointmentsList.length > 0 ? todayAppointmentsList.map((appt) => (
                                <div key={appt.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-3xl border border-transparent hover:border-slate-100 hover:bg-white transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:text-primary transition-colors text-slate-400"
                                        )}>
                                            <Clock className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800 tracking-tight">{appt.patient}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{appt.time} • {appt.dept} • {appt.doctor}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className={cn(
                                            "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border mr-2",
                                            appt.status === 'Approved' || appt.status === 'Confirmed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                appt.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                    "bg-slate-50 text-slate-500 border-slate-100"
                                        )}>
                                            {appt.status}
                                        </span>
                                        {appt.status === 'Pending' && (
                                            <button
                                                onClick={() => handleApprove(appt.id, appt.patient)}
                                                className="px-5 py-2.5 bg-emerald-500 text-[10px] font-black uppercase tracking-widest text-white rounded-xl shadow-lg shadow-emerald-200 hover:scale-105 active:scale-95 transition-all"
                                            >
                                                Approve
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10">
                                    <p className="text-slate-400 font-bold italic text-sm">No clinical sessions scheduled for today.</p>
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
                                {recentDoctors.map((doc, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black border border-slate-700">
                                                {doc.name ? doc.name.split(' ').map(n => n[0]).join('') : '??'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold tracking-tight">{doc.name}</p>
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{doc.dept}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={cn("w-2 h-2 rounded-full animate-pulse", doc.status === 'Active' ? 'bg-emerald-400' : 'bg-amber-400')}></span>
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

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
