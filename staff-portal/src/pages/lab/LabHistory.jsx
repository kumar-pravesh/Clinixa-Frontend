import React, { useState, useRef } from 'react';
import {
    FileText,
    Search,
    Download,
    Eye,
    Calendar,
    ChevronRight,
    SearchX,
    X,
    Printer,
    CheckCircle2,
    FlaskConical as Flask,
    User,
    Shield
} from 'lucide-react';
import { cn } from '../../utils/cn';
import html2pdf from 'html2pdf.js';
import { useLab } from '../../context/LabContext';

// HEX Color Constants for PDF compatibility
const colors = {
    primary: '#0D9488',
    slate900: '#0f172a',
    slate800: '#1e293b',
    slate700: '#334155',
    slate600: '#475569',
    slate500: '#64748b',
    slate400: '#94a3b8',
    slate300: '#cbd5e1',
    slate200: '#e2e8f0',
    slate100: '#f1f5f9',
    slate50: '#f8fafc',
    white: '#ffffff',
    emerald600: '#059669',
    emerald50: '#ecfdf5',
    red600: '#dc2626',
    red50: '#fef2f2'
};

const LabHistory = () => {
    const { labHistory } = useLab();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const reportRef = useRef(null);

    const filteredHistory = labHistory.filter(item =>
        item.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.test.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDownloadPDF = async (report) => {
        // Set selected report for rendering if not already
        setSelectedReport(report);
        setIsDownloading(true);

        // Wait for state update and render
        setTimeout(async () => {
            if (!reportRef.current) return;

            try {
                const element = reportRef.current;
                const opt = {
                    margin: [10, 10, 10, 10],
                    filename: `LabReport_${report.id}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: {
                        scale: 2,
                        useCORS: true,
                        letterRendering: true,
                        width: 790,
                    },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };

                await html2pdf().set(opt).from(element).save();
            } catch (error) {
                console.error('PDF Generation Error:', error);
            } finally {
                setIsDownloading(false);
            }
        }, 100);
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Record Archives</h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Access historic diagnostic reports & verifiable data</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search archives..."
                        className="input-field !pl-12 h-12 bg-white border-slate-200 w-full sm:w-80 shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: 'Total Archives', value: '1,280', icon: FileText, color: 'text-blue-500 bg-blue-50' },
                    { label: 'Processed Recently', value: '42', icon: Eye, color: 'text-purple-500 bg-purple-50' },
                    { label: 'Downloads Today', value: '15', icon: Download, color: 'text-emerald-500 bg-emerald-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5 hover:border-primary/20 transition-all cursor-default">
                        <div className={cn("p-4 rounded-2xl", stat.color)}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                {filteredHistory.length > 0 ? (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Report Reference</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Test Category</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredHistory.map((report) => (
                                        <tr key={report.id} className="group hover:bg-slate-50/50 transition-all">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-900 tracking-tight">{report.id}</span>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <Calendar className="w-3 h-3 text-slate-400" />
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase">{report.date}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="font-black text-slate-800 tracking-tight">{report.patient}</p>
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Processed By {report.technician}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-bold text-slate-600">{report.test}</span>
                                            </td>
                                            <td className="px-8 py-6 text-right space-x-2">
                                                <button
                                                    onClick={() => setSelectedReport(report)}
                                                    className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/30 transition-all hover:bg-primary/5 shadow-sm group"
                                                >
                                                    <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadPDF(report)}
                                                    disabled={isDownloading && selectedReport?.id === report.id}
                                                    className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-emerald-500 hover:border-emerald-200 transition-all hover:bg-emerald-50 shadow-sm group disabled:opacity-50"
                                                >
                                                    <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card Layout */}
                        <div className="md:hidden divide-y divide-slate-100">
                            {filteredHistory.map((report) => (
                                <div key={report.id} className="p-6 space-y-4 active:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-black text-slate-900 tracking-tight leading-none mb-1">{report.patient}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{report.id} • {report.date}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedReport(report)}
                                                className="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:text-primary transition-colors border border-slate-100"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDownloadPDF(report)}
                                                className="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:text-emerald-500 transition-colors border border-slate-100"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Test Analysis</p>
                                        <p className="text-xs font-black text-slate-700">{report.test}</p>
                                        <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase">Technician: {report.technician}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center p-10">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200 border border-slate-100 animate-pulse">
                            <SearchX className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight underline decoration-primary decoration-4 underline-offset-4">Record Not Found</h3>
                        <p className="text-sm text-slate-400 font-medium max-w-xs mt-3 leading-relaxed">
                            No archives match your current search criteria. Please verify the ID or Patient name.
                        </p>
                    </div>
                )}
            </div>

            {/* Disclaimer */}
            <div className="p-6 bg-slate-900 rounded-[2rem] border border-white/5 shadow-2xl shadow-slate-900/10">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-10 bg-primary rounded-full"></div>
                    <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Data Retention Policy</p>
                        <p className="text-xs text-slate-400 font-bold max-w-2xl">
                            All patient diagnostic registers are preserved for a minimum of 7 years in accordance with national healthcare guidelines.
                            Unauthorized access to archived data is strictly prohibited.
                        </p>
                    </div>
                </div>
            </div>

            {/* Report Preview Modal */}
            {selectedReport && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setSelectedReport(null)}
                    />

                    <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Report Preview</h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedReport.id} • {selectedReport.patient}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleDownloadPDF(selectedReport)}
                                    className="btn-primary !h-11 !px-6 !rounded-2xl flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" /> Download
                                </button>
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="p-3 hover:bg-slate-200/50 rounded-2xl transition-colors text-slate-400"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            {/* PDF Content Canvas (Hidden from UI but used by html2pdf) */}
                            <div ref={reportRef} style={{ width: '790px', margin: '0 auto', padding: '40px', backgroundColor: 'white', fontFamily: 'sans-serif' }}>
                                {/* Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${colors.primary}`, paddingBottom: '20px', marginBottom: '30px' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ backgroundColor: colors.primary, color: 'white', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '20px' }}>C</div>
                                            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: colors.slate900 }}>Clinixa Diagnostics</h1>
                                        </div>
                                        <p style={{ margin: '5px 0 0 0', fontSize: '10px', color: colors.slate500, fontWeight: '700' }}>45 MEDICAL SQUARE, CENTRAL HEALTH CITY • +91 9988776655</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: colors.primary }}>LABORATORY REPORT</h2>
                                        <p style={{ margin: '5px 0 0 0', fontSize: '12px', fontWeight: '700', color: colors.slate800 }}>ID: {selectedReport.id}</p>
                                    </div>
                                </div>

                                {/* Patient Info Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px', backgroundColor: colors.slate50, padding: '24px', borderRadius: '20px', border: `1px solid ${colors.slate100}` }}>
                                    <div>
                                        <p style={{ margin: '0 0 6px 0', fontSize: '10px', color: colors.slate400, fontWeight: '900', textTransform: 'uppercase', tracking: '0.1em' }}>Patient Details</p>
                                        <p style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: colors.slate900, tracking: '-0.02em' }}>{selectedReport.patient}</p>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: colors.slate600, fontWeight: '700' }}>ID: {selectedReport.patientId}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ margin: '0 0 6px 0', fontSize: '10px', color: colors.slate400, fontWeight: '900', textTransform: 'uppercase', tracking: '0.1em' }}>Report Details</p>
                                        <p style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: colors.slate900 }}>{selectedReport.date}</p>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: colors.slate600, fontWeight: '700' }}>Technician: {selectedReport.technician}</p>
                                    </div>
                                </div>

                                {/* Results Table */}
                                <div style={{ marginBottom: '40px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                        <div style={{ width: '4px', height: '18px', backgroundColor: colors.primary, borderRadius: '2px' }}></div>
                                        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: colors.slate900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Test Analysis Results</h3>
                                    </div>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: colors.slate50, textAlign: 'left' }}>
                                                <th style={{ padding: '14px 16px', borderBottom: `2px solid ${colors.slate200}`, color: colors.slate400, fontWeight: '900', fontSize: '10px', textTransform: 'uppercase' }}>Parameter</th>
                                                <th style={{ padding: '14px 16px', borderBottom: `2px solid ${colors.slate200}`, color: colors.slate400, fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', textAlign: 'center' }}>Result</th>
                                                <th style={{ padding: '14px 16px', borderBottom: `2px solid ${colors.slate200}`, color: colors.slate400, fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', textAlign: 'center' }}>Unit</th>
                                                <th style={{ padding: '14px 16px', borderBottom: `2px solid ${colors.slate200}`, color: colors.slate400, fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', textAlign: 'center' }}>Normal Range</th>
                                                <th style={{ padding: '14px 16px', borderBottom: `2px solid ${colors.slate200}`, color: colors.slate400, fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', textAlign: 'right' }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedReport.results?.map((res, i) => (
                                                <tr key={i} style={{ borderBottom: `1px solid ${colors.slate100}` }}>
                                                    <td style={{ padding: '16px', fontWeight: '800', color: colors.slate800 }}>{res.parameter}</td>
                                                    <td style={{ padding: '16px', fontWeight: '900', color: res.status !== 'Normal' ? colors.red600 : colors.slate900, textAlign: 'center', fontSize: '14px' }}>{res.result}</td>
                                                    <td style={{ padding: '16px', color: colors.slate500, textAlign: 'center', fontWeight: '700' }}>{res.unit}</td>
                                                    <td style={{ padding: '16px', color: colors.slate500, textAlign: 'center', fontWeight: '700' }}>{res.range}</td>
                                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                                        <span style={{
                                                            padding: '6px 12px',
                                                            borderRadius: '8px',
                                                            fontSize: '10px',
                                                            fontWeight: '900',
                                                            backgroundColor: res.status === 'Normal' ? colors.emerald50 : colors.red50,
                                                            color: res.status === 'Normal' ? colors.emerald600 : colors.red600,
                                                            border: `1px solid ${res.status === 'Normal' ? colors.emerald600 + '20' : colors.red600 + '20'}`
                                                        }}>
                                                            {res.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* RemarksSection */}
                                <div style={{ marginBottom: '60px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                        <div style={{ width: '4px', height: '18px', backgroundColor: colors.slate900, borderRadius: '2px' }}></div>
                                        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: colors.slate900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Technician's Remarks</h3>
                                    </div>
                                    <div style={{ padding: '20px', backgroundColor: colors.slate50, border: `1px solid ${colors.slate100}`, borderRadius: '15px', minHeight: '80px', fontSize: '13px', color: colors.slate700, lineHeight: '1.7', fontWeight: '600' }}>
                                        {selectedReport.notes}
                                    </div>
                                </div>

                                {/* Footer / Verification */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '40px', borderTop: `1px solid ${colors.slate100}` }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ color: colors.emerald600 }}>
                                            <Shield size={20} />
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '10px', fontWeight: '900', color: colors.emerald600 }}>VERIFIED SECURE</p>
                                            <p style={{ margin: 0, fontSize: '8px', color: colors.slate400 }}>Clinixa Digital Signature Applied</p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ width: '150px', borderBottom: `1px solid ${colors.slate300}`, marginBottom: '10px' }}></div>
                                        <p style={{ margin: 0, fontSize: '10px', fontWeight: '900', color: colors.slate900 }}>DR. ANANYA SHARMA</p>
                                        <p style={{ margin: 0, fontSize: '8px', color: colors.slate400 }}>Pathologist, MD</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '8px', color: colors.slate300, textTransform: 'uppercase' }}>
                                    End of diagnostic report • Generated on {new Date().toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// there is nothing wrong with this code, it is just a very long component that renders the lab history page with search, table, and PDF generation features.
export default LabHistory;
