import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    CreditCard,
    Search,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Banknote,
    Wallet,
    Smartphone,
    MoreVertical,
    Filter,
    Download,
    X,
    FileText,
    Loader2
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNotification } from '../../context/NotificationContext';
import html2pdf from 'html2pdf.js';
import api from '../../api/axios';

const PDF_COLORS = {
    primary: '#0D9488',
    slate800: '#1e293b',
    slate700: '#334155',
    slate600: '#475569',
    slate500: '#64748b',
    slate400: '#94a3b8',
    slate200: '#e2e8f0',
    slate100: '#f1f5f9',
    slate50: '#f8fafc',
    white: '#ffffff',
};

const BillingControl = () => {
    const { addNotification } = useNotification();
    const reportRef = useRef(null);
    const invoiceRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTxFilter, setActiveTxFilter] = useState('All');
    const [openMenuId, setOpenMenuId] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    const fetchInvoices = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/admin/invoices');
            // Backend returns id, invoice_number, amount, total, payment_status, payment_mode, issued_date, patient_name
            const mappedData = response.data.map(inv => ({
                id: inv.invoice_number || `INV-${String(inv.id).padStart(4, '0')}`,
                raw_id: inv.id,
                patient: inv.patient_name,
                method: inv.payment_mode || 'UPI',
                type: inv.type || 'Consultation',
                amount: Number(inv.total || inv.amount || 0),
                status: inv.payment_status,
                date: inv.issued_date
            }));
            setTransactions(mappedData);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            addNotification({
                type: 'error',
                title: 'Data Synchronization Error',
                message: 'Failed to retrieve real-time financial records.'
            });
        } finally {
            setIsLoading(false);
        }
    }, [addNotification]);

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const tx = transactions.find(t => t.id === id);
            await api.put(`/admin/invoices/${tx.raw_id}/status`, { status: newStatus });

            addNotification({
                type: newStatus === 'Paid' ? 'success' : 'info',
                title: 'Treasury Updated',
                message: `Invoice ${id} has been marked as ${newStatus.toLowerCase()}.`
            });
            setOpenMenuId(null);
            fetchInvoices(); // Refresh from DB
        } catch (error) {
            console.error('Error updating transaction:', error);
            addNotification({
                type: 'error',
                title: 'Transaction Error',
                message: `Failed up update status for invoice ${id}.`
            });
        }
    };

    const handleExportPDF = async (title, specificTransaction = null) => {
        setIsExporting(true);

        // If specific transaction, set state and wait for render
        if (specificTransaction) {
            setSelectedInvoice(specificTransaction);
            await new Promise(resolve => setTimeout(resolve, 100)); // Allow state update
        } else {
            setSelectedInvoice(null);
        }

        // Determine which element to print
        const element = specificTransaction ? invoiceRef.current : reportRef.current;

        if (!element) {
            setIsExporting(false);
            return;
        }

        addNotification({
            type: 'info',
            title: 'Generating PDF',
            message: `Compiling ${title}...`
        });

        const opt = {
            margin: [10, 10, 10, 10],
            filename: `${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        try {
            await html2pdf().set(opt).from(element).save();
            addNotification({
                type: 'success',
                title: 'Export Success',
                message: `${title} has been downloaded.`
            });
        } catch (error) {
            console.error('PDF generation error:', error);
            addNotification({
                type: 'error',
                title: 'Export Failed',
                message: 'Could not generate PDF document.'
            });
        } finally {
            setIsExporting(false);
            setOpenMenuId(null);
            if (specificTransaction) {
                // Reset selected invoice after a delay to ensure print is done
                setTimeout(() => setSelectedInvoice(null), 500);
            }
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Paid': return "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/5";
            case 'Pending': return "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/5";
            case 'Failed': return "bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100/5";
            default: return "bg-slate-50 text-slate-500 border-slate-100";
        }
    };

    const getPaymentIcon = (method) => {
        switch (method) {
            case 'UPI': return <Smartphone className="w-4 h-4" />;
            case 'Card': return <CreditCard className="w-4 h-4" />;
            case 'Cash': return <Banknote className="w-4 h-4" />;
            default: return <Wallet className="w-4 h-4" />;
        }
    };

    const filteredTx = transactions.filter(tx => {
        const matchesSearch = tx.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeTxFilter === 'All' || tx.status === activeTxFilter;
        return matchesSearch && matchesFilter;
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const stats = [
        { label: 'Today Collections', val: `₹${transactions.filter(t => t.status === 'Paid' && t.date === todayStr).reduce((acc, t) => acc + (Number(t.amount) || 0), 0).toLocaleString('en-IN')}`, trend: 15, color: 'text-emerald-500' },
        { label: 'Receivables (Pending)', val: `₹${transactions.filter(t => t.status === 'Pending').reduce((acc, t) => acc + (Number(t.amount) || 0), 0).toLocaleString('en-IN')}`, trend: -8, color: 'text-amber-500' },
        { label: 'Failed Transactions', val: `₹${transactions.filter(t => t.status === 'Failed').reduce((acc, t) => acc + (Number(t.amount) || 0), 0).toLocaleString('en-IN')}`, trend: 2, color: 'text-rose-500' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <CreditCard className="w-8 h-8 text-primary" /> Financial Treasury
                    </h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Global Revenue & Transaction Audit Center</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="h-14 px-8 bg-slate-900 text-white rounded-2xl flex items-center gap-3 shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all group">
                        <TrendingUp className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        <span className="font-black uppercase tracking-widest text-xs">Revenue Insights</span>
                    </button>
                    <button
                        onClick={() => handleExportPDF('Revenue Analysis Report')}
                        disabled={isExporting}
                        className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary hover:border-primary/30 transition-all shadow-sm flex items-center gap-2 group disabled:opacity-50"
                        title="Download Revenue Data as PDF"
                    >
                        {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" />}
                    </button>
                </div>
            </div>

            {/* Financial Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                            <div className="flex justify-between items-end">
                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.val}</h3>
                                <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-50", stat.color)}>
                                    {stat.trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {Math.abs(stat.trend)}%
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
                    </div>
                ))}
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Enter Invoice #, Patient name or Transaction ID..."
                            className="input-field !pl-12 bg-slate-50/50 h-14 border-slate-100 focus:bg-white text-sm font-bold shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        {['All', 'Paid', 'Pending', 'Failed'].map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveTxFilter(f)}
                                className={cn(
                                    "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    activeTxFilter === f ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction / ID</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Member</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Method & Type</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Net Amount</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                [1, 2, 3, 4].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-8 py-6">
                                            <div className="h-4 bg-slate-100 w-24 rounded mb-2"></div>
                                            <div className="h-3 bg-slate-50 w-16 rounded"></div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="h-4 bg-slate-100 w-32 rounded"></div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex gap-2">
                                                <div className="w-8 h-8 bg-slate-100 rounded"></div>
                                                <div className="space-y-1">
                                                    <div className="h-3 bg-slate-100 w-12 rounded"></div>
                                                    <div className="h-2 bg-slate-50 w-10 rounded"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6"><div className="h-4 bg-slate-100 w-16 rounded"></div></td>
                                        <td className="px-8 py-6"><div className="h-6 bg-slate-100 w-20 rounded-full"></div></td>
                                        <td className="px-8 py-6 text-right"><div className="w-10 h-10 bg-slate-100 rounded-xl ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredTx.length > 0 ? filteredTx.map((tx) => (
                                <tr key={tx.id} className="group hover:bg-slate-50/30 transition-all">
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-black text-slate-800 tracking-tight">{tx.id}</p>
                                        <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">{tx.date}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-black text-slate-800 tracking-tight">{tx.patient}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Medical #882{String(tx.id).replace(/\D/g, '').slice(-1) || '0'}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                                {getPaymentIcon(tx.method)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-600 tracking-tight">{tx.method}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{tx.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-black text-slate-800 tracking-tighter">₹{tx.amount.toLocaleString('en-IN')}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                            getStatusStyle(tx.status)
                                        )}>
                                            <span className={cn("w-1 h-1 rounded-full mr-2", tx.status === 'Paid' ? 'bg-emerald-500' : tx.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500')}></span>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="relative inline-block">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuId(openMenuId === tx.id ? null : tx.id);
                                                }}
                                                className="p-3 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-2xl transition-all"
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </button>

                                            {openMenuId === tx.id && (
                                                <>
                                                    <div className="fixed inset-0 z-30" onClick={() => setOpenMenuId(null)}></div>
                                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                        {tx.status === 'Pending' && (
                                                            <button
                                                                onClick={() => handleUpdateStatus(tx.id, 'Paid')}
                                                                className="w-full px-5 py-4 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-50 flex items-center gap-3 transition-colors border-b border-slate-50 text-left"
                                                            >
                                                                <CheckCircle2 className="w-4 h-4" /> Mark As Paid
                                                            </button>
                                                        )}
                                                        {tx.status !== 'Failed' && (
                                                            <button
                                                                onClick={() => handleUpdateStatus(tx.id, 'Failed')}
                                                                className="w-full px-5 py-4 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 flex items-center gap-3 transition-colors border-b border-slate-50 text-left"
                                                            >
                                                                <XCircle className="w-4 h-4" /> Fail Transaction
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleExportPDF(`Invoice_${tx.id}`, tx)}
                                                            disabled={isExporting}
                                                            className="w-full px-5 py-4 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 flex items-center gap-3 transition-colors text-left disabled:opacity-50"
                                                        >
                                                            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                                                            Export Invoice (PDF)
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <p className="text-slate-400 font-bold italic">No transactions match your search criteria.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Hidden PDF Templates (HEX Only Styles) */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                <div ref={reportRef} style={{ width: '700px', padding: '40px', backgroundColor: 'white', fontFamily: 'sans-serif' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${PDF_COLORS.primary}`, paddingBottom: '20px', marginBottom: '30px' }}>
                        <div>
                            <h1 style={{ margin: 0, color: PDF_COLORS.slate800, fontSize: '28px' }}>Financial Revenue Audit</h1>
                            <p style={{ margin: '5px 0 0 0', color: PDF_COLORS.slate500 }}>Generated on: {new Date().toLocaleString()}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h2 style={{ margin: 0, color: PDF_COLORS.primary, fontWeight: '900', textTransform: 'uppercase' }}>Clinixa</h2>
                            <p style={{ margin: 0, fontSize: '12px', color: PDF_COLORS.slate400 }}>Treasury Department</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                        {stats.map((s, idx) => (
                            <div key={idx} style={{ backgroundColor: PDF_COLORS.slate50, padding: '20px', borderRadius: '15px', border: `1px solid ${PDF_COLORS.slate100}` }}>
                                <p style={{ margin: 0, color: PDF_COLORS.slate400, fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', trackingWidest: '0.1em' }}>{s.label}</p>
                                <p style={{ margin: '5px 0 0 0', fontSize: '22px', fontWeight: '900', color: PDF_COLORS.slate800 }}>{s.val}</p>
                            </div>
                        ))}
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: PDF_COLORS.slate50, borderBottom: `1px solid ${PDF_COLORS.slate200}` }}>
                                <th style={{ padding: '12px', textAlign: 'left', color: PDF_COLORS.slate600, fontSize: '10px', textTransform: 'uppercase' }}>Transaction ID</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: PDF_COLORS.slate600, fontSize: '10px', textTransform: 'uppercase' }}>Patient Name</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: PDF_COLORS.slate600, fontSize: '10px', textTransform: 'uppercase' }}>Method</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: PDF_COLORS.slate600, fontSize: '10px', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '12px', textAlign: 'right', color: PDF_COLORS.slate600, fontSize: '10px', textTransform: 'uppercase' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTx.map(tx => (
                                <tr key={tx.id} style={{ borderBottom: `1px solid ${PDF_COLORS.slate100}` }}>
                                    <td style={{ padding: '12px', color: PDF_COLORS.slate800, fontWeight: 'bold', fontSize: '12px' }}>{tx.id}</td>
                                    <td style={{ padding: '12px', color: PDF_COLORS.slate700, fontSize: '12px' }}>{tx.patient}</td>
                                    <td style={{ padding: '12px', color: PDF_COLORS.slate500, fontSize: '12px' }}>{tx.method}</td>
                                    <td style={{ padding: '12px', fontSize: '10px', fontWeight: 'bold' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '10px',
                                            backgroundColor: tx.status === 'Paid' ? '#ecfdf5' : tx.status === 'Pending' ? '#fffbeb' : '#fef2f2',
                                            color: tx.status === 'Paid' ? '#059669' : tx.status === 'Pending' ? '#d97706' : '#dc2626'
                                        }}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right', color: PDF_COLORS.slate800, fontWeight: '900', fontSize: '12px' }}>₹{tx.amount.toLocaleString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: `1px solid ${PDF_COLORS.slate200}`, textAlign: 'center' }}>
                        <p style={{ fontSize: '10px', color: PDF_COLORS.slate400, margin: 0 }}>© 2026 Clinixa Management - This document is electronically generated and verified by the Audit Control Center.</p>
                    </div>
                </div>
            </div>

            {/* Hidden Single Invoice Template */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                {selectedInvoice && (
                    <div ref={invoiceRef} style={{ width: '700px', padding: '50px', backgroundColor: 'white', fontFamily: 'sans-serif', border: `1px solid ${PDF_COLORS.slate200}` }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `2px solid ${PDF_COLORS.primary}`, paddingBottom: '30px', marginBottom: '40px' }}>
                            <div>
                                <h1 style={{ margin: 0, color: PDF_COLORS.primary, fontSize: '32px', fontWeight: '900', letterSpacing: '-0.02em' }}>CLINIXA</h1>
                                <p style={{ margin: '5px 0 0 0', color: PDF_COLORS.slate500, fontSize: '12px', lineHeight: '1.5' }}>
                                    Health & Wellness Center<br />
                                    123 Medical Plaza, Suite 400<br />
                                    Sector 62, Noida, UP 201301<br />
                                    Phone: +91 98765 43210
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <h2 style={{ margin: 0, color: PDF_COLORS.slate800, fontSize: '24px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tax Invoice</h2>
                                <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: PDF_COLORS.slate600 }}>Invoice #: <strong>{selectedInvoice.id}</strong></p>
                                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: PDF_COLORS.slate600 }}>Date: <strong>{new Date(selectedInvoice.date).toLocaleDateString()}</strong></p>
                            </div>
                        </div>

                        {/* Bill To */}
                        <div style={{ marginBottom: '40px', backgroundColor: PDF_COLORS.slate50, padding: '25px', borderRadius: '12px' }}>
                            <p style={{ margin: '0 0 10px 0', fontSize: '10px', fontWeight: 'bold', color: PDF_COLORS.slate400, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Bill To</p>
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: PDF_COLORS.slate800 }}>{selectedInvoice.patient}</h3>
                            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: PDF_COLORS.slate500 }}>Medical ID: #882{String(selectedInvoice.id).replace(/\D/g, '').slice(-1) || '0'}</p>
                            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: PDF_COLORS.slate500 }}>Payment Method: <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{selectedInvoice.method}</span></p>
                        </div>

                        {/* Line Items */}
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
                            <thead>
                                <tr style={{ borderBottom: `2px solid ${PDF_COLORS.slate200}` }}>
                                    <th style={{ padding: '15px 0', textAlign: 'left', color: PDF_COLORS.slate400, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Description</th>
                                    <th style={{ padding: '15px 0', textAlign: 'right', color: PDF_COLORS.slate400, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Qty</th>
                                    <th style={{ padding: '15px 0', textAlign: 'right', color: PDF_COLORS.slate400, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Price</th>
                                    <th style={{ padding: '15px 0', textAlign: 'right', color: PDF_COLORS.slate400, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: `1px solid ${PDF_COLORS.slate100}` }}>
                                    <td style={{ padding: '20px 0', color: PDF_COLORS.slate700, fontSize: '14px', fontWeight: 'bold' }}>
                                        {selectedInvoice.type} Services
                                        <div style={{ fontSize: '12px', color: PDF_COLORS.slate400, fontWeight: 'normal', marginTop: '5px' }}>Standard consultation and medical review</div>
                                    </td>
                                    <td style={{ padding: '20px 0', textAlign: 'right', color: PDF_COLORS.slate600, fontSize: '14px' }}>1</td>
                                    <td style={{ padding: '20px 0', textAlign: 'right', color: PDF_COLORS.slate600, fontSize: '14px' }}>₹{selectedInvoice.amount.toLocaleString('en-IN')}</td>
                                    <td style={{ padding: '20px 0', textAlign: 'right', color: PDF_COLORS.slate800, fontSize: '14px', fontWeight: 'bold' }}>₹{selectedInvoice.amount.toLocaleString('en-IN')}</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Total */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '60px' }}>
                            <div style={{ width: '250px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '14px', color: PDF_COLORS.slate500 }}>Subtotal:</span>
                                    <span style={{ fontSize: '14px', color: PDF_COLORS.slate800, fontWeight: 'bold' }}>₹{selectedInvoice.amount.toLocaleString('en-IN')}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '14px', color: PDF_COLORS.slate500 }}>Tax (0%):</span>
                                    <span style={{ fontSize: '14px', color: PDF_COLORS.slate800, fontWeight: 'bold' }}>₹0</span>
                                </div>
                                <div style={{ borderTop: `2px solid ${PDF_COLORS.slate200}`, marginTop: '15px', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '16px', color: PDF_COLORS.slate800, fontWeight: '900' }}>TOTAL AMOUNT</span>
                                    <span style={{ fontSize: '24px', color: PDF_COLORS.primary, fontWeight: '900' }}>₹{selectedInvoice.amount.toLocaleString('en-IN')}</span>
                                </div>
                                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                                    <span style={{
                                        padding: '6px 16px',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        fontWeight: '900',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        backgroundColor: selectedInvoice.status === 'Paid' ? '#ecfdf5' : '#fffbeb',
                                        color: selectedInvoice.status === 'Paid' ? '#059669' : '#d97706',
                                        border: `1px solid ${selectedInvoice.status === 'Paid' ? '#a7f3d0' : '#fde68a'}`
                                    }}>
                                        {selectedInvoice.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ borderTop: `1px solid ${PDF_COLORS.slate200}`, paddingTop: '30px', textAlign: 'center' }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: PDF_COLORS.slate800, fontWeight: 'bold' }}>Thank you for choosing Clinixa!</h4>
                            <p style={{ margin: 0, fontSize: '12px', color: PDF_COLORS.slate400, lineHeight: '1.6' }}>
                                This is a computer-generated invoice and does not require a physical signature.<br />
                                For any billing inquiries, please contact accounts@clinixa.com within 7 days.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BillingControl;
