import React, { useState, useEffect, useCallback } from 'react';
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
    Users,
    ArrowUpRight,
    MapPin,
    User,
    Award,
    Briefcase
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNotification } from '../../context/NotificationContext';
import api from '../../api/axios';
import ImageCropper from '../../components/common/ImageCropper';

const DoctorManagement = () => {
    const { addNotification } = useNotification();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [doctors, setDoctors] = useState([]);
<<<<<<< HEAD
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const fetchDoctors = React.useCallback(async () => {
        try {
            // No need for search query here as filtering is done frontend for now, 
            // but we can pass it if we want server-side filtering
=======
    const [showCropper, setShowCropper] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);

    const fetchDoctors = useCallback(async () => {
        try {
            setLoading(true);
>>>>>>> fe50d5d16cb0ff4f897020bf606253f5f7bf3b08
            const response = await api.get('/admin/doctors');
            setDoctors(response.data);
        } catch (error) {
            console.error('[DoctorManagement] Error fetching doctors:', error);
            addNotification({
                type: 'error',
<<<<<<< HEAD
                title: 'Load Error',
                message: 'Failed to fetch medical personnel data.'
=======
                title: 'Data Load Error',
                message: error.response?.data?.message || 'Failed to load doctors'
>>>>>>> fe50d5d16cb0ff4f897020bf606253f5f7bf3b08
            });
        } finally {
            setLoading(false);
        }
    }, [addNotification]);

<<<<<<< HEAD
    React.useEffect(() => {
=======
    useEffect(() => {
>>>>>>> fe50d5d16cb0ff4f897020bf606253f5f7bf3b08
        fetchDoctors();
    }, [fetchDoctors]);

    const [formData, setFormData] = useState({
        name: '',
        dept: 'General Medicine',
        email: '',
        phone: '',

        consultation_fee: '',
        status: 'Active',
        password: '', // Added password field for creating user
        image: null // Added for profile pic
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

                consultation_fee: '',
                status: 'Active',
                password: '',
<<<<<<< HEAD
                profile_pic: ''
=======
                image: null
>>>>>>> fe50d5d16cb0ff4f897020bf606253f5f7bf3b08
            });
        }
        setIsModalOpen(true);
    };

    const handleViewDetails = (doctor) => {
        setSelectedDoctor(doctor);
        addNotification({
            type: 'info',
            title: 'Medical Profile Accessed',
            message: `Credentials for ${doctor.name} are now visible.`
        });
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to remove ${name}?`)) {
            try {
                await api.delete(`/admin/doctors/${id}`);
                setDoctors(prev => prev.filter(d => d.id !== id));
                addNotification({
                    type: 'info',
                    title: 'Personnel Removed',
                    message: `${name} has been removed from the directory.`
                });
            } catch (error) {
                addNotification({
                    type: 'error',
                    title: 'Removal Failed',
                    message: error.response?.data?.message || 'Failed to remove doctor'
                });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'image' && formData[key]) {
                    dataToSubmit.append('image', formData[key]);
                } else if (formData[key] !== null && formData[key] !== undefined) {
                    dataToSubmit.append(key, formData[key]);
                }
            });

            if (editingDoctor) {
                // Update existing doctor
                const response = await api.put(`/admin/doctors/${editingDoctor.id}`, dataToSubmit, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                // Update the doctor in the list with full response data
                setDoctors(prev => prev.map(d =>
                    d.id === editingDoctor.id ? { ...d, ...response.data.data } : d
                ));

                addNotification({
                    type: 'success',
                    title: 'Doctor Updated',
                    message: `${formData.name}'s profile has been updated successfully.`
                });
            } else {
                // Create New Doctor
                const response = await api.post('/admin/doctors', dataToSubmit, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                // Add to list with full response data
                setDoctors(prev => [response.data.data, ...prev]);

                addNotification({
                    type: 'success',
                    title: 'Personnel Registered',
                    message: `${formData.name} has been added to the directory.`
                });
            }
            setIsModalOpen(false);
            setEditingDoctor(null);
            setFormData({
                name: '',
                email: '',
                phone: '',
                dept: 'General Medicine',
                qualification: '',
                experience_years: 0,
                consultation_fee: 500,
                status: 'Active',
                image: null,
                password: ''
            });
        } catch (error) {
            console.error('[DoctorManagement] HandleSubmit Error:', error);
            addNotification({
                type: 'error',
                title: 'Operation Failed',
                message: error.response?.data?.message || error.message
            });
        }
    };

    const filteredDoctors = doctors.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.dept?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'All' || doc.status === activeFilter;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

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
                    <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        {['All', 'Active', 'On Leave', 'Inactive'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={cn(
                                    "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    activeFilter === filter ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
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
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
<<<<<<< HEAD
                        <tbody className="divide-y divide-slate-50">
                            {filteredDoctors.map((doc) => (
                                <tr key={doc.id} className="group hover:bg-slate-50/30 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black text-sm group-hover:bg-primary/5 group-hover:text-primary transition-colors overflow-hidden">
                                                {doc.profile_pic ? (
                                                    <img src={doc.profile_pic} alt={doc.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    doc.name.split(' ').map(n => n[0]).join('')
                                                )}
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
                                                onClick={() => handleViewDetails(doc)}
                                                className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                                title="View Profile"
                                            >
                                                <ArrowUpRight className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal(doc)}
                                                className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                                title="Edit Doctor"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(doc.id, doc.name)}
                                                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                title="Delete Doctor"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
=======
                        <tbody className="divide-y divide-slate-50 relative min-h-[200px]">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="py-20">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Directory...</p>
>>>>>>> fe50d5d16cb0ff4f897020bf606253f5f7bf3b08
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredDoctors.length > 0 ? (
                                filteredDoctors.map((doc) => (
                                    <tr key={doc.id} className="group hover:bg-slate-50/30 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black text-sm group-hover:bg-primary/5 group-hover:text-primary transition-colors overflow-hidden border border-slate-100 relative">
                                                    {/* Initials Fallback */}
                                                    <span className="absolute inset-0 flex items-center justify-center uppercase">
                                                        {doc.name ? doc.name.split(' ').map(n => n[0]).join('') : 'D'}
                                                    </span>

                                                    {/* Official Photo */}
                                                    {doc.image_url && (
                                                        <img
                                                            src={`${import.meta.env.VITE_API_ROOT || 'http://localhost:5000'}/${doc.image_url.startsWith('/') ? doc.image_url.substring(1) : doc.image_url}`}
                                                            alt={doc.name}
                                                            className="absolute inset-0 w-full h-full object-cover z-10"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                console.warn(`[DoctorManagement] Image load failed for ${doc.name}:`, e.target.src);
                                                            }}
                                                        />
                                                    )}
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center">
                                        <p className="text-slate-400 font-bold italic text-sm">No medical personnel found matching your criteria.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-3 text-slate-300 hover:text-slate-600 transition-colors z-10">
                            <X className="w-6 h-6" />
                        </button>

                        {/* Fixed Header */}
                        <div className="p-12 pb-6">
                            <div className="mb-6">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editingDoctor ? 'Modify Credentials' : 'Onboard New Personnel'}</h2>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1">Initialize medical profile and credentials</p>
                            </div>
                        </div>

                        {/* Scrollable Form Content */}
                        <div className="px-12 overflow-y-auto flex-1">
                            <form onSubmit={handleSubmit} className="space-y-6 pb-6" id="doctor-form">
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
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Consultation Fee (₹)</label>
                                        <input
                                            type="number"
                                            placeholder="500"
                                            className="input-field h-14 bg-slate-50 border-slate-100 !pl-6 text-sm font-bold"
                                            value={formData.consultation_fee}
                                            onChange={(e) => setFormData({ ...formData, consultation_fee: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Set Password</label>
                                        <input
                                            type="password"
                                            placeholder="Default: Doctor@123"
                                            className="input-field h-14 bg-slate-50 border-slate-100 !pl-6 text-sm font-bold"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
<<<<<<< HEAD
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Profile Picture URL</label>
                                        <input
                                            type="text"
                                            placeholder="https://example.com/photo.jpg"
                                            className="input-field h-14 bg-slate-50 border-slate-100 !pl-6 text-sm font-bold"
                                            value={formData.profile_pic || ''}
                                            onChange={(e) => setFormData({ ...formData, profile_pic: e.target.value })}
                                        />
=======
                                    <div className="space-y-2 md:col-span-2 border-2 border-dashed border-slate-100 rounded-[2rem] p-6 bg-slate-50/30">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Profile Picture</label>
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 bg-white rounded-3xl border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                                {formData.image ? (
                                                    <img src={URL.createObjectURL(formData.image)} alt="Preview" className="w-full h-full object-cover" />
                                                ) : editingDoctor?.image_url ? (
                                                    <img
                                                        src={`${import.meta.env.VITE_API_ROOT || 'http://localhost:5000'}/${editingDoctor.image_url}`}
                                                        alt="Current"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Plus className="w-8 h-8 text-slate-200" />
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="doctor-image-upload"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onload = () => {
                                                                setImageToCrop(reader.result);
                                                                setShowCropper(true);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor="doctor-image-upload"
                                                    className="flex items-center justify-center gap-2 h-12 bg-white border border-slate-200 rounded-xl font-bold text-[10px] uppercase tracking-widest text-slate-600 cursor-pointer hover:border-primary/50 hover:text-primary transition-all"
                                                >
                                                    Select New Photo
                                                </label>
                                                <p className="text-[9px] text-slate-400 font-bold ml-2 italic">PNG, JPG or WEBP. Max 5MB.</p>
                                            </div>
                                        </div>
>>>>>>> fe50d5d16cb0ff4f897020bf606253f5f7bf3b08
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

<<<<<<< HEAD
            {/* Doctor Profile View Modal */}
            {selectedDoctor && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative">
                        <button onClick={() => setSelectedDoctor(null)} className="absolute top-8 right-8 p-3 text-slate-300 hover:text-slate-600 transition-colors z-10">
                            <X className="w-6 h-6" />
                        </button>

                        <div className="p-12">
                            <div className="flex items-center gap-6 mb-10">
                                <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-400 font-black text-2xl border-4 border-white shadow-xl overflow-hidden">
                                    {selectedDoctor.profile_pic ? (
                                        <img src={selectedDoctor.profile_pic} alt={selectedDoctor.name} className="w-full h-full object-cover" />
                                    ) : (
                                        selectedDoctor.name.split(' ').map(n => n[0]).join('')
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedDoctor.name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Personnel ID: {selectedDoctor.id}</span>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border",
                                            getStatusStyle(selectedDoctor.status)
                                        )}>
                                            {selectedDoctor.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-10">
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <ShieldCheck className="w-3 h-3" /> Credentials & Dept
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                            <span className="text-xs font-bold text-slate-500">Department</span>
                                            <span className="text-sm font-black text-primary">{selectedDoctor.dept || 'General Medicine'}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                            <span className="text-xs font-bold text-slate-500">Qualification</span>
                                            <span className="text-sm font-black text-slate-800">{selectedDoctor.qualification || 'MBBS, MD'}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                            <span className="text-xs font-bold text-slate-500">Experience</span>
                                            <span className="text-sm font-black text-slate-800">{selectedDoctor.experience_years || 0} Years</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Briefcase className="w-3 h-3" /> Practice Details
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                            <span className="text-xs font-bold text-slate-500">Consultation Fee</span>
                                            <span className="text-sm font-black text-emerald-600">₹{selectedDoctor.consultation_fee}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                            <span className="text-xs font-bold text-slate-500">Joined Date</span>
                                            <span className="text-sm font-black text-slate-800">{selectedDoctor.created_at || 'Feb 10, 2026'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-3xl p-6 mb-10">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Phone className="w-3 h-3" /> Contact Channels
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                                            <p className="text-xs font-bold text-slate-700">{selectedDoctor.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Mobile Number</p>
                                            <p className="text-xs font-bold text-slate-700">{selectedDoctor.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => setSelectedDoctor(null)} className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-slate-200 hover:scale-[1.01] active:scale-[0.99] transition-all">
                                Close Personnel Profile
                            </button>
                        </div>
                    </div>
                </div>
=======
            {showCropper && (
                <ImageCropper
                    image={imageToCrop}
                    onCropComplete={(croppedBlob) => {
                        // Create a file from the blob
                        const file = new File([croppedBlob], 'profile.jpg', { type: 'image/jpeg' });
                        setFormData({ ...formData, image: file });
                        setShowCropper(false);
                    }}
                    onCancel={() => setShowCropper(false)}
                />
>>>>>>> fe50d5d16cb0ff4f897020bf606253f5f7bf3b08
            )}
        </div>
    );
};

export default DoctorManagement;
