import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, FileText, Printer, Eye, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useDoctor } from '../../context/DoctorContext';

const Prescriptions = () => {
    const navigate = useNavigate();
    const { prescriptions } = useDoctor();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPrescription, setSelectedPrescription] = useState(null);

    const filteredPrescriptions = prescriptions.filter(rx => {
        const patientName = rx.patient || rx.patient_name || '';
        const prescriptionId = String(rx.id || '');
        const search = searchTerm.toLowerCase();

        return (
            patientName.toLowerCase().includes(search) ||
            prescriptionId.toLowerCase().includes(search)
        );
    });

    const handlePrint = (rx) => {
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Prescription - ${rx.id}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 40px; }
                        .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                        .logo { font-size: 24px; font-weight: bold; color: #0f172a; }
                        .details { margin-bottom: 30px; }
                        .details p { margin: 5px 0; }
                        .medication-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        .medication-table th, .medication-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                        .medication-table th { background-color: #f8fafc; }
                        .footer { margin-top: 50px; text-align: right; border-top: 1px solid #ddd; padding-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">Clinixa Hospital</div>
                        <p>Doctor's Prescription</p>
                    </div>
                    <div class="details">
                        <p><strong>Prescription ID:</strong> ${rx.id}</p>
                        <p><strong>Patient Name:</strong> ${rx.patient || rx.patient_name || 'N/A'}</p>
                        <p><strong>Date:</strong> ${rx.date}</p>
                        <p><strong>Status:</strong> ${rx.status}</p>
                    </div>
                    <h3>Medications</h3>
                    <table class="medication-table">
                        <thead>
                            <tr>
                                <th>Medicine Name</th>
                                <th>Dosage</th>
                                <th>Frequency</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rx.medications.map(med => `
                                <tr>
                                    <td>${med.name}</td>
                                    <td>${med.dosage}</td>
                                    <td>${med.frequency}</td>
                                    <td>${med.duration}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="footer">
                        <p>Doctor's Signature</p>
                    </div>
                    <script>
                        window.onload = function() { window.print(); window.close(); }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Prescriptions</h1>
                    <p className="text-slate-500">Manage and issue patient prescriptions.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search prescriptions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-xl text-sm outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={() => navigate('/doctor/prescriptions/new')}
                        className="btn-primary flex items-center gap-2 px-4 py-2.5"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">New Prescription</span>
                    </button>
                </div>
            </div>

            <div className="bg-white/60 backdrop-blur-md rounded-[2rem] border border-white/50 shadow-sm overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200/60">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Prescription ID</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Issued</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Medications</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredPrescriptions.map((rx) => (
                                <tr key={rx.id} className="group hover:bg-white transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-black text-slate-900 tracking-tight">{rx.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-bold text-slate-800">
                                        {rx.patient || rx.patient_name || 'N/A'}
                                    </td>
                                    <td className="px-8 py-6 text-sm text-slate-500">
                                        {rx.date}
                                    </td>
                                    <td className="px-8 py-6 text-sm text-slate-600 font-medium">
                                        {rx.medications.length} items
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                            rx.status === 'Active'
                                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                : "bg-slate-100 text-slate-500 border-slate-200"
                                        )}>
                                            <span className={cn("w-1.5 h-1.5 rounded-full", rx.status === 'Active' ? "bg-emerald-500" : "bg-slate-400")}></span>
                                            {rx.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedPrescription(rx)}
                                                className="p-2 rounded-lg hover:bg-primary/5 text-slate-400 hover:text-primary transition-colors"
                                                title="View"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handlePrint(rx)}
                                                className="p-2 rounded-lg hover:bg-primary/5 text-slate-400 hover:text-primary transition-colors"
                                                title="Print"
                                            >
                                                <Printer className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4 p-4">
                    {filteredPrescriptions.map((rx) => (
                        <div key={rx.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{rx.patient || rx.patient_name || 'N/A'}</h3>
                                        <span className="text-xs font-medium text-slate-400">{rx.id}</span>
                                    </div>
                                </div>
                                <span className={cn(
                                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                    rx.status === 'Active'
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                        : "bg-slate-100 text-slate-500 border-slate-200"
                                )}>
                                    <span className={cn("w-1 h-1 rounded-full", rx.status === 'Active' ? "bg-emerald-500" : "bg-slate-400")}></span>
                                    {rx.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                                    <p className="font-medium text-slate-700">{rx.date}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Items</p>
                                    <p className="font-medium text-slate-700">{rx.medications.length} Medications</p>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2 border-t border-slate-50">
                                <button
                                    onClick={() => setSelectedPrescription(rx)}
                                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Eye className="w-3 h-3" /> View Details
                                </button>
                                <button
                                    onClick={() => handlePrint(rx)}
                                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-primary/5 text-primary hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Printer className="w-3 h-3" /> Print
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* View Modal */}
            {selectedPrescription && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Prescription Details</h2>
                                <p className="text-sm text-slate-500">{selectedPrescription.id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedPrescription(null)}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Patient</p>
                                    <p className="font-bold text-slate-800">{selectedPrescription.patient || selectedPrescription.patient_name || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                                    <p className="font-bold text-slate-800">{selectedPrescription.date}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-800 mb-3">Medications</h3>
                                <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-100/50 text-slate-500">
                                            <tr>
                                                <th className="px-4 py-3 font-medium">Medicine</th>
                                                <th className="px-4 py-3 font-medium">Dosage</th>
                                                <th className="px-4 py-3 font-medium">Frequency</th>
                                                <th className="px-4 py-3 font-medium">Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {selectedPrescription.medications.map((med, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-4 py-3 font-medium text-slate-700">{med.name}</td>
                                                    <td className="px-4 py-3 text-slate-600">{med.dosage}</td>
                                                    <td className="px-4 py-3 text-slate-600">{med.frequency}</td>
                                                    <td className="px-4 py-3 text-slate-600">{med.duration}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedPrescription(null)}
                                className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => handlePrint(selectedPrescription)}
                                className="btn-primary px-4 py-2 flex items-center gap-2"
                            >
                                <Printer className="w-4 h-4" /> Print
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Prescriptions;
