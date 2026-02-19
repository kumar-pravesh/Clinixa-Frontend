import React, { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight, AlertCircle, Loader2, CheckCircle2, KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../components/common/Logo';
import authService from '../../services/authService';

const MotionDiv = motion.div;

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            await authService.forgotPassword(email);
            setSent(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans overflow-hidden">
            {/* LEFT SIDE */}
            <div className="hidden lg:flex w-[55%] bg-slate-950 text-white p-20 flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg viewBox="0 0 1000 200" className="w-[200%] h-auto absolute top-1/2 -translate-y-1/2 left-[-50%] text-primary/40">
                        <motion.path
                            d="M0,100 L300,100 L310,80 L325,120 L335,100 L350,100 L360,20 L380,180 L395,100 L410,100 L420,90 L430,110 L440,100 L1000,100"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        />
                    </svg>
                </div>

                <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

                <MotionDiv
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10"
                >
                    <Logo forceLight={true} className="mb-24 scale-125 origin-left" />

                    <div className="space-y-3 mb-10">
                        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 w-fit">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400">Account Recovery</span>
                        </div>
                        <h1 className="text-7xl font-black leading-[0.95] tracking-tighter">
                            Credential<br />
                            <span className="text-gradient">Recovery.</span>
                        </h1>
                    </div>

                    <p className="text-xl text-slate-400 max-w-lg leading-relaxed font-medium mb-12">
                        Securely reset your institutional credentials through our encrypted recovery pipeline.
                    </p>
                </MotionDiv>

                <div className="relative z-10 border-t border-white/5 pt-10 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Clinixa Staff v4.2.0</p>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full lg:w-[45%] flex items-center justify-center p-8 lg:p-24 bg-white relative">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, #0D9488 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <MotionDiv
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md relative z-10"
                >
                    <div className="lg:hidden mb-16">
                        <Logo />
                    </div>

                    <div className="mb-14">
                        <h2 className="text-5xl font-black text-slate-950 tracking-tighter leading-none mb-6">Reset<br />Password.</h2>
                        <div className="flex items-center gap-3">
                            <KeyRound size={18} className="text-primary" />
                            <span className="text-slate-400 font-black uppercase text-[10px] tracking-[0.4em]">Secure Recovery Protocol</span>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <MotionDiv
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="mb-10 p-6 bg-red-50 border border-red-100 rounded-[2.5rem] flex items-center gap-5"
                            >
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 shrink-0 shadow-sm">
                                    <AlertCircle size={24} />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-red-400 leading-none">Error</p>
                                    <p className="text-xs font-bold text-red-600 leading-tight">{error}</p>
                                </div>
                            </MotionDiv>
                        )}
                    </AnimatePresence>

                    {!sent ? (
                        <form onSubmit={handleSubmit} className="space-y-10" noValidate>
                            <div className="space-y-6">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 ml-2">Enter Your Email</p>
                                <div className="group relative">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors text-slate-400 group-focus-within:text-primary" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Staff Identification Email"
                                        className="w-full pl-16 pr-8 py-6 bg-slate-50 border-2 border-slate-50 rounded-[2rem] outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm focus:bg-white focus:border-primary/20 focus:ring-[15px] focus:ring-primary/5"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-950 py-7 rounded-[2rem] text-white font-black uppercase tracking-[0.3em] text-[10px] shadow-3xl shadow-slate-950/20 hover:bg-primary hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 group"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin w-5 h-5" />
                                        Sending Reset Link...
                                    </>
                                ) : (
                                    <>
                                        Send Reset Link <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <MotionDiv
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center space-y-8"
                        >
                            <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto">
                                <CheckCircle2 size={40} className="text-emerald-500" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-black text-slate-950 tracking-tight">Check Your Email</h3>
                                <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                                    If an account with that email exists, a password reset link has been sent. Please check your inbox and spam folder.
                                </p>
                            </div>
                        </MotionDiv>
                    )}

                    <div className="mt-20 pt-12 border-t border-slate-100 text-center">
                        <Link to="/login" className="inline-flex items-center gap-3 text-primary hover:text-slate-950 transition-colors font-black uppercase text-[10px] tracking-[0.2em]">
                            <ArrowLeft size={16} />
                            Back to Login
                        </Link>
                    </div>
                </MotionDiv>
            </div>
        </div>
    );
};

export default ForgotPassword;
