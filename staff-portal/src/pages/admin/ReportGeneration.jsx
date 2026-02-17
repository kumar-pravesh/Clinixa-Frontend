import React, { useState, useEffect, useRef } from 'react';
import {
    BarChart3,
    FileText,
    Download,
    Search,
    PieChart,
    Activity,
    ArrowRight,
    FilePlus,
    TrendingUp,
    Loader2
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNotification } from '../../context/NotificationContext';
import api from '../../api/axios';
import html2pdf from 'html2pdf.js';

const ReportGeneration = () => {
    const { addNotification } = useNotification();
    const reportTemplateRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({
        revenue: 0,
        patients: 0,
        appointments: 0,
        doctors: 0
    });
    const [isExporting, setIsExporting] = useState(false);
    const [currentReportData, setCurrentReportData] = useState(null);

    const [reports, setReports] = useState([
        { id: 'REP-001', name: 'Annual Financial Audit', type: 'Financial', frequency: 'Yearly', lastRun: '2026-01-01', status: 'Ready' },
        { id: 'REP-002', name: 'Patient Demographic Analysis', type: 'Clinical', frequency: 'Monthly', lastRun: '2026-02-01', status: 'Ready' },
        { id: 'REP-003', name: 'Doctor Productivity Metrics', type: 'Performance', frequency: 'Weekly', lastRun: '2026-02-05', status: 'Ready' },
        { id: 'REP-004', name: 'Daily Revenue Reconciliation', type: 'Financial', frequency: 'Daily', lastRun: '2026-02-07', status: 'Ready' },
        { id: 'REP-005', name: 'Departmental Resource Usage', type: 'Operations', frequency: 'Monthly', lastRun: '2026-02-01', status: 'Ready' },
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [invoicesRes, patientsRes, aptRes, docsRes] = await Promise.all([
                    api.get('/admin/invoices'),
                    api.get('/admin/patients'),
                    api.get('/admin/appointments'),
                    api.get('/admin/doctors')
                ]);

                const totalRev = invoicesRes.data.reduce((acc, curr) => acc + (Number(curr.amount || curr.total) || 0), 0);

                setStats({
                    revenue: totalRev,
                    patients: patientsRes.data.length,
                    appointments: aptRes.data.length,
                    doctors: docsRes.data.length
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };
        fetchStats();
    }, []);

    const generateReportData = async (report) => {
        setIsExporting(true);
        addNotification({ type: 'info', title: 'Compiling Data', message: `Gathering data for ${report.name}...` });

        try {
            let data = {
                title: report.name,
                generatedAt: new Date().toLocaleString(),
                type: report.type,
                summary: [],
                columns: [],
                rows: []
            };

            if (report.id === 'REP-001') { // Annual Financial Audit
                const res = await api.get('/admin/invoices');
                // Group by month
                const monthly = res.data.reduce((acc, curr) => {
                    const month = new Date(curr.issued_date || curr.date).toLocaleString('default', { month: 'long', year: 'numeric' });
                    acc[month] = (acc[month] || 0) + (Number(curr.amount || curr.total) || 0);
                    return acc;
                }, {});

                data.columns = ['Period', 'Revenue Generated', 'Status'];
                data.rows = Object.entries(monthly).map(([month, amount]) => [
                    month,
                    `₹${amount.toLocaleString('en-IN')}`,
                    'Audited'
                ]);
                data.summary = [
                    { label: 'Total Annual Revenue', value: `₹${Object.values(monthly).reduce((a, b) => a + b, 0).toLocaleString('en-IN')}` },
                    { label: 'Fiscal Year', value: '2025-2026' }
                ];
            } else if (report.id === 'REP-002') { // Patient Demographics
                const res = await api.get('/admin/patients');
                data.columns = ['Patient Name', 'Gender', 'Age', 'Type'];
                data.rows = res.data.map(p => [
                    p.name,
                    p.gender || 'N/A',
                    p.age || 'N/A',
                    p.patient_type || 'General'
                ]);
                data.summary = [
                    { label: 'Total Patients Registered', value: res.data.length },
                    { label: 'Active Profiles', value: '100%' }
                ];
            } else if (report.id === 'REP-003') { // Doctor Productivity
                const [docs, apts] = await Promise.all([api.get('/admin/doctors'), api.get('/admin/appointments')]);
                data.columns = ['Doctor Name', 'Department', 'Total Appointments', 'Efficiency'];
                data.rows = docs.data.map(d => {
                    const count = apts.data.filter(a => a.doctor_id === d.id).length;
                    return [d.name, d.specialization || 'General', count, 'High'];
                });
                data.summary = [
                    { label: 'Total Medical Staff', value: docs.data.length },
                    { label: 'Total Consultations', value: apts.data.length }
                ];
            } else if (report.id === 'REP-004') { // Daily Revenue
                const res = await api.get('/admin/invoices');
                const today = new Date().toISOString().split('T')[0];
                const dailyData = res.data.filter(i => (i.issued_date || i.date)?.startsWith(today));
                data.columns = ['Invoice ID', 'Patient', 'Time', 'Amount'];
                if (dailyData.length > 0) {
                    data.rows = dailyData.map(i => [
                        i.invoice_number || i.id,
                        i.patient_name,
                        new Date(i.issued_date || i.date).toLocaleTimeString(),
                        `₹${Number(i.amount || i.total).toLocaleString('en-IN')}`
                    ]);
                } else {
                    data.rows = [];
                }

                const dailyTotal = dailyData.reduce((acc, curr) => acc + (Number(curr.amount || curr.total) || 0), 0);
                data.summary = [
                    { label: 'Daily Collection', value: `₹${dailyTotal.toLocaleString('en-IN')}` },
                    { label: 'Transaction Count', value: dailyData.length }
                ];
            } else if (report.id === 'REP-005') { // Department Usage
                const [deps, docs] = await Promise.all([api.get('/admin/departments'), api.get('/admin/doctors')]);
                data.columns = ['Department Name', 'Head', 'Staff Count', 'Status'];
                data.rows = deps.data.map(d => {
                    const staffCount = docs.data.filter(doc => doc.department === d.name).length;
                    return [d.name, d.head_doctor || 'N/A', staffCount, 'Active'];
                });
                data.summary = [
                    { label: 'Active Departments', value: deps.data.length },
                    { label: 'Operational Capacity', value: '100%' }
                ];
            }

            setCurrentReportData(data);

            // Wait for render
            setTimeout(async () => {
                if (reportTemplateRef.current) {
                    const opt = {
                        margin: [10, 10, 10, 10],
                        filename: `${report.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`,
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 2, useCORS: true },
                        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                    };
                    await html2pdf().set(opt).from(reportTemplateRef.current).save();

                    addNotification({ type: 'success', title: 'Export Complete', message: `${report.name} downloaded successfully.` });
                }
                setIsExporting(false);
                setCurrentReportData(null);
            }, 500);

        } catch (error) {
            console.error(error);
            addNotification({ type: 'error', title: 'Export Failed', message: 'Could not generate report data.' });
            setIsExporting(false);
            setCurrentReportData(null);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Ready': return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case 'Processing': return "bg-blue-50 text-blue-600 border-blue-100";
            default: return "bg-slate-50 text-slate-500 border-slate-100";
        }
    };

    const filteredReports = reports.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-primary" /> Analytics Center
                    </h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Intelligence, Big Data & BI Reports</p>
                </div>
                <button
                    onClick={() => addNotification({ type: 'info', title: 'Feature Restricted', message: 'Custom reporting is only available in Enterprise tier.' })}
                    className="btn-primary flex items-center gap-2 h-14 px-8 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <FilePlus className="w-5 h-5" /> <span className="font-black uppercase tracking-widest text-xs">Custom Report</span>
                </button>
            </div>

            {/* Analytics Quick View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                    <div className="relative z-10">
                        <Activity className="w-10 h-10 text-emerald-400 mb-6" />
                        <h3 className="text-lg font-black tracking-tight">System Performance</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Operational Nodes: {stats.doctors + stats.appointments}</p>
                        <div className="mt-8 flex items-baseline gap-2">
                            <span className="text-4xl font-black tracking-tighter">Optimal</span>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                        <TrendingUp className="w-24 h-24" />
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex flex-col justify-between group hover:border-primary/20 transition-all">
                    <div>
                        <PieChart className="w-10 h-10 text-violet-500 mb-6" />
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">Patient Distribution</h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Total Registered Patients</p>
                    </div>
                    <div className="mt-8 flex items-baseline gap-2">
                        <span className="text-4xl font-black tracking-tighter text-slate-900">{stats.patients}</span>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex flex-col justify-between group hover:border-emerald-200 transition-all">
                    <div>
                        <TrendingUp className="w-10 h-10 text-emerald-500 mb-6" />
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">Revenue Dynamics</h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Total Collections</p>
                    </div>
                    <div className="mt-8 flex items-baseline gap-2">
                        <span className="text-4xl font-black tracking-tighter text-emerald-600">₹{stats.revenue.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>

            {/* Available Reports */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <h2 className="text-lg font-black text-slate-800">Available Reports</h2>
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Find specific reports..."
                            className="input-field !pl-12 bg-slate-50/50 h-12 border-slate-100 focus:bg-white text-sm font-bold"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-8 gap-6">
                    {filteredReports.map((report) => (
                        <div key={report.id} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 transition-all group relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm group-hover:text-primary transition-colors">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                                    getStatusStyle(report.status)
                                )}>
                                    {report.status}
                                </span>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-sm font-black text-slate-800 leading-tight mb-1">{report.name}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{report.type} Index</p>
                            </div>

                            <div className="space-y-3 py-4 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</span>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{report.frequency}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Export</span>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{report.lastRun}</span>
                                </div>
                            </div>

                            <button
                                disabled={isExporting}
                                onClick={() => generateReportData(report)}
                                className="w-full mt-4 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isExporting && currentReportData?.title === report.name ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                {isExporting && currentReportData?.title === report.name ? 'Compiling...' : 'Generate Report'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hidden PDF Report Template */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                {currentReportData && (
                    <div ref={reportTemplateRef} style={{ width: '700px', padding: '40px', backgroundColor: 'white', fontFamily: 'sans-serif' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0D9488', paddingBottom: '20px', marginBottom: '30px' }}>
                            <div>
                                <h1 style={{ margin: 0, color: '#1e293b', fontSize: '24px', fontWeight: 'bold' }}>{currentReportData.title}</h1>
                                <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '12px' }}>Generated on: {currentReportData.generatedAt}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <h2 style={{ margin: 0, color: '#0D9488', fontWeight: '900', textTransform: 'uppercase' }}>CLINIXA</h2>
                                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Analytics Division</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${currentReportData.summary.length}, 1fr)`, gap: '20px', marginBottom: '30px' }}>
                            {currentReportData.summary.map((item, idx) => (
                                <div key={idx} style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                    <p style={{ margin: 0, fontSize: '10px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>{item.label}</p>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>{item.value}</p>
                                </div>
                            ))}
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                                    {currentReportData.columns.map((col, idx) => (
                                        <th key={idx} style={{ padding: '12px', textAlign: 'left', color: '#475569', fontWeight: 'bold', textTransform: 'uppercase' }}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {currentReportData.rows.length > 0 ? currentReportData.rows.map((row, rIdx) => (
                                    <tr key={rIdx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        {row.map((cell, cIdx) => (
                                            <td key={cIdx} style={{ padding: '12px', color: '#334155' }}>{cell}</td>
                                        ))}
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={currentReportData.columns.length} style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>No data available for this report period.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                            <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>© 2026 CLINIXA HOSPITAL BI SYSTEMS - CONFIDENTIAL ANALYTICS REPORT</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportGeneration;
