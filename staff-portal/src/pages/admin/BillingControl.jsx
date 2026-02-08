import React, { useState } from 'react';
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
    FileText
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNotification } from '../../context/NotificationContext';

const BillingControl = () => {
    const { addNotification } = useNotification();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTxFilter, setActiveTxFilter] = useState('All');
    const [openMenuId, setOpenMenuId] = useState(null);

    const [transactions, setTransactions] = useState([
        { id: 'INV-5501', patient: 'Rahul Sharma', amount: 1500, date: '2026-02-07', method: 'UPI', status: 'Paid', type: 'Consultation' },
        { id: 'INV-5502', patient: 'Priya Singh', amount: 3200, date: '2026-02-07', method: 'Card', status: 'Pending', type: 'Laboratory' },
        { id: 'INV-5503', patient: 'Amit Patel', amount: 4500, date: '2026-02-06', method: 'Cash', status: 'Paid', type: 'Pharmacy' },
        { id: 'INV-5504', patient: 'Deepak V', amount: 1200, date: '2026-02-07', method: 'UPI', status: 'Failed', type: 'Consultation' },
        { id: 'INV-5505', patient: 'Amit Sharma', amount: 2500, date: '2026-02-07', method: 'Card', status: 'Pending', type: 'General' },
    ]);

    const handleUpdateStatus = (id, newStatus) => {
        setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, status: newStatus } : tx));
        addNotification({
            type: newStatus === 'Paid' ? 'success' : 'info',
            title: 'Transaction Updated',
            message: `Invoice ${id} marked as ${newStatus}.`
        });
        setOpenMenuId(null); // Close menu after action
    };

    /**
     * Simulates a data export by creating a .txt file
     */
    const simulateExport = (title, patient = null) => {
        addNotification({
            type: 'info',
            title: 'Generating Report',
            message: `Compiling data for ${title}...`
        });

        setTimeout(() => {
            const content = `---- CLINIXA FINANCIAL DATA EXPORT ----\n\nTitle: ${title}\nGenerated on: ${new Date().toLocaleString()}\n${patient ? `Patient: ${patient}\n` : ''}\nTotal Revenue Analyzed: ₹${transactions.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}\nStatus: Verified\n\n© 2026 CLINIXA HOSPITAL MANAGEMENT`;
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
                message: `${title} data has been saved to your downloads.`
            });
            setOpenMenuId(null); // Close menu after action
        }, 1500);
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

    const stats = [
        { label: 'Today Collections', val: `₹${transactions.filter(t => t.status === 'Paid').reduce((acc, t) => acc + t.amount, 0).toLocaleString()}`, trend: 15, color: 'text-emerald-500' },
        { label: 'Receivables (Pending)', val: `₹${transactions.filter(t => t.status === 'Pending').reduce((acc, t) => acc + t.amount, 0).toLocaleString()}`, trend: -8, color: 'text-amber-500' },
        { label: 'Failed Transactions', val: `₹${transactions.filter(t => t.status === 'Failed').reduce((acc, t) => acc + t.amount, 0).toLocaleString()}`, trend: 2, color: 'text-rose-500' },
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
                        onClick={() => simulatePDFDownload('Revenue_Analysis_Report')}
                        className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary hover:border-primary/30 transition-all shadow-sm flex items-center gap-2 group"
                        title="Download Revenue Data as PDF"
                    >
                        <Download className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" />
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
                            {filteredTx.length > 0 ? filteredTx.map((tx) => (
                                <tr key={tx.id} className="group hover:bg-slate-50/30 transition-all">
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-black text-slate-800 tracking-tight">{tx.id}</p>
                                        <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">{tx.date}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-black text-slate-800 tracking-tight">{tx.patient}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Medical #882{Math.floor(Math.random() * 10)}</p>
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
                                        <span className="text-sm font-black text-slate-800 tracking-tighter">₹{tx.amount.toLocaleString()}</span>
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
                                                            onClick={() => simulateExport(`Invoice_${tx.id}`, tx.patient)}
                                                            className="w-full px-5 py-4 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 flex items-center gap-3 transition-colors text-left"
                                                        >
                                                            <FileText className="w-4 h-4" /> Export Data (.txt)
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
        </div>
    );
};

export default BillingControl;
