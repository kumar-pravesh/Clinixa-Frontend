import React, { useState } from 'react';
import {
    FlaskConical,
    Search,
    Filter,
    ArrowRight,
    Upload,
    Clock,
    AlertCircle,
    ChevronDown,
    LayoutGrid,
    List
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useLab } from '../../context/LabContext';

const TestQueue = () => {
    const navigate = useNavigate();
    const { labQueue, updateLabStatus } = useLab();
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    const [filterPriority, setFilterPriority] = useState('All');

    const filteredData = labQueue.filter(item => {
        const matchesSearch = (item.patient?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (item.test_id?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (item.testType?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        const matchesPriority = filterPriority === 'All' || item.priority === filterPriority;
        return matchesSearch && matchesPriority;
    });

    const handleProcessTest = (testId) => {
        updateLabStatus(testId, 'In Progress');
        navigate('/lab/upload');
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Active Test Queue</h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Manage and track live diagnostic requests</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search queue..."
                            className="input-field !pl-12 h-12 bg-white border-slate-200 w-full sm:w-64 shadow-sm rounded-2xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex bg-white/70 backdrop-blur-md border border-white/80 rounded-2xl p-1 shadow-xl shadow-slate-200/50">
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn("p-2.5 rounded-xl transition-all", viewMode === 'list' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-slate-600")}
                        >
                            <List className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn("p-2.5 rounded-xl transition-all", viewMode === 'grid' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-400 hover:text-slate-600")}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center gap-4 bg-white/70 backdrop-blur-md p-5 rounded-[2.5rem] border border-white/80 shadow-xl shadow-slate-200/50">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50/50 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border border-slate-100/50">
                    <Filter className="w-3.5 h-3.5" /> Filter By
                </div>

                <div className="flex gap-2">
                    {['All', 'Urgent', 'Routine'].map((p) => (
                        <button
                            key={p}
                            onClick={() => setFilterPriority(p)}
                            className={cn(
                                "px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border",
                                filterPriority === p
                                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-slate-600 shadow-sm"
                            )}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                <div className="ml-auto hidden lg:flex items-center gap-2 text-slate-400 bg-slate-50/50 px-4 py-2 rounded-xl border border-slate-100/50">
                    <Clock className="w-4 h-4 text-primary/60" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Live Updates Enabled</span>
                </div>
            </div>

            {/* Content Area */}
            {viewMode === 'list' ? (
                <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white/80 shadow-xl shadow-slate-200/50 overflow-hidden min-h-[500px]">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Reference No</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient & Department</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Analysis Type</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredData.length > 0 ? filteredData.map((item) => (
                                    <tr key={item.id} className="group hover:bg-white transition-all duration-300">
                                        <td className="px-8 py-7">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">{item.test_id || item.id}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{item.time}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-500 text-xs shadow-inner group-hover:bg-primary/5 group-hover:text-primary transition-colors uppercase">
                                                    {item.patient?.split(' ').map(n => n[0]).join('') || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-800 tracking-tight leading-none mb-1.5">{item.patient}</p>
                                                    <p className="text-[9px] text-primary font-black uppercase tracking-[0.15em] opacity-70">{item.department}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7">
                                            <div className="flex items-center gap-2.5">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full shadow-sm",
                                                    item.priority === 'STAT' || item.priority === 'Urgent' ? "bg-rose-500 shadow-rose-200 animate-pulse" : "bg-blue-500 shadow-blue-200"
                                                )}></div>
                                                <span className="text-sm font-black text-slate-700 tracking-tight">{item.testType}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
                                                item.status === 'In Progress'
                                                    ? "bg-primary/5 text-primary border-primary/10 shadow-sm shadow-primary/5"
                                                    : "bg-orange-50 text-orange-600 border-orange-100 shadow-sm shadow-orange-50"
                                            )}>
                                                <span className={cn("w-1.5 h-1.5 rounded-full", item.status === 'In Progress' ? "bg-primary animate-pulse" : "bg-orange-500")}></span>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-7 text-right">
                                            <button
                                                onClick={() => handleProcessTest(item.id)}
                                                className={cn(
                                                    "inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all group active:scale-95 border border-transparent",
                                                    item.status === 'In Progress'
                                                        ? "bg-primary text-white shadow-primary/20 hover:bg-primary/90"
                                                        : "bg-slate-900 text-white shadow-slate-900/10 hover:bg-primary"
                                                )}
                                            >
                                                <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                                                {item.status === 'In Progress' ? 'Update' : 'Process'}
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center opacity-30">
                                            <div className="flex flex-col items-center gap-4">
                                                <FlaskConical className="w-16 h-16 text-slate-300" />
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Queue is currently empty</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card Layout */}
                    <div className="md:hidden divide-y divide-slate-100">
                        {filteredData.map((item) => (
                            <div key={item.id} className="p-6 space-y-4 active:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-500 text-sm shadow-inner uppercase">
                                            {item.patient?.split(' ').map(n => n[0]).join('') || '?'}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 tracking-tight leading-none mb-1.5">{item.patient}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.test_id || item.id} • {item.time}</p>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm",
                                        item.priority === 'STAT' || item.priority === 'Urgent' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-blue-50 text-blue-600 border-blue-100"
                                    )}>
                                        {item.priority}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center bg-white/50 backdrop-blur-sm p-5 rounded-3xl border border-white/80 shadow-inner">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em] opacity-80">Department / Type</p>
                                        <p className="text-sm font-black text-slate-800 mt-1">{item.testType}</p>
                                        <p className="text-[9px] text-primary font-black uppercase mt-1 opacity-70 tracking-widest">{item.department}</p>
                                    </div>
                                    <button
                                        onClick={() => handleProcessTest(item.id)}
                                        className={cn(
                                            "w-14 h-14 rounded-3xl shadow-2xl flex items-center justify-center transition-all active:scale-95 border",
                                            item.status === 'In Progress' ? "bg-primary text-white border-primary shadow-primary/30" : "bg-slate-900 text-white border-slate-900 shadow-slate-900/30"
                                        )}
                                    >
                                        <Upload className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 px-1">
                                    <span className={cn(
                                        "w-2 h-2 rounded-full shadow-sm",
                                        item.status === 'In Progress' ? "bg-primary animate-pulse shadow-primary/40" : "bg-orange-500 shadow-orange-400/40"
                                    )}></span>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredData.map((item) => (
                        <div key={item.id} className="bg-white/70 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 transition-all group relative overflow-hidden">
                            <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700", item.priority === 'Urgent' ? "bg-rose-500" : "bg-blue-500")}></div>

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-slate-100 rounded-3xl flex items-center justify-center font-black text-slate-500 text-sm group-hover:bg-primary group-hover:text-white transition-all shadow-inner uppercase">
                                        {item.patient?.split(' ').map(n => n[0]).join('') || '?'}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 tracking-tight leading-none mb-1.5">{item.patient}</h3>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em]">{item.test_id || item.id}</p>
                                    </div>
                                </div>
                                <span className={cn(
                                    "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm",
                                    item.priority === 'STAT' || item.priority === 'Urgent' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-blue-50 text-blue-600 border-blue-100"
                                )}>
                                    {item.priority}
                                </span>
                            </div>

                            <div className="bg-slate-50/50 p-5 rounded-3xl mb-8 space-y-3 border border-slate-100 group-hover:bg-white transition-colors relative z-10">
                                <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    <span>Analysis Required</span>
                                    <FlaskConical className="w-3.5 h-3.5 text-primary/40" />
                                </div>
                                <p className="text-sm font-black text-slate-800 tracking-tight">{item.testType}</p>
                                <p className="text-[10px] text-primary font-black uppercase tracking-widest opacity-60">{item.department}</p>
                            </div>

                            <div className="flex items-center justify-between gap-5 relative z-10">
                                <div className="flex flex-col">
                                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.15em] mb-1">Waiting time</span>
                                    <span className="text-xs font-black text-slate-800 tracking-widest">{item.time}</span>
                                </div>
                                <button
                                    onClick={() => handleProcessTest(item.id)}
                                    className={cn(
                                        "flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all group active:scale-95 flex items-center justify-center gap-2.5 border border-transparent",
                                        item.status === 'In Progress'
                                            ? "bg-primary text-white shadow-primary/30"
                                            : "bg-slate-900 text-white shadow-slate-900/30 hover:bg-primary"
                                    )}
                                >
                                    <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                                    {item.status === 'In Progress' ? 'Continue' : 'Start'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {filteredData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 bg-white/40 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-slate-200 animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-xl shadow-slate-200/50 text-slate-200">
                        <Search className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">No results matching search</h3>
                    <p className="text-sm text-slate-400 font-black uppercase tracking-[0.1em]">Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
};

export default TestQueue;
