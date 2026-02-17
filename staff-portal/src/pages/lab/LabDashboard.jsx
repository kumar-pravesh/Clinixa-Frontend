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
    MoreVertical,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useLab } from '../../context/LabContext';

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
                </div>
            </div>
        </div>
    );
};

const LabDashboard = () => {
    const navigate = useNavigate();
    const { labQueue, loading, error, updateLabStatus } = useLab();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredQueue = labQueue.filter(item =>
        (item.patient?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (item.test_id?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (item.testType?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    const handleProcessTest = (testId) => {
        updateLabStatus(testId, 'In Progress');
        navigate('/lab/upload');
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Loading Dashboard Data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-100 p-8 rounded-[2.5rem] text-center">
                <p className="text-red-600 font-bold">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 btn-secondary text-xs py-2">Try Again</button>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lab Operations</h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Real-time diagnostics & report management</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by ID or Patient..."
                            className="input-field !pl-12 h-12 bg-white border-slate-200 w-full lg:w-80 shadow-sm rounded-2xl"
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
                    color="bg-orange-500 shadow-orange-500/20"
                    trend={labQueue.filter(t => t.status === 'Pending').length > 0 ? "+new" : null}
                />
                <StatCard
                    title="In Analysis"
                    value={labQueue.filter(t => t.status === 'In Progress').length.toString()}
                    icon={FlaskConical}
                    color="bg-primary shadow-primary/20"
                />
                <StatCard
                    title="Completed Today"
                    value="--"
                    icon={CheckCircle2}
                    color="bg-emerald-500 shadow-emerald-500/20"
                />
                <StatCard
                    title="Queue Depth"
                    value={labQueue.length.toString()}
                    icon={Users}
                    color="bg-slate-900 shadow-slate-900/20"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Queue Table */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Test Execution Queue</h2>
                        </div>
                        <button
                            onClick={() => navigate('/lab/queue')}
                            className="group text-primary text-sm font-black flex items-center gap-1 hover:gap-2 transition-all"
                        >
                            View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>

                    <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white/80 shadow-xl shadow-slate-200/50 overflow-hidden min-h-[400px]">
                        {filteredQueue.length > 0 ? (
                            <>
                                {/* Desktop Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Reference</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Details</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {filteredQueue.map((test) => (
                                                <tr key={test.id} className="group hover:bg-white transition-all duration-300">
                                                    <td className="px-8 py-6">
                                                        <span className="text-sm font-black text-slate-900 tracking-tight">{test.test_id}</span>
                                                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{test.time}</p>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-500 text-xs shadow-inner uppercase">
                                                                {test.patient?.split(' ').map(n => n[0]).join('') || '?'}
                                                            </div>
                                                            <div>
                                                                <span className="font-black text-slate-800 tracking-tight block">{test.patient}</span>
                                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{test.testType}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={cn(
                                                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
                                                            test.status === 'In Progress'
                                                                ? "bg-primary/5 text-primary border-primary/10"
                                                                : test.priority === 'STAT' || test.priority === 'Urgent'
                                                                    ? "bg-rose-50 text-rose-600 border-rose-100 shadow-sm shadow-rose-100"
                                                                    : "bg-amber-50 text-amber-600 border-amber-100 shadow-sm shadow-amber-100"
                                                        )}>
                                                            <span className={cn("w-1.5 h-1.5 rounded-full", test.status === 'In Progress' ? "bg-primary animate-pulse" : test.priority === 'STAT' || test.priority === 'Urgent' ? "bg-rose-500" : "bg-amber-500")}></span>
                                                            {test.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button
                                                            onClick={() => handleProcessTest(test.id)}
                                                            className={cn(
                                                                "p-3 rounded-xl transition-all active:scale-95 group shadow-sm border border-transparent",
                                                                test.status === 'In Progress'
                                                                    ? "bg-primary text-white shadow-primary/20"
                                                                    : "bg-slate-50 text-slate-400 hover:text-primary hover:border-primary/20 hover:bg-primary/5"
                                                            )}
                                                        >
                                                            <Upload className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="md:hidden divide-y divide-slate-100">
                                    {filteredQueue.map((test) => (
                                        <div key={test.id} className="p-6 space-y-4 active:bg-slate-50 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-500 text-xs shadow-inner uppercase">
                                                        {test.patient?.split(' ').map(n => n[0]).join('') || '?'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-slate-900 tracking-tight">{test.patient}</h4>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{test.test_id} • {test.time}</p>
                                                    </div>
                                                </div>
                                                <span className={cn(
                                                    "px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider",
                                                    test.priority === 'STAT' || test.priority === 'Urgent' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                                                )}>
                                                    {test.priority}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                <div>
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em]">Test Type</p>
                                                    <p className="text-xs font-black text-slate-700 mt-0.5">{test.testType}</p>
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
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-20 text-center opacity-30">
                                <FlaskConical className="w-20 h-20 mb-6 text-slate-300" />
                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No matching tests in queue</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Actions & Alerts */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Quick Actions</h2>
                    </div>

                    <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/80 shadow-xl shadow-slate-200/50 space-y-4">
                        <button onClick={() => navigate('/lab/queue')} className="w-full group bg-primary hover:bg-primary-dark text-white p-4 rounded-2xl flex items-center justify-between transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20">
                            <span className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <span className="font-bold">Test Queue</span>
                            </span>
                            <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>

                        <button onClick={() => navigate('/lab/upload')} className="w-full group bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl flex items-center justify-between transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20">
                            <span className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                    <Upload className="w-5 h-5" />
                                </div>
                                <span className="font-bold">Upload Reports</span>
                            </span>
                            <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>

                        <button onClick={() => navigate('/lab/history')} className="w-full group bg-slate-900 hover:bg-black text-white p-4 rounded-2xl flex items-center justify-between transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/20">
                            <span className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <span className="font-bold">Lab History</span>
                            </span>
                            <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                    </div>

                    <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-3">Facility Notice</h3>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                Calibration of Hematology Analyzer is scheduled for 4:00 PM today. Please complete all pending blood counts before then.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabDashboard;
