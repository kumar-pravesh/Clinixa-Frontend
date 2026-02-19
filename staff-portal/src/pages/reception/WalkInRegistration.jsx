import React, { useState, useEffect } from 'react';
import {
    UserPlus,
    Search,
    User,
    Phone,
    MapPin,
    Calendar,
    Save,
    AlertCircle,
    ArrowLeft,
    Ticket,
    CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useQueue } from '../../context/QueueContext';
import { useNotification } from '../../context/NotificationContext';
import receptionService from '../../services/receptionService';

const WalkInRegistration = () => {
    const { generateToken } = useQueue();
    const { addNotification } = useNotification();
    const [mobile, setMobile] = useState('');
    const [isExisting, setIsExisting] = useState(false);
    const [generatedToken, setGeneratedToken] = useState(null);
    const [lastVisit, setLastVisit] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        dob: '',
        address: '',
        reason: '',
        height: '',
        weight: '',
        bp_systolic: '',
        bp_diastolic: '',
        blood_group: '',
        dept: ''
    });
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const fetchDeps = async () => {
            try {
                const deps = await receptionService.getDepartments();
                setDepartments(deps);
                if (deps.length > 0) {
                    setFormData(prev => ({ ...prev, dept: deps[0].name }));
                }
            } catch (err) {
                console.error('Error fetching departments:', err);
            }
        };
        fetchDeps();
    }, []);

    const mockPatients = {
        '9876543210': {
            name: 'Emma Wilson',
            gender: 'Female',
            dob: '1992-05-14',
            address: 'Park Avenue, Suite 4',
            lastVisit: '12 days ago'
        },
        '9128521727': {
            name: 'John Doe',
            gender: 'Male',
            dob: '1980-08-22',
            address: '123 Hospital St, Medical District',
            lastVisit: '3 weeks ago'
        },
        '9988776655': {
            name: 'Robert Brown',
            gender: 'Male',
            dob: '1975-11-30',
            address: 'Downtown Street, Apt 12',
            lastVisit: '5 days ago'
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        // Mobile number validation: 10 digits, not starting with 0
        if (!/^[1-9]\d{9}$/.test(mobile)) {
            addNotification({
                type: 'error',
                title: 'Invalid Mobile Number',
                message: "Mobile number must be exactly 10 digits and cannot start with 0."
            });
            return;
        }

        try {
            const results = await receptionService.searchPatient(mobile);
            const found = results.find(p => p.phone === mobile || p.id === mobile);

            if (found) {
                setIsExisting(true);
                setLastVisit(found.registered_date);
                setFormData({
                    name: found.name,
                    gender: found.gender,
                    dob: found.dob,
                    address: found.address || '',
                    reason: 'Follow-up consultation',
                    height: found.height || '',
                    weight: found.weight || '',
                    bp_systolic: found.bp_systolic || '',
                    bp_diastolic: found.bp_diastolic || '',
                    blood_group: found.blood_group || ''
                });
            } else {
                setIsExisting(false);
                setLastVisit(null);
                setFormData({
                    name: '',
                    gender: '',
                    dob: '',
                    address: '',
                    reason: '',
                    height: '',
                    weight: '',
                    bp_systolic: '',
                    bp_diastolic: '',
                    blood_group: '',
                    dept: departments.length > 0 ? departments[0].name : ''
                });
                addNotification({
                    type: 'info',
                    title: 'Not Found',
                    message: "Patient record not found. Please fill details to register."
                });
            }
        } catch (err) {
            console.error('Error searching patient:', err);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // 1. Name Validation
        if (!formData.name || formData.name.trim().length < 3) {
            addNotification({
                type: 'error',
                title: 'Invalid Name',
                message: "Full name is required and should be at least 3 characters."
            });
            return;
        }

        // 2. Gender Validation
        if (!formData.gender) {
            addNotification({
                type: 'error',
                title: 'Gender Required',
                message: "Please select patient gender."
            });
            return;
        }

        // 3. Mobile number validation: 10 digits, not starting with 0
        if (!/^[1-9]\d{9}$/.test(mobile)) {
            addNotification({
                type: 'error',
                title: 'Invalid Mobile Number',
                message: "Mobile number must be exactly 10 digits and cannot start with 0."
            });
            return;
        }

        // 4. DOB Validation (Cannot be in the future)
        if (!formData.dob) {
            addNotification({
                type: 'error',
                title: 'DOB Required',
                message: "Please select patient date of birth."
            });
            return;
        }
        const birthDate = new Date(formData.dob);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (birthDate > today) {
            addNotification({
                type: 'error',
                title: 'Invalid DOB',
                message: "Date of birth cannot be in the future."
            });
            return;
        }

        try {
            let patientId = null;
            if (!isExisting) {
                const res = await receptionService.registerWalkIn({
                    ...formData,
                    phone: mobile
                });
                patientId = res.id;
            } else {
                // If existing, we need to extract numeric ID from PID-XXXX
                const results = await receptionService.searchPatient(mobile);
                const found = results.find(p => p.phone === mobile || p.id === mobile);
                patientId = found.id.replace('PID-', '').replace(/^0+/, '');
            }

            const token = await generateToken({
                patient_id: patientId,
                dept: formData.dept,
                doctor_id: formData.doctor_id || null, // Optional
                department: formData.reason || 'Consultation'
            });

            setGeneratedToken(token);
            addNotification({
                type: isExisting ? 'appointment' : 'emergency',
                title: isExisting ? 'Follow-up Check-in' : 'New Patient Registered',
                message: `${formData.name} has been ${isExisting ? 'checked in for follow-up' : 'registered as a new patient'}. Token: ${token.id}`
            });
        } catch (err) {
            console.error('Error saving registration:', err);
            addNotification({
                type: 'error',
                title: 'Save Failed',
                message: err.response?.data?.message || "Failed to register patient/generate token"
            });
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-20 px-4 sm:px-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                <Link to="/reception" className="hidden md:flex p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all group">
                    <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Walk-in Registration</h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Register a new patient or update an existing one.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Left Column: Search & Status */}
                <div className="space-y-6">
                    <div className="dashboard-card !p-8">
                        <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                            <Search className="w-5 h-5 text-primary" /> Check Existing Patient
                        </h2>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-2 text-center pointer-events-none">Mobile Number</label>
                                <div className="flex gap-2">
                                    <input
                                        type="tel"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        placeholder="e.g. 9876543210"
                                        className="input-field h-14 !text-lg font-bold text-center"
                                    />
                                    <button type="submit" className="btn-primary flex items-center justify-center p-2 w-14 h-14 rounded-xl shadow-lg shadow-primary/20">
                                        <Search className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </form>

                        {isExisting && (
                            <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-2xl flex gap-3 animate-in fade-in zoom-in-95 duration-300">
                                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                <div>
                                    <p className="text-sm font-black text-primary">Patient Found!</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Record verified. Details auto-filled.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={cn(
                        "dashboard-card !p-8 transition-all duration-500 border-2",
                        generatedToken ? "bg-primary text-white border-transparent shadow-2xl shadow-primary/30" : "bg-white border-slate-100 text-slate-400"
                    )}>
                        <h3 className={cn("font-black mb-4 flex items-center gap-2 uppercase tracking-widest text-[10px]", generatedToken ? "text-white" : "text-primary/40")}>
                            {generatedToken ? <CheckCircle2 className="w-4 h-4" /> : <Ticket className="w-4 h-4" />}
                            {generatedToken ? "Token Generated" : ""}
                        </h3>
                        {generatedToken ? (
                            <div className="space-y-4">
                                <div className="text-center py-8 bg-white/10 rounded-2xl border border-white/20">
                                    <span className="text-5xl font-black tracking-tighter">{generatedToken.id}</span>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-60 mt-1">Patient Queue ID</p>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black px-1 uppercase tracking-wider">
                                    <span className="opacity-60">STATUS:</span>
                                    <span className="bg-white/20 px-3 py-1 rounded-full">{generatedToken.status}</span>
                                </div>
                                <Link
                                    to="/reception/tokens"
                                    className="block w-full text-center py-4 bg-white text-primary rounded-xl font-black text-sm hover:transform hover:scale-[1.02] transition-all shadow-xl"
                                >
                                    View Queue Management
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <p className="text-sm text-slate-400 font-bold leading-relaxed text-center italic opacity-60">
                                    Once registration is saved, a unique token will be generated for the patient queue.
                                </p>
                                <div className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest border-t border-slate-50 pt-6">
                                    Note: Token ID will appear here after save.
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Registration Form */}
                <div className="lg:col-span-2">
                    <div className={cn(
                        "dashboard-card transition-all duration-500 border-2",
                        isExisting ? "border-primary/20 bg-primary/[0.01]" : "border-transparent"
                    )}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                                {isExisting ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <UserPlus className="w-5 h-5 text-primary" />}
                                {isExisting ? "Verify Patient Details" : "New Patient Details"}
                            </h2>
                            {isExisting && (
                                <div className="flex gap-2">
                                    <span className="bg-primary text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20">Follow-up</span>
                                    {lastVisit && <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Last: {lastVisit}</span>}
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Full Name</label>
                                    <div className="relative">
                                        <User className={cn("absolute left-3 top-3.5 w-4 h-4 transition-colors", isExisting ? "text-primary" : "text-slate-400")} />
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className={cn(
                                                "input-field !pl-10 h-11 font-bold",
                                                isExisting && "bg-primary/[0.03] border-primary/20 text-primary"
                                            )}
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Gender</label>
                                    <select
                                        className={cn(
                                            "input-field appearance-none h-11 font-bold",
                                            isExisting && "bg-primary/[0.03] border-primary/20 text-primary"
                                        )}
                                        value={formData.gender}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                        required
                                    >
                                        <option value="">Select Gender</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Mobile Number</label>
                                    <div className="relative">
                                        <Phone className={cn("absolute left-3 top-3.5 w-4 h-4 transition-colors", isExisting ? "text-primary" : "text-slate-400")} />
                                        <input
                                            type="tel"
                                            className={cn(
                                                "input-field !pl-10 h-11 font-bold",
                                                isExisting && "bg-primary/[0.03] border-primary/20 text-primary"
                                            )}
                                            placeholder="9876543210"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Date of Birth</label>
                                    <div className="relative">
                                        <Calendar className={cn("absolute left-3 top-3.5 w-4 h-4 transition-colors", isExisting ? "text-primary" : "text-slate-400")} />
                                        <input
                                            type="date"
                                            className={cn(
                                                "input-field !pl-10 h-11 font-bold",
                                                isExisting && "bg-primary/[0.03] border-primary/20 text-primary"
                                            )}
                                            value={formData.dob}
                                            onChange={(e) => handleInputChange('dob', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Full Address</label>
                                <div className="relative">
                                    <MapPin className={cn("absolute left-3 top-3.5 w-4 h-4 transition-colors", isExisting ? "text-primary" : "text-slate-400")} />
                                    <textarea
                                        rows="3"
                                        placeholder="123 Hospital St, Medical District..."
                                        className={cn(
                                            "input-field !pl-10 py-3 font-bold",
                                            isExisting && "bg-primary/[0.03] border-primary/20 text-primary"
                                        )}
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Height (CM)</label>
                                    <input
                                        type="number"
                                        placeholder="175"
                                        className="input-field h-11 font-bold"
                                        value={formData.height}
                                        onChange={(e) => handleInputChange('height', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Weight (KG)</label>
                                    <input
                                        type="number"
                                        placeholder="70"
                                        className="input-field h-11 font-bold"
                                        value={formData.weight}
                                        onChange={(e) => handleInputChange('weight', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">BP Systolic</label>
                                    <input
                                        type="number"
                                        placeholder="120"
                                        className="input-field h-11 font-bold"
                                        value={formData.bp_systolic}
                                        onChange={(e) => handleInputChange('bp_systolic', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">BP Diastolic</label>
                                    <input
                                        type="number"
                                        placeholder="80"
                                        className="input-field h-11 font-bold"
                                        value={formData.bp_diastolic}
                                        onChange={(e) => handleInputChange('bp_diastolic', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Blood Group</label>
                                    <select
                                        className="input-field appearance-none h-11 font-bold"
                                        value={formData.blood_group}
                                        onChange={(e) => handleInputChange('blood_group', e.target.value)}
                                    >
                                        <option value="">Select Blood Group</option>
                                        <option>A+</option>
                                        <option>A-</option>
                                        <option>B+</option>
                                        <option>B-</option>
                                        <option>O+</option>
                                        <option>O-</option>
                                        <option>AB+</option>
                                        <option>AB-</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Department</label>
                                    <select
                                        className="input-field appearance-none h-11 font-bold"
                                        value={formData.dept}
                                        onChange={(e) => handleInputChange('dept', e.target.value)}
                                        required
                                    >
                                        {departments.map((dept) => (
                                            <option key={dept.id || dept.name} value={dept.name}>
                                                {dept.name}
                                            </option>
                                        ))}
                                        {departments.length === 0 && (
                                            <>
                                                <option>General Medicine</option>
                                                <option>Pediatrics</option>
                                                <option>Dentistry</option>
                                                <option>Cardiology</option>
                                                <option>Orthopedics</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Reason for Visit</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Persistent headache"
                                        className="input-field h-11 font-bold"
                                        value={formData.reason}
                                        onChange={(e) => handleInputChange('reason', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" className="px-6 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-lg transition-colors">Discard</button>
                                <button type="submit" disabled={!!generatedToken} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                                    <Save className="w-5 h-5" /> {generatedToken ? "Saved" : "Save Registration"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalkInRegistration;
