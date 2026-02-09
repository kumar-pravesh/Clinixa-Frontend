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
    X,
    Eye,
    Search,
    Edit2,
    Trash2
} from 'lucide-react';
import { cn } from '../../utils/cn';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="dashboard-card group hover:border-primary/30 transition-all cursor-default">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color} text-white shadow-lg`}>
                <Icon className="w-6 h-6" />
            </div>
            {trend && (
                <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    {trend}
                </span>
            )}
        </div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
    </div>
);

const ReceptionDashboard = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewAllOpen, setIsViewAllOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingToken, setEditingToken] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [openActionMenu, setOpenActionMenu] = useState(null);

    const [recentTokens, setRecentTokens] = useState([
        { id: 'TK-1024', patient: 'John Doe', doctor: 'Dr. Smith', dept: 'General Medicine', status: 'Waiting', date: '2026-02-09', time: '10:30 AM' },
        { id: 'TK-1025', patient: 'Emma Wilson', doctor: 'Dr. Sharma', dept: 'Pediatrics', status: 'In Progress', date: '2026-02-09', time: '10:35 AM' },
        { id: 'TK-1026', patient: 'Robert Brown', doctor: 'Dr. Patel', dept: 'Dentistry', status: 'Waiting', date: '2026-02-09', time: '10:45 AM' },
        { id: 'TK-1027', patient: 'Sarah Connor', doctor: 'Dr. Verma', dept: 'Cardiology', status: 'Completed', date: '2026-02-08', time: '11:00 AM' },
        { id: 'TK-1028', patient: 'Michael Johnson', doctor: 'Dr. Kumar', dept: 'Neurology', status: 'Waiting', date: '2026-02-09', time: '11:15 AM' },
        { id: 'TK-1029', patient: 'Lisa Anderson', doctor: 'Dr. Singh', dept: 'Orthopedics', status: 'In Progress', date: '2026-02-09', time: '11:20 AM' },
        { id: 'TK-1030', patient: 'David Smith', doctor: 'Dr. Reddy', dept: 'General Medicine', status: 'Waiting', date: '2026-02-09', time: '11:30 AM' },
        { id: 'TK-1031', patient: 'Jennifer Lee', doctor: 'Dr. Gupta', dept: 'Dermatology', status: 'Waiting', date: '2026-02-09', time: '11:45 AM' },
        { id: 'TK-1032', patient: 'Thomas Martin', doctor: 'Dr. Chopra', dept: 'ENT', status: 'Completed', date: '2026-02-08', time: '12:00 PM' },
        { id: 'TK-1033', patient: 'Michelle Davis', doctor: 'Dr. Malhotra', dept: 'Gynecology', status: 'Waiting', date: '2026-02-09', time: '12:15 PM' },
        { id: 'TK-1034', patient: 'James Wilson', doctor: 'Dr. Nair', dept: 'Urology', status: 'In Progress', date: '2026-02-09', time: '12:30 PM' },
        { id: 'TK-1035', patient: 'Patricia Brown', doctor: 'Dr. Iyer', dept: 'Pediatrics', status: 'Waiting', date: '2026-02-09', time: '12:45 PM' },
    ]);

    const handleGenerateToken = (data) => {
        const newToken = {
            id: `TK-${1024 + recentTokens.length}`,
            patient: data.patient,
            doctor: data.doctor || 'Dr. Smith',
            dept: data.dept,
            status: 'Waiting',
            date: data.date || new Date().toISOString().split('T')[0],
            time: data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setRecentTokens([newToken, ...recentTokens]);
    };

    const handleDeleteToken = (tokenId) => {
        setRecentTokens(recentTokens.filter(token => token.id !== tokenId));
        setOpenActionMenu(null);
        alert(`Token ${tokenId} deleted successfully!`);
    };

    const openEditModal = (token) => {
        setEditingToken({ ...token });
        setIsEditModalOpen(true);
        setOpenActionMenu(null);
    };

    const handleUpdateToken = (tokenId) => {
        // kept for backward compatibility
        const token = recentTokens.find(t => t.id === tokenId);
        if (token) openEditModal(token);
    };

    const handleEditChange = (field, value) => {
        setEditingToken(prev => ({ ...prev, [field]: value }));
    };

    const saveEditedToken = () => {
        if (!editingToken) return;
        setRecentTokens(prev => prev.map(t => (t.id === editingToken.id ? editingToken : t)));
        setIsEditModalOpen(false);
        setEditingToken(null);
        alert('Token updated successfully');
    };

    const filteredTokens = recentTokens.filter(token =>
        token.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (token.date || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                />
                <StatCard
                    title="Active Queue"
                    value="18"
                    icon={Ticket}
                    color="bg-secondary text-slate-800"
                />
                <StatCard
                    title="Avg. Waiting Time"
                    value="15 min"
                    icon={Clock}
                    color="bg-accent"
                />
                <StatCard
                    title="Revenue (Today)"
                    value="₹12,450"
                    icon={TrendingUp}
                    color="bg-slate-800"
                    trend="+5%"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800">Queue Activity</h2>
                        <button onClick={() => setIsViewAllOpen(true)} className="text-primary text-sm font-bold flex items-center hover:underline">
                            View All <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
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

                    <div className="dashboard-card bg-primary/5 border-primary/20">
                        <h3 className="font-bold text-primary mb-2">Notice Board</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
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

            {/* View All Tokens Modal */}
            {isViewAllOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-8 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">All Queue Tokens</h2>
                                <p className="text-primary-50 text-sm font-bold mt-1 uppercase tracking-widest">Complete list of all patient tokens</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative hidden sm:block">
                                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/60" />
                                    <input
                                        type="text"
                                        placeholder="Search tokens..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-white/20 text-white placeholder-white/60 !pl-10 py-2 px-4 rounded-lg border border-white/30 focus:outline-none focus:border-white/50 w-48 text-sm font-bold"
                                    />
                                </div>
                                <button
                                    onClick={() => setIsViewAllOpen(false)}
                                    className="p-2 hover:bg-white/20 rounded-xl transition-all"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Token ID</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Name</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredTokens.length > 0 ? filteredTokens.map((token) => (
                                        <tr key={token.id} className="hover:bg-slate-50/50 transition-all">
                                            <td className="px-6 py-5">
                                                <span className="text-sm font-black text-primary tracking-tight bg-primary/5 px-2.5 py-1 rounded-lg inline-block">{token.id}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="font-black text-slate-800 tracking-tight">{token.patient}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="font-bold text-slate-700 text-sm">{token.doctor}</p>
                                            </td>
                                            <td className="px-6 py-5 text-slate-600 font-bold text-sm">
                                                {token.dept}
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap",
                                                    token.status === 'In Progress'
                                                        ? "bg-blue-50 text-blue-600 border border-blue-100"
                                                        : token.status === 'Completed'
                                                        ? "bg-green-50 text-green-600 border border-green-100"
                                                        : "bg-orange-50 text-orange-600 border border-orange-100"
                                                )}>
                                                    <span className={cn(
                                                        "w-1.5 h-1.5 rounded-full",
                                                        token.status === 'In Progress' ? "bg-blue-500 animate-pulse" :
                                                        token.status === 'Completed' ? "bg-green-500" :
                                                        "bg-orange-500 animate-pulse"
                                                    )}></span>
                                                    {token.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm font-bold text-slate-600">{token.date}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm font-bold text-slate-600">{token.time}</span>
                                            </td>
                                            <td className="px-6 py-5 text-right relative">
                                                <div className="relative inline-block">
                                                    <button
                                                        onClick={() => setOpenActionMenu(openActionMenu === token.id ? null : token.id)}
                                                        className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm"
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>

                                                    {/* Action Dropdown Menu */}
                                                    {openActionMenu === token.id && (
                                                        <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                                                            <button
                                                                onClick={() => handleUpdateToken(token.id)}
                                                                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors text-slate-700 font-bold text-sm border-b border-slate-100"
                                                            >
                                                                <Edit2 className="w-4 h-4 text-blue-600" />
                                                                Update
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteToken(token.id)}
                                                                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-red-50 transition-colors text-red-700 font-bold text-sm"
                                                            >
                                                                <Trash2 className="w-4 h-4 text-red-600" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                                <td colSpan="8" className="px-6 py-12 text-center text-slate-400 font-bold">
                                                    No tokens found matching your search.
                                                </td>
                                            </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-slate-50 border-t border-slate-200 p-6 flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-600">Total Tokens: {filteredTokens.length} of {recentTokens.length}</span>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsViewAllOpen(false)}
                                    className="px-6 py-2 text-slate-700 font-bold hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                                <button className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                                    Export Records
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Token Modal */}
            {isEditModalOpen && editingToken && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-black">Edit Token {editingToken.id}</h3>
                            <button onClick={() => { setIsEditModalOpen(false); setEditingToken(null); }} className="text-slate-500 hover:text-slate-800">Close</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Patient Name</label>
                                <input value={editingToken.patient} onChange={(e) => handleEditChange('patient', e.target.value)} className="input-field h-10 w-full" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Doctor</label>
                                <input value={editingToken.doctor} onChange={(e) => handleEditChange('doctor', e.target.value)} className="input-field h-10 w-full" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Department</label>
                                <input value={editingToken.dept} onChange={(e) => handleEditChange('dept', e.target.value)} className="input-field h-10 w-full" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Status</label>
                                <select value={editingToken.status} onChange={(e) => handleEditChange('status', e.target.value)} className="input-field h-10 w-full">
                                    <option>Waiting</option>
                                    <option>In Progress</option>
                                    <option>Completed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Date</label>
                                <input type="date" value={editingToken.date} onChange={(e) => handleEditChange('date', e.target.value)} className="input-field h-10 w-full" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Time</label>
                                <input value={editingToken.time} onChange={(e) => handleEditChange('time', e.target.value)} className="input-field h-10 w-full" />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => { setIsEditModalOpen(false); setEditingToken(null); }} className="px-4 py-2 font-bold rounded-lg border">Cancel</button>
                            <button onClick={saveEditedToken} className="px-4 py-2 bg-primary text-white font-bold rounded-lg">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReceptionDashboard;
