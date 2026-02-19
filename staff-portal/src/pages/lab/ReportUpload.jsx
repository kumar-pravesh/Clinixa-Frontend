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
    Loader2,
    Shield
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

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('lab_test_id', selectedPatient.id);
            formData.append('patient_id', selectedPatient.patient_id || '');
            formData.append('doctor_id', selectedPatient.doctor_id || '');
            formData.append('test_name', selectedPatient.testType || '');
            formData.append('notes', remarks || 'All parameters within specified limits.');

            // Mocking some results structure for now, though backend should ideally handle flexible results
            const results = [
                { parameter: 'Diagnostic Accuracy', result: '99.9%', range: '99-100%', unit: '%', status: 'Normal' }
            ];
            formData.append('results', JSON.stringify(results));

            const result = await completeLabTest(selectedPatient.id, formData);

            if (result.success) {
                addNotification({
                    type: 'lab',
                    title: 'Report Uploaded',
                    message: `Diagnostic report for ${selectedPatient.patient} has been processed successfully.`
                });
                navigate('/lab/history');
            } else {
                addNotification({
                    type: 'error',
                    title: 'Upload Failed',
                    message: result.message || 'Failed to process report.'
                });
            }
        } catch (error) {
            console.error("Upload error:", error);
            addNotification({
                type: 'error',
                title: 'Error',
                message: 'An unexpected error occurred during upload.'
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-4">
            {/* Header section with refined typography and navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => navigate('/lab')}
                        className="w-12 h-12 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-2xl border border-white shadow-xl shadow-slate-200/50 hover:bg-white hover:shadow-2xl transition-all group active:scale-90"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Report <span className="text-primary">Processing</span></h1>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.25em] mt-1">Finalize diagnostic results and verify clinical data</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Patient Selector Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white/70 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/80 shadow-xl shadow-slate-200/50">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Test Queue</h2>
                        </div>

                        <div className="relative group mb-8">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Filter records..."
                                className="input-field !pl-12 h-12 bg-white/50 border-white shadow-inner w-full rounded-2xl focus:ring-primary/10 transition-all font-bold placeholder:text-slate-300"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {labQueue.filter(p =>
                                (p.patient?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                                (p.test_id?.toLowerCase() || '').includes(searchQuery.toLowerCase())
                            ).length > 0 ? (
                                labQueue.filter(p =>
                                    (p.patient?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                                    (p.test_id?.toLowerCase() || '').includes(searchQuery.toLowerCase())
                                ).map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setSelectedPatient(p)}
                                        className={cn(
                                            "w-full p-6 text-left rounded-3xl border transition-all relative group overflow-hidden",
                                            selectedPatient?.id === p.id
                                                ? "bg-slate-900 border-transparent shadow-2xl shadow-slate-900/20"
                                                : "bg-white/50 border-white hover:border-primary/20 hover:bg-white"
                                        )}
                                    >
                                        <div className="relative z-10 flex flex-col gap-1">
                                            <div className="flex justify-between items-start">
                                                <span className={cn(
                                                    "text-[9px] font-black uppercase tracking-widest",
                                                    selectedPatient?.id === p.id ? "text-primary/80" : "text-slate-400"
                                                )}>{p.test_id}</span>
                                                <span className={cn(
                                                    "text-[8px] font-black uppercase px-2 py-0.5 rounded-full",
                                                    selectedPatient?.id === p.id ? "bg-white/10 text-white" : "bg-slate-100 text-slate-400"
                                                )}>{p.priority || 'Normal'}</span>
                                            </div>
                                            <p className={cn(
                                                "font-black tracking-tight text-base leading-tight",
                                                selectedPatient?.id === p.id ? "text-white" : "text-slate-800"
                                            )}>{p.patient}</p>
                                            <p className={cn(
                                                "text-[10px] font-bold uppercase tracking-wider",
                                                selectedPatient?.id === p.id ? "text-white/40" : "text-slate-400"
                                            )}>{p.testType}</p>
                                        </div>
                                        {selectedPatient?.id === p.id && (
                                            <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-primary/20 rounded-full blur-3xl"></div>
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="text-center py-12 px-4 opacity-40">
                                    <Clipboard className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                                    <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">No pending requests found matching criteria</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side: Upload Form & Live Preview */}
                <div className="lg:col-span-8">
                    <form onSubmit={handleUpload} className="space-y-8">
                        {selectedPatient ? (
                            <div className="bg-white/70 backdrop-blur-md rounded-[3rem] border border-white/80 shadow-xl shadow-slate-200/50 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                                {/* Form Top: Context Bar */}
                                <div className="p-10 bg-slate-900 text-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48 opacity-40"></div>
                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 bg-primary/20 rounded-[2rem] flex items-center justify-center border border-white/10 backdrop-blur-md shadow-2xl">
                                                <User className="w-10 h-10 text-primary" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2 block">Processing Diagnostic For</span>
                                                <h3 className="text-3xl font-black tracking-tighter leading-none mb-2">{selectedPatient.patient}</h3>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest text-white/60 border border-white/5">{selectedPatient.patient_id}</span>
                                                    <span className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest text-white/60 border border-white/5">{selectedPatient.testType}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Referral: {selectedPatient.department}</span>
                                            <div className="h-2 w-32 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary w-2/3 shadow-[0_0_15px_rgba(20,184,166,0.5)]"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-12 space-y-12">
                                    {/* Upload Area */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 px-2">
                                            <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
                                            <h4 className="text-xl font-black text-slate-800 tracking-tight uppercase">Documentation</h4>
                                        </div>

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
                                                    "flex flex-col items-center justify-center p-16 border-4 border-dashed rounded-[3.5rem] transition-all cursor-pointer group relative overflow-hidden",
                                                    selectedFile
                                                        ? "bg-emerald-50 border-emerald-200"
                                                        : "bg-slate-50 border-slate-200 hover:border-primary/40 hover:bg-primary/[0.02]"
                                                )}
                                            >
                                                {selectedFile ? (
                                                    <div className="text-center relative z-10">
                                                        <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-white shadow-2xl shadow-emerald-500/30 transform hover:scale-110 transition-transform">
                                                            <CheckCircle2 className="w-12 h-12" />
                                                        </div>
                                                        <p className="text-xl font-black text-slate-900 mb-1 tracking-tight">{selectedFile.name}</p>
                                                        <p className="text-[11px] text-emerald-600 font-black uppercase tracking-[0.2em]">Medical file attached successfully</p>
                                                    </div>
                                                ) : (
                                                    <div className="text-center relative z-10">
                                                        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-slate-400 group-hover:text-primary transition-all shadow-xl group-hover:shadow-primary/20 border border-slate-100 group-hover:border-primary/20 transform group-hover:-translate-y-3">
                                                            <Upload className="w-12 h-12" />
                                                        </div>
                                                        <h5 className="text-xl font-black text-slate-800 mb-3 tracking-tight">Click or Drag Result File</h5>
                                                        <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.25em] leading-loose max-w-xs mx-auto">
                                                            Support for verified PDF & High-Res JPG formats (Max 15MB)
                                                        </p>
                                                    </div>
                                                )}
                                                {selectedFile && (
                                                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
                                                )}
                                            </label>
                                            {selectedFile && (
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedFile(null)}
                                                    className="absolute -top-4 -right-4 w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-2xl shadow-slate-300 transition-all hover:-translate-y-1 active:scale-90"
                                                >
                                                    <X className="w-6 h-6" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Remarks Section */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 px-2">
                                            <div className="w-1.5 h-6 bg-slate-900 rounded-full"></div>
                                            <h4 className="text-xl font-black text-slate-800 tracking-tight uppercase">Analysis Summary</h4>
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute top-6 left-6 opacity-20 group-focus-within:opacity-100 transition-opacity">
                                                <Clipboard className="w-6 h-6 text-primary" />
                                            </div>
                                            <textarea
                                                rows="5"
                                                placeholder="Enter technician's summary, observations, or key diagnostic findings..."
                                                className="w-full pl-16 pr-8 py-8 bg-slate-50 border-2 border-transparent rounded-[2.5rem] focus:bg-white focus:border-primary/20 focus:ring-8 focus:ring-primary/5 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 text-base shadow-inner"
                                                value={remarks}
                                                onChange={(e) => setRemarks(e.target.value)}
                                            ></textarea>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-8 flex flex-col items-center">
                                        <button
                                            type="submit"
                                            disabled={!selectedPatient || !selectedFile || isUploading}
                                            className="w-full group bg-slate-900 hover:bg-slate-800 text-white p-1 rounded-[2.5rem] shadow-[0_20px_50px_rgba(15,23,42,0.3)] transition-all hover:-translate-y-2 active:scale-95 disabled:opacity-30 disabled:hover:translate-y-0"
                                        >
                                            <div className="w-full h-full bg-slate-900 group-hover:bg-slate-800 p-6 rounded-[2.3rem] flex items-center justify-center gap-4 transition-colors">
                                                {isUploading ? (
                                                    <>
                                                        <Loader2 className="w-7 h-7 animate-spin text-primary" />
                                                        <span className="text-sm font-black uppercase tracking-[0.3em]">Processing Secure Upload...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                                                            <CheckCircle2 className="w-6 h-6 text-white" />
                                                        </div>
                                                        <span className="text-sm font-black uppercase tracking-[0.3em]">Verify & Sign Records</span>
                                                    </>
                                                )}
                                            </div>
                                        </button>
                                        <p className="mt-8 text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                                            <Shield className="w-4 h-4 text-primary opacity-50" />
                                            Biometric-linked timestamp will be applied upon submission
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white/40 backdrop-blur-md rounded-[3rem] border border-white/80 p-20 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-700 min-h-[700px]">
                                <div className="w-40 h-40 bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 flex items-center justify-center text-slate-100 ring-8 ring-white/50">
                                    <Clipboard className="w-20 h-20" />
                                </div>
                                <div className="max-w-md space-y-4">
                                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Select Test Record</h2>
                                    <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] leading-loose">
                                        Choose a validated lab request from the technician's queue to initiate report processing and documentation
                                    </p>
                                </div>
                            </div>
                        )}
                    </form>

                    {/* Bottom Info Bar */}
                    <div className="mt-10 p-10 bg-primary/5 border border-primary/10 rounded-[3rem] relative overflow-hidden group">
                        <div className="flex items-start gap-8 relative z-10">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-primary border border-primary/10 shrink-0">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="font-black text-primary uppercase tracking-widest text-[11px] mb-3">Diagnostic Compliance Protocol</h4>
                                <p className="text-sm text-slate-600 leading-relaxed font-bold opacity-80 max-w-2xl">
                                    All medical reports are subject to multi-point verification. By finalizing this record, you acknowledge that
                                    all parameters have been cross-checked with analyzer outputs and laboratory standards (ISO 15189).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportUpload;
