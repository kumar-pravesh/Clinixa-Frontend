import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenerateTokenModal } from './TokenManagement';
import {
    Users,
    Ticket,
    Clock,
    TrendingUp,
    MoreHorizontal,
    ChevronRight,
    UserPlus,
    CreditCard,
    Plus,
    Calendar
} from 'lucide-react';
import { cn } from '../../utils/cn';

import { SimpleChart } from '../../components/common/SimpleChart';

import { useQueue } from '../../context/QueueContext';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ title, value, icon: Icon, color, trend, chartData }) => {
    const IconComponent = Icon;

    return (
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all group overflow-hidden relative cursor-default">
            <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-[0.05] group-hover:scale-150 transition-transform duration-700", color)}></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={cn("p-4 rounded-2xl text-white shadow-lg", color)}>
                    <IconComponent className="w-5 h-5" />
                </div>
                {trend && (
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                        <TrendingUp className="w-3 h-3" />
                        {trend}
                    </span>
                )}
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] mb-1 opacity-80">{title}</p>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
                    </div>
                    {chartData && (
                        <div className="w-24 h-12 -mb-2 opacity-50 group-hover:opacity-100 transition-opacity">
                            <SimpleChart data={chartData} color={color.replace('bg-', 'text-').replace('text-slate-800', 'text-slate-600')} height={40} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ReceptionDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { tokens, stats, generateToken } = useQueue();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const recentTokens = tokens.slice(0, 5);

    const handleGenerateToken = async (data) => {
        try {
            await generateToken(data);
        } catch (err) {
            console.error('Error generating token from dashboard:', err);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Welcome back, <span className="text-primary">{user?.name?.split(' ')[0] || 'Receptionist'}!</span>
                    </h1>
                    <p className="text-slate-500 font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary/60" />
                        Here's what's happening at the reception today.
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-3 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/80 shadow-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-slate-700">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="New Registrations"
                    value={stats.newRegistrations}
                    icon={Users}
                    color="bg-primary shadow-primary/20"
                    trend="+12%"
                    chartData={[10, 15, 12, 18, 20, stats.newRegistrations || 24]}
                />
                <StatCard
                    title="Active Queue"
                    value={stats.activeQueue}
                    icon={Ticket}
                    color="bg-blue-600 shadow-blue-500/20"
                    chartData={[5, 8, 12, 15, 18, stats.activeQueue || 18]}
                />
                <StatCard
                    title="Avg. Waiting Time"
                    value={`${stats.avgWaitingTime} min`}
                    icon={Clock}
                    color="bg-amber-500 shadow-amber-500/20"
                    chartData={[20, 18, 16, 15, 14, stats.avgWaitingTime || 15]}
                />
                <StatCard
                    title="Revenue (Today)"
                    value={`₹${stats.revenueToday.toLocaleString()}`}
                    icon={TrendingUp}
                    color="bg-slate-900 shadow-slate-900/20"
                    trend="+5%"
                    chartData={[5000, 7000, 8500, 10000, 11000, stats.revenueToday || 12450]}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Queue Activity</h2>
                        </div>
                        <button onClick={() => navigate('/reception/tokens')} className="group text-primary text-sm font-black flex items-center gap-1 hover:gap-2 transition-all">
                            View All <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>

                    <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white/80 shadow-xl shadow-slate-200/50 overflow-hidden">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Token ID</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Details</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Department</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentTokens.length > 0 ? recentTokens.map((token) => (
                                        <tr key={token.id} className="group hover:bg-white transition-all duration-300 cursor-default">
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">{token.token_number || token.id}</span>
                                                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{token.time}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="font-black text-slate-800 tracking-tight">{token.patient}</p>
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{token.patientId || `PID-${token.patient_id}`}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-slate-500 font-bold text-sm bg-slate-100/50 px-3 py-1 rounded-lg">
                                                    {token.dept}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
                                                    token.status === 'In Progress'
                                                        ? "bg-blue-50 text-blue-600 border-blue-100 shadow-sm shadow-blue-100"
                                                        : "bg-amber-50 text-amber-600 border-amber-100 shadow-sm shadow-amber-100"
                                                )}>
                                                    <span className={cn("w-1.5 h-1.5 rounded-full", token.status === 'In Progress' ? "bg-blue-500 animate-pulse" : "bg-amber-500")}></span>
                                                    {token.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => navigate('/reception/tokens')}
                                                    className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all active:scale-95"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-16 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-300">
                                                        <Ticket className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">No active tokens</p>
                                                        <p className="text-sm text-slate-400">Queue is empty</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-slate-100">
                            {recentTokens.map((token) => (
                                <div key={token.id} className="p-6 space-y-4 active:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-black text-slate-900 tracking-tight">{token.token_number || token.id}</span>
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border",
                                                    token.status === 'In Progress' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                                )}>{token.status}</span>
                                            </div>
                                            <h4 className="font-black text-slate-800 tracking-tight leading-none">{token.patient}</h4>
                                        </div>
                                        <button className="p-2.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-100">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px]">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-slate-400 font-bold uppercase tracking-widest">Department</span>
                                            <span className="font-black text-slate-700">{token.dept}</span>
                                        </div>
                                        <div className="text-right flex flex-col gap-1">
                                            <span className="text-slate-400 font-bold uppercase tracking-widest">Arrival</span>
                                            <span className="font-black text-slate-700">{token.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Quick Actions</h2>
                    </div>

                    <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/80 shadow-xl shadow-slate-200/50 space-y-4">
                        <button onClick={() => navigate('/reception/register')} className="w-full group bg-primary hover:bg-primary-dark text-white p-4 rounded-2xl flex items-center justify-between transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20">
                            <span className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                    <UserPlus className="w-5 h-5" />
                                </div>
                                <span className="font-bold">Register Patient</span>
                            </span>
                            <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>

                        <button onClick={() => setIsModalOpen(true)} className="w-full group bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl flex items-center justify-between transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20">
                            <span className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                    <Ticket className="w-5 h-5" />
                                </div>
                                <span className="font-bold">Generate Token</span>
                            </span>
                            <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>

                        <button onClick={() => navigate('/reception/billing')} className="w-full group bg-slate-900 hover:bg-black text-white p-4 rounded-2xl flex items-center justify-between transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/20">
                            <span className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <span className="font-bold">Process Billing</span>
                            </span>
                            <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                    </div>

                    <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-3">Notice Board</h3>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                Dr. Miller will be unavailable from 2:00 PM today. Please reschedule all remaining appointments for tomorrow.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <GenerateTokenModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onGenerate={handleGenerateToken}
            />
        </div>
    );
};

export default ReceptionDashboard;
