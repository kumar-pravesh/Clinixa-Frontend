import { useEffect, useState } from 'react';
import doctorService from '../../services/doctorService';
import { motion } from "framer-motion";
import { PlusCircle, Star, Activity, Shield, Award, Zap, ArrowRight, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";

const MotionDiv = motion.div;

const DoctorsPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await doctorService.getAllDoctors();
                setDoctors(data);
            } catch (error) {
                console.error("Failed to fetch doctors:", error);
                setDoctors([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    return (
        <div className="bg-white min-h-screen">
            {/* 🚀 CINEMATIC HEADER: Clinical Elite Collective */}
            <section className="bg-slate-950 text-white pt-32 pb-16 text-center relative overflow-hidden">
                {/* Animated Medical Grid Background */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/80" />

                <div className="container mx-auto px-6 relative z-10">
                    <MotionDiv
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 mb-6 bg-white/5 backdrop-blur-md px-6 py-2 rounded-full border border-white/10"
                    >
                        <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400">Clinical Elite Collective</span>
                    </MotionDiv>

                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter leading-none">
                        Medical <span className="text-gradient">Architects.</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto font-medium text-base leading-relaxed">
                        Curating the world's most elite medical minds to engineer your path to optimal health.
                    </p>

                    {/* Header Performance Bar */}
                    <div className="flex justify-center flex-wrap gap-8 mt-10 pt-8 border-t border-white/5">
                        <div className="flex items-center gap-3">
                            <Shield className="text-primary" size={20} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Board Certified</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Award className="text-sky-400" size={20} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Global Excellence</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Zap className="text-orange-400" size={20} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Instant Sync</span>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-6 py-12 relative">
                {/* Decorative Grid Layer */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, #0D9488 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                {loading ? (
                    <div className="flex justify-center items-center py-40">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                        {doctors.length > 0 ? (
                            doctors.map((doctor, i) => (
                                <MotionDiv
                                    key={doctor.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.8 }}
                                    className="group relative flex flex-col bg-slate-950 rounded-[48px] overflow-hidden border-2 border-slate-900 hover:border-white/10 transition-all duration-700 shadow-2xl"
                                >
                                    <div className="p-10 flex-grow relative overflow-hidden">
                                        {/* Subtle Waveform Animation in Background */}
                                        <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                            <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                                                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="animate-spin-slow" />
                                            </svg>
                                        </div>

                                        <div className="flex items-start justify-between mb-8">
                                            <div className="relative">
                                                <div className="w-24 h-24 bg-white/5 backdrop-blur-3xl rounded-[32px] overflow-hidden border-2 border-white/5 group-hover:border-primary transition-all duration-500 p-1 flex items-center justify-center font-black text-2xl text-slate-600">
                                                    {doctor.image_url ? (
                                                        <div className="w-full h-full">
                                                            <img
                                                                src={`${import.meta.env.VITE_API_ROOT || 'http://localhost:5000'}/${doctor.image_url}`}
                                                                alt={doctor.name}
                                                                className="w-full h-full object-cover rounded-[28px]"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    const fallback = e.target.parentElement.querySelector('.fallback-initials');
                                                                    if (fallback) fallback.style.display = 'flex';
                                                                }}
                                                            />
                                                            <div className="fallback-initials hidden absolute inset-0 w-full h-full bg-slate-900 flex items-center justify-center font-black text-slate-400 group-hover:text-primary transition-colors">
                                                                {doctor.name.split(' ').map(n => n[0]).join('')}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="flex items-center justify-center w-full h-full bg-slate-900">
                                                            {doctor.name.split(' ').map(n => n[0]).join('')}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-slate-950 shadow-2xl flex items-center justify-center animate-pulse" title="Live Connect Ready">
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-3 text-right">
                                                <div className="bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                                                    <Star size={12} className="text-orange-400 fill-orange-400" />
                                                    <span className="text-[10px] font-black text-white">{doctor.rating || '4.9'}</span>
                                                </div>
                                                <div className="bg-slate-900 border border-white/5 px-4 py-1.5 rounded-2xl">
                                                    <span className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em]">{doctor.experience || '10+'} YRS ELITE</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative z-10">
                                            <h2 className="text-3xl font-black text-white mb-2 leading-none tracking-tighter group-hover:text-primary transition-colors">{doctor.name}</h2>
                                            <p className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                                <span className="w-8 h-[1px] bg-primary/30" />
                                                {doctor.department_name || doctor.specialization}
                                            </p>

                                            <div className="space-y-4 mb-4">
                                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 group-hover:bg-white/10 transition-colors">
                                                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400">
                                                        <Activity size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Primary Focus</p>
                                                        <p className="text-white font-bold text-xs uppercase tracking-tight">{doctor.specialization}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 group-hover:bg-white/10 transition-colors">
                                                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400">
                                                        <UserCheck size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Clinical Grade</p>
                                                        <p className="text-white font-bold text-xs uppercase tracking-tight">{doctor.designation || 'Specialist Consultant'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 backdrop-blur-2xl p-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div>
                                            <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.3em] mb-1.5">Consultation Access</p>
                                            <p className="text-white font-black text-3xl tracking-tighter self-end"><span className="text-xs text-primary mr-1 italic font-medium">₹</span>{doctor.consultation_fee}</p>
                                        </div>
                                        <Link
                                            to="/patient/book-appointment"
                                            state={{ doctorId: doctor.id, doctorName: doctor.name, fee: doctor.consultation_fee, image_url: doctor.image_url }}
                                            className="group/btn h-14 bg-white text-slate-950 px-8 rounded-[20px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all duration-500 shadow-3xl active:scale-95 flex items-center gap-3"
                                        >
                                            Book Specialist <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                                        </Link>
                                    </div>
                                </MotionDiv>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 bg-slate-900/50 rounded-[48px] border-2 border-dashed border-slate-800">
                                <Activity className="mx-auto text-slate-700 mb-4" size={48} />
                                <p className="text-slate-500 font-black uppercase tracking-widest text-sm">Collective Under Maintenance</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorsPage;
