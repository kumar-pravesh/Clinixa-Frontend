import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, MoreHorizontal, User, FileText, Calendar, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useDoctor } from '../../context/DoctorContext';
import doctorService from '../../services/doctorService';
import { useEffect } from 'react';

const AssignedPatients = () => {
    // Context provides assigned patients
    const { patients: assignedPatients } = useDoctor();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [displayPatients, setDisplayPatients] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Effect to handle search vs assigned switch
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchTerm.trim()) {
                setDisplayPatients(assignedPatients);
                setIsSearching(false);
                return;
            }

            setIsSearching(true);
            try {
                // Use global search when typing
                const results = await doctorService.searchPatients(searchTerm);
                // Map results to match UI structure if needed (backend returns slightly diff keys?)
                // Access backend consistently. Backend: id, name, age, gender, diagnosis(maybe missing), status(maybe missing), last_visit
                const formattedResults = results.map(p => ({
                    ...p,
                    lastVisit: p.last_visit || 'N/A',
                    status: p.status || 'OPD',
                    diagnosis: p.diagnosis || 'Check Records'
                }));
                setDisplayPatients(formattedResults);
            } catch (error) {
                console.error("Search failed", error);
                // Fallback or empty on error
                setDisplayPatients([]);
            } finally {
                setIsSearching(false);
            }
        };

        const debounceTimer = setTimeout(() => {
            fetchSearchResults();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, assignedPatients]);

    const handleViewPatient = (patient) => {
        setSelectedPatient(patient);
    };

    const handleSchedule = () => {
        navigate('/doctor/appointments');
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">My Patients</h1>
                    <p className="text-slate-500">Manage and view your assigned patients.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-xl text-sm outline-none transition-all"
                    />
                </div>
            </div>

            <div className="bg-white/50 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-sm overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200/60">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-normal">Patient ID</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-normal">Name</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-normal">Age / Gender</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-normal">Diagnosis</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-normal">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-normal">Last Visit</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-normal text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {displayPatients.length > 0 ? (
                                displayPatients.map((patient) => (
                                    <tr key={patient.id} className="group hover:bg-white transition-all">
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-black text-slate-900 tracking-tight">{patient.id}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <span className="font-bold text-slate-800">{patient.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-slate-600 font-medium">
                                            {patient.age} / {patient.gender}
                                        </td>
                                        <td className="px-8 py-6 text-sm text-slate-600 font-medium">
                                            {patient.diagnosis}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                patient.status === 'Admitted'
                                                    ? "bg-purple-50 text-purple-600 border-purple-100"
                                                    : "bg-green-50 text-green-600 border-green-100"
                                            )}>
                                                <span className={cn("w-1.5 h-1.5 rounded-full", patient.status === 'Admitted' ? "bg-purple-500" : "bg-green-500")}></span>
                                                {patient.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-slate-500">
                                            {patient.lastVisit}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewPatient(patient)}
                                                    className="p-2 rounded-lg hover:bg-primary/5 text-slate-400 hover:text-primary transition-colors"
                                                    title="View Details"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={handleSchedule}
                                                    className="p-2 rounded-lg hover:bg-primary/5 text-slate-400 hover:text-primary transition-colors"
                                                    title="Schedule Follow-up"
                                                >
                                                    <Calendar className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-8 py-12 text-center text-slate-400">
                                        {searchTerm ? "No patients found matching your search." : "No assigned patients found."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4 p-4">
                    {displayPatients.length > 0 ? displayPatients.map((patient) => (
                        <div key={patient.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{patient.name}</h3>
                                        <span className="text-xs font-medium text-slate-400">{patient.id}</span>
                                    </div>
                                </div>
                                <span className={cn(
                                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                    patient.status === 'Admitted'
                                        ? "bg-purple-50 text-purple-600 border-purple-100"
                                        : "bg-green-50 text-green-600 border-green-100"
                                )}>
                                    <span className={cn("w-1 h-1 rounded-full", patient.status === 'Admitted' ? "bg-purple-500" : "bg-green-500")}></span>
                                    {patient.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Diagnosis</p>
                                    <p className="font-medium text-slate-700">{patient.diagnosis}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Visit</p>
                                    <p className="font-medium text-slate-700">{patient.lastVisit}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2 border-t border-slate-50">
                                <button
                                    onClick={() => handleViewPatient(patient)}
                                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FileText className="w-3 h-3" /> View Details
                                </button>
                                <button
                                    onClick={handleSchedule}
                                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-primary/5 text-primary hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Calendar className="w-3 h-3" /> Schedule
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-10 text-slate-400">
                            {searchTerm ? "No patients found." : "No assigned patients."}
                        </div>
                    )}
                </div>
            </div>

            {/* View Patient Modal */}
            {
                selectedPatient && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Patient Details</h2>
                                    <p className="text-sm text-slate-500">{selectedPatient.id}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedPatient(null)}
                                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-8 space-y-8">
                                <div className="flex items-start gap-6">
                                    <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                        <User className="w-10 h-10" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-bold text-slate-800">{selectedPatient.name}</h3>
                                        <div className="flex flex-wrap gap-2 text-sm text-slate-500">
                                            <span>{selectedPatient.age} years old</span>
                                            <span>•</span>
                                            <span>{selectedPatient.gender}</span>
                                            <span>•</span>
                                            <span>Blood Group: O+</span>
                                        </div>
                                        <div className="pt-2">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                selectedPatient.status === 'Admitted'
                                                    ? "bg-purple-50 text-purple-600 border-purple-100"
                                                    : "bg-green-50 text-green-600 border-green-100"
                                            )}>
                                                <span className={cn("w-1.5 h-1.5 rounded-full", selectedPatient.status === 'Admitted' ? "bg-purple-500" : "bg-green-500")}></span>
                                                {selectedPatient.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Current Diagnosis</p>
                                        <p className="font-medium text-slate-800">{selectedPatient.diagnosis}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Last Visit</p>
                                        <p className="font-medium text-slate-800">{selectedPatient.lastVisit}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold text-slate-800 mb-3">Medical History</h4>
                                    <div className="space-y-3">
                                        <div className="flex gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                                            <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0"></div>
                                            <div>
                                                <p className="font-medium text-slate-700">Viral Fever</p>
                                                <p className="text-sm text-slate-400">Treated in Dec 2025</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                                            <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0"></div>
                                            <div>
                                                <p className="font-medium text-slate-700">Mild Allergic Reaction</p>
                                                <p className="text-sm text-slate-400">Treated in Oct 2025</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                                <button
                                    onClick={() => setSelectedPatient(null)}
                                    className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedPatient(null);
                                        handleSchedule(selectedPatient);
                                    }}
                                    className="btn-primary px-4 py-2 flex items-center gap-2"
                                >
                                    <Calendar className="w-4 h-4" /> Schedule Follow-up
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default AssignedPatients;
