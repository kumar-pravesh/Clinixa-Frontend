import React, { useState, useEffect } from 'react';
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
import { adminService } from '../../services/adminService';

const PatientRecords = () => {
    const { addNotification } = useNotification();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);

    const calculateAge = (dob) => {
        if (!dob) return 'N/A';
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await adminService.getPatients();
                setPatients(data);
            } catch (err) {
                console.error('Error fetching patients:', err);
                addNotification({
                    type: 'error',
                    title: 'Data Load Failed',
                    message: 'Could not retrieve patient records from backend.'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, [addNotification]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'OPD': return "bg-blue-50 text-blue-600 border-blue-100";
            case 'IPD': return "bg-indigo-50 text-indigo-600 border-indigo-100";
            case 'Emergency': return "bg-rose-50 text-rose-600 border-rose-100";
            default: return "bg-slate-50 text-slate-500 border-slate-100";
        }
    };

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
            const content = `---- CLINIXA MASTER PATIENT INDEX ----\n\nGenerated on: ${new Date().toLocaleString()}\nTotal Records: ${patients.length}\n\n${patients.map(p => `ID: ${p.id} | Name: ${p.name} | Age: ${calculateAge(p.dob)} | Phone: ${p.phone || p.contact} | Email: ${p.email}`).join('\n')}\n\n© 2026 CLINIXA HOSPITAL SYSTEMS`;
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
        addNotification({
            type: 'info',
            title: 'Medical Record Accessed',
            message: `Clinical history for ${patient.name} is now visible.`
        });
    };

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    <div className="flex items-center gap-3">
                        <button className="px-6 h-14 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-all flex items-center gap-2">
                            <Filter className="w-4 h-4" /> Advanced Filter
                        </button>
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
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Id</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Name</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Age</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Phone</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-slate-400 italic">
                                        Loading real-time records...
                                    </td>
                                </tr>
                            ) : filteredPatients.length > 0 ? filteredPatients.map((patient) => {
                                const calculateAge = (dob) => {
                                    if (!dob) return 'N/A';
                                    const birthDate = new Date(dob);
                                    const today = new Date();
                                    let age = today.getFullYear() - birthDate.getFullYear();
                                    const m = today.getMonth() - birthDate.getMonth();
                                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                                        age--;
                                    }
                                    return age;
                                };

                                return (
                                    <tr key={patient.id} className="group hover:bg-slate-50/30 transition-all">
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">#{patient.id}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black group-hover:bg-primary/5 group-hover:text-primary transition-colors text-[10px]">
                                                    {patient.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <p className="text-sm font-black text-slate-800 tracking-tight">{patient.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-slate-600">{calculateAge(patient.dob)} Years</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-slate-600">{patient.phone || patient.contact}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-slate-500">{patient.email}</p>
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
                                );
                            }) : (
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
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative">
                        <button onClick={() => setSelectedPatient(null)} className="absolute top-8 right-8 p-3 text-slate-300 hover:text-slate-600 transition-colors">
                            <X className="w-6 h-6" />
                        </button>

                        <div className="p-12">
                            <div className="flex items-center gap-6 mb-10">
                                <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-400 font-black text-2xl border-4 border-white shadow-xl">
                                    {selectedPatient.name.split(' ').map(n => n[0]).join('')}
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
                                            <span className="text-xs font-bold text-slate-500">Age / Gender</span>
                                            <span className="text-sm font-black text-slate-800">{calculateAge(selectedPatient.dob)}y / {selectedPatient.gender}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Clinical Status</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                            <span className="text-xs font-bold text-slate-500">Primary Condition</span>
                                            <span className="text-sm font-black text-slate-800">{selectedPatient.clinical_condition || 'Normal Observation'}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                            <span className="text-xs font-bold text-slate-500">Care Unit / Status</span>
                                            <span className="text-sm font-black text-primary">{selectedPatient.status}</span>
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

                            <button onClick={() => setSelectedPatient(null)} className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-slate-200 hover:scale-[1.01] active:scale-[0.99] transition-all">
                                Close Clinical Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientRecords;
