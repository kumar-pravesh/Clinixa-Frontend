import React, { useState, useRef, useEffect } from 'react';
import {
    CreditCard,
    Search,
    Plus,
    Trash2,
    Printer,
    ArrowLeft,
    ChevronRight,
    Wallet,
    Smartphone,
    Banknote,
    Loader2,
    FlaskConical,
    Pill,
    UserPlus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import html2pdf from 'html2pdf.js';
import { PaymentModal } from '../../components/common/PaymentModal';
import { useNotification } from '../../context/NotificationContext';
import receptionService from '../../services/receptionService';

const BillingManagement = () => {
    const { addNotification } = useNotification();
    const invoiceTemplateRef = useRef(null);
    const [consultationFee, setConsultationFee] = useState(500);
    const [labCharges, setLabCharges] = useState(0);
    const [medicineCharges, setMedicineCharges] = useState(0);
    const [discount, setDiscount] = useState(0); // Percentage
    const [billItems, setBillItems] = useState([]);
    const [paymentMode, setPaymentMode] = useState('UPI');
    const [searchQuery, setSearchQuery] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length >= 2) {
                setIsSearching(true);
                try {
                    const results = await receptionService.searchPatient(searchQuery);
                    setSearchResults(results);
                } catch (error) {
                    console.error("Search failed:", error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

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

    const addItem = () => {
        setBillItems([...billItems, { id: `${Date.now()}-${Math.random()}`, service: '', charge: 0 }]);
    };

    const removeItem = (id) => {
        if (billItems.length > 1) {
            setBillItems(billItems.filter(item => item.id !== id));
        }
    };

    const updateItem = (index, field, value) => {
        const newItems = [...billItems];
        newItems[index][field] = value;
        setBillItems(newItems);
    };

    const itemsTotal = billItems.reduce((sum, item) => sum + Number(item.charge || 0), 0);
    const subtotal = Number(consultationFee || 0) + Number(labCharges || 0) + Number(medicineCharges || 0) + itemsTotal;
    const discountAmount = (subtotal * Number(discount || 0)) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxRate = 0.18;
    const taxAmount = taxableAmount * taxRate;
    const total = taxableAmount + taxAmount;

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const handleCreateBill = () => {
        if (!selectedPatient) {
            alert("Please select a patient first");
            return;
        }
        if (billItems.some(item => !item.service || !item.charge)) {
            // Allow empty bill items? Maybe not.
            alert("Please fill in all service details");
            return;
        }
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = async () => {
        setIsGenerating(true);
        console.log('Generating PDF and Saving Invoice...');

        try {
            // 1. Create Invoice in Backend
            const invoiceData = {
                patient_id: parseInt(selectedPatient.id.replace('PID-', '')), // Convert to numeric ID
                consultation_fee: parseFloat(consultationFee),
                lab_charges: parseFloat(labCharges),
                medicine_charges: parseFloat(medicineCharges),
                items: billItems.map(item => ({
                    service: item.service,
                    charge: parseFloat(item.charge) || 0
                })),
                discount_percent: parseFloat(discount),
                payment_mode: paymentMode
            };

            console.log('Invoice Data being sent:', invoiceData);
            await receptionService.createInvoice(invoiceData);

            // 2. Generate PDF
            if (invoiceTemplateRef.current) {
                const element = invoiceTemplateRef.current;
                const opt = {
                    margin: [10, 5, 10, 5],
                    filename: `Clinixa_Bill_${selectedPatient?.id || 'New'}_${new Date().toISOString().split('T')[0]}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: {
                        scale: 2,
                        useCORS: true,
                        letterRendering: true,
                        width: 790
                    },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };
                await html2pdf().set(opt).from(element).save();
            }

            addNotification({
                type: 'payment',
                title: 'Payment Received',
                message: `Invoice created successfully for ${selectedPatient.name}. Total: ₹${total.toLocaleString()}`
            });

            // Reset form
            setSelectedPatient(null);
            setBillItems([]);
            setConsultationFee(500);
            setLabCharges(0);
            setMedicineCharges(0);
            setDiscount(0);

        } catch (error) {
            console.error('Invoice generation error:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                fullError: error
            });
            addNotification({
                type: 'emergency',
                title: 'Invoice Failed',
                message: error.response?.data?.message || 'Could not create invoice. Please try again.'
            });
        } finally {
            setIsGenerating(false);
            setIsPaymentModalOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 animate-in fade-in duration-500 pb-20 px-4 sm:px-6">
            {/* Hidden PDF Template (HEX Only Styles) */}
            <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                <div ref={invoiceTemplateRef} style={{ width: '790px', padding: '48px', backgroundColor: 'white', fontFamily: 'sans-serif', border: `1px solid ${colors.slate200}`, borderRadius: '24px', overflow: 'hidden' }}>
                    {/* Header */}
                    <div style={{ backgroundColor: colors.slate800, padding: '48px', color: 'white', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', margin: '-48px -48px 48px -48px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                    <div style={{ backgroundColor: colors.primary, width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px', fontWeight: '900' }}>C</div>
                                    <div>
                                        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', fontStyle: 'italic' }}>Clinixa</h2>
                                        <p style={{ margin: 0, fontSize: '10px', fontWeight: '900', color: colors.primary, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Healthcare Redefined</p>
                                    </div>
                                </div>
                                <div style={{ fontSize: '14px', color: colors.slate400 }}>
                                    <p style={{ margin: 0 }}>45 Medical Square, Central Health City</p>
                                    <p style={{ margin: '4px 0' }}>+91 9988776655</p>
                                    <p style={{ margin: 0 }}>billing@clinixa.life</p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <h3 style={{ margin: 0, fontSize: '36px', fontWeight: '900', textTransform: 'uppercase' }}>Invoice</h3>
                                <p style={{ margin: '8px 0 0 0', fontSize: '14px', fontWeight: '700', color: colors.slate400 }}>DATE: <span style={{ color: 'white' }}>{new Date().toLocaleDateString()}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Patient / Details */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '48px', borderBottom: `1px solid ${colors.slate100}`, paddingBottom: '32px' }}>
                        <div>
                            <span style={{ fontSize: '10px', fontWeight: '900', color: colors.slate400, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: '12px' }}>Bill To</span>
                            <h4 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: colors.slate800 }}>{selectedPatient?.name || 'N/A'}</h4>
                            <p style={{ margin: '4px 0', fontSize: '14px', fontWeight: '700', color: colors.primary }}>{selectedPatient?.id || 'N/A'} • {selectedPatient?.phone || ''} • {selectedPatient?.gender || ''}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '10px', fontWeight: '900', color: colors.slate400, textTransform: 'uppercase', letterSpacing: '0.2em', display: 'block', marginBottom: '12px' }}>Payment Info</span>
                            <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: colors.slate800 }}>Mode: {paymentMode}</p>
                            <p style={{ margin: '4px 0', fontSize: '14px', color: colors.slate500 }}>Status: Paid</p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '48px' }}>
                        <thead>
                            <tr style={{ borderBottom: `2px solid ${colors.slate100}` }}>
                                <th style={{ paddingBottom: '16px', textAlign: 'left', fontSize: '10px', fontWeight: '900', color: colors.slate400, textTransform: 'uppercase' }}>Description</th>
                                <th style={{ paddingBottom: '16px', textAlign: 'right', fontSize: '10px', fontWeight: '900', color: colors.slate400, textTransform: 'uppercase' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {consultationFee > 0 && (
                                <tr style={{ borderBottom: `1px solid ${colors.slate100}` }}>
                                    <td style={{ padding: '20px 0', fontWeight: '700', color: colors.slate700 }}>Consultation Fees</td>
                                    <td style={{ padding: '20px 0', textAlign: 'right', fontWeight: '900', color: colors.slate800 }}>₹{Number(consultationFee).toLocaleString()}</td>
                                </tr>
                            )}
                            {labCharges > 0 && (
                                <tr style={{ borderBottom: `1px solid ${colors.slate100}` }}>
                                    <td style={{ padding: '20px 0', fontWeight: '700', color: colors.slate700 }}>Lab Charges</td>
                                    <td style={{ padding: '20px 0', textAlign: 'right', fontWeight: '900', color: colors.slate800 }}>₹{Number(labCharges).toLocaleString()}</td>
                                </tr>
                            )}
                            {medicineCharges > 0 && (
                                <tr style={{ borderBottom: `1px solid ${colors.slate100}` }}>
                                    <td style={{ padding: '20px 0', fontWeight: '700', color: colors.slate700 }}>Medicine Charges</td>
                                    <td style={{ padding: '20px 0', textAlign: 'right', fontWeight: '900', color: colors.slate800 }}>₹{Number(medicineCharges).toLocaleString()}</td>
                                </tr>
                            )}
                            {billItems.map(item => (
                                <tr key={item.id} style={{ borderBottom: `1px solid ${colors.slate100}` }}>
                                    <td style={{ padding: '20px 0', fontWeight: '700', color: colors.slate700 }}>{item.service}</td>
                                    <td style={{ padding: '20px 0', textAlign: 'right', fontWeight: '900', color: colors.slate800 }}>₹{Number(item.charge).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '48px' }}>
                        <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '700', color: colors.slate500 }}>
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            {discount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '700', color: colors.primary }}>
                                    <span>Discount ({discount}%)</span>
                                    <span>-₹{discountAmount.toLocaleString()}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '700', color: colors.slate500 }}>
                                <span>GST (18%)</span>
                                <span>₹{taxAmount.toLocaleString()}</span>
                            </div>
                            <div style={{ height: '1px', backgroundColor: colors.slate200, margin: '8px 0' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(13, 148, 136, 0.05)', padding: '16px', borderRadius: '16px' }}>
                                <span style={{ fontWeight: '900', color: colors.slate800, textTransform: 'uppercase' }}>Total</span>
                                <span style={{ fontSize: '24px', fontWeight: '900', color: colors.primary }}>₹{total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{ textAlign: 'center', borderTop: `1px solid ${colors.slate100}`, paddingTop: '32px' }}>
                        <p style={{ margin: 0, fontSize: '12px', color: colors.slate400, fontWeight: 'bold' }}>Thank you for choosing Clinixa Healthcare Services.</p>
                        <p style={{ margin: '8px 0 0 0', fontSize: '10px', color: colors.slate300, fontStyle: 'italic' }}>Computer generated bill - No signature required.</p>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-4 text-center md:text-left pt-6 sm:pt-10 mb-8 sm:mb-12">
                <Link to="/reception" className="md:flex p-2.5 hover:bg-white rounded-2xl border border-transparent hover:border-slate-200 transition-all group shadow-sm bg-white/50 backdrop-blur-md">
                    <ArrowLeft className="w-6 h-6 text-slate-500 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight leading-none">Billing Management</h1>
                    <p className="text-slate-400 font-black uppercase text-[10px] sm:text-[11px] tracking-[0.3em] mt-3">Invoice Generation & Payment Processing</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Bill Creator */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/50 shadow-xl shadow-slate-200/50">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-primary" /> Invoice Items
                                </h2>
                                <button onClick={addItem} className="btn-secondary py-2 flex items-center gap-2 text-sm">
                                    <Plus className="w-4 h-4" /> Add Service
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Desktop Header */}
                                <div className="hidden md:grid grid-cols-12 gap-4 px-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    <div className="col-span-7 pl-4">Service Description</div>
                                    <div className="col-span-3 text-right">Amount (₹)</div>
                                    <div className="col-span-2"></div>
                                </div>

                                <div className="space-y-4">
                                    {/* Fixed Charge Categories */}
                                    {[
                                        { label: 'Consultation Fees', value: consultationFee, setter: setConsultationFee, icon: UserPlus },
                                        { label: 'Lab Charges', value: labCharges, setter: setLabCharges, icon: FlaskConical },
                                        { label: 'Medicine Charges', value: medicineCharges, setter: setMedicineCharges, icon: Pill }
                                    ].map((fee, idx) => (
                                        <div key={idx} className="flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-center p-5 md:p-0 bg-white md:bg-transparent rounded-3xl border border-slate-100 md:border-0 shadow-sm md:shadow-none hover:border-primary/20 transition-all">
                                            <div className="w-full md:col-span-7">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center md:hidden">
                                                        {fee.icon ? <fee.icon className="w-5 h-5 text-primary" /> : <CreditCard className="w-5 h-5 text-primary" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest md:hidden">Category</p>
                                                        <p className="text-sm font-black text-slate-800 md:bg-slate-50 md:border md:border-slate-100 md:px-5 md:py-3 md:rounded-2xl w-full">{fee.label}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full md:col-span-3">
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm">₹</span>
                                                    <input
                                                        type="number"
                                                        className="input-field !pl-10 text-left md:text-right h-12 md:h-12 font-black text-slate-800 bg-slate-50/50"
                                                        value={fee.value}
                                                        onChange={(e) => fee.setter(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Dynamic Items */}
                                    {billItems.map((item, index) => (
                                        <div key={item.id} className="flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-center p-5 md:p-0 bg-white md:bg-transparent rounded-3xl border border-primary/10 md:border-0 shadow-xl shadow-primary/5 md:shadow-none animate-in zoom-in-95 duration-200">
                                            <div className="w-full md:col-span-7">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center md:hidden shrink-0">
                                                        <Plus className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Additional Service Description"
                                                        className="input-field h-12 md:h-12 font-black text-slate-800 bg-white md:bg-slate-50/50"
                                                        value={item.service}
                                                        onChange={(e) => updateItem(index, 'service', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-full md:col-span-3">
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black text-sm">₹</span>
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        className="input-field !pl-10 text-left md:text-right h-12 md:h-12 font-black text-primary bg-primary/[0.02]"
                                                        value={item.charge}
                                                        onChange={(e) => updateItem(index, 'charge', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-full md:col-span-2 flex justify-end md:justify-center">
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-3 text-red-100 bg-red-500 hover:bg-red-600 rounded-2xl transition-all shadow-lg shadow-red-200 md:shadow-none"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                                <div className="flex justify-between text-slate-600">
                                    <span className="font-medium text-sm">Subtotal</span>
                                    <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600">
                                    <span className="font-medium text-sm">Discount (%)</span>
                                    <div className="w-24">
                                        <input
                                            type="number"
                                            className="input-field h-8 text-right text-xs font-bold"
                                            value={discount}
                                            onChange={(e) => setDiscount(e.target.value)}
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-primary font-bold text-sm">
                                        <span>Discount Amount</span>
                                        <span>-₹{discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-slate-600">
                                    <span className="font-medium text-sm">Tax (GST 18%)</span>
                                    <span className="font-bold">₹{taxAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl mt-4">
                                    <span className="font-bold text-slate-800">Grand Total</span>
                                    <span className="text-2xl font-black text-primary font-mono tracking-tighter">₹{total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Patient & Payment */}
                    <div className="space-y-6">
                        <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/50 shadow-xl shadow-slate-200/50 relative z-10">
                            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                                <Search className="w-5 h-5 text-primary" /> Select Patient
                            </h3>
                            <div className="relative mb-6 z-50">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search by Name, Phone, or Patient ID (PID-xxxx)"
                                    className="input-field !pl-12 h-12 bg-slate-50 border-slate-200 text-sm font-bold w-full"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        if (selectedPatient) setSelectedPatient(null);
                                    }}
                                    autoComplete="off"
                                />
                                {isSearching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary pointer-events-none" />}
                                {searchQuery && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 divide-y divide-slate-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-64 overflow-y-auto min-w-full">
                                        {isSearching && (
                                            <div className="p-4 text-center text-slate-400 text-sm font-bold">
                                                Searching...
                                            </div>
                                        )}
                                        {!isSearching && searchResults.length > 0 && searchResults.map(p => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setSelectedPatient({
                                                        id: p.id,
                                                        name: p.name,
                                                        phone: p.phone,
                                                        gender: p.gender
                                                    });
                                                    setSearchQuery('');
                                                    setSearchResults([]);
                                                }}
                                                className="w-full p-4 text-left hover:bg-primary/5 transition-colors flex items-center gap-3 group cursor-pointer"
                                            >
                                                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-black text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                                                    {p.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-black text-slate-700 group-hover:text-primary transition-colors">{p.name}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{p.id} • {p.phone}</p>
                                                </div>
                                            </button>
                                        ))}
                                        {!isSearching && searchResults.length === 0 && (
                                            <div className="p-4 text-center text-slate-400 text-sm font-bold">
                                                No patients found. Try searching by name, phone, or patient ID.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {selectedPatient ? (
                                <div className="p-5 bg-primary/5 border border-primary/10 rounded-2xl flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-xl font-black text-primary border-2 border-primary/20 shadow-sm">
                                            {selectedPatient.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-primary tracking-tight leading-none mb-1">{selectedPatient.name}</p>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{selectedPatient.id} • {selectedPatient.phone}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedPatient(null)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                                    <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">Start typing to find patient</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                            <div className="relative z-10">
                                <h3 className="text-lg font-black text-white mb-8 text-center uppercase tracking-[0.1em]">Payment Mode</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: 'UPI', icon: Smartphone, label: 'UPI' },
                                        { id: 'Cash', icon: Banknote, label: 'Cash' },
                                        { id: 'Card', icon: CreditCard, label: 'Card' }
                                    ].map(mode => (
                                        <button
                                            key={mode.id}
                                            onClick={() => setPaymentMode(mode.id)}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-3 group",
                                                paymentMode === mode.id
                                                    ? "bg-primary/5 border-primary text-primary shadow-lg shadow-primary/10"
                                                    : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                                            )}
                                        >
                                            <mode.icon className={cn("w-6 h-6 transition-transform group-active:scale-95", paymentMode === mode.id ? "text-primary" : "text-slate-300")} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{mode.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-10 space-y-4">
                                    <button
                                        onClick={handleCreateBill}
                                        disabled={isGenerating}
                                        className="w-full btn-primary h-16 text-lg font-black shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                                        {isGenerating ? "Processing..." : "Create & Print Bill"}
                                    </button>
                                    <button className="w-full text-slate-400 text-[10px] font-black hover:text-slate-600 transition-colors uppercase tracking-[0.3em] py-4">
                                        Save & Finish Later
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                amount={total}
                onSuccess={handlePaymentSuccess}
            />
        </div>
    );
};

export default BillingManagement;

