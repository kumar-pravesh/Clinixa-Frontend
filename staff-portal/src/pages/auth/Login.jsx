import React, { useState } from 'react';
import { Mail, Lock, CheckCircle2, ArrowRight, AlertCircle, Loader2, ShieldCheck, Activity, Globe, Server, UserCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../components/common/Logo';

const MotionDiv = motion.div;

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});

    const validateForm = (email, password) => {
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Staff email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!password) {
            newErrors.password = 'Access key is required';
        }
        return newErrors;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setErrors({});

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');

        const validationErrors = validateForm(email, password);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        console.log('Login attempt for email:', email);
        setLoading(true);

        try {
            const data = await login({ email, password });
            const role = data.user?.role;
            console.log('Login successful, role:', role);

            if (role === 'admin') {
                navigate('/admin', { replace: true });
            } else if (role === 'lab_technician') {
                navigate('/lab', { replace: true });
            } else if (role === 'doctor') {
                navigate('/doctor', { replace: true });
            } else if (role === 'receptionist') {
                navigate('/reception', { replace: true });
            } else {
                navigate('/reception', { replace: true });
            }
        } catch (err) {
            console.error('Login implementation error:', err.message);
            setError(err.message || 'System error during login. Please contact administrator.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans overflow-hidden">
            {/* 🛡️ LEFT SIDE: Enterprise Operator Interface */}
            <div className="hidden lg:flex w-[55%] bg-slate-950 text-white p-20 flex-col justify-between relative overflow-hidden">
                {/* 💓 Animated ECG Heartbeat Background */}
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

                {/* 📐 Professional Medical Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

                <MotionDiv
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10"
                >
                    <Logo forceLight={true} className="mb-24 scale-125 origin-left hover:scale-130 transition-transform" />

                    <div className="space-y-3 mb-10">
                        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 w-fit">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Enterprise Operator Interface</span>
                        </div>
                        <h1 className="text-7xl font-black leading-[0.95] tracking-tighter">
                            Advanced<br />
                            <span className="text-gradient">Clinical Command.</span>
                        </h1>
                    </div>

                    <p className="text-xl text-slate-400 max-w-lg leading-relaxed font-medium mb-12">
                        Precision-engineered ecosystem for modern healthcare professionals. Securely manage clinical intelligence with Clinixa Core.
                    </p>
                </MotionDiv>

                {/* Operational Status Cards */}
                <div className="relative z-10 grid grid-cols-2 gap-8 max-w-2xl">
                    {[
                        { title: "Active Operations", desc: "Live System Sync", icon: Activity, status: "Normal", color: "text-sky-400" },
                        { title: "Operator Security", desc: "Multi-layered Auth", icon: ShieldCheck, status: "Active", color: "text-emerald-400" },
                    ].map((feature, i) => (
                        <MotionDiv
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                            className="group bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[40px] border border-white/5 hover:border-white/10 transition-all duration-500"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${feature.color}`}>
                                    <feature.icon size={24} />
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                    <div className={`w-1 h-1 rounded-full ${feature.color.replace('text-', 'bg-')} animate-pulse`} />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{feature.status}</span>
                                </div>
                            </div>
                            <p className="font-black text-white text-lg tracking-tight mb-1">{feature.title}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{feature.desc}</p>
                        </MotionDiv>
                    ))}
                </div>

                <div className="relative z-10 border-t border-white/5 pt-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Clinixa Staff v4.2.0</p>
                        <div className="w-1 h-1 rounded-full bg-slate-800" />
                        <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">Medical Node 0871</p>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-12 h-1 bg-primary rounded-full" />
                        <div className="w-4 h-1 bg-white/10 rounded-full" />
                    </div>
                </div>
            </div>

            {/* 🔐 RIGHT SIDE: Staff Authentication Gateway */}
            <div className="w-full lg:w-[45%] flex items-center justify-center p-8 lg:p-24 bg-white relative">
                {/* Subtle Grid for right side */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, #0D9488 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <MotionDiv
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-md relative z-10"
                >
                    <div className="lg:hidden mb-16">
                        <Logo />
                    </div>

                    <div className="mb-14">
                        <h2 className="text-6xl font-black text-slate-950 tracking-tighter leading-none mb-6">Staff Portal.</h2>
                        <div className="flex items-center gap-3">
                            <UserCheck size={18} className="text-primary" />
                            <span className="text-slate-400 font-black uppercase text-[10px] tracking-[0.4em]">Institutional Identity Required</span>
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
                                    <p className="text-[10px] font-black uppercase tracking-widest text-red-400 leading-none">Security Flag</p>
                                    <p className="text-xs font-bold text-red-600 leading-tight">{error}</p>
                                </div>
                            </MotionDiv>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleLogin} className="space-y-10" noValidate>
                        <div className="space-y-6">
                            <div className="space-y-5">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 ml-2">Operator Credentials</p>
                                <div className="space-y-4">
                                    <div className="group relative">
                                        <Mail className={`absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.email ? 'text-red-500' : 'text-slate-400 group-focus-within:text-primary'}`} />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Staff Identification Email"
                                            className={`w-full pl-16 pr-8 py-6 bg-slate-50 border-2 rounded-[2rem] outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm ${errors.email ? 'border-red-200 focus:border-red-500 focus:ring-red-50' : 'border-slate-50 focus:bg-white focus:border-primary/20 focus:ring-[15px] focus:ring-primary/5'}`}
                                        />
                                        {errors.email && <p className="text-[10px] text-red-500 font-bold mt-2 ml-4 uppercase tracking-wider">{errors.email}</p>}
                                    </div>

                                    <div className="group relative">
                                        <Lock className={`absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.password ? 'text-red-500' : 'text-slate-400 group-focus-within:text-primary'}`} />
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Institutional Secret Key"
                                            className={`w-full pl-16 pr-8 py-6 bg-slate-50 border-2 rounded-[2rem] outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm ${errors.password ? 'border-red-200 focus:border-red-500 focus:ring-red-50' : 'border-slate-50 focus:bg-white focus:border-primary/20 focus:ring-[15px] focus:ring-primary/5'}`}
                                        />
                                        {errors.password && <p className="text-[10px] text-red-500 font-bold mt-2 ml-4 uppercase tracking-wider">{errors.password}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-4">
                                <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-2 border-slate-200 text-primary focus:ring-primary/20 accent-primary cursor-pointer" />
                                <label htmlFor="remember" className="text-xs font-bold text-slate-600 cursor-pointer">Remember Station</label>
                            </div>
                            <Link to="/forgot-password" global="true" className="text-[10px] font-black text-primary hover:text-slate-950 uppercase tracking-[0.2em] transition-colors">Forgot Password</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-950 py-7 rounded-[2rem] text-white font-black uppercase tracking-[0.3em] text-[10px] shadow-3xl shadow-slate-950/20 hover:bg-primary hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 group"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin w-5 h-5" />
                                    Validating Node Access...
                                </>
                            ) : (
                                <>
                                    Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-20 pt-12 border-t border-slate-100 text-center">
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-tight">
                            Restricted Medical Network Zone. <Link to="/register" className="text-primary hover:text-slate-950 transition-colors underline underline-offset-8 decoration-2 font-black">Create Account</Link>
                        </p>
                    </div>
                </MotionDiv>
            </div>
        </div>
    );
};

export default Login;
