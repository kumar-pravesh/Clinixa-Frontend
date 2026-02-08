import React, { useState } from 'react';
import {
    Building2,
    Plus,
    Search,
    MoreVertical,
    ArrowRight,
    Users,
    Stethoscope,
    ChevronRight,
    Edit3,
    Trash2,
    LayoutGrid,
    CheckCircle2,
    X
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNotification } from '../../context/NotificationContext';

const DepartmentManagement = () => {
    const { addNotification } = useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDept, setEditingDept] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [openMenuId, setOpenMenuId] = useState(null);

    const [departments, setDepartments] = useState([
        { id: 'DEPT01', name: 'Cardiology', head: 'Dr. Arun Kumar', staff: 24, beds: 45, status: 'Full Capacity', color: 'bg-rose-500' },
        { id: 'DEPT02', name: 'Pediatrics', head: 'Dr. Sarah Paul', staff: 18, beds: 30, status: 'Active', color: 'bg-sky-500' },
        { id: 'DEPT03', name: 'Neurology', head: 'Dr. John Doe', staff: 15, beds: 20, status: 'Active', color: 'bg-indigo-500' },
        { id: 'DEPT04', name: 'Oncology', head: 'Dr. Maria Garcia', staff: 20, beds: 35, status: 'Active', color: 'bg-emerald-500' },
        { id: 'DEPT05', name: 'Orthopedics', head: 'Dr. Robert Smith', staff: 12, beds: 25, status: 'Active', color: 'bg-amber-500' },
    ]);

    const [formData, setFormData] = useState({
        name: '',
        head: '',
        staff: 0,
        beds: 0,
        status: 'Active',
        color: 'bg-primary'
    });

    const handleOpenModal = (dept = null) => {
        if (dept) {
            setEditingDept(dept);
            setFormData(dept);
        } else {
            setEditingDept(null);
            setFormData({
                name: '',
                head: '',
                staff: 0,
                beds: 0,
                status: 'Active',
                color: 'bg-primary'
            });
        }
        setIsModalOpen(true);
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Delete ${name} department? This will affect all associated staff records.`)) {
            setDepartments(prev => prev.filter(d => d.id !== id));
            addNotification({
                type: 'info',
                title: 'Infrastructure Modified',
                message: `${name} department has been decommissioned.`
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingDept) {
            setDepartments(prev => prev.map(d => d.id === editingDept.id ? { ...formData } : d));
            addNotification({
                type: 'success',
                title: 'Dept Updated',
                message: `${formData.name} infrastructure details updated.`
            });
        } else {
            const newDept = {
                ...formData,
                id: `DEPT0${departments.length + 1}`
            };
            setDepartments(prev => [...prev, newDept]);
            addNotification({
                type: 'success',
                title: 'New Specialty Added',
                message: `${formData.name} department is now operational.`
            });
        }
        setIsModalOpen(false);
    };

    const filteredDepts = departments.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.head.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-primary" /> Hospital Infrastructure
                    </h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Specialty Departments & Facility Units</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search units..."
                            className="input-field !pl-12 !h-12 w-64 bg-white shadow-sm border-slate-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="btn-primary flex items-center gap-2 h-14 px-8 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Plus className="w-5 h-5" /> <span className="font-black uppercase tracking-widest text-xs">New Department</span>
                    </button>
                </div>
            </div>

            {/* Dept Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDepts.map((dept) => (
                    <div key={dept.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full opacity-[0.05] group-hover:scale-150 transition-transform duration-700 overflow-hidden pointer-events-none">
                            <div className={cn("w-full h-full", dept.color)}></div>
                        </div>

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className={cn("p-4 rounded-2xl text-white shadow-lg", dept.color)}>
                                <LayoutGrid className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                                    dept.status === 'Full Capacity' ? "bg-rose-50 text-rose-600 border-rose-100" :
                                        dept.status === 'Maintenance' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                            "bg-emerald-50 text-emerald-600 border-emerald-100"
                                )}>
                                    {dept.status}
                                </span>
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenMenuId(openMenuId === dept.id ? null : dept.id);
                                        }}
                                        className="p-2 text-slate-300 hover:text-slate-600 transition-colors bg-slate-50 rounded-xl"
                                    >
                                        <MoreVertical className="w-5 h-5 text-slate-400" />
                                    </button>

                                    {openMenuId === dept.id && (
                                        <>
                                            <div className="fixed inset-0 z-30" onClick={() => setOpenMenuId(null)}></div>
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                <button
                                                    onClick={() => {
                                                        handleOpenModal(dept);
                                                        setOpenMenuId(null);
                                                    }}
                                                    className="w-full px-5 py-4 text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors border-b border-slate-50"
                                                >
                                                    <Edit3 className="w-4 h-4 text-primary" /> Edit Unit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleDelete(dept.id, dept.name);
                                                        setOpenMenuId(null);
                                                    }}
                                                    className="w-full px-5 py-4 text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 flex items-center gap-3 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" /> Decommission
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mb-6 relative z-10">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">{dept.name}</h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Head: {dept.head}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-6 border-t border-slate-50 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><Users className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-xs font-black text-slate-800">{dept.staff}</p>
                                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Medical Staff</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 border-l border-slate-50 pl-4">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><CheckCircle2 className="w-5 h-5" /></div>
                                <div>
                                    <p className="text-xs font-black text-slate-800">{dept.beds}</p>
                                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Available Beds</p>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 transition-all flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white relative z-10">
                            View Details <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-3 text-slate-300 hover:text-slate-600 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                        <div className="p-12">
                            <div className="mb-10">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editingDept ? 'Edit Infrastructure' : 'Configure New Department'}</h2>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1">Management and capacity parameters</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Department Title</label>
                                    <input
                                        type="text"
                                        placeholder="Cardiology Unit"
                                        className="input-field h-14 bg-slate-50 border-slate-100 !pl-6 text-sm font-bold"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Head of department</label>
                                    <input
                                        type="text"
                                        placeholder="Dr. John Doe"
                                        className="input-field h-14 bg-slate-50 border-slate-100 !pl-6 text-sm font-bold"
                                        value={formData.head}
                                        onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Current Staff</label>
                                        <input
                                            type="number"
                                            className="input-field h-14 bg-slate-50 border-slate-100 !pl-6 text-sm font-bold text-center"
                                            value={formData.staff}
                                            onChange={(e) => setFormData({ ...formData, staff: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Total Beds</label>
                                        <input
                                            type="number"
                                            className="input-field h-14 bg-slate-50 border-slate-100 !pl-6 text-sm font-bold text-center"
                                            value={formData.beds}
                                            onChange={(e) => setFormData({ ...formData, beds: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Infrastructure Status</label>
                                    <select
                                        className="input-field h-14 bg-slate-50 border-slate-100 !pl-6 text-sm font-bold appearance-none"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option>Active</option>
                                        <option>Full Capacity</option>
                                        <option>Maintenance</option>
                                    </select>
                                </div>

                                <button type="submit" className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-slate-200 mt-6 hover:scale-[1.01] active:scale-[0.99] transition-all">
                                    {editingDept ? 'Commit Changes' : 'Initialize Unit'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepartmentManagement;
