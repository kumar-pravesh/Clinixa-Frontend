import React, { useState } from 'react';
import {
    Stethoscope,
    Search,
    Plus,
    MoreVertical,
    Mail,
    Phone,
    Building,
    Calendar,
    Edit3,
    Trash2,
    X,
    Filter,
    ShieldCheck,
    AlertCircle,
    ChevronRight,
    Users
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNotification } from '../../context/NotificationContext';

const DoctorManagement = () => {
    const { addNotification } = useNotification();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');

    const [doctors, setDoctors] = useState([
        { id: 'DOC001', name: 'Dr. Arun Kumar', dept: 'Cardiology', email: 'arun.k@clinixa.life', phone: '+91 9988001122', status: 'Active', experience: '12 Years', shifts: 'Morning' },
        { id: 'DOC002', name: 'Dr. Sarah Paul', dept: 'Pediatrics', email: 'sarah.p@clinixa.life', phone: '+91 9988001133', status: 'On Leave', experience: '8 Years', shifts: 'Evening' },
        { id: 'DOC003', name: 'Dr. James Bond', dept: 'Surgery', email: 'james.b@clinixa.life', phone: '+91 9988001144', status: 'Active', experience: '15 Years', shifts: 'Night' },
        { id: 'DOC004', name: 'Dr. Emily Watson', dept: 'Dermatology', email: 'emily.w@clinixa.life', phone: '+91 9988001155', status: 'Active', experience: '6 Years', shifts: 'Morning' },
    ]);

    const [formData, setFormData] = useState({
        name: '',
        dept: 'General Medicine',
        email: '',
        phone: '',
        experience: '0 Years',
        shifts: 'Morning',
        status: 'Active'
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Active': return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case 'On Leave': return "bg-amber-50 text-amber-600 border-amber-100";
            case 'Inactive': return "bg-slate-50 text-slate-500 border-slate-100";
            default: return "bg-slate-50 text-slate-500 border-slate-100";
        }
    };

    const handleOpenModal = (doctor = null) => {
        if (doctor) {
            setEditingDoctor(doctor);
            setFormData(doctor);
        } else {
            setEditingDoctor(null);
            setFormData({
                name: '',
                dept: 'General Medicine',
                email: '',
                phone: '',
                experience: '0 Years',
                shifts: 'Morning',
                status: 'Active'
            });
        }
        setIsModalOpen(true);
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to remove ${name}?`)) {
            setDoctors(prev => prev.filter(d => d.id !== id));
            addNotification({
                type: 'info',
                title: 'Personnel Removed',
                message: `${name} has been removed from the directory.`
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingDoctor) {
            setDoctors(prev => prev.map(d => d.id === editingDoctor.id ? { ...formData } : d));
            addNotification({
                type: 'success',
                title: 'Profile Updated',
                message: `Credentials for ${formData.name} updated successfully.`
            });
        } else {
            const newDoc = {
                ...formData,
                id: `DOC00${doctors.length + 1}`
            };
            setDoctors(prev => [...prev, newDoc]);
            addNotification({
                type: 'success',
                title: 'Doctor Onboarded',
                message: `${formData.name} has been added to the medical staff.`
            });
        }
        setIsModalOpen(false);
    };

    const filteredDoctors = doctors.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.dept.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'All' || doc.status === activeFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Stethoscope className="w-8 h-8 text-primary" /> Personnel Directory
                    </h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Medical Staff & Doctor Management</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary hover:border-primary/20 transition-all shadow-sm">
                        <Filter className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="btn-primary flex items-center gap-2 h-14 px-8 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Plus className="w-5 h-5" /> <span className="font-black uppercase tracking-widest text-xs">Add Doctor</span>
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total staff', val: doctors.length, color: 'bg-primary' },
                    { label: 'Currently Active', val: doctors.filter(d => d.status === 'Active').length, color: 'bg-emerald-500' },
                    { label: 'On Leave', val: doctors.filter(d => d.status === 'On Leave').length, color: 'bg-amber-500' },
                    { label: 'Inactive', val: doctors.filter(d => d.status === 'Inactive').length, color: 'bg-slate-500' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900 tracking-tighter">{stat.val}</p>
                        </div>
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform", stat.color)}>
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & List */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, ID or specialty..."
                            className="input-field !pl-12 bg-slate-50/50 h-12 border-slate-100 focus:bg-white text-sm font-bold"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {['All', 'Active', 'On Leave'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={cn(
                                    "px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all underline-offset-8 decoration-2 hover:underline",
                                    activeFilter === filter ? "text-primary underline" : "text-slate-400"
                                )}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Doctor Details</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Department</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Experience</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredDoctors.map((doc) => (
                                <tr key={doc.id} className="group hover:bg-slate-50/30 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black text-sm group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                                {doc.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 tracking-tight">{doc.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{doc.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Building className="w-4 h-4 text-slate-300" />
                                            <span className="text-sm font-bold text-slate-600">{doc.dept}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-bold text-slate-500">{doc.experience}</td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                            getStatusStyle(doc.status)
                                        )}>
                                            <span className={cn("w-1 h-1 rounded-full mr-2", doc.status === 'Active' ? 'bg-emerald-500' : doc.status === 'On Leave' ? 'bg-amber-500' : 'bg-slate-400')}></span>
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(doc)}
                                                className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(doc.id, doc.name)}
                                                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-3 text-slate-300 hover:text-slate-600 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                        <div className="p-12">
                            <div className="mb-10">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editingDoctor ? 'Modify Credentials' : 'Onboard New Personnel'}</h2>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1">Initialize medical profile and credentials</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Legal Name</label>
                                        <input
                                            type="text"
                                            placeholder="Dr. John Smith"
                                            className="input-field h-14 bg-slate-50 border-slate-100 !pl-6 text-sm font-bold"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Specialty / Department</label>
                                        <select
                                            className="input-field h-14 bg-slate-50 border-slate-100 !pl-6 text-sm font-bold appearance-none"
                                            value={formData.dept}
                                            onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                                        >
                                            <option>General Medicine</option>
                                            <option>Cardiology</option>
                                            <option>Pediatrics</option>
                                            <option>Neurology</option>
                                            <option>Surgery</option>
                                            <option>Dermatology</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Work Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="john.s@clinixa.life"
                                            className="input-field h-14 bg-slate-50 border-slate-100 !pl-6 text-sm font-bold"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Mobile Number</label>
                                        <input
                                            type="tel"
                                            placeholder="+91 00000 00000"
                                            className="input-field h-14 bg-slate-50 border-slate-100 !pl-6 text-sm font-bold"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Experience</label>
                                        <input
                                            type="text"
                                            placeholder="5 Years"
                                            className="input-field h-14 bg-slate-50 border-slate-100 !pl-6 text-sm font-bold"
                                            value={formData.experience}
                                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Status</label>
                                        <select
                                            className="input-field h-14 bg-slate-50 border-slate-100 !pl-6 text-sm font-bold appearance-none"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option>Active</option>
                                            <option>On Leave</option>
                                            <option>Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <button type="submit" className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-slate-200 mt-6 hover:scale-[1.01] active:scale-[0.99] transition-all">
                                    {editingDoctor ? 'Update Profile' : 'Finalize Registration'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorManagement;
