import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, ArrowLeft, Search } from 'lucide-react';
import { useDoctor } from '../../context/DoctorContext';
import doctorService from '../../services/doctorService';

const AddPrescription = () => {
    const navigate = useNavigate();
    const { addPrescription } = useDoctor();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [searchResults, setSearchResults] = useState([]);

    const [medications, setMedications] = useState([
        { id: 1, name: '', dosage: '', frequency: '', duration: '' }
    ]);

    const addMedication = () => {
        setMedications([
            ...medications,
            { id: `${Date.now()}-${Math.random()}`, name: '', dosage: '', frequency: '', duration: '' }
        ]);
    };

    const removeMedication = (id) => {
        setMedications(medications.filter(med => med.id !== id));
    };

    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setSelectedPatient(null); // Reset selection on type

        if (query.length > 1) {
            try {
                const results = await doctorService.searchPatients(query);
                setSearchResults(results);
            } catch (err) {
                console.error("Search failed", err);
            }
        } else {
            setSearchResults([]);
        }
    };

    const selectPatient = (patient) => {
        setSelectedPatient(patient);
        setSearchQuery(`${patient.name} (${patient.id})`);
        setSearchResults([]);
    };

    const updateMedication = (id, field, value) => {
        setMedications(medications.map(med =>
            med.id === id ? { ...med, [field]: value } : med
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedPatient) {
            alert("Please select a valid patient from the search results.");
            return;
        }

        addPrescription({
            patientId: selectedPatient.id.replace('PID-', ''), // Ensure pure ID if needed, or backend handles it
            medications: medications
        });
        navigate('/doctor/prescriptions');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">New Prescription</h1>
                    <p className="text-slate-500">Create a new prescription for a patient.</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Patient Selection */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Patient Details</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search for patient by name or ID..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-xl text-sm font-medium outline-none transition-all"
                                required
                            />
                            {searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 max-h-60 overflow-y-auto z-50">
                                    {searchResults.map(patient => (
                                        <button
                                            key={patient.id}
                                            type="button"
                                            onClick={() => selectPatient(patient)}
                                            className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between group transition-colors"
                                        >
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">{patient.name}</p>
                                                <p className="text-xs text-slate-500">{patient.phone} • {patient.gender}</p>
                                            </div>
                                            <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md group-hover:bg-white group-hover:text-primary transition-colors">
                                                {patient.id}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="h-px bg-slate-100"></div>

                    {/* Medications */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">Medications</label>
                            <button
                                type="button"
                                onClick={addMedication}
                                className="text-primary text-sm font-bold flex items-center gap-2 hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" /> Add Medication
                            </button>
                        </div>

                        <div className="space-y-4">
                            {medications.map((med) => (
                                <div key={med.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100 group hover:border-primary/20 transition-all">
                                    <div className="md:col-span-4">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Drug Name</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Amoxicillin"
                                            value={med.name}
                                            onChange={(e) => updateMedication(med.id, 'name', e.target.value)}
                                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-primary/50 outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Dosage</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: 500mg"
                                            value={med.dosage}
                                            onChange={(e) => updateMedication(med.id, 'dosage', e.target.value)}
                                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-primary/50 outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Frequency</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Twice daily"
                                            value={med.frequency}
                                            onChange={(e) => updateMedication(med.id, 'frequency', e.target.value)}
                                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-primary/50 outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Duration</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: 5 days"
                                            value={med.duration}
                                            onChange={(e) => updateMedication(med.id, 'duration', e.target.value)}
                                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:border-primary/50 outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-1 flex justify-center pt-6">
                                        <button
                                            type="button"
                                            onClick={() => removeMedication(med.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            disabled={medications.length === 1}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-slate-100">
                        <button
                            type="submit"
                            className="btn-primary flex items-center gap-2 px-8 py-3 text-sm"
                        >
                            <Save className="w-4 h-4" /> Save Prescription
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPrescription;
