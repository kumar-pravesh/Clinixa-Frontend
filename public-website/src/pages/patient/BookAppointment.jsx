import { useState, useEffect, useCallback } from 'react';
import { patientService } from '../../services/patientService';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar as CalendarIcon, Clock, ChevronRight, User, Star, Activity, PlusCircle, CheckCircle } from 'lucide-react';

// Helper to load Razorpay SDK
const loadScript = (src) => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.id = 'razorpay-sdk';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const MotionDiv = motion.div;

const BookAppointment = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [formData, setFormData] = useState({ date: '', timeSlot: '' });
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { resumePayment, initData, appointmentId, doctorId: initialDoctorId } = location.state || {};

    const processPayment = useCallback(async (apptId, preInitData = null) => {
        setProcessing(true);
        console.log('Initiating payment process for apptId:', apptId);
        try {
            const currentInitData = preInitData || await patientService.initiatePayment(apptId);
            console.log('Payment Init Data:', currentInitData);

            if (!currentInitData || !currentInitData.payload) {
                throw new Error('Invalid payment initialization data received from server');
            }

            const activePaymentId = currentInitData.paymentId;

            if (currentInitData.provider === 'razorpay') {
                const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
                if (!res) {
                    alert('Razorpay SDK failed to load. Are you online?');
                    setProcessing(false);
                    return;
                }

                const options = {
                    key: currentInitData.payload.key,
                    amount: currentInitData.payload.amount,
                    currency: currentInitData.payload.currency,
                    name: "Clinixa Hospital",
                    description: "Appointment Payment",
                    order_id: currentInitData.payload.order_id,
                    prefill: {
                        name: "Tejas",
                        email: "patient@clinixa.com",
                        contact: "9999999999"
                    },
                    theme: {
                        color: "#0f172a"
                    },
                    handler: async function (response) {
                        try {
                            const confirmData = await patientService.confirmPayment(activePaymentId, response);
                            if (confirmData.status === 'SUCCESS') {
                                navigate('/patient/appointments');
                            } else {
                                alert('Payment Failed!');
                            }
                        } catch (error) {
                            alert('Payment Verification Failed: ' + error.message);
                        } finally {
                            setProcessing(false);
                        }
                    },
                    modal: {
                        ondismiss: function () {
                            setProcessing(false);
                            console.log('Payment modal closed by user');
                        }
                    }
                };

                const paymentObject = new window.Razorpay(options);

                paymentObject.on('payment.failed', function (response) {
                    console.error('Payment Failed:', response.error);
                    alert('Payment Failed: ' + response.error.description);
                    setProcessing(false);
                });

                try {
                    paymentObject.open();
                } catch (openErr) {
                    console.error('Error opening Razorpay checkout:', openErr);
                    setProcessing(false);
                    alert('Error opening checkout: ' + openErr.message);
                }

            } else {
                await new Promise(resolve => setTimeout(resolve, 1500));
                const confirmData = await patientService.confirmPayment(activePaymentId, { status: 'SUCCESS' });

                if (confirmData.status === 'SUCCESS') {
                    navigate('/patient/appointments');
                } else {
                    alert('Payment Failed!');
                }
                setProcessing(false);
            }

        } catch (err) {
            alert('Payment Error: ' + err.message);
            setProcessing(false);
        }
    }, [navigate]);

    useEffect(() => {
        patientService.getDoctors()
            .then(data => {
                setDoctors(data);
                if (initialDoctorId) {
                    const doc = data.find(d => d.id === initialDoctorId || d.id === `DOC-${String(initialDoctorId).padStart(4, '0')}`);
                    if (doc) setSelectedDoctor(doc);
                }
            })
            .finally(() => setLoading(false));

        // Handle Payment Resumption from Review Page
        if (resumePayment && initData) {
            processPayment(appointmentId, initData);
        }
    }, [initialDoctorId, resumePayment, initData, appointmentId, processPayment]);

    useEffect(() => {
        if (selectedDoctor && formData.date) {
            setLoadingSlots(true);
            patientService.getAvailability(selectedDoctor.id, formData.date)
                .then(data => setAvailableSlots(data))
                .catch(err => console.error('Error fetching slots:', err))
                .finally(() => setLoadingSlots(false));
        }
    }, [selectedDoctor, formData.date]);

    const handleBook = async (e) => {
        e.preventDefault();
        // Transition to Review Step
        navigate('/patient/appointment-review', {
            state: {
                doctorId: selectedDoctor.id,
                doctorName: selectedDoctor.name,
                fee: selectedDoctor.consultation_fee,
                date: formData.date,
                timeSlot: formData.timeSlot
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Page Header */}
            <div className="bg-primary text-white py-12 mb-8">
                <div className="container mx-auto px-6">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <CalendarIcon size={32} />
                        Book Your Appointment
                    </h1>
                    <p className="text-teal-100 mt-2">Select your preferred doctor and time slot for a seamless consultation.</p>
                </div>
            </div>

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Step 1: Doctor Selection - HIDE IF PRE-SELECTED */}
                    {!initialDoctorId && (
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <User className="text-primary" size={20} />
                                    1. Select Specialist
                                </h2>

                                {loading ? (
                                    <div className="flex flex-col items-center py-12 space-y-4">
                                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-gray-400 font-medium">Fetching doctors...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                        {doctors.map(doc => (
                                            <MotionDiv
                                                key={doc.id}
                                                whileHover={{ x: 5 }}
                                                onClick={() => setSelectedDoctor(doc)}
                                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selectedDoctor?.id === doc.id
                                                    ? 'border-primary bg-primary/5 shadow-md ring-4 ring-primary/5'
                                                    : 'border-gray-50 hover:border-primary/30 bg-white hover:shadow-md'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                                                        <img
                                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.name}`}
                                                            alt={doc.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="font-bold text-gray-900 leading-tight">{doc.name}</div>
                                                        <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">{doc.department_name || doc.specialization}</div>
                                                    </div>
                                                    {selectedDoctor?.id === doc.id && <CheckCircle size={20} className="text-primary" />}
                                                </div>
                                            </MotionDiv>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Date and Time Selection */}
                    <div className={initialDoctorId ? "lg:col-span-3 max-w-3xl mx-auto w-full" : "lg:col-span-2"}>
                        <AnimatePresence mode="wait">
                            {selectedDoctor ? (
                                <MotionDiv
                                    key="form"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-full"
                                >
                                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-50">
                                        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                                            <Clock className="text-primary" size={20} />
                                            {initialDoctorId ? 'Consultation Slot' : '2. Choose Date & Time'}
                                        </h2>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Consulting Fee</p>
                                            <p className="text-primary font-black text-2xl">₹{selectedDoctor.consultation_fee}</p>
                                        </div>
                                    </div>

                                    {/* Selected Doctor Summary for Direct Booking */}
                                    {initialDoctorId && (
                                        <div className="mb-8 p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedDoctor.name}`}
                                                    alt={selectedDoctor.name}
                                                    className="w-full h-full object-cover bg-white"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1">Booking With</p>
                                                <h3 className="text-xl font-bold text-gray-900">{selectedDoctor.name}</h3>
                                                <p className="text-sm text-gray-500">{selectedDoctor.department_name || selectedDoctor.specialization}</p>
                                            </div>
                                            <button
                                                onClick={() => navigate('/patient/book-appointment', { state: {} })}
                                                className="ml-auto text-xs font-bold text-primary hover:underline"
                                            >
                                                Change Doctor
                                            </button>
                                        </div>
                                    )}

                                    <form onSubmit={handleBook} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Select Date</label>
                                                <div className="relative">
                                                    <input
                                                        type="date"
                                                        required
                                                        min={new Date().toISOString().split('T')[0]}
                                                        className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50/50 px-5 py-4 font-bold text-gray-700 outline-none focus:border-primary/50 focus:bg-white transition-all appearance-none"
                                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                                    />
                                                    <CalendarIcon className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={20} />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Available Slots</label>
                                                <div className="relative">
                                                    <select
                                                        required
                                                        disabled={loadingSlots || !formData.date}
                                                        className="w-full rounded-2xl border-2 border-gray-50 bg-gray-50/50 px-5 py-4 font-bold text-gray-700 outline-none focus:border-primary/50 focus:bg-white transition-all appearance-none disabled:opacity-50"
                                                        value={formData.timeSlot}
                                                        onChange={e => setFormData({ ...formData, timeSlot: e.target.value })}
                                                    >
                                                        <option value="">{loadingSlots ? 'Loading slots...' : 'Select a time slot'}</option>
                                                        {availableSlots.map(slot => (
                                                            <option
                                                                key={slot.time}
                                                                value={slot.time}
                                                                disabled={!slot.available}
                                                            >
                                                                {slot.time} {!slot.available ? '(Booked)' : ''}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <Clock className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={20} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-gray-50">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full bg-accent text-white font-black text-lg py-5 rounded-2xl hover:bg-orange-600 shadow-lg shadow-orange-500/20 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                                            >
                                                {processing ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        Continue to Review <ChevronRight size={24} />
                                                    </>
                                                )}
                                            </button>
                                            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6">
                                                Verified Specialists • Secure Payments • Instant Confirmation
                                            </p>
                                        </div>
                                    </form>
                                </MotionDiv>
                            ) : (
                                <MotionDiv
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-white rounded-3xl border-2 border-dashed border-gray-200 h-full flex flex-col items-center justify-center p-12 text-center"
                                >
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                                        <User size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-400">Select a Doctor to Continue</h3>
                                    <p className="text-sm text-gray-300 mt-2 max-w-xs">Please pick a specialist from the list on the left to see their available slots.</p>
                                </MotionDiv>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
