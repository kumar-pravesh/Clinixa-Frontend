import React, { useState } from 'react';
import { Mail, Lock, CheckCircle2, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
        <div className="min-h-screen flex bg-white font-inter">
            {/* Left Side - Hero/Branding */}
            <div className="hidden lg:flex w-[55%] bg-slate-900 text-white p-16 flex-col justify-between relative overflow-hidden">
                {/* Modern Mesh Gradient Background */}
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-primary rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-600 rounded-full blur-[100px] animate-pulse delay-700"></div>
                </div>

                {/* Dot Grid Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="h-16 w-auto overflow-hidden rounded-2xl bg-white p-2 shadow-xl shadow-primary/20 transform hover:rotate-3 transition-transform">
                            <img src="/logo.png" alt="Clinixa Logo" className="h-full w-auto object-contain" />
                        </div>
                    </div>

                    <h1 className="text-6xl font-black mb-8 leading-[1.1] tracking-tighter">
                        Experience <br />
                        <span className="text-primary italic">Better</span> Care
                    </h1>
                    <p className="text-lg text-slate-400 max-w-md leading-relaxed font-medium">
                        Advanced technology meets compassionate expertise. Empowering hospitals with a modern, feature-ready management system.
                    </p>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-5 p-6 bg-white/[0.03] backdrop-blur-xl rounded-[2rem] border border-white/[0.05] max-w-sm hover:bg-white/[0.06] transition-all duration-500 group">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-black text-sm uppercase tracking-wider">24/7 Digital Hub</p>
                            <p className="text-xs text-slate-500 font-bold mt-1">Real-time patient & queue data</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 p-6 bg-white/[0.03] backdrop-blur-xl rounded-[2rem] border border-white/[0.05] max-w-sm hover:bg-white/[0.06] transition-all duration-500 group ml-12">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-black text-sm uppercase tracking-wider">Smart Analytics</p>
                            <p className="text-xs text-slate-500 font-bold mt-1">Insightful reports & billing</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                        © 2026 CLINIXA SYSTEMS
                    </p>
                    <div className="flex gap-4 opacity-30">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-[45%] flex items-center justify-center p-12 bg-white relative">
                {/* Background Blobs for Mobile */}
                <div className="lg:hidden absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary rounded-full blur-3xl"></div>
                </div>

                <div className="w-full max-w-md relative z-10">
                    <div className="text-center mb-10">
                        <div className="lg:hidden flex items-center justify-center mb-8">
                            <div className="h-12 w-auto overflow-hidden rounded-xl bg-white p-1 shadow-md">
                                <img src="/logo.png" alt="Clinixa Logo" className="h-full w-auto object-contain" />
                            </div>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Welcome Home</h2>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Authentication Required for Portal Access</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="w-8 h-8 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 shrink-0">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-bold text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="bg-white p-2 rounded-[2.5rem]">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Work Email</label>
                                    <div className="group relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="sarah.j@clinixa.life"
                                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                        <a href="#" className="text-[9px] font-black text-primary hover:text-primary/80 uppercase tracking-widest">Forgot Account?</a>
                                    </div>
                                    <div className="group relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 px-2">
                                    <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-2 border-slate-200 text-primary focus:ring-primary transition-all cursor-pointer" />
                                    <label htmlFor="remember" className="text-xs font-bold text-slate-500 cursor-pointer select-none">Stay logged in for 30 days</label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-slate-900/20 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 overflow-hidden relative"
                            >
                                {loading ? (
                                    <span className="relative z-10 flex items-center gap-3">
                                        <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
                                        SECURE INITIALIZING...
                                    </span>
                                ) : (
                                    <>
                                        <span className="relative z-10 flex items-center gap-3 tracking-widest text-xs uppercase">
                                            Access Dashboard <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-slate-400 font-bold text-xs">
                            Internal Staff Portal. <Link to="/register" className="text-slate-900 hover:text-primary transition-colors">Join Organization</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
