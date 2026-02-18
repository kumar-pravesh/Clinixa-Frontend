import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, ShieldCheck, Activity, Globe, Server } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../components/shared/Logo';

const MotionDiv = motion.div;

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});

    const validateForm = (email, password) => {
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!password) {
            newErrors.password = 'Password is required';
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

        setLoading(true);
        // ... rest of the function
        try {
            const data = await authService.login(email, password);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('accessToken', data.accessToken);
            navigate('/patient/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setLoading(true);
        setTimeout(async () => {
            try {
                const mockToken = btoa(JSON.stringify({
                    email: 'google-user@gmail.com',
                    name: 'Google User',
                    sub: 'google-123'
                }));
                const data = await authService.googleAuth(mockToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('accessToken', data.accessToken);
                navigate('/patient/dashboard');
            } catch (err) {
                setError(err.response?.data?.message || 'Google Authentication failed');
            } finally {
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen flex bg-white font-sans overflow-hidden">
            {/* 🛡️ LEFT SIDE: Cinematic Clinical Interface */}
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

                {/* 📐 Medical Grid Depth */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

                <MotionDiv
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10"
                >
                    <Link to="/">
                        <Logo forceLight={true} className="mb-24 scale-125 origin-left hover:scale-130 transition-transform" />
                    </Link>

                    <div className="space-y-3 mb-10">
                        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 w-fit">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Secure Access Gateway</span>
                        </div>
                        <h1 className="text-7xl font-black leading-[0.95] tracking-tighter">
                            Your Personal<br />
                            <span className="text-gradient">Clinical Hub.</span>
                        </h1>
                    </div>

                    <p className="text-xl text-slate-400 max-w-lg leading-relaxed font-medium mb-12">
                        Enter our high-fidelity health ecosystem to manage your clinical journey with mission-critical precision.
                    </p>
                </MotionDiv>

                {/* Product Status Cards */}
                <div className="relative z-10 grid grid-cols-2 gap-8 max-w-2xl">
                    {[
                        { title: "Personal Records", desc: "Encryption Active", icon: ShieldCheck, status: "Secure", color: "text-emerald-400" },
                        { title: "Smart Booking", desc: "Real-time Sync", icon: Activity, status: "Live", color: "text-sky-400" },
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
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Clinixa Core v1.4.0</p>
                        <div className="w-1 h-1 rounded-full bg-slate-800" />
                        <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">Neural Engine Active</p>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-12 h-1 bg-primary rounded-full" />
                        <div className="w-4 h-1 bg-white/10 rounded-full" />
                        <div className="w-4 h-1 bg-white/10 rounded-full" />
                    </div>
                </div>
            </div>

            {/* 🔐 RIGHT SIDE: Professional Authentication Form */}
            <div className="w-full lg:w-[45%] flex items-center justify-center p-8 lg:p-24 bg-white relative">
                {/* Subtle Grid for right side */}
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
                        <h2 className="text-6xl font-black text-slate-950 tracking-tighter leading-none mb-6">Welcome<br />Back.</h2>
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={18} className="text-primary" />
                            <span className="text-slate-400 font-black uppercase text-[10px] tracking-[0.4em]">Authorized Access Only</span>
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
                                    <p className="text-[10px] font-black uppercase tracking-widest text-red-400 leading-none">Access Refused</p>
                                    <p className="text-xs font-bold text-red-600 leading-tight">{error}</p>
                                </div>
                            </MotionDiv>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleLogin} className="space-y-10">
                        <div className="space-y-6">
                            <div className="space-y-5">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 ml-2">Clinical Credentials</p>
                                <div className="space-y-4">
                                    <div className="group relative">
                                        <Mail className={`absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.email ? 'text-red-500' : 'text-slate-400 group-focus-within:text-primary'}`} />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Registered Institutional Email"
                                            className={`w-full pl-16 pr-8 py-6 bg-slate-50 border-2 rounded-[2rem] outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm ${errors.email ? 'border-red-200 focus:border-red-500 focus:ring-red-50' : 'border-slate-50 focus:bg-white focus:border-primary/20 focus:ring-[15px] focus:ring-primary/5'}`}
                                            noValidate
                                        />
                                        {errors.email && <p className="text-[10px] text-red-500 font-bold mt-2 ml-4 uppercase tracking-wider">{errors.email}</p>}
                                    </div>

                                    <div className="group relative">
                                        <Lock className={`absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.password ? 'text-red-500' : 'text-slate-400 group-focus-within:text-primary'}`} />
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Secure Medical Key"
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
                                <label htmlFor="remember" className="text-xs font-bold text-slate-600 cursor-pointer">Stay Authenticated</label>
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
                                    Synchronizing...
                                </>
                            ) : (
                                <>
                                    Sign In <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 space-y-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
                            <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.4em] text-slate-400"><span className="bg-white px-6">Federated Identity Gateway</span></div>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full py-6 border-2 border-slate-100 rounded-[2rem] flex items-center justify-center gap-5 hover:bg-slate-50 hover:border-slate-200 transition-all font-bold text-slate-950 group shadow-sm"
                        >
                            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Sign in with Google
                        </button>
                    </div>

                    <div className="mt-20 pt-12 border-t border-slate-100 text-center">
                        <p className="text-slate-400 font-bold text-xs">
                            Access restricted to registered patients. <Link to="/register" className="text-primary hover:text-slate-950 transition-colors underline underline-offset-8 decoration-2 font-black">Create Account</Link>
                        </p>
                    </div>
                </MotionDiv>
            </div>
        </div>
    );
};

export default LoginPage;
