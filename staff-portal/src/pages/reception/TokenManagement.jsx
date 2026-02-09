import React, { useState } from 'react';
import {
    Ticket,
    Search,
    Filter,
    RefreshCw,
    MoreVertical,
    ChevronRight,
    Clock,
    CheckCircle2,
    XCircle,
    PlayCircle,
    Trash2,
    Plus
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useQueue } from '../../context/QueueContext';

export const GenerateTokenModal = ({ isOpen, onClose, onGenerate }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        patient: '',
        dept: 'General Medicine',
        doctor: 'Dr. Smith',
        mobile: '',
        date: new Date().toISOString().slice(0,10),
        time: new Date().toISOString().slice(11,16)
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onGenerate(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-primary" /> Generate Token
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Patient Name</label>
                        <input
                            required
                            type="text"
                            placeholder="John Doe"
                            className="input-field !pl-4 h-11"
                            value={formData.patient}
                            onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                            <input
                                required
                                type="date"
                                className="input-field !pl-4 h-11"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Time</label>
                            <input
                                required
                                type="time"
                                className="input-field !pl-4 h-11"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mobile Number</label>
                        <input
                            required
                            type="tel"
                            placeholder="9876543210"
                            className="input-field !pl-4 h-11"
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Department</label>
                            <select
                                className="input-field appearance-none h-11 !pl-4"
                                value={formData.dept}
                                onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                            >
                                <option>General Medicine</option>
                                <option>Pediatrics</option>
                                <option>Dentistry</option>
                                <option>Cardiology</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Doctor</label>
                            <select
                                className="input-field appearance-none h-11 !pl-4"
                                value={formData.doctor}
                                onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                            >
                                <option>Dr. Smith</option>
                                <option>Dr. Brown</option>
                                <option>Dr. Lee</option>
                                <option>Dr. Wilson</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 btn-primary py-3 flex items-center justify-center gap-2">
                            <Ticket className="w-5 h-5" /> Generate
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const TokenManagement = () => {
    const { tokens, updateTokenStatus, deleteToken, generateToken } = useQueue();
    const [activeTab, setActiveTab] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTokens = tokens.filter(t => {
        const matchesTab = activeTab === 'All' ? true : t.status === activeTab;
        const q = searchQuery.toLowerCase();
        const matchesSearch = t.patient.toLowerCase().includes(q) ||
            t.id.toLowerCase().includes(q) ||
            (t.date || '').toLowerCase().includes(q);
        return matchesTab && matchesSearch;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Waiting': return "bg-orange-50 text-orange-600 border-orange-200";
            case 'In Progress': return "bg-blue-50 text-blue-600 border-blue-200";
            case 'Completed': return "bg-green-50 text-green-600 border-green-200";
            case 'Cancelled': return "bg-red-50 text-red-600 border-red-200";
            default: return "bg-slate-50 text-slate-600 border-slate-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Waiting': return <Clock className="w-4 h-4" />;
            case 'In Progress': return <PlayCircle className="w-4 h-4" />;
            case 'Completed': return <CheckCircle2 className="w-4 h-4" />;
            case 'Cancelled': return <XCircle className="w-4 h-4" />;
            default: return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 px-4 sm:px-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Token & Queue</h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Live patient flow monitoring</p>
                </div>
                <div className="flex items-center justify-center gap-3">
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-primary/20 transition-all shadow-sm group">
                        <RefreshCw className="w-5 h-5 text-slate-400 group-hover:text-primary group-active:rotate-180 transition-all duration-500" />
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2 h-12 px-6 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                        <Plus className="w-5 h-5" /> <span className="font-black uppercase tracking-wider text-xs">New Token</span>
                    </button>
                </div>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
                    <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit shadow-inner min-w-max">
                        {['All', 'Waiting', 'In Progress', 'Completed'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest",
                                    activeTab === tab
                                        ? "bg-white text-primary shadow-md scale-100"
                                        : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="relative lg:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search patient or token ID..."
                        className="input-field !pl-12 bg-white h-12 shadow-sm border-slate-200 focus:border-primary/50 text-sm font-bold"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Mobile Token Cards (Visible only on mobile) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredTokens.length > 0 ? filteredTokens.map((token) => (
                    <div key={token.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm active:scale-[0.99] transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                                    <span className="text-lg font-black text-slate-800 tracking-tighter">{token.id}</span>
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800 text-sm">{token.patient}</h3>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{token.date} • {token.time}</p>
                                </div>
                            </div>
                            <span className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border",
                                getStatusStyle(token.status)
                            )}>
                                {getStatusIcon(token.status)}
                                {token.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-4">
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Department</p>
                                <p className="text-xs font-black text-slate-700">{token.dept}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Doctor</p>
                                <p className="text-xs font-black text-slate-700">{token.doctor}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                {token.status === 'Waiting' && (
                                    <button
                                        onClick={() => updateTokenStatus(token.id, 'In Progress')}
                                        className="h-10 px-4 bg-blue-50 text-blue-600 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-wide border border-blue-100 active:scale-95 transition-all"
                                    >
                                        <PlayCircle className="w-4 h-4" /> Start
                                    </button>
                                )}
                                {token.status === 'In Progress' && (
                                    <button
                                        onClick={() => updateTokenStatus(token.id, 'Completed')}
                                        className="h-10 px-4 bg-green-50 text-green-600 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-wide border border-green-100 active:scale-95 transition-all"
                                    >
                                        <CheckCircle2 className="w-4 h-4" /> Done
                                    </button>
                                )}
                                {(token.status === 'Waiting' || token.status === 'In Progress') && (
                                    <button
                                        onClick={() => updateTokenStatus(token.id, 'Cancelled')}
                                        className="h-10 w-10 bg-red-50 text-red-100 rounded-xl flex items-center justify-center border border-red-100 active:scale-95 transition-all"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={() => deleteToken(token.id)}
                                className="h-10 w-10 bg-slate-50 text-slate-300 rounded-xl flex items-center justify-center border border-slate-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold italic text-sm">No active tokens in this queue.</p>
                    </div>
                )}
            </div>

            {/* Desktop Token Table (Hidden on mobile) */}
            <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Token ID</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Details</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Dept & Doctor</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Time</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quick Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredTokens.length > 0 ? filteredTokens.map((token) => (
                                <tr key={token.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <span className="text-xl font-black text-slate-800 tracking-tighter">{token.id}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="font-black text-slate-800">{token.patient}</p>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{token.mobile}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-bold text-slate-700">{token.dept}</p>
                                        <p className="text-xs text-slate-500 font-bold">{token.doctor}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn(
                                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border",
                                            getStatusStyle(token.status)
                                        )}>
                                            {getStatusIcon(token.status)}
                                            {token.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-slate-400">{token.date}</td>
                                    <td className="px-6 py-5 text-sm font-bold text-slate-400">{token.time}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-end gap-2">
                                            {token.status === 'Waiting' && (
                                                <button
                                                    onClick={() => updateTokenStatus(token.id, 'In Progress')}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all flex items-center gap-1.5"
                                                    title="Start Consultation"
                                                >
                                                    <PlayCircle className="w-5 h-5" />
                                                    <span className="text-[10px] font-black uppercase tracking-wider hidden lg:block">Start</span>
                                                </button>
                                            )}
                                            {token.status === 'In Progress' && (
                                                <button
                                                    onClick={() => updateTokenStatus(token.id, 'Completed')}
                                                    className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-all flex items-center gap-1.5"
                                                    title="Mark as Completed"
                                                >
                                                    <CheckCircle2 className="w-5 h-5" />
                                                    <span className="text-[10px] font-black uppercase tracking-wider hidden lg:block">Done</span>
                                                </button>
                                            )}
                                            {(token.status === 'Waiting' || token.status === 'In Progress') && (
                                                <button
                                                    onClick={() => updateTokenStatus(token.id, 'Cancelled')}
                                                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Cancel Token"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteToken(token.id)}
                                                className="p-2 text-slate-300 hover:text-slate-500 hover:bg-slate-100 rounded-lg transition-all"
                                                title="Remove Record"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <p className="text-slate-400 font-bold italic">No active tokens found in this queue.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Queue Performance Disclaimer */}
            <div className="flex items-start gap-4 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                <Filter className="w-6 h-6 text-blue-500 mt-1" />
                <div>
                    <h4 className="font-bold text-blue-800 uppercase tracking-wide text-xs mb-1">Queue Policy</h4>
                    <p className="text-sm text-blue-700/80 leading-relaxed font-bold">
                        Tokens are prioritized based on arrival time. Emergent cases can be "Fast-Tracked" using the management menu on each token.
                    </p>
                </div>
            </div>

            <GenerateTokenModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onGenerate={generateToken}
            />
        </div>
    );
};

export default TokenManagement;
