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
        (item.patient?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (item.test_id?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (item.testType?.toLowerCase() || '').includes(searchQuery.toLowerCase())
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
                    filename: `LabReport_${report.test_id}.pdf`,
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
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Archives & <span className="text-primary">Reports</span></h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.25em] mt-1">Access historic diagnostic records and verifiable medical data</p>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search archives by patient or ID..."
                        className="input-field !pl-12 h-14 bg-white/70 backdrop-blur-md border-white shadow-xl shadow-slate-200/50 w-full sm:w-96 rounded-2xl focus:ring-primary/10 transition-all placeholder:text-slate-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {[
                    { label: 'Total Archives', value: labHistory.length.toString(), icon: FileText, color: 'bg-primary shadow-primary/20' },
                    { label: 'Today Processed', value: labHistory.filter(h => h.completedDate === new Date().toISOString().split('T')[0]).length.toString(), icon: Eye, color: 'bg-orange-500 shadow-orange-500/20' },
                    { label: 'Verifiable Data', value: '100%', icon: Shield, color: 'bg-slate-900 shadow-slate-900/20' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white/70 backdrop-blur-md p-7 rounded-[2.5rem] border border-white/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/5 transition-all group overflow-hidden relative">
                        <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-[0.05] group-hover:scale-150 transition-transform duration-700", stat.color.split(' ')[0])}></div>
                        <div className="flex justify-between items-start mb-6">
                            <div className={cn("p-4 rounded-2xl text-white shadow-lg", stat.color)}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] mb-1 opacity-80">{stat.label}</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Area */}
            <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-white/80 shadow-xl shadow-slate-200/50 overflow-hidden min-h-[500px] relative">
                {filteredHistory.length > 0 ? (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="pl-10 pr-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Record ID</th>
                                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient / Subject</th>
                                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Test Category</th>
                                        <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Date</th>
                                        <th className="pl-6 pr-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredHistory.map((report) => (
                                        <tr key={report.id} className="group hover:bg-white transition-all duration-300">
                                            <td className="pl-10 pr-6 py-7">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">{report.test_id || report.id}</span>
                                                    <span className="text-[10px] text-slate-300 font-bold uppercase mt-1 tracking-widest">{report.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-7">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-500 text-xs shadow-inner uppercase group-hover:bg-primary/5 group-hover:text-primary transition-all">
                                                        {report.patient?.split(' ').map(n => n[0]).join('') || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-800 tracking-tight leading-none mb-1.5">{report.patient}</p>
                                                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.1em] opacity-70">Technician: {report.technician || 'System'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-7">
                                                <span className="text-sm font-black text-slate-700 tracking-tight">{report.testType}</span>
                                            </td>
                                            <td className="px-6 py-7">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-200"></div>
                                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{report.completedDate}</span>
                                                </div>
                                            </td>
                                            <td className="pl-6 pr-10 py-7 text-right">
                                                <div className="flex justify-end items-center gap-3">
                                                    <button
                                                        onClick={() => setSelectedReport(report)}
                                                        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest bg-white border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/30 transition-all hover:bg-primary/5 shadow-sm group active:scale-95"
                                                        title="View Preview"
                                                    >
                                                        <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDownloadPDF(report)}
                                                        disabled={isDownloading && selectedReport?.id === report.id}
                                                        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest bg-slate-900 border border-transparent text-white hover:bg-primary transition-all shadow-xl shadow-slate-900/10 group active:scale-95 disabled:opacity-50"
                                                        title="Generate PDF"
                                                    >
                                                        <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card Layout */}
                        <div className="md:hidden divide-y divide-slate-100">
                            {filteredHistory.map((report) => (
                                <div key={report.id} className="p-7 space-y-5 active:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-500 text-sm shadow-inner uppercase">
                                                {report.patient?.split(' ').map(n => n[0]).join('') || '?'}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 tracking-tight leading-none mb-1.5">{report.patient}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{report.test_id} • {report.completedDate}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDownloadPDF(report)}
                                            className="p-3.5 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-900/20 active:scale-90 transition-all"
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="bg-white border border-white shadow-inner p-5 rounded-[2rem] flex justify-between items-center group active:bg-slate-50 transition-all" onClick={() => setSelectedReport(report)}>
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-80">Test Analysis</p>
                                            <p className="text-sm font-black text-slate-800">{report.testType}</p>
                                            <p className="text-[9px] text-primary font-black uppercase tracking-widest opacity-70">Technician: {report.technician || 'System'}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center p-10 animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-slate-200/50 text-slate-200 ring-8 ring-slate-50/50">
                            <SearchX className="w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-3">Record Not Located</h3>
                        <p className="text-sm text-slate-400 font-black uppercase tracking-[0.1em] max-w-xs leading-relaxed">
                            Search produced no matches in medical archives
                        </p>
                    </div>
                )}
            </div>

            {/* Compliance Footer */}
            <div className="p-8 bg-slate-900/95 backdrop-blur-md rounded-[2.5rem] border border-white/5 shadow-2xl shadow-slate-950 overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-1.5 h-12 bg-primary rounded-full shadow-[0_0_15px_rgba(20,184,166,0.5)]"></div>
                    <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Security & Data Retention Policy</p>
                        <p className="text-sm text-slate-400 font-medium max-w-3xl leading-relaxed">
                            Clinixa systems maintain diagnostic registers for a mandatory period of 7 years.
                            All archive access is logged with biometric-linked timestamps for auditing.
                        </p>
                    </div>
                    <div className="ml-auto hidden lg:flex items-center gap-2 px-5 py-2.5 bg-white/5 rounded-2xl border border-white/10">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Verifiable Record</span>
                    </div>
                </div>
            </div>

            {/* Report Preview Modal */}
            {selectedReport && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500"
                        onClick={() => setSelectedReport(null)}
                    />

                    <div className="relative bg-white w-full max-w-5xl max-h-[92vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500 border border-white/10">
                        {/* Modal Header */}
                        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50 backdrop-blur-md">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-inner">
                                    <FileText className="w-7 h-7" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1.5">Diagnostic Report</h2>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 px-2 py-0.5 rounded-md">{selectedReport.test_id || selectedReport.id}</span>
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md">{selectedReport.patient}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleDownloadPDF(selectedReport)}
                                    className="h-14 px-8 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-3 active:scale-95"
                                >
                                    <Printer className="w-5 h-5" /> Download / Print
                                </button>
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="w-14 h-14 hover:bg-rose-50 rounded-2xl transition-all text-slate-400 hover:text-rose-500 flex items-center justify-center active:scale-90"
                                >
                                    <X className="w-7 h-7" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-0 bg-slate-100/30 custom-scrollbar">
                            <div className="max-w-[850px] mx-auto py-12 px-6">
                                {/* PDF Content Canvas */}
                                <div ref={reportRef} className="bg-white shadow-[0_0_50px_rgba(0,0,0,0.05)] rounded-t-lg mx-auto overflow-hidden" style={{ width: '790px', padding: '50px', backgroundColor: 'white', fontFamily: "'Outfit', 'Inter', system-ui, sans-serif" }}>
                                    {/* Header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `3px solid ${colors.primary}`, paddingBottom: '30px', marginBottom: '40px' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{ backgroundColor: colors.primary, color: 'white', width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '24px', boxShadow: `0 10px 20px ${colors.primary}40` }}>C</div>
                                                <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '900', color: colors.slate900, tracking: '-0.02em' }}>Clinixa Diagnostics</h1>
                                            </div>
                                            <p style={{ margin: '10px 0 0 0', fontSize: '11px', color: colors.slate500, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>45 MEDICAL SQUARE, CENTRAL HEALTH CITY • +91 9988776655</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: colors.primary, letterSpacing: '0.05em' }}>LABORATORY REPORT</h2>
                                            <p style={{ margin: '8px 0 0 0', fontSize: '14px', fontWeight: '800', color: colors.slate800 }}>REF NO: {selectedReport.test_id || selectedReport.id}</p>
                                        </div>
                                    </div>

                                    {/* Patient Info Grid */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', marginBottom: '50px', backgroundColor: colors.slate50, padding: '35px', borderRadius: '30px', border: `1px solid ${colors.white}`, boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)' }}>
                                        <div style={{ borderRight: `1px solid ${colors.slate200}`, paddingRight: '20px' }}>
                                            <p style={{ margin: '0 0 10px 0', fontSize: '10px', color: colors.slate400, fontWeight: '900', textTransform: 'uppercase', tracking: '0.2em' }}>Patient Information</p>
                                            <p style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: colors.slate900, letterSpacing: '-0.03em' }}>{selectedReport.patient}</p>
                                            <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                                                <p style={{ margin: 0, fontSize: '13px', color: colors.slate600, fontWeight: '700' }}>ID: <span style={{ color: colors.slate900 }}>{selectedReport.patientId || 'CLX-001'}</span></p>
                                                <p style={{ margin: 0, fontSize: '13px', color: colors.slate600, fontWeight: '700' }}>SEX: <span style={{ color: colors.slate900 }}>NOT SPECIFIED</span></p>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ margin: '0 0 10px 0', fontSize: '10px', color: colors.slate400, fontWeight: '900', textTransform: 'uppercase', tracking: '0.2em' }}>Analysis Details</p>
                                            <p style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: colors.slate900 }}>{selectedReport.completedDate || selectedReport.date}</p>
                                            <div style={{ marginTop: '8px' }}>
                                                <p style={{ margin: 0, fontSize: '13px', color: colors.primary, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{selectedReport.testType}</p>
                                                <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: colors.slate400, fontWeight: '700' }}>BY TECH: {selectedReport.technician?.toUpperCase() || 'SYSTEM'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Results Header */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', padding: '0 10px' }}>
                                        <div style={{ width: '6px', height: '24px', backgroundColor: colors.primary, borderRadius: '3px' }}></div>
                                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: colors.slate900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Quantitative Test Results</h3>
                                    </div>

                                    {/* Results Table */}
                                    <div style={{ marginBottom: '50px', border: `1px solid ${colors.slate100}`, borderRadius: '25px', overflow: 'hidden' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                            <thead>
                                                <tr style={{ backgroundColor: colors.slate50, textAlign: 'left' }}>
                                                    <th style={{ padding: '20px 24px', color: colors.slate400, fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Parameter Analysis</th>
                                                    <th style={{ padding: '20px 24px', color: colors.slate400, fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', textAlign: 'center' }}>Measured Result</th>
                                                    <th style={{ padding: '20px 24px', color: colors.slate400, fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', textAlign: 'center' }}>Unit</th>
                                                    <th style={{ padding: '20px 24px', color: colors.slate400, fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', textAlign: 'center' }}>Biological Range</th>
                                                    <th style={{ padding: '20px 24px', color: colors.slate400, fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', textAlign: 'right' }}>Interpretation</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedReport.results?.length > 0 ? selectedReport.results.map((res, i) => (
                                                    <tr key={i} style={{ borderTop: `1px solid ${colors.slate100}`, transition: 'background-color 0.2s' }}>
                                                        <td style={{ padding: '20px 24px', fontWeight: '800', color: colors.slate800 }}>{res.parameter}</td>
                                                        <td style={{ padding: '20px 24px', fontWeight: '900', color: res.status?.toLowerCase() !== 'normal' ? colors.red600 : colors.slate900, textAlign: 'center', fontSize: '16px' }}>{res.result}</td>
                                                        <td style={{ padding: '20px 24px', color: colors.slate400, textAlign: 'center', fontWeight: '700' }}>{res.unit}</td>
                                                        <td style={{ padding: '20px 24px', color: colors.slate400, textAlign: 'center', fontWeight: '700' }}>{res.range}</td>
                                                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                                            <div style={{
                                                                display: 'inline-block',
                                                                padding: '8px 16px',
                                                                borderRadius: '12px',
                                                                fontSize: '11px',
                                                                fontWeight: '900',
                                                                backgroundColor: res.status?.toLowerCase() === 'normal' ? colors.emerald50 : colors.red50,
                                                                color: res.status?.toLowerCase() === 'normal' ? colors.emerald600 : colors.red600,
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.05em'
                                                            }}>
                                                                {res.status}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: colors.slate300, fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em' }}>No data parameters found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Remarks Section */}
                                    <div style={{ marginBottom: '60px', padding: '0 10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                            <div style={{ width: '6px', height: '20px', backgroundColor: colors.slate900, borderRadius: '3px' }}></div>
                                            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: colors.slate900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pathologist Interpretation</h3>
                                        </div>
                                        <div style={{ padding: '30px', backgroundColor: colors.slate50, border: `1px solid ${colors.slate100}`, borderRadius: '25px', minHeight: '100px', fontSize: '14px', color: colors.slate700, lineHeight: '1.8', fontWeight: '600', position: 'relative' }}>
                                            <div style={{ position: 'absolute', top: '15px', right: '15px', opacity: 0.1 }}><FileText size={40} /></div>
                                            {selectedReport.notes || 'The clinical correlation is requested. Results are verified by automated analysis and reviewed by our certified pathologist.'}
                                        </div>
                                    </div>

                                    {/* Footer / Validation */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '40px', borderTop: `2px solid ${colors.slate100}`, padding: '40px 10px 0 10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ color: colors.emerald600 }}>
                                                <Shield size={28} />
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontSize: '11px', fontWeight: '900', color: colors.emerald600, letterSpacing: '0.1em' }}>VERIFIED & ENCRYPTED</p>
                                                <p style={{ margin: '3px 0 0 0', fontSize: '9px', color: colors.slate400, fontWeight: '700' }}>Clinixa Blockchain ID: {Math.random().toString(16).substring(2, 10).toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ width: '180px', height: '1px', backgroundColor: colors.slate300, marginBottom: '15px' }}></div>
                                            <p style={{ margin: 0, fontSize: '13px', fontWeight: '900', color: colors.slate900, tracking: '0.05em' }}>DR. ANANYA SHARMA, MD</p>
                                            <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: colors.slate400, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Lead Pathologist • Registration #CL-7782</p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '9px', color: colors.slate300, textTransform: 'uppercase', letterSpacing: '0.25em', fontWeight: '700' }}>
                                        End of verifiable diagnostic report • Generated on {new Date().toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LabHistory;
