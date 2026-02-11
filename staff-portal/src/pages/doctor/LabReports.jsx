import React, { useState } from 'react';
import { Search, Upload, FileText, Download, Eye, Calendar, User, Printer, X, CheckCircle, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useDoctor } from '../../context/DoctorContext';

const LabReports = () => {
    const { labReports, uploadLabReport, updateLabReportStatus } = useDoctor();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);

    const handleUpload = () => {
        // Simulating a file upload for now
        const newReport = {
            patient: 'Alice Johnson',
            test: 'MRI Scan',
            status: 'Pending'
        };
        uploadLabReport(newReport);
        alert('Simulated Report Uploaded!');
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
                        <p><strong>Patient Name:</strong> ${report.patient}</p>
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
                        onClick={handleUpload}
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
                            {labReports.filter(r => r.patient.toLowerCase().includes(searchTerm.toLowerCase())).map((report) => (
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
                                            {report.patient}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-medium text-slate-700">
                                        {report.test}
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
                                                onClick={() => setSelectedReport(report)}
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
                    {labReports.filter(r => r.patient.toLowerCase().includes(searchTerm.toLowerCase())).map((report) => (
                        <div key={report.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{report.patient}</h3>
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
                                    <p className="font-medium text-slate-700">{report.test}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                                    <p className="font-medium text-slate-700">{report.date}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2 border-t border-slate-50">
                                <button
                                    onClick={() => setSelectedReport(report)}
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
        </div>
    );
};

export default LabReports;
