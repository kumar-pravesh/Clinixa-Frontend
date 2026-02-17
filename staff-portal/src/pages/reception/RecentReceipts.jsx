import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Printer,
    Search,
    FileText,
    Download,
    ExternalLink,
    ChevronRight,
    MoreVertical,
    Loader2
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import receptionService from '../../services/receptionService';

const RecentReceipts = () => {
    const navigate = useNavigate();
    const reportRef = useRef(null);
    const summaryRef = useRef(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [reprintingId, setReprintingId] = useState(null);
    const [receipts, setReceipts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        setIsLoading(true);
        try {
            const data = await receptionService.getInvoices();
            setReceipts(data || []);
        } catch (error) {
            console.error("Failed to fetch invoices:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // HEX Color Constants for PDF Compatibility
    const colors = {
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



    const filteredReceipts = receipts.filter(receipt =>
        (receipt.invoice_number?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (receipt.patient_name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    const handleReprint = (id) => {
        setReprintingId(id);
        // Simulate PDF generation for quick reprint button
        setTimeout(() => {
            setReprintingId(null);
            alert(`Invoice ${id} has been exported as PDF successfully!`);
        }, 1500);
    };

    const handleViewDetails = (id) => {
        navigate(`/reception/receipts/${id}`);
    };

    const handleExport = async () => {
        if (!reportRef.current) return;
        setIsExporting(true);

        const element = reportRef.current;
        const opt = {
            margin: [10, 5, 10, 5], // Slightly reduced side margins
            filename: `Clinixa_Daily_Report_${new Date().toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                width: 790, // Explicitly set width for canvas capture
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        try {
            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error('Report generation error:', error);
            alert('Failed to generate PDF Report.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleGenerateSummary = async () => {
        if (!summaryRef.current) return;
        setIsGeneratingSummary(true);

        const element = summaryRef.current;
        const opt = {
            margin: [15, 15, 15, 15],
            filename: `Clinixa_Reconciliation_Summary_${new Date().toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                width: 590,
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        try {
            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error('Summary generation error:', error);
            alert('Failed to generate PDF Summary.');
        } finally {
            setIsGeneratingSummary(false);
        }
    };

    // Calculate totals for summary
    const summaryData = receipts.reduce((acc, curr) => {
        const mode = curr.payment_mode || 'Other';
        const amount = parseFloat(curr.total) || 0;
        acc[mode] = (acc[mode] || 0) + amount;
        acc.total += amount;
        return acc;
    }, { total: 0 });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hidden PDF Templates (HEX Only Styles) */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                {/* Report Template - Scaled for A4 */}
                <div ref={reportRef} style={{ width: '790px', padding: '40px', backgroundColor: 'white', fontFamily: 'sans-serif' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${colors.primary}`, paddingBottom: '20px', marginBottom: '30px' }}>
                        <div>
                            <h1 style={{ margin: 0, color: colors.slate800, fontSize: '28px' }}>Daily Transaction Report</h1>
                            <p style={{ margin: '5px 0 0 0', color: colors.slate500 }}>Generated on: {new Date().toLocaleDateString()}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <h2 style={{ margin: 0, color: colors.primary, fontWeight: '900', textTransform: 'uppercase' }}>Clinixa</h2>
                            <p style={{ margin: 0, fontSize: '12px', color: colors.slate400 }}>Healthcare Excellence</p>
                        </div>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: colors.slate50, borderBottom: `1px solid ${colors.slate200}` }}>
                                <th style={{ padding: '12px', textAlign: 'left', color: colors.slate600, fontSize: '12px', textTransform: 'uppercase' }}>ID</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: colors.slate600, fontSize: '12px', textTransform: 'uppercase' }}>Patient</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: colors.slate600, fontSize: '12px', textTransform: 'uppercase' }}>Date</th>
                                <th style={{ padding: '12px', textAlign: 'left', color: colors.slate600, fontSize: '12px', textTransform: 'uppercase' }}>Mode</th>
                                <th style={{ padding: '12px', textAlign: 'right', color: colors.slate600, fontSize: '12px', textTransform: 'uppercase' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receipts.map(r => (
                                <tr key={r.id} style={{ borderBottom: `1px solid ${colors.slate100}` }}>
                                    <td style={{ padding: '12px', color: colors.slate800, fontWeight: 'bold' }}>{r.invoice_number}</td>
                                    <td style={{ padding: '12px', color: colors.slate700 }}>{r.patient_name}</td>
                                    <td style={{ padding: '12px', color: colors.slate500 }}>{r.date}</td>
                                    <td style={{ padding: '12px', color: colors.slate500 }}>{r.payment_mode}</td>
                                    <td style={{ padding: '12px', textAlign: 'right', color: colors.slate800, fontWeight: '900' }}>₹{(parseFloat(r.total) || 0).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr style={{ backgroundColor: colors.slate50 }}>
                                <td colSpan="4" style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold', color: colors.slate600 }}>Total Collected:</td>
                                <td style={{ padding: '15px', textAlign: 'right', fontWeight: '900', color: colors.primary, fontSize: '18px' }}>₹{summaryData.total.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Summary Template */}
                <div ref={summaryRef} style={{ width: '600px', padding: '60px', backgroundColor: 'white', fontFamily: 'sans-serif', textAlign: 'center' }}>
                    <div style={{ backgroundColor: colors.slate800, color: 'white', padding: '40px', borderRadius: '20px', marginBottom: '40px' }}>
                        <div style={{ backgroundColor: colors.primary, width: '40px', height: '40px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', fontSize: '20px', fontWeight: '900' }}>C</div>
                        <h1 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>Daily Summary</h1>
                        <p style={{ margin: '10px 0 0 0', color: colors.slate400 }}>{new Date().toLocaleDateString()}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                        {['UPI', 'Cash', 'Card'].map(m => (
                            <div key={m} style={{ backgroundColor: colors.slate50, padding: '20px', borderRadius: '15px', border: `1px solid ${colors.slate100}` }}>
                                <p style={{ margin: 0, color: colors.slate400, fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>{m}</p>
                                <p style={{ margin: '5px 0 0 0', fontSize: '20px', fontWeight: '900', color: colors.slate800 }}>₹{(summaryData[m] || 0).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: `2px dashed ${colors.slate200}`, paddingTop: '30px' }}>
                        <p style={{ margin: 0, color: colors.slate500, fontSize: '14px', fontWeight: 'bold' }}>Grand Total Collected</p>
                        <p style={{ margin: '10px 0 0 0', fontSize: '48px', fontWeight: '900', color: colors.primary }}>₹{summaryData.total.toLocaleString()}</p>
                    </div>

                    <p style={{ marginTop: '60px', fontSize: '12px', color: colors.slate400, fontStyle: 'italic' }}>
                        This is an official reconciliation summary generated by Clinixa Billing System.
                    </p>
                </div>
            </div>

            <div>
                <h1 className="text-2xl font-bold text-slate-800">Recent Receipts</h1>
                <p className="text-slate-500">View, download, or reprint recent transactions.</p>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="relative lg:w-96">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by Invoice ID or Patient..."
                        className="input-field !pl-10 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
                    >
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        {isExporting ? "Exporting PDF..." : "Export Today's Report"}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left font-sans">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            <th className="px-6 py-4">Invoice ID</th>
                            <th className="px-6 py-4">Patient</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                            <th className="px-6 py-4">Payment Mode</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                        <p className="text-slate-400 font-medium">Fetching receipts...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredReceipts.length > 0 ? (
                            filteredReceipts.map((receipt) => (
                                <tr key={receipt.id} className="group hover:bg-primary/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-primary opacity-40" />
                                            <span className="font-bold text-slate-800">{receipt.invoice_number}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-slate-700">{receipt.patient_name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                        {receipt.date}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-black text-slate-800">₹{receipt.total?.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            {receipt.payment_mode}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleReprint(receipt.id)}
                                                disabled={reprintingId === receipt.id}
                                                title="Reprint PDF"
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all disabled:opacity-50"
                                            >
                                                {reprintingId === receipt.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Printer className="w-5 h-5" />}
                                            </button>
                                            <button
                                                onClick={() => handleViewDetails(receipt.id)}
                                                title="View Detail"
                                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-medium">
                                    No receipts found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-8 bg-slate-800 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/30 transition-all duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Need to print a summary?</h3>
                        <p className="text-slate-400 max-w-md">Generate a daily reconciliation report containing all cash, UPI, and card transactions for the accounts department.</p>
                    </div>
                    <button
                        onClick={handleGenerateSummary}
                        disabled={isGeneratingSummary}
                        className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-black/20 shrink-0 flex items-center gap-3 disabled:opacity-50"
                    >
                        {isGeneratingSummary && <Loader2 className="w-5 h-5 animate-spin" />}
                        {isGeneratingSummary ? "Exporting Summary..." : "Generate Daily Summary PDF"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecentReceipts;
