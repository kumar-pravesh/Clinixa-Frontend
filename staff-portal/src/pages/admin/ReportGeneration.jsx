import React, { useState } from 'react';
import {
    BarChart3,
    FileText,
    Download,
    Calendar,
    Search,
    Filter,
    PieChart,
    Activity,
    ArrowRight,
    CheckCircle2,
    FileSpreadsheet,
    FilePlus,
    Clock,
    TrendingUp
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNotification } from '../../context/NotificationContext';

const ReportGeneration = () => {
    const { addNotification } = useNotification();
    const [searchQuery, setSearchQuery] = useState('');
    const [reports, setReports] = useState([
        { id: 'REP-001', name: 'Annual Financial Audit', type: 'Financial', frequency: 'Yearly', lastRun: '2026-01-01', status: 'Ready' },
        { id: 'REP-002', name: 'Patient Demographic Analysis', type: 'Clinical', frequency: 'Monthly', lastRun: '2026-02-01', status: 'Ready' },
        { id: 'REP-003', name: 'Doctor Productivity Metrics', type: 'Performance', frequency: 'Weekly', lastRun: '2026-02-05', status: 'Processing', progress: 65 },
        { id: 'REP-004', name: 'Daily Revenue Reconciliation', type: 'Financial', frequency: 'Daily', lastRun: '2026-02-07', status: 'Ready' },
        { id: 'REP-005', name: 'Departmental Resource Usage', type: 'Operations', frequency: 'Monthly', lastRun: '2026-02-01', status: 'Ready' },
    ]);

    const handleRequestBuild = (id, name) => {
        setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Processing', progress: 0 } : r));
        addNotification({
            type: 'info',
            title: 'Build Requested',
            message: `System is compiling data for: ${name}`
        });

        // Simulate progress
        let p = 0;
        const interval = setInterval(() => {
            p += Math.floor(Math.random() * 20) + 5;
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
                setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Ready', progress: 100, lastRun: new Date().toISOString().split('T')[0] } : r));
                addNotification({
                    type: 'success',
                    title: 'Report Compiled',
                    message: `${name} is ready for download.`
                });
            } else {
                setReports(prev => prev.map(r => r.id === id ? { ...r, progress: p } : r));
            }
        }, 800);
    };

    /**
     * Simulates a data export for reports
     */
    const simulateExport = (title) => {
        addNotification({
            type: 'info',
            title: 'Generating Report',
            message: `Compiling analytics data for ${title}...`
        });

        setTimeout(() => {
            const content = `---- CLINIXA ANALYTICS DATA EXPORT ----\n\nReport Name: ${title}\nGenerated on: ${new Date().toLocaleString()}\nStatus: Verified\n\n© 2026 CLINIXA HOSPITAL BI SYSTEMS`;
            const blob = new Blob([content], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().getTime()}.txt`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            addNotification({
                type: 'success',
                title: 'Export Complete',
                message: `${title} data has been saved successfully.`
            });
        }, 1500);
    };

    const handleDownload = (name) => {
        simulateExport(name);
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
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Active Throughout: 99.8%</p>
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
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">By specialty and demographics</p>
                    </div>
                    <button className="w-full mt-8 py-4 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 transition-all flex items-center justify-center gap-2">
                        View Analytics <ArrowRight className="w-3 h-3" />
                    </button>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex flex-col justify-between group hover:border-emerald-200 transition-all">
                    <div>
                        <TrendingUp className="w-10 h-10 text-emerald-500 mb-6" />
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">Revenue Dynamics</h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Growth analysis & financial trends</p>
                    </div>
                    <button className="w-full mt-8 py-4 bg-slate-50 hover:bg-emerald-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 transition-all flex items-center justify-center gap-2 border border-transparent hover:emerald-200">
                        Financial Audit <ArrowRight className="w-3 h-3" />
                    </button>
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
                            {report.status === 'Processing' && (
                                <div className="absolute top-0 left-0 h-1 bg-primary transition-all duration-500" style={{ width: `${report.progress}%` }}></div>
                            )}

                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm group-hover:text-primary transition-colors">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                                    getStatusStyle(report.status)
                                )}>
                                    {report.status === 'Processing' ? `${report.progress}% Build` : report.status}
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

                            <div className="flex gap-2">
                                <button
                                    disabled={report.status === 'Processing'}
                                    onClick={() => handleDownload(report.name)}
                                    className="flex-1 py-3 bg-white border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/20 rounded-xl flex items-center justify-center transition-all shadow-sm disabled:opacity-50"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                                <button
                                    disabled={report.status === 'Processing'}
                                    onClick={() => handleRequestBuild(report.id, report.name)}
                                    className="flex-[3] py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-slate-200 disabled:bg-slate-400"
                                >
                                    {report.status === 'Processing' ? 'Compiling...' : 'Request Build'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportGeneration;
