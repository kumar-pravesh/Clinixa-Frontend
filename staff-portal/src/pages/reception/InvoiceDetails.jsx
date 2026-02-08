import React, { useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Printer,
    Download,
    ArrowLeft,
    Mail,
    MapPin,
    Phone,
    Loader2
} from 'lucide-react';
import html2pdf from 'html2pdf.js';

const InvoiceDetails = () => {
    const { id } = useParams();
    const invoiceRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);

    // HEX Color Constants to avoid OKLCH issues with html2canvas/Tailwind v4
    const colors = {
        primary: '#0D9488',
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
        green500: '#22c55e',
        green100: '#dcfce7'
    };

    // Mock data for the specific invoice
    const invoiceData = {
        id: id || 'INV-1001',
        date: '06 Feb 2026',
        dueDate: '06 Feb 2026',
        status: 'Paid',
        customer: {
            name: 'John Doe',
            id: 'PID-8824',
            address: '123 Hospital St, Medical District',
            phone: '9876543210',
            email: 'john.doe@example.com'
        },
        items: [
            { description: 'General Consultation', quantity: 1, price: 500, total: 500 },
            { description: 'Pharmacy - Paracetamol', quantity: 2, price: 50, total: 100 },
            { description: 'Blood Test (CBC)', quantity: 1, price: 800, total: 800 },
        ],
        subtotal: 1400,
        tax: 252, // 18% GST
        total: 1652,
        paymentMode: 'UPI',
        paymentDate: '06 Feb 2026, 10:30 AM'
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        if (!invoiceRef.current) return;

        setIsDownloading(true);
        console.log('Starting PDF generation with FULL HEX compatibility mode...');

        try {
            const element = invoiceRef.current;
            const opt = {
                margin: [10, 5, 10, 5], // Adjusted for A4 safe zone
                filename: `Invoice_${invoiceData.id}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    scrollY: 0,
                    scrollX: 0,
                    width: 790, // Fixed width capture for A4
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            await html2pdf().set(opt).from(element).save();
            console.log('PDF generated successfully');
        } catch (error) {
            console.error('Detailed PDF generation error:', error);
            alert(`Failed to generate PDF: ${error.message || 'Unknown error'}`);
        } finally {
            setIsDownloading(false);
        }
    };

    // Helper for common styles to avoid OKLCH-heavy Tailwind utility classes
    const styles = {
        container: {
            backgroundColor: colors.white,
            borderRadius: '24px',
            border: `1px solid ${colors.slate200}`,
            overflow: 'hidden',
            fontFamily: 'sans-serif',
            width: '790px', // Fixed width for A4 consistency
            margin: '0 auto'
        },
        header: {
            backgroundColor: colors.slate800,
            padding: '48px',
            color: colors.white,
            position: 'relative'
        },
        badge: {
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            color: colors.green500,
            border: `1px solid rgba(34, 197, 94, 0.2)`,
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '10px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
        },
        section: {
            padding: '48px',
            borderBottom: `1px solid ${colors.slate100}`
        },
        label: {
            fontSize: '10px',
            fontWeight: '900',
            color: colors.slate400,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            marginBottom: '16px',
            display: 'block'
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20 pt-4">
            {/* Action Bar - Still using Tailwind because it's excluded from capture */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 sticky top-4 z-50 print:hidden">
                <div className="flex items-center gap-4">
                    <Link to="/reception/receipts" className="p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800">Invoice {invoiceData.id}</h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{invoiceData.customer.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handlePrint} className="flex-1 sm:flex-none btn-secondary flex items-center justify-center gap-2">
                        <Printer className="w-4 h-4" /> Print
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className="flex-1 sm:flex-none btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        {isDownloading ? 'Downloading...' : 'Download PDF'}
                    </button>
                </div>
            </div>

            {/* Invoice Canvas - PURE CSS TO AVOID OKLCH */}
            <div ref={invoiceRef} style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '32px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ backgroundColor: colors.primary, width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: '900' }}>C</div>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.025em' }}>Clinixa</h2>
                                    <p style={{ margin: 0, fontSize: '10px', fontWeight: '900', color: colors.primary, textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '-4px' }}>Healthcare Redefined</p>
                                </div>
                            </div>
                            <div style={{ fontSize: '14px', color: colors.slate400, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <p style={{ margin: 0 }}>45 Medical Square, Central Health City</p>
                                <p style={{ margin: 0 }}>+91 9988776655</p>
                                <p style={{ margin: 0 }}>billing@clinixa.life</p>
                            </div>
                        </div>

                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '36px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.025em' }}>Invoice</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: colors.slate400, textTransform: 'uppercase' }}>Number: <span style={{ color: 'white', marginLeft: '8px' }}>{invoiceData.id}</span></p>
                                <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: colors.slate400, textTransform: 'uppercase' }}>Date: <span style={{ color: 'white', marginLeft: '8px' }}>{invoiceData.date}</span></p>
                                <div style={{ marginTop: '8px' }}>
                                    <span style={styles.badge}>{invoiceData.status}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Patient / Details Grid */}
                <div style={styles.section}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px' }}>
                        <div>
                            <span style={styles.label}>Patient Information</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <p style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: colors.slate800 }}>{invoiceData.customer.name}</p>
                                <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: colors.primary }}>ID: {invoiceData.customer.id}</p>
                                <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: colors.slate500, lineHeight: '1.5' }}>{invoiceData.customer.address}</p>
                                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: colors.slate500 }}>{invoiceData.customer.phone}</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={styles.label}>Payment Information</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: colors.slate400, textTransform: 'uppercase', display: 'block' }}>Payment Mode</span>
                                    <span style={{ fontSize: '18px', fontWeight: '900', color: colors.slate800 }}>{invoiceData.paymentMode}</span>
                                </div>
                                <div>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: colors.slate400, textTransform: 'uppercase', display: 'block' }}>Transaction ID</span>
                                    <span style={{ fontSize: '14px', fontWeight: '700', color: colors.slate600 }}>TXN-49204932042</span>
                                </div>
                                <div>
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: colors.slate400, textTransform: 'uppercase', display: 'block' }}>Timestamp</span>
                                    <span style={{ fontSize: '14px', fontWeight: '700', color: colors.slate600 }}>{invoiceData.paymentDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div style={{ padding: '48px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: `2px solid ${colors.slate100}` }}>
                                <th style={{ paddingBottom: '16px', fontSize: '10px', fontWeight: '900', color: colors.slate400, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Service Description</th>
                                <th style={{ paddingBottom: '16px', fontSize: '10px', fontWeight: '900', color: colors.slate400, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Qty</th>
                                <th style={{ paddingBottom: '16px', fontSize: '10px', fontWeight: '900', color: colors.slate400, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Unit Price</th>
                                <th style={{ paddingBottom: '16px', fontSize: '10px', fontWeight: '900', color: colors.slate400, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoiceData.items.map((item, index) => (
                                <tr key={index} style={{ borderBottom: `1px solid ${colors.slate100}` }}>
                                    <td style={{ py: '20px', padding: '16px 0' }}>
                                        <p style={{ margin: 0, fontWeight: '700', color: colors.slate700 }}>{item.description}</p>
                                    </td>
                                    <td style={{ py: '20px', padding: '16px 0', textAlign: 'center', fontWeight: '700', color: colors.slate500 }}>{item.quantity}</td>
                                    <td style={{ py: '20px', padding: '16px 0', textAlign: 'right', fontWeight: '500', color: colors.slate500 }}>₹{item.price.toLocaleString()}</td>
                                    <td style={{ py: '20px', padding: '16px 0', textAlign: 'right', fontWeight: '900', color: colors.slate800 }}>₹{item.total.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: colors.slate500 }}>
                                <span style={{ fontSize: '14px', fontWeight: '700' }}>Subtotal</span>
                                <span style={{ fontWeight: '700' }}>₹{invoiceData.subtotal.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: colors.slate500 }}>
                                <span style={{ fontSize: '14px', fontWeight: '700' }}>GST (18%)</span>
                                <span style={{ fontWeight: '700' }}>₹{invoiceData.tax.toLocaleString()}</span>
                            </div>
                            <div style={{ height: '1px', backgroundColor: colors.slate200, margin: '8px 0' }}></div>
                            <div style={{ backgroundColor: 'rgba(13, 148, 136, 0.05)', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '18px', fontWeight: '900', color: colors.slate800, textTransform: 'uppercase' }}>Grand Total</span>
                                <span style={{ fontSize: '24px', fontWeight: '900', color: colors.primary }}>₹{invoiceData.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ backgroundColor: colors.slate50, padding: '48px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: '48px' }}>
                    <div style={{ maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h4 style={{ margin: 0, fontSize: '10px', fontWeight: '900', color: colors.slate400, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Important Notes</h4>
                        <p style={{ margin: 0, fontSize: '12px', color: colors.slate500, lineHeight: '1.5', fontWeight: '500' }}>
                            This is a computer-generated invoice. No physical signature is required. Please keep this for your medical records.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <div style={{ width: '160px', height: '1px', backgroundColor: colors.slate300, marginBottom: '8px' }}></div>
                        <p style={{ margin: 0, fontSize: '10px', fontWeight: '900', color: colors.slate400, textTransform: 'uppercase', letterSpacing: '0.1em', fontStyle: 'italic' }}>Authorized Signature</p>
                        <div style={{ width: '96px', height: '48px', backgroundColor: 'rgba(255, 255, 255, 0.5)', border: `1px solid ${colors.slate200}`, marginTop: '16px', borderRadius: '4px', transform: 'rotate(-2deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: colors.primary, fontStyle: 'italic', fontSize: '14px', fontFamily: 'serif' }}>Clinixa Admin</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'center', color: colors.slate400, fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '32px 0' }}>
                Generated via Clinixa Billing Engine • {new Date().getFullYear()}
            </div>
        </div>
    );
};

export default InvoiceDetails;
