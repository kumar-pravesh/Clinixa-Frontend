import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { motion } from "framer-motion";
import { User, Mail, Lock, Phone, ArrowLeft, Calendar, ShieldCheck, Activity, ArrowRight } from "lucide-react";
import Logo from "../components/shared/Logo";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        dob: '',
        gender: 'Male',
        phone: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await authService.register(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setIsLoading(true);
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
                setError('Google Authentication failed');
            } finally {
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] -translate-y-1/2 -translate-x-1/2" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] translate-y-1/2 translate-x-1/2" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full glass-card p-10 rounded-[40px] relative z-10"
            >
                <div className="text-center mb-10">
                    <Link to="/" className="inline-block mb-8 hover:scale-105 transition-transform">
                        <Logo className="h-10 mx-auto" />
                    </Link>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-4">Initialize Identity</h2>
                    <p className="text-sm font-medium text-slate-500 max-w-[320px] mx-auto">
                        Join the Clinixa digital health ecosystem for precision clinical diagnostics and management.
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-50 text-red-600 p-4 rounded-2xl text-[13px] border border-red-100 mb-8 font-bold flex items-center gap-3"
                    >
                        <ShieldCheck size={18} className="shrink-0" />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        {/* Full Name */}
                        <div className="md:col-span-2 group">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1 group-focus-within:text-primary transition-colors">Legal Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input name="name" type="text" onChange={handleChange} required className="input-field pl-12" placeholder="Patient Full Name" />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="group">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1 group-focus-within:text-primary transition-colors">Digital Mail</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input name="email" type="email" onChange={handleChange} required className="input-field pl-12" placeholder="you@example.com" />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="group">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1 group-focus-within:text-primary transition-colors">Contact Signal</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input name="phone" type="text" onChange={handleChange} required className="input-field pl-12" placeholder="+91 00000 00000" />
                            </div>
                        </div>

                        {/* DOB */}
                        <div className="group">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1 group-focus-within:text-primary transition-colors">Cycle Start (DOB)</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input name="dob" type="date" onChange={handleChange} required className="input-field pl-12 py-[11px]" />
                            </div>
                        </div>

                        {/* Gender */}
                        <div className="group">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1 group-focus-within:text-primary transition-colors">Gender Identity</label>
                            <select name="gender" onChange={handleChange} className="input-field appearance-none cursor-pointer">
                                <option value="Male">Biological Male</option>
                                <option value="Female">Biological Female</option>
                                <option value="Other">Non-Binary / Other</option>
                            </select>
                        </div>

                        {/* Password */}
                        <div className="md:col-span-2 group">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1 group-focus-within:text-primary transition-colors">Access Key Creation</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input name="password" type="password" onChange={handleChange} required className="input-field pl-12" placeholder="Minimum 8 characters" />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full py-4 mt-4"
                    >
                        {isLoading ? (
                            <Activity className="animate-spin mx-auto" size={20} />
                        ) : (
                            <span className="uppercase tracking-[0.2em]">Generate Account</span>
                        )}
                    </button>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
                        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-400"><span className="bg-white px-4">Federated Entry</span></div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full h-14 glass-card rounded-2xl flex items-center justify-center gap-4 hover:bg-slate-50 transition-all font-bold text-slate-700 group border-slate-100"
                    >
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Join with Google
                    </button>
                </form>

                <div className="text-center mt-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Already configured?</p>
                    <Link to="/login" className="btn-secondary w-full py-4 text-xs tracking-widest flex items-center justify-center gap-3">
                        <ArrowLeft size={14} /> Back to Authority Check
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
