import React, { useState } from 'react';
import { Search, Upload, FileText, Download, Eye, Calendar, User, Printer, X, CheckCircle, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useDoctor } from '../../context/DoctorContext';

const UploadModal = ({ isOpen, onClose, patients, onUpload }) => {
    const [selectedPatient, setSelectedPatient] = useState('');
    const [testName, setTestName] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPatient || !testName || !file) {
            alert('Please fill all fields and select a file.');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('patient_id', selectedPatient);
        formData.append('test_name', testName);
        formData.append('file', file);

        try {
            const success = await onUpload(formData);
            if (success) {
                onClose();
            }
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Upload Lab Report</h2>
                        <p className="text-sm text-slate-500 font-medium">Add a new medical report to patient record.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Select Patient</label>
                            <select
                                value={selectedPatient}
                                onChange={(e) => setSelectedPatient(e.target.value)}
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-xl text-sm outline-none transition-all appearance-none"
                                required
                            >
                                <option value="">Choose a patient...</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Test Name</label>
                            <input
                                type="text"
                                value={testName}
                                onChange={(e) => setTestName(e.target.value)}
                                placeholder="e.g., MRI Scan, Blood Test"
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-xl text-sm outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Report File (PDF/Image)</label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                    id="report-file"
                                    required
                                />
                                <label
                                    htmlFor="report-file"
                                    className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-slate-50 border-2 border-slate-200 border-dashed rounded-2xl appearance-none cursor-pointer hover:border-primary/40 hover:bg-primary/[0.02] group-hover:bg-primary/[0.02]"
                                >
                                    <div className="flex flex-center flex-col items-center gap-2">
                                        <Upload className="w-8 h-8 text-slate-300 group-hover:text-primary transition-colors" />
                                        <span className="text-xs font-bold text-slate-500 group-hover:text-primary">
                                            {file ? file.name : 'Drop file here or click to browse'}
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="flex-1 px-4 py-3.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:shadow-none"
                        >
                            {uploading ? 'Uploading...' : 'Upload Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const OrderTestModal = ({ isOpen, onClose, patients, onOrder }) => {
    const [selectedPatient, setSelectedPatient] = useState('');
    const [testName, setTestName] = useState('');
    const [category, setCategory] = useState('Diagnostic');
    const [priority, setPriority] = useState('Routine');
    const [notes, setNotes] = useState('');
    const [ordering, setOrdering] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPatient || !testName) {
            alert('Please select a patient and enter a test name.');
            return;
        }

        setOrdering(true);
        try {
            const success = await onOrder({
                patientId: selectedPatient,
                testName,
                category,
                priority,
                notes
            });
            if (success) {
                onClose();
            }
        } finally {
            setOrdering(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Order Lab Test</h2>
                        <p className="text-sm text-slate-500 font-medium">Request a new diagnostic test for a patient.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Select Patient</label>
                            <select
                                value={selectedPatient}
                                onChange={(e) => setSelectedPatient(e.target.value)}
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-xl text-sm outline-none transition-all appearance-none"
                                required
                            >
                                <option value="">Choose a patient...</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Test Name</label>
                                <input
                                    type="text"
                                    value={testName}
                                    onChange={(e) => setTestName(e.target.value)}
                                    placeholder="e.g., Blood Test"
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-xl text-sm outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-xl text-sm outline-none transition-all appearance-none"
                                >
                                    <option>Diagnostic</option>
                                    <option>Pathology</option>
                                    <option>Imaging</option>
                                    <option>Biochemistry</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Priority</label>
                            <div className="flex gap-3">
                                {['Routine', 'Urgent', 'STAT'].map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPriority(p)}
                                        className={cn(
                                            "flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                            priority === p
                                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                                : "bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300"
                                        )}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Notes / Instructions</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any specific instructions for the lab technician..."
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-xl text-sm outline-none transition-all min-h-[100px] resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={ordering}
                            className="flex-1 px-4 py-3.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:shadow-none"
                        >
                            {ordering ? 'Ordering...' : 'Place Order'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const LabReports = () => {
    const { labReports, uploadLabReport, requestLabTest, updateLabReportStatus, patients } = useDoctor();
    const [searchTerm, setSearchTerm] = useState('');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    const handleUpload = async (formData) => {
        const result = await uploadLabReport(formData);
        if (result.success) {
            setIsUploadModalOpen(false);
            return true;
        }
        return false;
    };

    const handleOrder = async (testData) => {
        const result = await requestLabTest(testData);
        if (result.success) {
            setIsOrderModalOpen(false);
            return true;
        }
        return false;
    };

    const handlePrint = (report) => {
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Lab Report - ${report.id}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 40px; }
                        .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                        .logo { font-size: 24px; font-weight: bold; color: #0f172a; }
                        .details { margin-bottom: 30px; }
                        .details p { margin: 5px 0; }
                        .content { margin-top: 40px; padding: 20px; border: 1px solid #ddd; background: #f9f9f9; text-align: center; }
                        .footer { margin-top: 50px; text-align: right; border-top: 1px solid #ddd; padding-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">Clinixa Hospital</div>
                        <p>Laboratory Report</p>
                    </div>
                    <div class="details">
                        <p><strong>Report ID:</strong> ${report.id}</p>
                        <p><strong>Patient Name:</strong> ${report.patient || report.patient_name || 'N/A'}</p>
                        <p><strong>Test Name:</strong> ${report.test}</p>
                        <p><strong>Date:</strong> ${report.date}</p>
                        <p><strong>Status:</strong> ${report.status}</p>
                    </div>
                    <div class="content">
                        <h3>Test Results</h3>
                        <p>This is a simulated placeholder for the actual test results and parameters.</p>
                        <p>In a real application, this would contain the detailed medical analysis.</p>
                    </div>
                    <div class="footer">
                        <p>Lab Technician Signature</p>
                    </div>
                    <script>
                        window.onload = function() { window.print(); window.close(); }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const toggleStatus = (report) => {
        const newStatus = report.status === 'Available' ? 'Reviewed' : 'Available';
        updateLabReportStatus(report.id, newStatus);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Lab Reports</h1>
                    <p className="text-slate-500">View and manage patient lab results.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search reports..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 rounded-xl text-sm outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setIsOrderModalOpen(true)}
                        className="btn-secondary flex items-center gap-2 px-4 py-2.5"
                    >
                        <Clock className="w-4 h-4" />
                        <span className="hidden sm:inline">Order Lab Test</span>
                    </button>
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="btn-primary flex items-center gap-2 px-4 py-2.5"
                    >
                        <Upload className="w-4 h-4" />
                        <span className="hidden sm:inline">Upload Report</span>
                    </button>
                </div>
            </div>

            <div className="bg-white/60 backdrop-blur-md rounded-[2rem] border border-white/50 shadow-sm overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200/60">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Report ID</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Test Name</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {labReports.filter(r => (r.patient || r.patient_name || '').toLowerCase().includes(searchTerm.toLowerCase())).map((report) => (
                                <tr key={report.id} className="group hover:bg-white transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-black text-slate-900 tracking-tight">{report.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 font-bold text-slate-800">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-slate-400" />
                                            {report.patient || report.patient_name || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-medium text-slate-700">
                                        {report.test_name || report.test}
                                    </td>
                                    <td className="px-8 py-6 text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {report.date}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <button
                                            onClick={() => toggleStatus(report)}
                                            className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all hover:opacity-80",
                                                report.status === 'Available' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                    report.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                        "bg-blue-50 text-blue-600 border-blue-100" // Reviewed
                                            )}
                                        >
                                            <span className={cn("w-1.5 h-1.5 rounded-full",
                                                report.status === 'Available' ? "bg-emerald-500" :
                                                    report.status === 'Pending' ? "bg-amber-500" : "bg-blue-500"
                                            )}></span>
                                            {report.status}
                                        </button>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handlePrint(report)}
                                                className="p-2 rounded-lg hover:bg-primary/5 text-slate-400 hover:text-primary transition-colors"
                                                title="View"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handlePrint(report)}
                                                className="p-2 rounded-lg hover:bg-primary/5 text-slate-400 hover:text-primary transition-colors"
                                                title="Download/Print"
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
                    {labReports.filter(r => (r.patient || r.patient_name || '').toLowerCase().includes(searchTerm.toLowerCase())).map((report) => (
                        <div key={report.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{report.patient || report.patient_name || 'N/A'}</h3>
                                        <span className="text-xs font-medium text-slate-400">{report.id}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleStatus(report)}
                                    className={cn(
                                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all hover:opacity-80",
                                        report.status === 'Available' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                            report.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                "bg-blue-50 text-blue-600 border-blue-100"
                                    )}
                                >
                                    <span className={cn("w-1.5 h-1.5 rounded-full",
                                        report.status === 'Available' ? "bg-emerald-500" :
                                            report.status === 'Pending' ? "bg-amber-500" : "bg-blue-500"
                                    )}></span>
                                    {report.status}
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Test</p>
                                    <p className="font-medium text-slate-700">{report.test_name || report.test}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                                    <p className="font-medium text-slate-700">{report.date}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2 border-t border-slate-50">
                                <button
                                    onClick={() => handlePrint(report)}
                                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Eye className="w-3 h-3" /> View
                                </button>
                                <button
                                    onClick={() => handlePrint(report)}
                                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-primary/5 text-primary hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Printer className="w-3 h-3" /> Print
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                patients={patients}
                onUpload={handleUpload}
            />
            <OrderTestModal
                isOpen={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
                patients={patients}
                onOrder={handleOrder}
            />
        </div>
    );
};

export default LabReports;
