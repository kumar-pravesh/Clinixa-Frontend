import React, { useState } from 'react';
import {
    Upload,
    File,
    X,
    CheckCircle2,
    AlertCircle,
    Search,
    User,
    Clipboard,
    ArrowLeft,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { useLab } from '../../context/LabContext';
import { cn } from '../../utils/cn';

const ReportUpload = () => {
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const { labQueue, completeLabTest } = useLab();
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [remarks, setRemarks] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedPatient || !selectedFile) return;

        setIsUploading(true);
        // Simulate upload delay
        setTimeout(() => {
            const mockReportData = {
                notes: remarks || 'All parameters within specified limits.',
                results: [
                    { parameter: 'Diagnostic Accuracy', result: '99.9%', range: '99-100%', unit: '%', status: 'Normal' }
                ]
            };

            completeLabTest(selectedPatient.id, mockReportData);

            setIsUploading(false);
            addNotification({
                type: 'emergency',
                title: 'Report Uploaded',
                message: `Diagnostic report for ${selectedPatient.patient} has been processed successfully.`
            });
            navigate('/lab/history');
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500 pb-20 px-4 sm:px-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/lab')}
                    className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all group"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Report Processing</h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Upload verified diagnostic results to patient records.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Left Side - Selection */}
                <div className="md:col-span-2 space-y-6">
                    <div className="dashboard-card !p-8">
                        <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tight">
                            <Search className="w-5 h-5 text-primary" /> Find Test Record
                        </h2>

                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Patient Name or LAB ID"
                                className="input-field !pl-12 h-12 bg-slate-50 border-slate-200 text-sm font-bold"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="space-y-3">
                            {labQueue.filter(p =>
                                p.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                p.id.toLowerCase().includes(searchQuery.toLowerCase())
                            ).map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedPatient(p)}
                                    className={cn(
                                        "w-full p-5 text-left rounded-2xl border-2 transition-all group",
                                        selectedPatient?.id === p.id
                                            ? "bg-primary/5 border-primary shadow-lg shadow-primary/5"
                                            : "bg-white border-slate-100 hover:border-slate-200"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <p className={cn("text-sm font-bold transition-colors", selectedPatient?.id === p.id ? "text-primary" : "text-slate-800")}>{p.patient}</p>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{p.id}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">{p.test}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side - Upload Form */}
                <div className="md:col-span-3">
                    <form onSubmit={handleUpload} className="dashboard-card !p-8 space-y-8 min-h-[500px] flex flex-col justify-between">
                        <div>
                            <h2 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2 uppercase tracking-tight">
                                <Upload className="w-5 h-5 text-primary" /> File Submission
                            </h2>

                            {selectedPatient ? (
                                <div className="space-y-8 animate-in fade-in duration-300">
                                    {/* Selected Patient Info */}
                                    <div className="p-6 bg-slate-900 rounded-[2rem] text-white flex items-center gap-5 shadow-xl shadow-slate-900/10 border border-white/5">
                                        <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center border border-white/10">
                                            <User className="w-8 h-8 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black tracking-wide">{selectedPatient.patient}</p>
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-1">{selectedPatient.test}</p>
                                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Ref: {selectedPatient.department}</p>
                                        </div>
                                    </div>

                                    {/* Upload Area */}
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id="file-upload"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className={cn(
                                                "flex flex-col items-center justify-center p-12 border-4 border-dashed rounded-[3rem] transition-all cursor-pointer group",
                                                selectedFile
                                                    ? "bg-emerald-50 border-emerald-200"
                                                    : "bg-slate-50 border-slate-200 hover:border-primary/30 hover:bg-primary/[0.02]"
                                            )}
                                        >
                                            {selectedFile ? (
                                                <div className="text-center">
                                                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500 border border-emerald-500/20">
                                                        <CheckCircle2 className="w-10 h-10" />
                                                    </div>
                                                    <p className="text-sm font-black text-slate-800 mb-1">{selectedFile.name}</p>
                                                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">File attached successfully</p>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-400 group-hover:text-primary transition-all shadow-lg group-hover:shadow-primary/20 border border-slate-100 group-hover:border-primary/20 transform group-hover:-translate-y-2">
                                                        <File className="w-10 h-10" />
                                                    </div>
                                                    <p className="text-sm font-black text-slate-800 mb-2 tracking-tight">Click or drop report here</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">Support for PDF, JPG (Max 10MB)</p>
                                                </div>
                                            )}
                                        </label>
                                        {selectedFile && (
                                            <button
                                                type="button"
                                                onClick={() => setSelectedFile(null)}
                                                className="absolute -top-3 -right-3 w-10 h-10 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 shadow-lg hover:border-red-100 transition-all"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Report Summary */}
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Technician's Summary / Remarks</label>
                                        <textarea
                                            rows="3"
                                            placeholder="Enter key findings or observations..."
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                            value={remarks}
                                            onChange={(e) => setRemarks(e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 pb-20">
                                    <Clipboard className="w-20 h-20 mb-6 text-slate-300" />
                                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Please select a patient <br /> record from the list</p>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!selectedPatient || !selectedFile || isUploading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-slate-900/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-30 disabled:hover:scale-100"
                        >
                            {isUploading ? (
                                <div className="flex items-center gap-3">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                    <span className="tracking-widest text-xs uppercase">Uploading Record...</span>
                                </div>
                            ) : (
                                <span className="tracking-widest text-xs uppercase">Verify & Upload Result</span>
                            )}
                        </button>
                    </form>
                    <div className="mt-6 flex items-start gap-4 p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100">
                        <AlertCircle className="w-6 h-6 text-blue-500 mt-1 shrink-0" />
                        <div>
                            <h4 className="font-black text-blue-800 uppercase tracking-wide text-[10px] mb-1">Upload Compliance</h4>
                            <p className="text-xs text-blue-700/80 leading-relaxed font-bold">
                                All reports must be verified by a senior technician. By clicking upload, you confirm that the result has undergone quality control.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportUpload;
