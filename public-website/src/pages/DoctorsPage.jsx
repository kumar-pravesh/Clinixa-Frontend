import { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from "framer-motion";
import { PlusCircle, Star } from "lucide-react";
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
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-3xl overflow-hidden border-2 border-secondary">
                                        {/* Placeholder Avatar */}
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.name}`}
                                            alt={doctor.name}
                                            className="w-full h-full"
                                        />
                                    </div>
                                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <Star size={12} fill="currentColor" /> 4.9
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h2>
                                <p className="text-secondary font-medium text-sm mb-4 uppercase tracking-wide">{doctor.specialization}</p>

                                <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Consultation Fee</p>
                                        <p className="text-accent font-bold text-lg">₹{doctor.fees}</p>
                                    </div>
                                    <Link
                                        to="/patient/book-appointment"
                                        state={{ doctorId: doctor.id }}
                                        className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition flex items-center gap-2"
                                    >
                                        <PlusCircle size={18} /> Book
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
