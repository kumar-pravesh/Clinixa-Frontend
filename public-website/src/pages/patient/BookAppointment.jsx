import { useState, useEffect } from 'react';
import { patientService } from '../../services/patientService';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    ChevronRight,
    User,
    Star,
    PlusCircle,
    CreditCard,
    ArrowRight,
    Search,
    Bell,
    CheckCircle,
    ArrowLeft,
    AlertCircle
} from 'lucide-react';

const BookAppointment = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [step, setStep] = useState(1);
    const [processing, setProcessing] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        patientService.getDoctors()
            .then(data => setDoctors(data))
            .catch(error => console.error('Error fetching doctors:', error))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (selectedDoctor && selectedDate) {
            setLoadingSlots(true);
            patientService.getAvailability(selectedDoctor.id, selectedDate)
                .then(data => {
                    // Filter for available slots
                    setAvailableSlots(data);
                })
                .catch(error => console.error('Error fetching slots:', error))
                .finally(() => setLoadingSlots(false));
        }
    }, [selectedDoctor, selectedDate]);

    const loadRazorpay = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleBooking = async () => {
        setProcessing(true);
        try {
            // Step 1: Create Appointment in DB
            const apptRes = await patientService.bookAppointment({
                doctorId: selectedDoctor.id,
                date: selectedDate,
                timeSlot: selectedTime,
            });

            // Step 2: Initiate Payment
            const paymentInit = await patientService.initiatePayment(apptRes.id);

            // Step 3: Open Razorpay
            const res = await loadRazorpay('https://checkout.razorpay.com/v1/checkout.js');

            if (!res) {
                alert('Razorpay SDK failed to load. Please check your connection.');
                setProcessing(false);
                return;
            }

            const options = {
                key: paymentInit.payload.key,
                amount: paymentInit.payload.amount,
                currency: paymentInit.payload.currency,
                name: "CLINIXA Hospital",
                description: `Appointment with Dr. ${selectedDoctor.name}`,
                order_id: paymentInit.payload.id,
                handler: async function (response) {
                    try {
                        await patientService.confirmPayment(paymentInit.paymentId, response);
                        navigate('/patient/appointments');
                    } catch (error) {
                        alert("Payment verification failed. Please check your appointments list for status updates.");
                        navigate('/patient/appointments');
                    }
                },
                modal: {
                    ondismiss: function () {
                        setProcessing(false);
                    }
                },
                prefill: {
                    name: JSON.parse(localStorage.getItem("user"))?.name || "Patient",
                    email: JSON.parse(localStorage.getItem("user"))?.email || "patient@clinixa.com",
                },
                theme: { color: "#0ea5e9" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Booking failed:', error);
            alert(error.response?.data?.message || "Booking failed. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    const isPastSlot = (slotTime, dateStr) => {
        if (!dateStr) return false;

        const today = new Date();
        const selectedDate = new Date(dateStr);

        // Only check if it's the current day (ignoring time)
        const isToday = today.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0];
        if (!isToday) return false;

        // Parse slot time (e.g., "09:30 AM")
        const [time, modifier] = slotTime.split(' ');
        let [hours, minutes] = time.split(':');

        hours = parseInt(hours);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        const slotDateTime = new Date(selectedDate);
        slotDateTime.setHours(hours, parseInt(minutes), 0, 0);

        return slotDateTime < today;
    };

    const steps = [
        { id: 1, name: 'Doctor', icon: <User size={16} /> },
        { id: 2, name: 'Schedule', icon: <Calendar size={16} /> },
        { id: 3, name: 'Payment', icon: <CreditCard size={16} /> }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Wizard Header */}
            <div className="relative overflow-hidden rounded-2xl glass-panel p-4 shadow-sm border border-white/40">
                <div className="flex items-center justify-between px-4">
                    {steps.map((s, idx) => (
                        <div key={s.id} className="flex items-center flex-1 last:flex-none">
                            <div
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-500 ${step >= s.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-gray-400'
                                    }`}
                            >
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${step >= s.id ? 'bg-white text-primary' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                    {s.id}
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest hidden sm:block">{s.name}</span>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className="flex-1 px-4">
                                    <div className={`h-0.5 rounded-full transition-all duration-500 ${step > s.id ? 'bg-primary' : 'bg-gray-100'
                                        }`}></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center py-4">
                            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Pick Your Specialist</h2>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Available Doctors for immediate booking</p>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Experts...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {doctors.map(doc => (
                                    <div
                                        key={doc.id}
                                        onClick={() => { setSelectedDoctor(doc); setStep(2); }}
                                        className="glass-card p-6 rounded-2xl cursor-pointer transition-all duration-300 border border-white/40 shadow-lg hover:shadow-xl hover:-translate-y-1 relative group overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-6 -mt-6 group-hover:bg-primary/10 transition-colors"></div>
                                        <div className="flex flex-col items-center text-center relative z-10">
                                            <div className="w-16 h-16 bg-secondary rounded-full border-4 border-white shadow-md flex items-center justify-center text-primary text-xl font-black italic mb-4 overflow-hidden relative">
                                                {doc.image_url ? (
                                                    <>
                                                        <img
                                                            src={`${import.meta.env.VITE_API_ROOT || 'http://localhost:5000'}/${doc.image_url}`}
                                                            alt={doc.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                const fallback = e.target.parentElement.querySelector('.fallback-initial');
                                                                if (fallback) fallback.style.display = 'flex';
                                                            }}
                                                        />
                                                        <div className="fallback-initial hidden absolute inset-0 w-full h-full items-center justify-center">
                                                            {doc.name.charAt(0)}
                                                        </div>
                                                    </>
                                                ) : (
                                                    doc.name.charAt(0)
                                                )}
                                            </div>
                                            <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{doc.name}</h3>
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full mb-4">
                                                {doc.department_name || doc.specialization}
                                            </p>
                                            <div className="w-full flex items-center justify-between pt-4 border-t border-white/20 mt-2">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                                    <Star size={14} className="text-yellow-400 fill-yellow-400" /> 4.9
                                                </div>
                                                <div className="text-sm font-black text-gray-800">₹{doc.consultation_fee || 500}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-xl mx-auto"
                    >
                        <div className="glass-card p-8 rounded-3xl border border-white/40 shadow-xl">
                            <div className="flex items-center gap-4 mb-8">
                                <button onClick={() => setStep(1)} className="p-2 hover:bg-white/50 rounded-xl transition-all text-gray-400 hover:text-primary">
                                    <ArrowLeft size={20} />
                                </button>
                                <div>
                                    <h2 className="text-xl font-black text-gray-800 tracking-tight">Choose Your Time</h2>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-0.5">Booking with {selectedDoctor?.name}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">1. Select Date</label>
                                    <input
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={selectedDate}
                                        onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(''); }}
                                        className="w-full bg-white/50 border border-white/30 rounded-xl p-4 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-700 shadow-inner"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">2. Available Slots</label>
                                    {!selectedDate ? (
                                        <div className="p-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-center">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Please select a date first</p>
                                        </div>
                                    ) : loadingSlots ? (
                                        <div className="flex flex-col items-center py-8">
                                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    ) : availableSlots.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {availableSlots.map(slot => {
                                                const isPast = isPastSlot(slot.time, selectedDate);
                                                const isAvailable = slot.available && !isPast;

                                                return (
                                                    <button
                                                        key={slot.time}
                                                        disabled={!isAvailable}
                                                        onClick={() => setSelectedTime(slot.time)}
                                                        className={`py-3 rounded-xl text-xs font-bold transition-all ${!isAvailable
                                                            ? 'bg-gray-50 text-gray-300 cursor-not-allowed opacity-50'
                                                            : selectedTime === slot.time
                                                                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105 border-transparent'
                                                                : 'bg-white/50 text-gray-500 hover:bg-white border border-white/40'
                                                            }`}
                                                    >
                                                        {slot.time}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="p-8 bg-orange-50/30 rounded-2xl border border-orange-100 flex items-center gap-3 text-orange-400">
                                            <AlertCircle size={20} />
                                            <p className="text-xs font-bold uppercase tracking-widest">No slots available for this date</p>
                                        </div>
                                    )}
                                </div>

                                <button
                                    disabled={!selectedDate || !selectedTime}
                                    onClick={() => setStep(3)}
                                    className="w-full btn-premium py-4 rounded-2xl flex items-center justify-center gap-2 group disabled:opacity-50 mt-8 shadow-xl"
                                >
                                    <span>Review Summary</span>
                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="max-w-xl mx-auto"
                    >
                        <div className="glass-card p-8 rounded-3xl border border-white/40 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -mr-8 -mt-8"></div>

                            <div className="flex items-center gap-4 mb-8">
                                <button onClick={() => setStep(2)} className="p-2 hover:bg-white/50 rounded-xl transition-all text-gray-400 hover:text-primary">
                                    <ArrowLeft size={20} />
                                </button>
                                <h2 className="text-xl font-black text-gray-800 tracking-tight">Confirm Booking</h2>
                            </div>

                            <div className="space-y-4 mb-10">
                                <div className="p-4 bg-white/50 rounded-2xl border border-white/40 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary overflow-hidden relative">
                                            {selectedDoctor?.image_url ? (
                                                <>
                                                    <img
                                                        src={`${import.meta.env.VITE_API_ROOT || 'http://localhost:5000'}/${selectedDoctor.image_url}`}
                                                        alt={selectedDoctor.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            const fallback = e.target.parentElement.querySelector('.fallback-icon');
                                                            if (fallback) fallback.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div className="fallback-icon hidden absolute inset-0 w-full h-full items-center justify-center">
                                                        <User size={32} />
                                                    </div>
                                                </>
                                            ) : (
                                                <User size={32} />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Expert</p>
                                            <p className="text-sm font-bold text-gray-700">{selectedDoctor?.name}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-white/50 rounded-2xl border border-white/40 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Schedule</p>
                                            <p className="text-sm font-bold text-gray-700">
                                                {new Date(selectedDate).toLocaleDateString('en-US', { dateStyle: 'medium' })}, {selectedTime}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-dashed border-gray-200 space-y-3">
                                    <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                        <span>Consultation Fee</span>
                                        <span>₹{selectedDoctor?.consultation_fee || 500}.00</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                                        <span>GST (18%)</span>
                                        <span>₹{(selectedDoctor?.consultation_fee || 500) * 0.18}.00</span>
                                    </div>
                                    <div className="p-4 bg-primary rounded-2xl flex justify-between items-center shadow-lg shadow-primary/20 mt-4">
                                        <span className="text-sm font-bold text-white/80">Total Payable Now</span>
                                        <span className="text-xl font-black text-white">
                                            ₹{Math.round((selectedDoctor?.consultation_fee || 500) * 1.18)}.00
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleBooking}
                                disabled={processing}
                                className="w-full bg-accent text-white py-5 rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 transition-all font-black text-lg shadow-xl shadow-orange-500/20"
                            >
                                {processing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                        <span>INITIATING...</span>
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={22} />
                                        <span>PAY & CONFIRM</span>
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[10px] text-gray-400 font-black uppercase tracking-widest mt-6">
                                Secure Checkout Powered by Razorpay
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default BookAppointment;
