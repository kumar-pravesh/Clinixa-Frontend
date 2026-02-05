import { useState } from 'react';
import { FiCalendar, FiClock, FiUser, FiActivity, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const AppointmentBooking = () => {
    const [step, setStep] = useState(1);
    const [bookingData, setBookingData] = useState({
        doctor: '',
        date: '',
        slot: '',
        reason: ''
    });

    const doctors = [
        { name: 'Dr. Chandan Shashank', specialty: 'Cardiologist', available: '10:00 AM - 04:00 PM' },
        { name: 'Dr. Rajesh Kumar', specialty: 'Cardiologist', available: '10:00 AM - 04:00 PM' },
        { name: 'Dr. Anita Sharma', specialty: 'Pediatrician', available: '09:00 AM - 02:00 PM' },
        { name: 'Dr. Sameer Khan', specialty: 'Neurologist', available: '11:00 AM - 06:00 PM' },
    ];

    const slots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    return (
        <div className="card p-0 overflow-hidden bg-white shadow-xl max-w-4xl mx-auto">
            <div className="bg-gradient-primary p-8 text-white">
                <h2 className="text-2xl font-bold">Book an Appointment</h2>
                <p className="text-white/80 font-medium">Follow the steps to schedule your visit with our specialists.</p>

                {/* Stepper */}
                <div className="flex items-center mt-8 space-x-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= s ? 'bg-white text-primary-600' : 'bg-primary-400 text-white border border-primary-300'
                                }`}>
                                {s}
                            </div>
                            {s < 3 && <div className={`w-12 h-0.5 mx-2 ${step > s ? 'bg-white' : 'bg-primary-400'}`}></div>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-8">
                {step === 1 && (
                    <div className="animate-fade-in space-y-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                            <FiUser className="text-primary-500" />
                            <span>Select Specialist</span>
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {doctors.map((doc) => (
                                <button
                                    key={doc.name}
                                    onClick={() => setBookingData({ ...bookingData, doctor: doc.name })}
                                    className={`p-4 rounded-2xl border-2 text-left transition-all ${bookingData.doctor === doc.name
                                        ? 'border-primary-500 bg-primary-50 ring-4 ring-primary-50'
                                        : 'border-gray-100 hover:border-primary-200'

                                            ? 'border-primary-500 bg-primary-50 ring-4 ring-primary-50'
                                            : 'border-gray-100 hover:border-primary-200'
                                        }`}
                                >
                                    <p className="font-bold text-gray-900">{doc.name}</p>
                                    <p className="text-sm font-semibold text-gray-500">{doc.specialty} • {doc.available}</p>
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={!bookingData.doctor}
                            onClick={handleNext}
                            className="w-full btn-primary py-4 disabled:opacity-50 disabled:grayscale transition-all"
                        >
                            Next Step
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-fade-in space-y-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                            <FiCalendar className="text-primary-500" />
                            <span>Preferred Schedule</span>
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Select Date</label>
                                <input
                                    type="date"
                                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/10"
                                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Input Reason (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="Heart checkup..."
                                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/10"
                                    onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Available Slots</label>
                            <div className="grid grid-cols-4 gap-2">
                                {slots.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setBookingData({ ...bookingData, slot: s })}
                                        className={`py-2 text-xs font-bold rounded-lg border-2 transition-all ${bookingData.slot === s
                                            ? 'border-primary-500 bg-primary-50 text-primary-600'
                                            : 'border-gray-100 hover:border-gray-200 text-gray-600'

                                                ? 'border-primary-500 bg-primary-50 text-primary-600'
                                                : 'border-gray-100 hover:border-gray-200 text-gray-600'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <button onClick={handleBack} className="flex-1 py-4 font-bold text-gray-500 border-2 border-gray-100 rounded-2xl">Back</button>
                            <button
                                disabled={!bookingData.date || !bookingData.slot}
                                onClick={handleNext}
                                className="flex-[2] btn-primary py-4 disabled:opacity-50"
                            >
                                Review & Confirm
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-fade-in text-center py-8">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiCheckCircle className="w-12 h-12" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">Confirmed!</h3>
                        <p className="text-gray-500 font-medium mb-8">Your appointment with <span className="text-primary-600 font-bold">{bookingData.doctor}</span> is scheduled for <span className="text-gray-900 font-bold">{bookingData.date}</span> at <span className="text-gray-900 font-bold">{bookingData.slot}</span>.</p>

                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-left mb-8 max-w-sm mx-auto">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-4">Summary</p>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Service</span><span className="font-bold">Consultation</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Wait Time</span><span className="font-bold flex items-center"><FiClock className="mr-1" /> ~15 mins</span></div>
                                <div className="pt-3 border-t flex justify-between font-bold text-gray-900"><span>Consultation Fee</span><span>$50.00</span></div>
                            </div>
                        </div>

                        <button onClick={() => setStep(1)} className="btn-primary px-10 py-4 shadow-xl">Back to Dashboard</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentBooking;
