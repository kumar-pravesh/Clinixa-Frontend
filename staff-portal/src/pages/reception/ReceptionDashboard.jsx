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
    Plus
} from 'lucide-react';
import { cn } from '../../utils/cn';

import { SimpleChart } from '../../components/common/SimpleChart';

const StatCard = ({ title, value, icon: Icon, color, trend, chartData }) => {
    const IconComponent = Icon;

    return (
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-white/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all group overflow-hidden relative cursor-default">
            <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700", color)}></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={cn("p-3.5 rounded-2xl text-white shadow-lg shadow-primary/20", color)}>
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
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [recentTokens, setRecentTokens] = useState([
        { id: 'TK-1024', patient: 'John Doe', dept: 'General Medicine', status: 'Waiting', time: '10:30 AM' },
        { id: 'TK-1025', patient: 'Emma Wilson', dept: 'Pediatrics', status: 'In Progress', time: '10:35 AM' },
        { id: 'TK-1026', patient: 'Robert Brown', dept: 'Dentistry', status: 'Waiting', time: '10:45 AM' },
    ]);

    const handleGenerateToken = (data) => {
        const newToken = {
            id: `TK-${1024 + recentTokens.length}`,
            patient: data.patient,
            dept: data.dept,
            status: 'Waiting',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setRecentTokens([newToken, ...recentTokens]);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Section */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Welcome back, Sarah!</h1>
                <p className="text-slate-500">Here's what's happening at the reception today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="New Registrations"
                    value="24"
                    icon={Users}
                    color="bg-primary"
                    trend="+12%"
                    chartData={[10, 15, 12, 18, 20, 24]}
                />
                <StatCard
                    title="Active Queue"
                    value="18"
                    icon={Ticket}
                    color="bg-secondary text-slate-800"
                    chartData={[5, 8, 12, 15, 18, 18]}
                />
                <StatCard
                    title="Avg. Waiting Time"
                    value="15 min"
                    icon={Clock}
                    color="bg-accent"
                    chartData={[20, 18, 16, 15, 14, 15]}
                />
                <StatCard
                    title="Revenue (Today)"
                    value="₹12,450"
                    icon={TrendingUp}
                    color="bg-slate-800"
                    trend="+5%"
                    chartData={[5000, 7000, 8500, 10000, 11000, 12450]}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800">Queue Activity</h2>
                        <button className="text-primary text-sm font-bold flex items-center hover:underline">
                            View All <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="bg-white/60 backdrop-blur-md rounded-[2rem] border border-white/50 shadow-sm overflow-hidden">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Token ID</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Details</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentTokens.map((token) => (
                                        <tr key={token.id} className="group hover:bg-slate-50/50 transition-all">
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-black text-slate-900 tracking-tight">{token.id}</span>
                                                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{token.time}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="font-black text-slate-800 tracking-tight">{token.patient}</p>
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Ref: PID-9920</p>
                                            </td>
                                            <td className="px-8 py-6 text-slate-500 font-bold text-sm">
                                                {token.dept}
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                    token.status === 'In Progress'
                                                        ? "bg-blue-50 text-blue-600 border border-blue-100"
                                                        : "bg-orange-50 text-orange-600 border border-orange-100"
                                                )}>
                                                    <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", token.status === 'In Progress' ? "bg-blue-500" : "bg-orange-500")}></span>
                                                    {token.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/30 transition-all hover:bg-primary/5 shadow-sm group">
                                                    <MoreHorizontal className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
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
                                                <span className="text-sm font-black text-slate-900 tracking-tight">{token.id}</span>
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border",
                                                    token.status === 'In Progress' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-orange-50 text-orange-600 border-orange-100"
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
                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-slate-800">Quick Actions</h2>
                    <div className="space-y-3">
                        <button onClick={() => navigate('/reception/register')} className="w-full btn-primary flex items-center justify-between py-4 group">
                            <span className="flex items-center gap-3">
                                <UserPlus className="w-5 h-5" /> Register New Patient
                            </span>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <button onClick={() => setIsModalOpen(true)} className="w-full btn-secondary flex items-center justify-between py-4 group">
                            <span className="flex items-center gap-3">
                                <Ticket className="w-5 h-5" /> Generate Token
                            </span>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <button onClick={() => navigate('/reception/billing')} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium px-4 border border-slate-700 flex items-center justify-between py-4 group rounded-lg">
                            <span className="flex items-center gap-3">
                                <CreditCard className="w-5 h-5" /> Process Billing
                            </span>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>

                    <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <h3 className="font-bold text-primary mb-2 relative z-10">Notice Board</h3>
                        <p className="text-sm text-slate-600 leading-relaxed relative z-10">
                            Dr. Miller will be unavailable from 2:00 PM today. Please reschedule all remaining appointments.
                        </p>
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
