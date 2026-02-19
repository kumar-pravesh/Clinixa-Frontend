import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, ShieldCheck, Activity, User, Phone, Calendar, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../components/shared/Logo';

const MotionDiv = motion.div;

const RegisterPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpMessage, setOtpMessage] = useState('');

    // Stable today's date in YYYY-MM-DD format (local time)
    const todayStr = new Date().toLocaleDateString('en-CA');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        dob: '',
        gender: 'Male',
        phone: '',
        height: '',
        weight: '',
        bp_systolic: '',
        bp_diastolic: '',
        blood_group: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Extra guard for DOB future dates manually entered
        if (name === 'dob' && value > todayStr) {
            setErrors({ ...errors, dob: 'DOB cannot be in the future' });
            return;
        }

        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Full name is required';
        else if (formData.name.trim().length < 3) newErrors.name = 'Name must be at least 3 characters';

        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';

        if (!formData.phone) newErrors.phone = 'Phone number is required';
        else if (!/^[1-9]\d{9}$/.test(formData.phone)) newErrors.phone = 'Phone must be exactly 10 digits and cannot start with 0';

        if (!formData.dob) newErrors.dob = 'Date of birth is required';
        else {
            const birthDate = new Date(formData.dob);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (birthDate > today) newErrors.dob = 'DOB cannot be in the future';
        }

        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        // Health Validations (Optional but validated if present)
        if (formData.height && (isNaN(formData.height) || formData.height < 30 || formData.height > 250)) {
            newErrors.height = 'Invalid height (30-250 cm)';
        }
        if (formData.weight && (isNaN(formData.weight) || formData.weight < 2 || formData.weight > 300)) {
            newErrors.weight = 'Invalid weight (2-300 kg)';
        }
        if (formData.bp_systolic && (isNaN(formData.bp_systolic) || formData.bp_systolic < 40 || formData.bp_systolic > 250)) {
            newErrors.bp_systolic = 'Invalid BP Systolic';
        }
        if (formData.bp_diastolic && (isNaN(formData.bp_diastolic) || formData.bp_diastolic < 40 || formData.bp_diastolic > 150)) {
            newErrors.bp_diastolic = 'Invalid BP Diastolic';
        }

        return newErrors;
    };

    // Phase 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            const result = await authService.sendRegistrationOtp(formData);
            setOtpSent(true);
            setOtpMessage(result.message || 'OTP sent to your email. Please check your inbox.');
        } catch (err) {
            console.error('OTP send error:', err);
            const msg = err.response?.data?.message || 'Failed to send OTP. Please try again.';
            // If backend says use OTP (shouldn't happen in this flow, but safety fallback)
            if (err.response?.data?.useOtp) {
                setOtpSent(true);
                setOtpMessage('Please verify your email with OTP.');
            } else {
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    // Phase 2: Verify OTP and complete registration
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');

        if (!otp || otp.length < 6) {
            setError('Please enter the 6-digit OTP sent to your email.');
            return;
        }

        setLoading(true);
        try {
            await authService.verifyRegistrationOtp(formData.email, otp);
            navigate('/login');
        } catch (err) {
            console.error('OTP verification error:', err);
            setError(err.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError('');
        setLoading(true);
        try {
            const result = await authService.sendRegistrationOtp(formData);
            setOtpMessage(result.message || 'OTP resent to your email.');
            setOtp('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP.');
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
            <div className="hidden lg:flex w-[45%] bg-slate-950 text-white p-20 flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <MotionDiv
                        animate={{
                            scale: [1.2, 1, 1.2],
                            rotate: [-45, 0, -45],
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-[20%] -left-[20%] w-[80%] h-[80%] bg-accent/20 rounded-full blur-[140px]"
                    />
                </div>

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
                        <p className="text-primary font-bold text-xs uppercase tracking-[0.4em]">Initialize Your Journey</p>
                        <h1 className="text-6xl font-black leading-[1.1] tracking-tighter">
                            Patient<br />
                            <span className="text-primary">Identity</span> Cloud
                        </h1>
                    </div>

                    <p className="text-lg text-slate-400 max-w-lg leading-relaxed font-medium mb-12">
                        Create your federated health ID to unlock precision diagnostics, real-time doctor insights, and seamless clinical interactions.
                    </p>
                </MotionDiv>

                <div className="relative z-10 border-t border-white/5 pt-10 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                        Clinixa patient portal v1.2
                    </p>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="w-full lg:w-[55%] flex items-center justify-center p-8 lg:p-12 bg-white relative overflow-y-auto">
                <MotionDiv
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-2xl py-12"
                >
                    <div className="lg:hidden mb-12">
                        <Logo />
                    </div>

                    <div className="mb-12">
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4">Register.</h2>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
                            <ShieldCheck size={12} className="text-primary" /> End-to-End HIPAA Aligned Registration
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

                    {!otpSent ? (
                        /* Phase 1: Registration Form */
                        <form onSubmit={handleSendOtp} className="space-y-8" noValidate>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 group relative">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Legal Identity</label>
                                    <div className="relative">
                                        <User className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.name ? 'text-red-500' : 'text-slate-300 group-focus-within:text-primary'}`} />
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Full Legal Name"
                                            className={`w-full pl-14 pr-6 py-5 bg-slate-50 border-2 rounded-[2rem] outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 ${errors.name ? 'border-red-200 focus:border-red-500 focus:ring-red-50' : 'border-transparent focus:bg-white focus:border-primary/20 focus:ring-[12px] focus:ring-primary/5'}`}
                                            onChange={handleChange}
                                            value={formData.name}
                                        />
                                        {errors.name && <p className="text-[10px] text-red-500 font-bold mt-2 ml-4 uppercase tracking-wider">{errors.name}</p>}
                                    </div>
                                </div>

                                <div className="group relative">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Digital Mail</label>
                                    <div className="relative">
                                        <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.email ? 'text-red-500' : 'text-slate-300 group-focus-within:text-primary'}`} />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Identification Email"
                                            className={`w-full pl-14 pr-6 py-5 bg-slate-50 border-2 rounded-[2rem] outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 ${errors.email ? 'border-red-200 focus:border-red-500 focus:ring-red-50' : 'border-transparent focus:bg-white focus:border-primary/20 focus:ring-[12px] focus:ring-primary/5'}`}
                                            onChange={handleChange}
                                            value={formData.email}
                                        />
                                        {errors.email && <p className="text-[10px] text-red-500 font-bold mt-2 ml-4 uppercase tracking-wider">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="group relative">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Contact Signal</label>
                                    <div className="relative">
                                        <Phone className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.phone ? 'text-red-500' : 'text-slate-300 group-focus-within:text-primary'}`} />
                                        <input
                                            type="text"
                                            name="phone"
                                            placeholder="+91 00000 00000"
                                            className={`w-full pl-14 pr-6 py-5 bg-slate-50 border-2 rounded-[2rem] outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 ${errors.phone ? 'border-red-200 focus:border-red-500 focus:ring-red-50' : 'border-transparent focus:bg-white focus:border-primary/20 focus:ring-[12px] focus:ring-primary/5'}`}
                                            onChange={handleChange}
                                            value={formData.phone}
                                        />
                                        {errors.phone && <p className="text-[10px] text-red-500 font-bold mt-2 ml-4 uppercase tracking-wider">{errors.phone}</p>}
                                    </div>
                                </div>

                                <div className="group relative">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Cycle Start (DOB)</label>
                                    <div className="relative">
                                        <Calendar className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.dob ? 'text-red-500' : 'text-slate-300 group-focus-within:text-primary'}`} />
                                        <input
                                            type="date"
                                            name="dob"
                                            className={`w-full pl-14 pr-6 py-5 bg-slate-50 border-2 rounded-[2rem] outline-none transition-all font-bold text-slate-700 text-sm ${errors.dob ? 'border-red-200 focus:border-red-500 focus:ring-red-50' : 'border-transparent focus:bg-white focus:border-primary/20 focus:ring-[12px] focus:ring-primary/5'}`}
                                            onChange={handleChange}
                                            value={formData.dob}
                                            max={todayStr}
                                        />
                                        {errors.dob && <p className="text-[10px] text-red-500 font-bold mt-2 ml-4 uppercase tracking-wider">{errors.dob}</p>}
                                    </div>
                                </div>

                                <div className="group relative">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Biological Identity</label>
                                    <div className="relative">
                                        <select
                                            name="gender"
                                            className="w-full pl-6 pr-10 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-primary/20 focus:ring-[12px] focus:ring-primary/5 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                                            onChange={handleChange}
                                            value={formData.gender}
                                        >
                                            <option value="Male">Biological Male</option>
                                            <option value="Female">Biological Female</option>
                                            <option value="Other">Non-Binary / Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="md:col-span-2 mt-8 mb-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
                                        <div className="relative flex justify-start text-[10px] font-black uppercase tracking-widest text-slate-400"><span className="bg-white pr-4">Vital Statistics (Optional)</span></div>
                                    </div>
                                </div>

                                <div className="group relative">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Height (CM)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="height"
                                            placeholder="e.g. 175"
                                            className={`w-full px-6 py-5 bg-slate-50 border-2 rounded-[2rem] outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 ${errors.height ? 'border-red-200 focus:border-red-500' : 'border-transparent focus:bg-white focus:border-primary/20'}`}
                                            onChange={handleChange}
                                            value={formData.height}
                                        />
                                        {errors.height && <p className="text-[10px] text-red-500 font-bold mt-2 ml-4 uppercase tracking-wider">{errors.height}</p>}
                                    </div>
                                </div>

                                <div className="group relative">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Weight (KG)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="weight"
                                            placeholder="e.g. 70"
                                            className={`w-full px-6 py-5 bg-slate-50 border-2 rounded-[2rem] outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 ${errors.weight ? 'border-red-200 focus:border-red-500' : 'border-transparent focus:bg-white focus:border-primary/20'}`}
                                            onChange={handleChange}
                                            value={formData.weight}
                                        />
                                        {errors.weight && <p className="text-[10px] text-red-500 font-bold mt-2 ml-4 uppercase tracking-wider">{errors.weight}</p>}
                                    </div>
                                </div>

                                <div className="group relative">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">BP Systolic</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="bp_systolic"
                                            placeholder="e.g. 120"
                                            className={`w-full px-6 py-5 bg-slate-50 border-2 rounded-[2rem] outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 ${errors.bp_systolic ? 'border-red-200 focus:border-red-500' : 'border-transparent focus:bg-white focus:border-primary/20'}`}
                                            onChange={handleChange}
                                            value={formData.bp_systolic}
                                        />
                                        {errors.bp_systolic && <p className="text-[10px] text-red-500 font-bold mt-2 ml-4 uppercase tracking-wider">{errors.bp_systolic}</p>}
                                    </div>
                                </div>

                                <div className="group relative">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">BP Diastolic</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="bp_diastolic"
                                            placeholder="e.g. 80"
                                            className={`w-full px-6 py-5 bg-slate-50 border-2 rounded-[2rem] outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 ${errors.bp_diastolic ? 'border-red-200 focus:border-red-500' : 'border-transparent focus:bg-white focus:border-primary/20'}`}
                                            onChange={handleChange}
                                            value={formData.bp_diastolic}
                                        />
                                        {errors.bp_diastolic && <p className="text-[10px] text-red-500 font-bold mt-2 ml-4 uppercase tracking-wider">{errors.bp_diastolic}</p>}
                                    </div>
                                </div>

                                <div className="group relative">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Blood Group</label>
                                    <div className="relative">
                                        <select
                                            name="blood_group"
                                            className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-primary/20 focus:ring-[12px] focus:ring-primary/5 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                                            onChange={handleChange}
                                            value={formData.blood_group}
                                        >
                                            <option value="">Select Blood Group</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="md:col-span-2 group relative">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Access Key Creation</label>
                                    <div className="relative">
                                        <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.password ? 'text-red-500' : 'text-slate-300 group-focus-within:text-primary'}`} />
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Minimum 8 characters, secure"
                                            className={`w-full pl-14 pr-6 py-5 bg-slate-50 border-2 rounded-[2rem] outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 ${errors.password ? 'border-red-200 focus:border-red-500 focus:ring-red-50' : 'border-transparent focus:bg-white focus:border-primary/20 focus:ring-[12px] focus:ring-primary/5'}`}
                                            onChange={handleChange}
                                            value={formData.password}
                                        />
                                        {errors.password && <p className="text-[10px] text-red-500 font-bold mt-2 ml-4 uppercase tracking-wider">{errors.password}</p>}
                                    </div>
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
                                        Sending Verification Code...
                                    </>
                                ) : (
                                    <>
                                        Verify & Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        /* Phase 2: OTP Verification */
                        <MotionDiv
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl">
                                <p className="text-xs font-bold text-emerald-700 leading-relaxed">
                                    <ShieldCheck size={14} className="inline mr-2 -mt-0.5" />
                                    {otpMessage}
                                </p>
                                <p className="text-[10px] text-emerald-600 mt-2 font-medium">
                                    Sent to: <strong>{formData.email}</strong>
                                </p>
                            </div>


                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <div className="group relative">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Verification Code</label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            maxLength="6"
                                            placeholder="Enter 6-digit OTP"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-primary/20 focus:ring-[12px] focus:ring-primary/5 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 tracking-[0.5em] text-center text-lg"
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            value={otp}
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || otp.length < 6}
                                    className="w-full bg-slate-900 py-6 rounded-[2rem] text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-slate-900/40 hover:bg-primary hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin w-5 h-5" />
                                            Verifying Identity...
                                        </>
                                    ) : (
                                        <>
                                            Complete Registration <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="flex items-center justify-between pt-2">
                                <button
                                    onClick={() => { setOtpSent(false); setOtp(''); setError(''); }}
                                    className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors flex items-center gap-2"
                                >
                                    <ArrowLeft size={12} /> Back to Form
                                </button>
                                <button
                                    onClick={handleResendOtp}
                                    disabled={loading}
                                    className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:text-slate-900 transition-colors disabled:opacity-50"
                                >
                                    Resend Code
                                </button>
                            </div>
                        </MotionDiv>
                    )}

                    <div className="mt-10 space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
                            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-400"><span className="bg-white px-4">Social Gateway Integration</span></div>
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
                            Join with Google
                        </button>
                    </div>

                    <div className="mt-16 pt-10 border-t border-slate-100 text-center">
                        <p className="text-slate-400 font-bold text-xs">
                            Already configured? <Link to="/login" className="text-slate-900 hover:text-primary transition-colors underline underline-offset-4 font-black">Back to Authority Check</Link>
                        </p>
                    </div>
                </MotionDiv>
            </div>
        </div>
    );
};

export default RegisterPage;
