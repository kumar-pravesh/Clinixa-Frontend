import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, CreditCard, ChevronRight, ChevronLeft, CheckCircle, ShieldCheck, Activity } from 'lucide-react';

const MotionDiv = motion.div;

const AppointmentReview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { doctorId, date, timeSlot, doctorName, fee, image_url } = location.state || {};

    const [processing, setProcessing] = useState(false);
    const [agreed, setAgreed] = useState(false);

    useEffect(() => {
        if (!doctorId || !date || !timeSlot) {
            navigate('/patient/book-appointment');
        }
    }, [doctorId, date, timeSlot, navigate]);

    const handleConfirmBooking = async () => {
        if (!agreed) {
            alert('Please agree to the terms and conditions');
            return;
        }

        setProcessing(true);
        try {
            // 1. Create Appointment (Status will be PENDING)
            const appointment = await patientService.bookAppointment({
                doctorId,
                date,
                timeSlot
            });

            // 2. Initiate Payment
            const initData = await patientService.initiatePayment(appointment.id);

            // Redirect to a specific payment processing helper or handle it here
            // For now, using the existing flow in BookAppointment logic as reference
            // But ideally this should be a cleaner transition.

            navigate('/patient/book-appointment', {
                state: {
                    resumePayment: true,
                    appointmentId: appointment.id,
                    initData,
                    doctorId,
                    doctorName,
                    fee
                }
            });

        } catch (error) {
            alert('Booking failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setProcessing(false);
        }
    };

    if (!doctorId) return null;

    const numericFee = Number(fee) || 0;
    const taxAmount = numericFee * 0.18; // 18% GST estimate
    const totalAmount = numericFee + taxAmount;

    // Format date safely
    const formattedDate = date ? new Date(date) : null;
    const dateString = (formattedDate && !isNaN(formattedDate))
        ? formattedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        : 'Invalid Date';

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-primary text-white py-12 mb-8">
                <div className="container mx-auto px-6">
                    <h1 className="text-3xl font-bold mb-2">Review Your Appointment</h1>
                    <p className="text-teal-100 italic">One last step before we confirm your visit.</p>
                </div>
            </div>

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Review Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Doctor & Schedule Summary */}
                        <MotionDiv
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                        >
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Activity className="text-primary" size={24} />
                                Consultation Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary overflow-hidden">
                                        {image_url ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_ROOT || 'http://localhost:5000'}/${image_url}`}
                                                alt={doctorName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User size={32} />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-black tracking-widest mb-1">Doctor</p>
                                        <p className="text-lg font-bold text-gray-900">{doctorName}</p>
                                        <p className="text-sm text-gray-500">Video/In-Person Consultation</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-primary">
                                        <Calendar size={32} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-black tracking-widest mb-1">Date & Time</p>
                                        <p className="text-lg font-bold text-gray-900">{dateString}</p>
                                        <p className="text-sm font-bold text-accent">{timeSlot}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate(-1)}
                                className="mt-8 text-primary font-bold text-sm flex items-center gap-1 hover:underline"
                            >
                                <ChevronLeft size={16} /> Edit Details
                            </button>
                        </MotionDiv>

                        {/* Terms & Conditions */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-4">Terms & Policies</h2>
                            <div className="text-sm text-gray-500 space-y-2 mb-6 h-32 overflow-y-auto p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p>1. Please arrive 15 minutes before your scheduled appointment time.</p>
                                <p>2. Cancellation within 2 hours of the appointment will incur a 50% fee.</p>
                                <p>3. Rescheduling is allowed up to 1 hour before the slot.</p>
                                <p>4. Secure payment is handled via Razorpay/Stripe.</p>
                                <p>5. Your medical data is protected under HIPAA-compliant protocols.</p>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                                    I agree to the terms and conditions and privacy policy.
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Summary & Payment Card */}
                    <div className="space-y-6">
                        <MotionDiv
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 sticky top-8"
                        >
                            <h2 className="text-xl font-bold mb-6">Price Details</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Consultation Fee</span>
                                    <span className="font-bold">₹{numericFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600 text-sm">
                                    <span>GST (18%)</span>
                                    <span>₹{taxAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600 text-sm">
                                    <span>Service Fee</span>
                                    <span className="text-green-600 font-bold">FREE</span>
                                </div>
                                <div className="pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total Payable</span>
                                    <span className="text-2xl font-black text-primary">₹{totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleConfirmBooking}
                                disabled={processing || !agreed}
                                className="w-full bg-accent text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-orange-500/30 hover:bg-orange-600 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Proceed to Pay <ChevronRight size={20} />
                                    </>
                                )}
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-4 border-t border-gray-50 pt-6">
                                <ShieldCheck size={20} className="text-green-500" />
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Secure 256-bit SSL encrypted payment</span>
                            </div>
                        </MotionDiv>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentReview;
