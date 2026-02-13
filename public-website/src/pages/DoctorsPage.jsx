import { useEffect, useState } from 'react';
import doctorService from '../services/doctorService';
import { motion } from "framer-motion";
import { PlusCircle, Star, Activity } from "lucide-react";
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
                // Fallback to empty array or maybe show error state
                setDoctors([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <section className="bg-slate-950 text-white pt-36 pb-20 text-center relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <h1 className="text-4xl font-bold mb-4 relative z-10">Meet Our Specialists</h1>
                <p className="text-teal-100 max-w-2xl mx-auto px-4 relative z-10">
                    Our team of experienced doctors is dedicated to your well-being.
                </p>
            </section>

            <div className="container mx-auto px-6 mt-16">
                {loading ? (
                    <div className="text-center py-20">Loading doctors...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {doctors.length > 0 ? (
                            doctors.map((doctor, i) => (
                                <MotionDiv
                                    key={doctor.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col"
                                >
                                    <div className="p-8 flex-grow">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="relative">
                                                <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors flex items-center justify-center font-black text-2xl text-slate-400">
                                                    {doctor.image_url ? (
                                                        <img
                                                            src={`${import.meta.env.VITE_API_ROOT || 'http://localhost:5000'}/${doctor.image_url}`}
                                                            alt={doctor.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.parentElement.innerText = doctor.name.split(' ').map(n => n[0]).join('');
                                                            }}
                                                        />
                                                    ) : (
                                                        doctor.name.split(' ').map(n => n[0]).join('')
                                                    )}
                                                </div>
                                                <div className="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-white shadow-sm" title="Available Now"></div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-orange-100 italic">
                                                    <Star size={12} fill="currentColor" /> {doctor.rating || '4.9'}
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded border">{doctor.experience || '10+'} YRS EXP</span>
                                            </div>
                                        </div>

                                        <h2 className="text-2xl font-black text-gray-900 mb-1 group-hover:text-primary transition-colors">{doctor.name}</h2>
                                        <p className="text-primary font-bold text-sm mb-4 uppercase tracking-widest">{doctor.department_name || doctor.specialization}</p>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                <Activity size={16} className="text-secondary" />
                                                <span>{doctor.degree || 'MBBS, MD'} - {doctor.specialization}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                <PlusCircle size={16} className="text-accent" />
                                                <span>{doctor.designation || 'Senior Consultant'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50/50 p-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Consultation Fee</p>
                                            <p className="text-primary font-black text-2xl">₹{doctor.consultation_fee}</p>
                                        </div>
                                        <Link
                                            to="/patient/book-appointment"
                                            state={{ doctorId: doctor.id, doctorName: doctor.name, fee: doctor.consultation_fee, image_url: doctor.image_url }}
                                            className="bg-accent text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2"
                                        >
                                            Book Now
                                        </Link>
                                    </div>
                                </MotionDiv>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                No doctors found.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorsPage;
