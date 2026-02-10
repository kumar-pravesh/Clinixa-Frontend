import { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from "framer-motion";
import { PlusCircle, Star, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const DoctorsPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock data fallback if API fails (for pure UI testing if backend off)
    const mockDoctors = [
        { id: 1, name: "Dr. Sarah Smith", specialization: "Cardiology", fees: 500 },
        { id: 2, name: "Dr. James Wilson", specialization: "Neurology", fees: 600 },
        { id: 3, name: "Dr. Emily Chen", specialization: "Pediatrics", fees: 400 },
    ];

    useEffect(() => {
        api.get('/appointment/doctors')
            .then(res => setDoctors(res.data.length ? res.data : mockDoctors)) // Fallback to mock if empty
            .catch((err) => {
                console.error(err);
                setDoctors(mockDoctors);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <section className="bg-primary text-white py-16 text-center">
                <h1 className="text-4xl font-bold mb-4">Meet Our Specialists</h1>
                <p className="text-teal-100 max-w-2xl mx-auto px-4">
                    Our team of experienced doctors is dedicated to your well-being.
                </p>
            </section>

            <div className="container mx-auto px-6 mt-16">
                {loading ? (
                    <div className="text-center py-20">Loading doctors...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {doctors.map((doctor, i) => (
                            <motion.div
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
                                            <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.name}`}
                                                    alt={doctor.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-white shadow-sm" title="Available Now"></div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-orange-100 italic">
                                                <Star size={12} fill="currentColor" /> 4.9
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded border">12+ YRS EXP</span>
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-black text-gray-900 mb-1 group-hover:text-primary transition-colors">{doctor.name}</h2>
                                    <p className="text-primary font-bold text-sm mb-4 uppercase tracking-widest">{doctor.department_name || doctor.specialization}</p>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <Activity size={16} className="text-secondary" />
                                            <span>MBBS, MD - {doctor.specialization}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <PlusCircle size={16} className="text-accent" />
                                            <span>Senior Consultant</span>
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
                                        state={{ doctorId: doctor.id, doctorName: doctor.name, fee: doctor.consultation_fee }}
                                        className="bg-accent text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2"
                                    >
                                        Book Now
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorsPage;
