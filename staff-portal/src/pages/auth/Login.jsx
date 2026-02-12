import React, { useState } from 'react';
import { Mail, Lock, CheckCircle2, ArrowRight, AlertCircle, Loader2, ShieldCheck, Activity, Smartphone } from 'lucide-react';
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

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');

        console.log('Login attempt for email:', email);
        setLoading(true);

        try {
            // Call the actual login from AuthContext
            const data = await login({ email, password });

            // Redirection logic based on role (returned from login)
            const role = data.user?.role;
            console.log('Login successful, role:', role);

            if (role === 'admin') {
                navigate('/admin', { replace: true });
            } else if (role === 'lab_tech') {
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
                    <Logo forceLight={true} className="mb-24 scale-110 origin-left" />

                    <div className="space-y-2 mb-8">
                        <p className="text-primary font-bold text-xs uppercase tracking-[0.4em]">Enterprise Access</p>
                        <h1 className="text-6xl font-black leading-[1.1] tracking-tighter">
                            Advanced<br />
                            <span className="text-primary">Clinical</span> Workflow
                        </h1>
                    </div>

                    <p className="text-lg text-slate-400 max-w-lg leading-relaxed font-medium mb-12">
                        Precision-engineered tools for modern healthcare professionals. Securely manage patient flows, diagnostics, and administrative intelligence with the Clinixa Staff Ecosystem.
                    </p>
                </MotionDiv>

                <div className="relative z-10 grid grid-cols-2 gap-6 max-w-xl">
                    {[
                        { title: "24/7 Operations", desc: "Real-time sync", icon: Activity },
                        { title: "Military Grade", desc: "End-to-end encryption", icon: ShieldCheck },
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
                        Clinixa internal portal v4.0
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
                            <Lock size={12} className="text-primary" /> Multi-Factor Secured Access
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
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Staff Credentials</label>
                                <div className="space-y-4">
                                    <div className="group relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Staff Email Address"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-primary/20 focus:ring-[12px] focus:ring-primary/5 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                            required
                                        />
                                    </div>

                                    <div className="group relative">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="System Password"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-primary/20 focus:ring-[12px] focus:ring-primary/5 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-2 border-slate-200 text-primary focus:ring-primary/20 transition-all cursor-pointer accent-primary" />
                                <label htmlFor="remember" className="text-xs font-bold text-slate-500 cursor-pointer">Remember Station</label>
                            </div>
                            <a href="#" className="text-[10px] font-black text-primary hover:opacity-70 uppercase tracking-widest">Forgot?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 py-6 rounded-[2rem] text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-slate-900/40 hover:bg-primary hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin w-5 h-5" />
                                    Initialing Secure Tunnel...
                                </>
                            ) : (
                                <>
                                    Initialize Session <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-16 pt-10 border-t border-slate-100 text-center">
                        <p className="text-slate-400 font-bold text-xs">
                            Not registered on this node? <Link to="/register" className="text-slate-900 hover:text-primary transition-colors underline underline-offset-4">Register Staff</Link>
                        </p>
                    </div>
                </MotionDiv>
            </div>
        </div>
    );
};

export default Login;
