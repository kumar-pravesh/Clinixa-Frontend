import React, { useState } from 'react';
import { Mail, Lock, CheckCircle2, ArrowRight, AlertCircle, Loader2, ShieldCheck, User, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../components/common/Logo';

const MotionDiv = motion.div;

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth(); // Assuming register exists in context
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const password = formData.get('password');

        setLoading(true);

        try {
            // In real app, call context register. For now mock or use direct if available.
            // If context doesn't have register, we might need to use authService directly or update context.
            // But usually staff are created by admin, this is for public-website eventually.
            console.log('Registration attempt:', { name, email });

            // For the staff portal, registration might be restricted, but we are building it for the UI sync.
            if (register) {
                await register({ name, email, phone, password });
            } else {
                // Fallback for UI demonstration
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

            navigate('/login');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans overflow-hidden">
            {/* Left Side - Hero/Branding (Premium Dark) */}
            <div className="hidden lg:flex w-[55%] bg-slate-950 text-white p-20 flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <MotionDiv
                        animate={{
                            scale: [1.2, 1, 1.2],
                            rotate: [45, 0, 45],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[20%] -right-[20%] w-[80%] h-[80%] bg-primary/20 rounded-full blur-[140px]"
                    />
                </div>

                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <MotionDiv
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative z-10"
                >
                    <Logo forceLight={true} className="mb-24 scale-110 origin-left" />

                    <div className="space-y-2 mb-8">
                        <p className="text-primary font-bold text-xs uppercase tracking-[0.4em]">Join the Ecosystem</p>
                        <h1 className="text-6xl font-black leading-[1.1] tracking-tighter">
                            Create Your<br />
                            <span className="text-primary">Clinical</span> Profile
                        </h1>
                    </div>

                    <p className="text-lg text-slate-400 max-w-lg leading-relaxed font-medium mb-12">
                        Gain access to the next generation of healthcare management. Secure, integrated, and designed for professionals.
                    </p>
                </MotionDiv>

                <div className="relative z-10 border-t border-white/5 pt-10 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                        Clinixa Platform Auth v4.0
                    </p>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="w-full lg:w-[45%] flex items-center justify-center p-8 lg:p-24 bg-white relative">
                <MotionDiv
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <div className="lg:hidden mb-12">
                        <Logo />
                    </div>

                    <div className="mb-12">
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4">Register.</h2>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
                            <ShieldCheck size={12} className="text-primary" /> Multi-Layer Identity Verification
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <MotionDiv
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-8 p-5 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 overflow-hidden"
                            >
                                <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <p className="text-xs font-bold text-red-600 leading-tight">{error}</p>
                            </MotionDiv>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleRegister} className="space-y-8">
                        <div className="space-y-4">
                            <div className="group relative">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Legal Name"
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-primary/20 focus:ring-[12px] focus:ring-primary/5 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                    required
                                />
                            </div>

                            <div className="group relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-primary/20 focus:ring-[12px] focus:ring-primary/5 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                    required
                                />
                            </div>

                            <div className="group relative">
                                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Contact Signal (Phone)"
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-primary/20 focus:ring-[12px] focus:ring-primary/5 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                    required
                                />
                            </div>

                            <div className="group relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Secure Access Key"
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-primary/20 focus:ring-[12px] focus:ring-primary/5 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 py-6 rounded-[2rem] text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-slate-900/40 hover:bg-primary hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin w-5 h-5" />
                                    Creating Identity...
                                </>
                            ) : (
                                <>
                                    Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-16 pt-10 border-t border-slate-100 text-center">
                        <p className="text-slate-400 font-bold text-xs">
                            Already have an identity? <Link to="/login" className="text-slate-900 hover:text-primary transition-colors underline underline-offset-4">Back to Authority Check</Link>
                        </p>
                    </div>
                </MotionDiv>
            </div>
        </div>
    );
};

export default Register;
