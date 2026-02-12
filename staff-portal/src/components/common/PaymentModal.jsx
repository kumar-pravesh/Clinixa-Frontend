import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

export const PaymentModal = ({ isOpen, onClose, amount, onSuccess }) => {
    const [step, setStep] = useState('processing'); // processing, verifying, success

    useEffect(() => {
        if (isOpen) {
            const t0 = setTimeout(() => setStep('processing'), 0);
            const t1 = setTimeout(() => setStep('verifying'), 2000);
            const t2 = setTimeout(() => setStep('success'), 4000);
            const t3 = setTimeout(() => {
                onSuccess();
                onClose();
            }, 5500);

            return () => {
                clearTimeout(t0);
                clearTimeout(t1);
                clearTimeout(t2);
                clearTimeout(t3);
            };
        }
    }, [isOpen, onSuccess, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
                {/* Header with Razorpay-like branding colors */}
                <div className="bg-[#0c243b] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-500 p-1.5 rounded text-white font-bold text-xs">RZP</div>
                        <span className="text-white font-bold text-sm tracking-wide">Razorpay Trusted</span>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Total Payable</p>
                        <p className="text-white font-bold">₹{amount.toLocaleString()}</p>
                    </div>
                </div>

                <div className="p-8 text-center bg-white min-h-[300px] flex flex-col items-center justify-center relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at center, #3b82f6 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>

                    {step === 'processing' && (
                        <div className="animate-in fade-in zoom-in duration-300 flex flex-col items-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center relative z-10 border-4 border-white shadow-xl shadow-blue-100">
                                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                                </div>
                            </div>
                            <h3 className="mt-8 text-lg font-black text-slate-800">Processing Payment</h3>
                            <p className="text-xs text-slate-500 font-bold mt-2 uppercase tracking-wide animate-pulse">Contacting Bank Server...</p>

                            <div className="mt-8 flex items-center gap-2 text-slate-400 text-[10px] font-bold bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                <Lock className="w-3 h-3" /> 256-bit Secure Encryption
                            </div>
                        </div>
                    )}

                    {step === 'verifying' && (
                        <div className="animate-in fade-in zoom-in duration-300 flex flex-col items-center">
                            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl shadow-amber-100 mb-6">
                                <ShieldCheck className="w-10 h-10 text-amber-500" />
                            </div>
                            <h3 className="text-lg font-black text-slate-800">Verifying Transaction</h3>
                            <p className="text-xs text-slate-500 font-bold mt-2 uppercase tracking-wide">Please do not refresh...</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="animate-in fade-in zoom-in duration-300 flex flex-col items-center">
                            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl shadow-green-100 mb-6 relative">
                                <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-[ping_1s_ease-out_infinite] opacity-20"></div>
                                <CheckCircle2 className="w-12 h-12 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800">Payment Successful!</h3>
                            <p className="text-xs text-slate-500 font-bold mt-2 uppercase tracking-wide">Redirecting back to merchant...</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-slate-50 border-t border-slate-100 p-3 text-center">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Powered by Razorpay</p>
                </div>
            </div>
        </div>
    );
};
