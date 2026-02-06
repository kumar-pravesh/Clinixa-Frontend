import { useState, useEffect } from 'react';
import { patientService } from '../../services/patientService';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [formData, setFormData] = useState({ date: '', timeSlot: '' });
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        patientService.getDoctors()
            .then(data => setDoctors(data))
            .finally(() => setLoading(false));
    }, []);

    const handleBook = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            // 1. Create Appointment
            const appointment = await patientService.bookAppointment({
                doctorId: selectedDoctor.id,
                ...formData
            });

            // 2. Initiate Payment (Mock)
            // In a real app, this would open Razorpay/Stripe
            if (window.confirm(`Proceed to pay ₹${selectedDoctor.fees} for appointment?`)) {
                await processPayment(appointment.id);
            } else {
                alert('Payment cancelled. Appointment status: PENDING PAYMENT');
                navigate('/patient/appointments');
            }

        } catch (error) {
            alert('Booking failed: ' + (error.response?.data?.message || error.message));
            setProcessing(false);
        }
    };

    const processPayment = async (appointmentId) => {
        try {
            const initData = await patientService.initiatePayment(appointmentId);

            // SIMULATE PAYMENT GATEWAY INTERACTION
            // Here we just immediately confirm success for strict "Mock provider" requirement
            // In real integration, Razorpay would return a success callback

            const confirmData = await patientService.confirmPayment(initData.paymentId, 'SUCCESS');

            if (confirmData.status === 'SUCCESS') {
                alert('Appointment Confirmed!');
                navigate('/patient/appointments');
            } else {
                alert('Payment Failed!');
            }
        } catch (err) {
            alert('Payment Error: ' + err.message);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Book Appointment</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Doctor Selection */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Select Doctor</h2>
                    {loading ? <p>Loading doctors...</p> : (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {doctors.map(doc => (
                                <div
                                    key={doc.id}
                                    onClick={() => setSelectedDoctor(doc)}
                                    className={`p-4 border rounded cursor-pointer transition ${selectedDoctor?.id === doc.id
                                            ? 'border-primary bg-primary/10'
                                            : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="font-bold">{doc.name}</div>
                                    <div className="text-sm text-gray-600">{doc.specialization}</div>
                                    <div className="text-accent text-sm font-semibold">₹{doc.fees}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Booking Form */}
                {selectedDoctor && (
                    <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                        <h2 className="text-lg font-semibold mb-4 text-primary">details for {selectedDoctor.name}</h2>
                        <form onSubmit={handleBook} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 px-3 py-2 border"
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Time Slot</label>
                                <select
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 px-3 py-2 border"
                                    onChange={e => setFormData({ ...formData, timeSlot: e.target.value })}
                                >
                                    <option value="">Select Slot</option>
                                    <option value="09:00 AM">09:00 AM</option>
                                    <option value="10:00 AM">10:00 AM</option>
                                    <option value="11:00 AM">11:00 AM</option>
                                    <option value="02:00 PM">02:00 PM</option>
                                    <option value="04:00 PM">04:00 PM</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-accent text-white font-bold py-3 rounded-md hover:bg-orange-600 disabled:opacity-50 transition"
                            >
                                {processing ? 'Processing...' : `Pay ₹${selectedDoctor.fees} & Book`}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookAppointment;
