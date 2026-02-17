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
    Building2,
    Search,
    ChevronRight
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
    const [searchQuery, setSearchQuery] = useState('');
    const [dashboardData, setDashboardData] = useState({
        doctors: 0,
        patients: 0,
        todayAppointments: 0,
        pendingTokens: 0,
        todayRevenue: 0
    });
    const [recentDoctors, setRecentDoctors] = useState([]);
    const [todayAppointmentsList, setTodayAppointmentsList] = useState([]);

    const fetchDashboardData = useCallback(async (search = '') => {
        try {
            // If search is provided, we don't want the full page loader, just quiet update
            if (!search) setLoading(true);

            const [statsRes, appointmentsRes, doctorsRes] = await Promise.all([
                api.get('/admin/dashboard'),
                api.get(`/admin/appointments?limit=50&search=${search}`),
                api.get('/admin/doctors?limit=5')
            ]);

            setDashboardData(statsRes.data);
            setTodayAppointmentsList(appointmentsRes.data);
            setRecentDoctors(doctorsRes.data);
        } catch (error) {
            console.error('[AdminDashboard] Error fetching data:', error);
            addNotification({
                type: 'error',
                title: 'Data Sync Error',
                message: 'Failed to retrieve real-time hospital records.'
            });
        } finally {
            setLoading(false);
        }
    }, [addNotification]);

    // Initial fetch
    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Debounced search effect
    useEffect(() => {
        if (!searchQuery) {
            // If search is cleared, fetch fresh data once
            fetchDashboardData();
            return;
        }

        const timer = setTimeout(() => {
            fetchDashboardData(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, fetchDashboardData]);

    const handleApprove = async (id, patient) => {
        try {
            await api.put(`/admin/appointments/${id}/approve`);
            setTodayAppointmentsList(prev => prev.map(a => a.id === id ? { ...a, status: 'Scheduled' } : a));
            addNotification({
                type: 'appointment',
                title: 'Clinical Slot Confirmed',
                message: `${patient}'s appointment has been officially scheduled.`
            });
        } catch (error) {
            addNotification({
                type: 'error',
                title: 'Processing Error',
                message: 'Failed to finalize appointment status.'
            });
        }
    };

    const displayAppointments = todayAppointmentsList;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Initializing Command Center...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Executive Overview</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">System Operational • Real-time Intelligence</p>
                    </div>
                </div>
                <div className="hidden lg:flex items-center gap-2 bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                    <button onClick={fetchDashboardData} className="p-2.5 hover:bg-slate-50 text-slate-400 hover:text-primary rounded-xl transition-all active:scale-95 group" title="Refresh Data">
                        <Clock className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                    <div className="w-px h-4 bg-slate-100 mx-1"></div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-3">Last Sync: Just Now</span>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardStat
                    title="Daily Appointments"
                    value={(dashboardData?.todayAppointments || 0).toString()}
                    icon={CalendarCheck}
                    color="bg-sky-500" // Sky Blue
                    trend={12}
                    detail="Scheduled Today"
                    chartData={[15, 25, 20, 35, 28, dashboardData?.todayAppointments || 0]}
                />
                <DashboardStat
                    title="Active Patients"
                    value={(dashboardData?.patients || 0).toString()}
                    icon={Users}
                    color="bg-violet-500" // Violet
                    trend={8}
                    detail="Total Registered"
                    chartData={[850, 920, 900, 1050, 1100, dashboardData?.patients || 0]}
                />
                <DashboardStat
                    title="Daily Revenue"
                    value={`₹${((dashboardData?.todayRevenue || 0) / 1000).toFixed(1)}K`}
                    icon={TrendingUp}
                    color="bg-emerald-500" // Emerald
                    trend={15}
                    detail="Target: ₹2L"
                    chartData={[1.2, 1.5, 1.3, 1.8, 1.6, (dashboardData?.todayRevenue || 0) / 100000]}
                />
                <DashboardStat
                    title="Total Doctors"
                    value={(dashboardData?.doctors || 0).toString()}
                    icon={Stethoscope}
                    color="bg-orange-500" // Orange
                    trend={5}
                    detail="Medical Specialists"
                    chartData={[12, 14, 13, 16, 15, dashboardData?.doctors || 0]}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pending Actions */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-10 relative overflow-hidden group">
                        {/* Background subtle glow */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none group-hover:bg-primary/10 transition-colors duration-1000"></div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Clinical Activity</h2>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1 italic">Recent & Upcoming Schedules</p>
                            </div>
                            <div className="relative group/search">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/search:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search patients, doctors..."
                                    className="h-12 w-full md:w-64 bg-slate-50 border-none rounded-2xl pl-12 pr-6 text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                            {displayAppointments.length > 0 ? displayAppointments.map((appt) => (
                                <div key={appt.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all group/item translate-y-0 hover:-translate-y-0.5">
                                    <div className="flex items-center gap-5">
                                        <div className="relative">
                                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover/item:bg-primary/5 group-hover/item:border-primary/20 transition-all">
                                                <Clock className="w-6 h-6 text-slate-400 group-hover/item:text-primary transition-colors" />
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border border-slate-100 flex items-center justify-center p-0.5">
                                                <div className={cn("w-full h-full rounded-full", appt.status === 'Pending' ? 'bg-amber-400' : 'bg-emerald-400')}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-base font-black text-slate-800 tracking-tight group-hover/item:text-primary transition-colors">{appt.patient || 'Unknown Patient'}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{appt.date} • {appt.time}</span>
                                                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{appt.dept || 'General'}</span>
                                                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                <span className="text-[10px] text-primary/70 font-bold tracking-wider underline decoration-primary/20 underline-offset-4">Dr. {appt.doctor || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                                        <span className={cn(
                                            "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all",
                                            appt.status === 'Scheduled' || appt.status === 'Confirmed' || appt.status === 'Approved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                appt.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100 scale-105 shadow-sm" :
                                                    "bg-slate-50 text-slate-500 border-slate-100"
                                        )}>
                                            {appt.status}
                                        </span>
                                        {appt.status === 'Pending' && (
                                            <button
                                                onClick={() => handleApprove(appt.id, appt.patient)}
                                                className="px-6 py-3 bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white rounded-xl shadow-xl shadow-slate-900/20 hover:bg-emerald-600 hover:shadow-emerald-200 hover:scale-105 active:scale-95 transition-all"
                                            >
                                                Approve Spot
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-20 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-200">
                                        <CalendarCheck className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800 tracking-tight">No Appointments Found</h3>
                                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">{searchQuery ? 'Try matching another name or status' : 'No clinical activities recorded for this period'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Staff Quick View */}
                <div className="space-y-6">
                    <div className="bg-slate-950 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/40">
                        {/* Interactive background particle effect Simulation */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32 animate-pulse group-hover:bg-primary/30 transition-all duration-1000"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] -ml-24 -mb-24 group-hover:bg-blue-500/20 transition-all duration-1000"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-2xl font-black tracking-tight">Staff On-Duty</h2>
                                <div className="p-2 bg-white/5 rounded-xl border border-white/10 group-hover:border-primary/30 transition-all">
                                    <Users className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                                </div>
                            </div>
                            <div className="space-y-8">
                                {recentDoctors.map((doc, i) => (
                                    <div key={i} className="flex items-center justify-between group/row">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-white/10 overflow-hidden shadow-lg group-hover/row:scale-110 transition-transform">
                                                    {doc.image_url ? (
                                                        <img src={`http://localhost:5000/${doc.image_url}`} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-[11px] font-black text-white tracking-widest">{doc.name ? doc.name.split(' ').map(n => n[0]).join('') : 'DR'}</span>
                                                    )}
                                                </div>
                                                <span className={cn(
                                                    "absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950",
                                                    doc.status === 'Active' ? 'bg-emerald-400' : 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                                                )}></span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-black tracking-tight group-hover/row:text-primary transition-colors">{doc.name}</p>
                                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mt-0.5">{doc.dept}</p>
                                            </div>
                                        </div>
                                        <button className="p-2 text-slate-600 hover:text-white transition-colors">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => navigate('/admin/doctors')}
                                className="w-full mt-12 py-5 bg-white shadow-xl shadow-black/20 text-slate-900 hover:bg-primary hover:text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all transform hover:-translate-y-1 active:scale-95"
                            >
                                Intelligence Center
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-primary/10 shadow-lg shadow-primary/5 flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-800 tracking-tight">Specialty Units</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Manage Departments</p>
                            </div>
                        </div>
                        <button onClick={() => navigate('/admin/departments')} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary/5 hover:text-primary transition-all">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
