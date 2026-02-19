import React, { useState } from 'react';
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    FileText,
    Calendar,
    Clock,
    User,
    ArrowUpRight,
    MapPin,
    Smartphone,
    X
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNotification } from '../../context/NotificationContext';
import adminService from '../../services/adminService';
import { useEffect } from 'react';

const PatientRecords = () => {
    const { addNotification } = useNotification();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    const calculateAge = (dob) => {
        if (!dob) return 'N/A';
        try {
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        } catch (e) {
            return 'N/A';
        }
    };

    const calculateHealthScore = (patient) => {
        // Base score
        let score = 92;

        // Age impact
        const age = calculateAge(patient.dob);
        if (age !== 'N/A') {
            if (age > 60) score -= (age - 60) * 0.2;
            if (age < 10) score -= 5;
        }

        // Visit count impact (too many visits might indicate chronic issues)
        const visits = parseInt(patient.visit_count) || 0;
        if (visits > 5) score -= (visits - 5) * 2;

        // Consistency check: ensure score between 65 and 98 for "Active" patients
        return Math.max(65, Math.min(98, Math.floor(score + (Math.random() * 4 - 2))));
    };

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const data = await adminService.getPatients(searchQuery);
            const formattedData = data.map(p => {
                const age = calculateAge(p.dob);
                return {
                    ...p,
                    age: age,
                    healthScore: calculateHealthScore(p),
                    lastVisit: p.last_visit,
                    bloodGroup: p.blood_group || 'N/A',
                    status: 'OPD'
                };
            });
            setPatients(formattedData);
        } catch (error) {
            console.error("Failed to fetch patients", error);
            addNotification({
                type: 'error',
                title: 'Error',
                message: 'Failed to load patient records'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchPatients();
        }, 500); // Debounce search
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    /**
     * Simulates a data export for patient records
     */
    const simulateExport = () => {
        addNotification({
            type: 'info',
            title: 'Generating Directory',
            message: 'Compiling master patient index...'
        });

        setTimeout(() => {
            const content = `---- CLINIXA MASTER PATIENT INDEX ----\n\nGenerated on: ${new Date().toLocaleString()}\nTotal Records: ${patients.length}\n\n${patients.map(p => `ID: ${p.id} | Name: ${p.name} | Age: ${p.age} | Blood: ${p.bloodGroup} | Last Visit: ${p.lastVisit}`).join('\n')}\n\n© 2026 CLINIXA HOSPITAL SYSTEMS`;
            const blob = new Blob([content], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `patient_directory_${new Date().getTime()}.txt`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            addNotification({
                type: 'success',
                title: 'Export Successful',
                message: 'Patient directory data has been saved to your downloads.'
            });
        }, 1500);
    };

    const handleViewDetails = (patient) => {
        setSelectedPatient(patient);
    };

    const closeModal = () => {
        setSelectedPatient(null);
    };

    const handleDeletePatient = async () => {
        if (!selectedPatient) return;

        const name = selectedPatient.name;
        const patientId = selectedPatient.id;

        if (!window.confirm(`Are you sure you want to permanently delete the clinical profile for ${name}? This action cannot be undone.`)) {
            return;
        }

        setSelectedPatient(null);
        try {
            await adminService.deletePatient(patientId);
            // Remove from local state immediately
            setPatients(prev => prev.filter(p => p.id !== patientId));
            addNotification({
                type: 'success',
                title: 'Patient Removed',
                message: `Clinical profile for ${name} has been permanently deleted.`
            });
        } catch (error) {
            addNotification({
                type: 'error',
                title: 'Delete Failed',
                message: error.response?.data?.message || `Failed to delete ${name}'s profile.`
            });
            // Re-fetch to restore accurate state
            fetchPatients();
        }
    };

    const filteredPatients = patients.filter(p => {
        // Search is handled by backend, but we keep status filter client-side
        return activeFilter === 'All' || (p.status || 'OPD') === activeFilter;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <Users className="w-8 h-8 text-primary" /> Master Patient Index
                </h1>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Comprehensive Clinical Data Repository</p>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, patient ID, blood group or contact..."
                            className="input-field !pl-12 bg-slate-50/50 h-14 border-slate-100 focus:bg-white text-sm font-bold shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        {['All', 'OPD', 'IPD', 'Emergency'].map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={cn(
                                    "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    activeFilter === f ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => simulateExport()}
                            className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all"
                        >
                            <FileText className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Profile</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Medical Info</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact & Location</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredPatients.length > 0 ? filteredPatients.map((patient) => (
                                <tr key={patient.id} className="group hover:bg-slate-50/30 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black group-hover:bg-primary/5 group-hover:text-primary transition-colors text-xs">
                                                {patient.name ? patient.name.split(' ').map(n => n[0]).join('') : '??'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 tracking-tight">{patient.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">{patient.id}</span>
                                                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                    <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">{patient.age}Y • {patient.gender}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded text-[9px] font-black">{patient.blood_group || 'N/A'}</div>
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Blood Group</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className={cn(
                                                        "w-1.5 h-1.5 rounded-full animate-pulse",
                                                        patient.healthScore > 85 ? "bg-emerald-500" : patient.healthScore > 75 ? "bg-amber-500" : "bg-rose-500"
                                                    )}></div>
                                                    <span className="text-[9px] font-black text-slate-700">{patient.healthScore}% IDX</span>
                                                </div>
                                            </div>
                                            {patient.last_visit && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5 text-slate-300" />
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last: {patient.last_visit}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-xs font-bold">{patient.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <span className="text-[10px] font-bold uppercase tracking-wider truncate max-w-[180px]">{patient.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{patient.registered_date}</div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => handleViewDetails(patient)}
                                            className="p-3 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all group-hover:scale-110"
                                        >
                                            <ArrowUpRight className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <p className="text-slate-400 font-bold italic">No patient records found matching your search.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Patient Detail Modal */}
            {selectedPatient && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={closeModal} className="absolute top-8 right-8 p-3 text-slate-300 hover:text-slate-600 transition-colors z-10">
                            <X className="w-6 h-6" />
                        </button>

                        <div className="p-12 overflow-y-auto flex-1">
                            <div className="flex items-center gap-6 mb-10">
                                <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-400 font-black text-2xl border-4 border-white shadow-xl">
                                    {selectedPatient.name ? selectedPatient.name.split(' ').map(n => n[0]).join('') : '??'}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedPatient.name}</h2>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1">Patient UUID: {selectedPatient.id}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 mb-10">
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Vital Statistics</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                            <span className="text-xs font-bold text-slate-500">Blood Group</span>
                                            <span className="text-sm font-black text-rose-500">{selectedPatient.blood_group || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                            <span className="text-xs font-bold text-slate-500">Date of Birth / Gender</span>
                                            <span className="text-sm font-black text-slate-800">{selectedPatient.dob || 'N/A'} / {selectedPatient.gender}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                            <span className="text-xs font-bold text-slate-500">Health Index Score</span>
                                            <span className={cn(
                                                "text-sm font-black",
                                                selectedPatient.healthScore > 85 ? "text-emerald-500" : selectedPatient.healthScore > 75 ? "text-amber-500" : "text-rose-500"
                                            )}>{selectedPatient.healthScore}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Clinical Status</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                            <span className="text-xs font-bold text-slate-500">Visit Count</span>
                                            <span className="text-sm font-black text-slate-800">{selectedPatient.visit_count || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                            <span className="text-xs font-bold text-slate-500">Last Visit</span>
                                            <span className="text-sm font-black text-primary">{selectedPatient.last_visit || 'No visits'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-3xl p-6 mb-10">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Residential Address</h4>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <p className="text-sm font-bold">{selectedPatient.address}</p>
                                </div>
                            </div>

                            <button onClick={closeModal} className="w-full h-16 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-slate-200 hover:scale-[1.01] active:scale-[0.99] transition-all mb-4">
                                Close Clinical Profile
                            </button>

                            <button onClick={handleDeletePatient} className="w-full h-12 bg-white text-rose-500 border-2 border-rose-100 hover:border-rose-200 rounded-xl font-black uppercase tracking-titles text-[9px] transition-all">
                                Permanently Delete Record
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientRecords;
