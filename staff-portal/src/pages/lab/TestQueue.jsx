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
        const matchesSearch = item.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.test.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = filterPriority === 'All' || item.priority === filterPriority;
        return matchesSearch && matchesPriority;
    });

    const handleProcessTest = (testId) => {
        updateLabStatus(testId, 'In Progress');
        navigate('/lab/upload');
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Active Test Queue</h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Manage and track live diagnostic requests</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search queue..."
                            className="input-field !pl-10 h-11 bg-white border-slate-200 w-full sm:w-64 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-400 hover:text-slate-600")}
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-primary text-white shadow-md shadow-primary/20" : "text-slate-400 hover:text-slate-600")}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-black text-slate-500 uppercase tracking-widest border border-slate-100">
                    <Filter className="w-3.5 h-3.5" /> Filter By
                </div>

                <div className="flex gap-2">
                    {['All', 'Urgent', 'Routine'].map((p) => (
                        <button
                            key={p}
                            onClick={() => setFilterPriority(p)}
                            className={cn(
                                "px-4 py-1.5 rounded-xl text-xs font-bold transition-all border",
                                filterPriority === p
                                    ? "bg-primary/10 border-primary/20 text-primary shadow-sm"
                                    : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                            )}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                <div className="ml-auto hidden lg:flex items-center gap-2 text-slate-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Last Updated: Just Now</span>
                </div>
            </div>

            {/* Content Area */}
            {viewMode === 'list' ? (
                <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Test ID</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient & Dept</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Analysis Type</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredData.map((item) => (
                                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900 tracking-tight">{item.id}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">{item.time}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-500 text-xs border border-slate-200 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all">
                                                    {item.patient.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-800 tracking-tight leading-none mb-1">{item.patient}</p>
                                                    <p className="text-[10px] text-primary font-black uppercase tracking-wider">{item.department}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    item.priority === 'Urgent' ? "bg-red-500" : "bg-blue-500"
                                                )}></span>
                                                <span className="text-sm font-bold text-slate-700">{item.test}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                                                item.status === 'In Progress'
                                                    ? "bg-blue-50 text-blue-600 border-blue-100 animate-pulse"
                                                    : "bg-orange-50 text-orange-600 border-orange-100"
                                            )}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => handleProcessTest(item.id)}
                                                className={cn(
                                                    "inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black shadow-lg shadow-slate-900/10 transition-all group active:scale-95",
                                                    item.status === 'In Progress' ? "bg-primary text-white" : "bg-slate-900 text-white hover:bg-primary"
                                                )}
                                            >
                                                <Upload className="w-4 h-4" />
                                                {item.status === 'In Progress' ? 'Update' : 'Process'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card Layout */}
                    <div className="md:hidden divide-y divide-slate-100">
                        {filteredData.map((item) => (
                            <div key={item.id} className="p-6 space-y-4 active:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-500 text-xs shadow-inner">
                                            {item.patient.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 tracking-tight leading-none mb-1">{item.patient}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{item.id} • {item.time}</p>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                        item.priority === 'Urgent' ? "bg-red-50 text-red-600 border-red-100" : "bg-blue-50 text-blue-600 border-blue-100"
                                    )}>
                                        {item.priority}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em]">Department / Analysis</p>
                                        <p className="text-xs font-black text-slate-700 mt-1">{item.test}</p>
                                        <p className="text-[9px] text-primary font-black uppercase mt-0.5">{item.department}</p>
                                    </div>
                                    <button
                                        onClick={() => handleProcessTest(item.id)}
                                        className={cn(
                                            "w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center transition-all active:scale-90",
                                            item.status === 'In Progress' ? "bg-primary text-white" : "bg-slate-900 text-white"
                                        )}
                                    >
                                        <Upload className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 px-1">
                                    <span className={cn(
                                        "w-2 h-2 rounded-full",
                                        item.status === 'In Progress' ? "bg-blue-500 animate-pulse" : "bg-orange-500"
                                    )}></span>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredData.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-primary/30 transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-500 text-sm group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                                        {item.patient.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 tracking-tight leading-none mb-1">{item.patient}</h3>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.id}</p>
                                    </div>
                                </div>
                                <span className={cn(
                                    "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                    item.priority === 'Urgent' ? "bg-red-50 text-red-600 border-red-100" : "bg-blue-50 text-blue-600 border-blue-100"
                                )}>
                                    {item.priority}
                                </span>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-2xl mb-6 space-y-2 border border-slate-100 group-hover:bg-slate-50/50 transition-colors">
                                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>Analysis Required</span>
                                    <FlaskConical className="w-3.5 h-3.5" />
                                </div>
                                <p className="text-sm font-bold text-slate-700">{item.test}</p>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Waiting time</span>
                                    <span className="text-xs font-bold text-slate-700">{item.time}</span>
                                </div>
                                <button
                                    onClick={() => handleProcessTest(item.id)}
                                    className={cn(
                                        "flex-1 py-3 rounded-2xl text-[10px] font-black shadow-lg shadow-slate-900/10 transition-all group active:scale-95 flex items-center justify-center gap-2",
                                        item.status === 'In Progress' ? "bg-primary text-white" : "bg-slate-900 text-white hover:bg-primary"
                                    )}
                                >
                                    <Upload className="w-4 h-4" /> {item.status === 'In Progress' ? 'Continue Analysis' : 'Start Analysis'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {filteredData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                        <Search className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">No results found</h3>
                    <p className="text-sm text-slate-400 font-medium">Try adjusting your search or filters to find what you're looking for.</p>
                </div>
            )}
        </div>
    );
};

export default TestQueue;
