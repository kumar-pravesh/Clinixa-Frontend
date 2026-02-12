import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, ShieldCheck, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../components/shared/Logo';

const MotionDiv = motion.div;

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');

        setLoading(true);

        try {
            const data = await authService.login(email, password);

            // Save to localStorage (as expected by Public Website)
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
            {/* Left Side - Hero/Branding (Premium Dark) */}
            <div className="hidden lg:flex w-[55%] bg-slate-950 text-white p-20 flex-col justify-between relative overflow-hidden">
                {/* 🌊 Advanced Mesh Gradient */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <MotionDiv
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 45, 0],
                            x: [0, 100, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[20%] -left-[20%] w-[80%] h-[80%] bg-primary/20 rounded-full blur-[140px]"
                    />
                    <MotionDiv
                        animate={{
                            scale: [1.2, 1, 1.2],
                            rotate: [45, 0, 45],
                            x: [0, -50, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-[20%] -right-[20%] w-[70%] h-[70%] bg-accent/10 rounded-full blur-[120px]"
                    />
                </div>

                {/* 📐 Decorative Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <MotionDiv
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative z-10"
                >
                    <Link to="/">
                        <Logo forceLight={true} className="mb-24 scale-110 origin-left hover:scale-115 transition-transform" />
                    </Link>

                    <div className="space-y-2 mb-8">
                        <p className="text-primary font-bold text-xs uppercase tracking-[0.4em]">Patient Portal Access</p>
                        <h1 className="text-6xl font-black leading-[1.1] tracking-tighter">
                            Your Personal<br />
                            <span className="text-primary">Clinical</span> Dashboard
                        </h1>
                    </div>

                    <p className="text-lg text-slate-400 max-w-lg leading-relaxed font-medium mb-12">
                        Seamlessly manage appointments, access records, and consult with top specialists through our encrypted health ecosystem.
                    </p>
                </MotionDiv>

                <div className="relative z-10 grid grid-cols-2 gap-6 max-w-xl">
                    {[
                        { title: "Personal Records", desc: "Encrypted & Secure", icon: ShieldCheck },
                        { title: "Smart Booking", desc: "Instant Confirmation", icon: Activity },
                    ].map((feature, i) => (
                        <MotionDiv
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                            className="bg-white/5 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            <feature.icon className="text-primary mb-4" size={24} />
                            <p className="font-black text-sm uppercase tracking-wider mb-1">{feature.title}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{feature.desc}</p>
                        </MotionDiv>
                    ))}
                </div>

                <div className="relative z-10 border-t border-white/5 pt-10 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                        Clinixa patient portal v1.2
                    </p>
                    <div className="flex gap-2">
                        <div className="w-8 h-1 bg-primary rounded-full" />
                        <div className="w-4 h-1 bg-white/10 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form (Minimal Premium) */}
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
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4">Welcome Back.</h2>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
                            <ShieldCheck size={12} className="text-primary" /> Secure Patient Authentication
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

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Patient Credentials</label>
                                <div className="space-y-4">
                                    <div className="group relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Registered Email Identity"
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
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="remember" className="w-4 h-4 rounded-lg border-2 border-slate-200 text-primary focus:ring-primary/20 accent-primary" />
                                <label htmlFor="remember" className="text-xs font-bold text-slate-500">Stay linked</label>
                            </div>
                            <Link to="/forgot-password" title="Coming soon!" className="text-[10px] font-black text-primary hover:opacity-70 uppercase tracking-widest">Forgot Access?</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 py-6 rounded-[2rem] text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-slate-900/40 hover:bg-primary hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin w-5 h-5" />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    Log In <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
                            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-400"><span className="bg-white px-4">Federated Gateway</span></div>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full py-5 border-2 border-slate-100 rounded-[2rem] flex items-center justify-center gap-4 hover:bg-slate-50 transition-all font-bold text-slate-700 group"
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>
                    </div>

                    <div className="mt-16 pt-10 border-t border-slate-100 text-center">
                        <p className="text-slate-400 font-bold text-xs">
                            New to Clinixa? <Link to="/register" className="text-slate-900 hover:text-primary transition-colors underline underline-offset-4 font-black">Join Ecosystem</Link>
                        </p>
                    </div>
                </MotionDiv>
            </div>
        </div>
    );
};

export default LoginPage;
