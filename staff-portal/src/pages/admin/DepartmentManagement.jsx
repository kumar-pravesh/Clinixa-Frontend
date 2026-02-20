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
import api from '../../api/axios';

const DepartmentManagement = () => {
    const { addNotification } = useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDept, setEditingDept] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [openMenuId, setOpenMenuId] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [departments, setDepartments] = useState([]);
    const [isIntelligenceModalOpen, setIsIntelligenceModalOpen] = useState(false);
    const [selectedDeptForIntelligence, setSelectedDeptForIntelligence] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const DEPARTMENT_ARTICLES = {
        'Cardiology': [
            { title: 'Modern Cath Lab Standard', date: 'Feb 12, 2026', author: 'Dr. Sarah Chen', description: 'Exploring the latest integration of high-precision imaging in cardiac interventions.' },
            { title: 'Heart Rate Variability Analysis', date: 'Jan 28, 2026', author: 'Dr. Michael Ross', description: 'New protocols for monitoring patient recovery through continuous HRV data.' }
        ],
        'Dermatology': [
            { title: 'Laser Safety Protocols', date: 'Feb 15, 2026', author: 'Dr. Elena Vance', description: 'Updated guidelines for Level II laser equipment operations in clinic.' },
            { title: 'AI in Skin Lesion detection', date: 'Jan 10, 2026', author: 'Dr. James Wilson', description: 'Evaluating the performance of automated diagnostic assistance in early-stage detection.' }
        ],
        'Neurology': [
            { title: 'Deep Brain Stimulation Units', date: 'Feb 05, 2026', author: 'Dr. Alan Grant', description: 'Maintaining 99.9% uptime for electrode-based neurological care systems.' },
            { title: 'Neuro-plasticity Research', date: 'Dec 20, 2025', author: 'Dr. Sarah Chen', description: 'Phase 3 results from our latest stroke recovery studies.' }
        ],
        'Default': [
            { title: 'Unit Operational Efficiency', date: 'Feb 17, 2026', author: 'System Admin', description: 'Best practices for managing staff-to-bed ratios across general hospital units.' },
            { title: 'Patient Satisfaction Metrics', date: 'Feb 01, 2026', author: 'Hospital Board', description: 'Monthly review of specialist care feedback and communication scores.' }
        ]
    };

    const [formData, setFormData] = useState({
        name: '',
        head: '',
        staff: 0,
        beds: 0,
        status: 'Active',
        color: 'bg-primary',
        description: '',
        tech: 'Standard Care',
        success_rate: 95,
        publications: [],
        image_url: ''
    });

    const fetchDepartments = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/admin/departments');
            // Ensure publications is parsed if it comes as a string
            const data = response.data.map(d => ({
                ...d,
                publications: typeof d.publications === 'string' ? JSON.parse(d.publications) : (d.publications || [])
            }));
            setDepartments(data);
        } catch (error) {
            console.error('Error fetching departments:', error);
            addNotification({
                type: 'error',
                title: 'Data Load Error',
                message: 'Failed to retrieve hospital infrastructure data.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchDepartments();
    }, []);

    const handleOpenModal = (dept = null) => {
        setImageFile(null);
        if (dept) {
            setEditingDept(dept);
            const previewUrl = dept.image_url
                ? (dept.image_url.startsWith('http') ? dept.image_url : `http://localhost:5000/${dept.image_url}`)
                : null;
            setImagePreview(previewUrl);
            setFormData({
                ...dept,
                tech: dept.tech || 'Standard Care',
                success_rate: dept.success_rate || 95,
                publications: dept.publications || [],
                image_url: dept.image_url || ''
            });
        } else {
            setEditingDept(null);
            setImagePreview(null);
            setFormData({
                name: '',
                head: '',
                staff: 0,
                beds: 0,
                status: 'Active',
                color: 'bg-primary',
                description: '',
                tech: 'Standard Care',
                success_rate: 95,
                publications: [],
                image_url: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you absolutely sure you want to decommission the ${name} unit? All assigned staff will be transitioned to an unassigned status.`)) {
            try {
                await api.delete(`/admin/departments/${id}`);
                addNotification({
                    type: 'info',
                    title: 'Infrastructure Modified',
                    message: `${name} department has been decommissioned.`
                });
                fetchDepartments();
            } catch (error) {
                console.error('Error deleting department:', error);
                addNotification({
                    type: 'error',
                    title: 'Action Failed',
                    message: `Failed to delete ${name} department.`
                });
            }
        }
    };

    const handleAddPublication = () => {
        setFormData({
            ...formData,
            publications: [...formData.publications, {
                title: '',
                author: '',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                description: ''
            }]
        });
    };

    const handleUpdatePublication = (index, field, value) => {
        const updatedPublications = [...formData.publications];
        updatedPublications[index] = { ...updatedPublications[index], [field]: value };
        setFormData({ ...formData, publications: updatedPublications });
    };

    const handleRemovePublication = (index) => {
        setFormData({
            ...formData,
            publications: formData.publications.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = new FormData();
            // Append all text fields
            Object.keys(formData).forEach(key => {
                if (key === 'publications') {
                    payload.append(key, JSON.stringify(formData[key]));
                } else {
                    payload.append(key, formData[key] ?? '');
                }
            });
            // Append image file if selected
            if (imageFile) {
                payload.append('image', imageFile);
            }

            if (editingDept) {
                await api.put(`/admin/departments/${editingDept.id}`, payload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                addNotification({ type: 'success', title: 'Infrastructure Synced', message: `${formData.name} configuration updated.` });
            } else {
                await api.post('/admin/departments', payload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                addNotification({ type: 'success', title: 'Unit Deployed', message: `New ${formData.name} infrastructure is now operational.` });
            }
            setIsModalOpen(false);
            setImageFile(null);
            setImagePreview(null);
            fetchDepartments();
        } catch (error) {
            console.error('Error saving department:', error);
            addNotification({ type: 'error', title: 'Sync Error', message: 'Failed to commit infrastructure changes.' });
        }
    };

    const getPublications = (dept) => {
        if (dept.publications && dept.publications.length > 0) {
            return dept.publications;
        }
        return DEPARTMENT_ARTICLES[dept.name] || DEPARTMENT_ARTICLES['Default'];
    };

    const filteredDepts = (departments || []).filter(d => {
        const matchesSearch = (d.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (d.head || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'All' || d.status === activeFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <Building2 className="w-8 h-8 text-primary" />
                        </div>
                        Hospital Infrastructure
                    </h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-3 ml-16">Clinical Specialization & Facility Management</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 ml-16 xl:ml-0">
                    <div className="relative w-full sm:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Find units, heads, or tech..."
                            className="input-field !h-14 !pl-12 w-full bg-white shadow-xl shadow-slate-200/40 border-slate-100 focus:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="w-full sm:w-auto px-8 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/10 hover:bg-primary active:scale-95 transition-all group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="font-black uppercase tracking-widest text-xs">Add specialty</span>
                    </button>
                </div>
            </div>

            {/* Filter Controls */}
            <div className="flex gap-2 bg-white/60 backdrop-blur-md p-2 rounded-[2rem] border border-white shadow-sm w-fit overflow-x-auto max-w-full no-scrollbar">
                {['All', 'Active', 'Full Capacity', 'Maintenance'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={cn(
                            "px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                            activeFilter === filter ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20" : "text-slate-400 hover:text-slate-600 hover:bg-white"
                        )}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Dept Cards */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-[4rem] border border-slate-100 shadow-sm p-12 h-[32rem] animate-pulse flex flex-col">
                            <div className="flex items-start gap-6 mb-10">
                                <div className="p-6 rounded-3xl bg-slate-50 w-20 h-20 shrink-0"></div>
                                <div className="space-y-4 flex-1 pt-2">
                                    <div className="bg-slate-50 h-8 w-3/4 rounded-2xl"></div>
                                    <div className="bg-slate-50 h-4 w-1/2 rounded-xl"></div>
                                </div>
                            </div>
                            <div className="space-y-6 mb-10">
                                <div className="bg-slate-50 h-20 w-full rounded-[2rem]"></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 h-24 rounded-[2rem]"></div>
                                    <div className="bg-slate-50 h-24 rounded-[2rem]"></div>
                                </div>
                            </div>
                            <div className="mt-auto pt-6 border-t border-slate-100 flex gap-3">
                                <div className="flex-1 h-14 bg-slate-50 rounded-xl"></div>
                                <div className="w-14 h-14 bg-slate-50 rounded-xl"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredDepts.length === 0 ? (
                <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl shadow-slate-200/40 p-24 text-center animate-in fade-in zoom-in-95 duration-700">
                    <div className="w-28 h-28 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-slate-100">
                        <Building2 className="w-14 h-14 text-slate-200" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-4">No Infrastructure Recorded</h3>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] max-w-sm mx-auto mb-10 leading-relaxed">Your search or filter yielded no operational hospital units at this time.</p>
                    <button onClick={() => handleOpenModal()} className="px-10 h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary transition-all shadow-xl shadow-slate-900/10">
                        Initialize Specialty Unit
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDepts.map((dept) => (
                        <div key={dept.id} className="relative bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 flex flex-col h-full overflow-hidden group">
                            {/* Accent Rail */}
                            <div className={cn("absolute top-0 left-0 bottom-0 w-1.5", dept.color)}></div>

                            <div className="p-8 flex flex-col h-full">
                                {/* Header Section */}
                                <div className="flex items-start gap-4 mb-8">
                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0", dept.color)}>
                                        <LayoutGrid className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-tight mb-1 group-hover:text-primary transition-colors" title={dept.name}>{dept.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{dept.tech || 'Standard Ops'}</span>
                                            <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", dept.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500')}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Medical Director - High Density */}
                                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight leading-none mb-1">Medical Director</p>
                                        <p className="text-sm font-bold text-slate-800 leading-none">{dept.head}</p>
                                    </div>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                                        <p className="text-2xl font-bold text-slate-900 leading-none mb-1">{dept.doctor_count || dept.staff}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Specialists</p>
                                    </div>
                                    <div className="p-4 bg-white border border-slate-100 rounded-2xl">
                                        <p className="text-2xl font-bold text-slate-900 leading-none mb-1">{dept.beds}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Care Units</p>
                                    </div>
                                </div>

                                {/* Integrated CTA & Action Hub */}
                                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center gap-3">
                                    <button
                                        onClick={() => {
                                            setSelectedDeptForIntelligence(dept);
                                            setIsIntelligenceModalOpen(true);
                                        }}
                                        className="flex-1 py-4 bg-slate-900 hover:bg-primary text-white text-[10px] font-bold uppercase tracking-[0.15em] rounded-xl transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-slate-900/5"
                                    >
                                        Intelligence Center <ArrowRight className="w-4 h-4" />
                                    </button>

                                    <div className="relative shrink-0">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuId(openMenuId === dept.id ? null : dept.id);
                                            }}
                                            className="w-12 h-12 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-400 rounded-xl border border-slate-100 transition-all flex items-center justify-center active:scale-95 group/manage"
                                            title="Administrative Settings"
                                        >
                                            <MoreVertical className="w-5 h-5 group-hover/manage:scale-110 transition-transform" />
                                        </button>

                                        {openMenuId === dept.id && (
                                            <>
                                                <div className="fixed inset-0 z-30" onClick={() => setOpenMenuId(null)}></div>
                                                <div className="absolute right-0 bottom-full mb-4 w-56 bg-white rounded-2xl shadow-3xl border border-slate-100 z-40 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                                                    <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Administrative Tools</p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            handleOpenModal(dept);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="w-full px-5 py-4 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors border-b border-slate-50"
                                                    >
                                                        <Edit3 className="w-4 h-4 text-primary" /> Update Infrastructure
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm(`Are you absolutely sure you want to decommission the ${dept.name} unit? All assigned staff will be transitioned to an unassigned status.`)) {
                                                                handleDelete(dept.id, dept.name);
                                                            }
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="w-full px-5 py-4 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Decommission Unit
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Config Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-400 overflow-y-auto no-scrollbar">
                    <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] overflow-hidden relative my-8">
                        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none"></div>

                        <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 p-3 text-slate-300 hover:text-slate-600 bg-slate-50 hover:bg-white rounded-2xl border border-transparent hover:border-slate-100 transition-all z-10">
                            <X className="w-6 h-6" />
                        </button>
                        <div className="p-16">
                            <div className="mb-12">
                                <div className="p-4 bg-primary/10 rounded-2xl w-fit mb-6">
                                    <Building2 className="w-8 h-8 text-primary" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{editingDept ? 'Modify Infrastructure' : 'Initialize Specialist Unit'}</h2>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em] mt-3">Commiting new parameters to core hospital system</p>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Unit Identification</label>
                                    <input
                                        type="text"
                                        placeholder="E.g., Neuro-Science Pavilion"
                                        className="input-field h-16 bg-slate-50 border-slate-100 !pl-6 text-sm font-bold shadow-inner"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Lead Specialist (Head)</label>
                                    <input
                                        type="text"
                                        placeholder="Senior Medical Director Name"
                                        className="input-field h-16 bg-slate-50 border-slate-100 !pl-6 text-sm font-bold shadow-inner"
                                        value={formData.head}
                                        onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Allocated Staff</label>
                                    <input
                                        type="number"
                                        className="input-field h-16 bg-slate-50 border-slate-100 !pl-6 text-sm font-bold text-center shadow-inner"
                                        value={formData.staff}
                                        onChange={(e) => setFormData({ ...formData, staff: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Total Bed Units</label>
                                    <input
                                        type="number"
                                        className="input-field h-16 bg-slate-50 border-slate-100 !pl-6 text-sm font-bold text-center shadow-inner"
                                        value={formData.beds}
                                        onChange={(e) => setFormData({ ...formData, beds: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Clinical Tech Level</label>
                                    <select
                                        className="input-field h-16 bg-slate-50 border-slate-100 !pl-6 text-sm font-bold appearance-none shadow-inner"
                                        value={formData.tech}
                                        onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                                    >
                                        <option>Standard Care</option>
                                        <option>Level II Advanced</option>
                                        <option>Level III Intensive</option>
                                        <option>Robotic Assisted</option>
                                    </select>
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Department Image</label>
                                    <div
                                        className="relative border-2 border-dashed border-slate-200 rounded-3xl overflow-hidden cursor-pointer hover:border-primary/40 transition-colors group/upload"
                                        onClick={() => document.getElementById('dept-img-input').click()}
                                    >
                                        {imagePreview ? (
                                            <div className="relative h-44">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                                                    <p className="text-white text-xs font-black uppercase tracking-widest">Click to change image</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); }}
                                                    className="absolute top-3 right-3 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all z-10 font-bold text-base"
                                                >×</button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 group-hover/upload:bg-primary/5 transition-colors">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-slate-400 group-hover/upload:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                </div>
                                                <p className="text-sm font-black text-slate-700 mb-1">Click to upload image</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">JPG, PNG, or WEBP · Max 5MB</p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        id="dept-img-input"
                                        type="file"
                                        accept="image/jpg,image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setImageFile(file);
                                                setImagePreview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Operational Status</label>
                                    <select
                                        className="input-field h-16 bg-slate-50 border-slate-100 !pl-6 text-sm font-bold appearance-none shadow-inner"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option>Active</option>
                                        <option>Full Capacity</option>
                                        <option>Maintenance</option>
                                    </select>
                                </div>

                                {/* Specialist Publications (Thesis) */}
                                <div className="md:col-span-2 mt-6 pt-6 border-t border-slate-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                                                <Edit3 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Specialist Publications</p>
                                                <h4 className="text-lg font-black text-slate-900 tracking-tight mt-1">Research & Thesis Library</h4>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddPublication}
                                            className="px-6 h-12 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-600 rounded-xl border border-slate-100 transition-all flex items-center gap-3 font-bold text-xs"
                                        >
                                            <Plus className="w-4 h-4" /> Add Publication
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {formData.publications.map((pub, idx) => (
                                            <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 relative group/pub">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemovePublication(idx)}
                                                    className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover/pub:opacity-100 transition-all hover:scale-110 z-10"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Thesis Title</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Clinical Research Title"
                                                            className="w-full h-12 bg-white rounded-xl border border-slate-100 px-4 text-xs font-bold shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                            value={pub.title}
                                                            onChange={(e) => handleUpdatePublication(idx, 'title', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Principal Author</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Dr. Specialist Name"
                                                            className="w-full h-12 bg-white rounded-xl border border-slate-100 px-4 text-xs font-bold shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                            value={pub.author}
                                                            onChange={(e) => handleUpdatePublication(idx, 'author', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Publication Date</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Month DD, YYYY"
                                                            className="w-full h-12 bg-white rounded-xl border border-slate-100 px-4 text-xs font-bold shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                            value={pub.date}
                                                            onChange={(e) => handleUpdatePublication(idx, 'date', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Research Abstract</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Short summary of key findings..."
                                                            className="w-full h-12 bg-white rounded-xl border border-slate-100 px-4 text-xs font-bold shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                            value={pub.description}
                                                            onChange={(e) => handleUpdatePublication(idx, 'description', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {formData.publications.length === 0 && (
                                            <div className="p-12 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                                                <LayoutGrid className="w-12 h-12 text-slate-200 mb-4" />
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Publications Archive</p>
                                                <p className="text-[10px] text-slate-300 font-medium mt-1">Default clinical articles will be displayed for this unit.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button type="submit" className="md:col-span-2 h-20 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-slate-200 mt-8 hover:bg-primary hover:-translate-y-1 active:scale-95 transition-all">
                                    {editingDept ? 'Commit Configuration' : 'Sync Infrastructure'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )
            }

            {/* Department Intelligence Modal */}
            {
                isIntelligenceModalOpen && selectedDeptForIntelligence && (
                    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl z-[150] flex items-center justify-center p-6 animate-in fade-in duration-500">
                        <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden relative flex flex-col max-h-[90vh]">
                            {/* Header */}
                            <div className="p-16 pb-10 border-b border-slate-50 relative">
                                <div className={cn("absolute top-0 left-0 w-full h-2 bg-gradient-to-r", selectedDeptForIntelligence.color)}></div>
                                <button
                                    onClick={() => setIsIntelligenceModalOpen(false)}
                                    className="absolute top-12 right-12 p-4 text-slate-300 hover:text-slate-600 bg-slate-50 hover:bg-white rounded-3xl border border-transparent hover:border-slate-100 transition-all z-10"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <div className="flex items-center gap-6 mb-8">
                                    <div className={cn("p-5 rounded-3xl text-white shadow-2xl", selectedDeptForIntelligence.color)}>
                                        <LayoutGrid className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{selectedDeptForIntelligence.name}</h2>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em] mt-3">Intelligence & Specialist Publications</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-16 pt-12 overflow-y-auto no-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {getPublications(selectedDeptForIntelligence).map((article, idx) => (
                                        <div key={idx} className="group cursor-pointer">
                                            <div className="mb-6 overflow-hidden rounded-[2.5rem] aspect-video bg-slate-50 relative border border-slate-100 shadow-inner">
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <div className="absolute bottom-6 left-6 px-4 py-2 bg-white/80 backdrop-blur-md rounded-xl border border-white/50 text-[8px] font-black uppercase tracking-widest text-slate-500">
                                                    Clinical Thesis {idx + 1}
                                                </div>
                                            </div>
                                            <div className="px-2">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="text-[10px] text-primary font-black uppercase tracking-wider">{article.date}</span>
                                                    <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{article.author}</span>
                                                </div>
                                                <h3 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-primary transition-colors mb-3">{article.title}</h3>
                                                <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">{article.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Footer */}
                            <div className="p-16 py-10 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Accessing secure medical archives</p>
                                <button className="px-10 h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary transition-all flex items-center gap-4">
                                    Internal Library <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default DepartmentManagement;
