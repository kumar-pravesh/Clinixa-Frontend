import React, { useState } from 'react';
import {
    FlaskConical,
    Users,
    CheckCircle2,
    Clock,
    Search,
    Filter,
    ArrowRight,
    Upload,
    MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useLab } from '../../context/LabContext';

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
    const IconComponent = Icon;

    return (
        <div className="dashboard-card group hover:border-primary/30 transition-all cursor-default">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${color} text-white shadow-lg`}>
                    <IconComponent className="w-6 h-6" />
                </div>
                {trend && (
                    <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {trend}
                    </span>
                )}
            </div>
            <p className="text-slate-500 text-sm font-medium tracking-wide">{title}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{value}</h3>
        </div>
    );
};

const LabDashboard = () => {
    const navigate = useNavigate();
    const { labQueue, updateLabStatus } = useLab();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredQueue = labQueue.filter(item =>
        item.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.test.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleProcessTest = (testId) => {
        updateLabStatus(testId, 'In Progress');
        navigate('/lab/upload');
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lab Operations</h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Real-time diagnostics & report management</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by ID or Patient..."
                            className="input-field !pl-10 h-11 bg-white border-slate-200 w-full lg:w-64 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Pending Tests"
                    value={labQueue.filter(t => t.status === 'Pending').length.toString()}
                    icon={Clock}
                    color="bg-orange-500"
                    trend="+new"
                />
                <StatCard
                    title="In Analysis"
                    value={labQueue.filter(t => t.status === 'In Progress').length.toString().padStart(2, '0')}
                    icon={FlaskConical}
                    color="bg-primary"
                />
                <StatCard
                    title="Completed Today"
                    value="28"
                    icon={CheckCircle2}
                    color="bg-emerald-500"
                    trend="+12%"
                />
                <StatCard
                    title="Total Patients"
                    value="45"
                    icon={Users}
                    color="bg-slate-800"
                />
            </div>

            {/* Main Content Area */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase text-xs">Test Execution Queue</h2>
                    <button
                        onClick={() => navigate('/lab/queue')}
                        className="text-primary text-sm font-bold flex items-center hover:underline gap-1 transition-all hover:gap-2"
                    >
                        View Full Queue <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm transition-all duration-300">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto overflow-y-hidden">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">ID</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Patient Details</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Required Test</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Priority</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredQueue.map((test) => (
                                    <tr key={test.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-black text-slate-900 tracking-tight">{test.id}</span>
                                            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{test.time}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-500 text-xs shadow-inner">
                                                    {test.patient.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="font-black text-slate-800 tracking-tight">{test.patient}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-slate-700">{test.test}</p>
                                            <p className={cn(
                                                "text-[9px] font-black uppercase tracking-widest mt-0.5",
                                                test.status === 'In Progress' ? "text-primary animate-pulse" : "text-slate-400"
                                            )}>{test.status}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                                test.priority === 'Urgent' ? "bg-red-50 text-red-600 border border-red-50" : "bg-blue-50 text-blue-600 border border-blue-50"
                                            )}>
                                                {test.priority}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => handleProcessTest(test.id)}
                                                className={cn(
                                                    "inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black shadow-lg transition-all active:scale-95 group",
                                                    test.status === 'In Progress'
                                                        ? "bg-primary text-white shadow-primary/20"
                                                        : "bg-slate-900 text-white shadow-slate-900/10 hover:bg-primary"
                                                )}
                                            >
                                                <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                                                {test.status === 'In Progress' ? 'Update' : 'Process'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-slate-100">
                        {filteredQueue.map((test) => (
                            <div key={test.id} className="p-6 space-y-4 active:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-500 text-xs shadow-inner">
                                            {test.patient.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 tracking-tight">{test.patient}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{test.id} • {test.time}</p>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider",
                                        test.priority === 'Urgent' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                                    )}>
                                        {test.priority}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em]">Test Type</p>
                                        <p className="text-xs font-black text-slate-700 mt-0.5">{test.test}</p>
                                    </div>
                                    <button
                                        onClick={() => handleProcessTest(test.id)}
                                        className={cn(
                                            "p-3 rounded-xl shadow-lg transition-all active:scale-90",
                                            test.status === 'In Progress' ? "bg-primary text-white" : "bg-slate-900 text-white"
                                        )}
                                    >
                                        <Upload className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabDashboard;
