import { useState } from 'react';
import { FiX, FiUser, FiCalendar, FiClock, FiPhone, FiCheck } from 'react-icons/fi';

const BookingModal = ({ isOpen, onClose, doctorData }) => {
    const [selectedDate, setSelectedDate] = useState(0);
    const [selectedTime, setSelectedTime] = useState(null);

    if (!isOpen) return null;

    // Generate next 7 days
    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
            fullDate: date.toLocaleDateString(),
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            date: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' })
        };
    });

    const timeSlots = {
        morning: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
        afternoon: ['01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM']
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden animate-scale-in flex flex-col">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-[110]"
                >
                    <FiX className="w-5 h-5 text-gray-500" />
                </button>

                <div className="p-8 pb-0 overflow-y-auto custom-scrollbar flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirm your appointment</h2>

                    <div className="space-y-6 pb-8">
                        {/* Consultation Info */}
                        <div className="flex items-center space-x-4 p-4 bg-primary-50 rounded-2xl border border-primary-100">
                            <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white">
                                <FiUser className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-primary-600 font-bold uppercase tracking-wider">Video Consultation with</p>
                                <p className="text-xl font-black text-gray-900">{doctorData?.name || 'Dr. Rajesh Kumar'}</p>
                            </div>
                        </div>

                        {/* Interactive Selectors */}
                        <div className="space-y-4">
                            {/* Date Selector */}
                            <div>
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <div className="flex items-center space-x-2 text-gray-900 font-bold">
                                        <FiCalendar className="w-5 h-5 text-primary-600" />
                                        <span>Select Date</span>
                                    </div>
                                    <span className="text-sm font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                                        {dates[selectedDate].month} {dates[selectedDate].date}
                                    </span>
                                </div>
                                <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {dates.map((d, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedDate(i)}
                                            className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center transition-all border-2 ${selectedDate === i
                                                ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/30'
                                                : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-primary-200'
                                                }`}
                                        >
                                            <span className="text-[10px] uppercase font-bold opacity-80">{d.day}</span>
                                            <span className="text-xl font-black leading-none my-1">{d.date}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Selector */}
                            <div>
                                <div className="flex items-center justify-between mb-3 px-1">
                                    <div className="flex items-center space-x-2 text-gray-900 font-bold">
                                        <FiClock className="w-5 h-5 text-primary-600" />
                                        <span>Available Slots</span>
                                    </div>
                                    {selectedTime && (
                                        <span className="text-sm font-bold text-accent-600 bg-accent-50 px-3 py-1 rounded-full border border-accent-100 animate-fade-in">
                                            {selectedTime}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="space-y-2">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Morning</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {timeSlots.morning.map((slot) => (
                                                <button
                                                    key={slot}
                                                    onClick={() => setSelectedTime(slot)}
                                                    className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${selectedTime === slot
                                                        ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-500/20'
                                                        : 'bg-white border-gray-100 text-gray-700 hover:border-primary-100'
                                                        }`}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Afternoon</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {timeSlots.afternoon.map((slot) => (
                                                <button
                                                    key={slot}
                                                    onClick={() => setSelectedTime(slot)}
                                                    className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${selectedTime === slot
                                                        ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-500/20'
                                                        : 'bg-white border-gray-100 text-gray-700 hover:border-primary-100'
                                                        }`}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notice */}
                        <p className="text-sm text-gray-500 leading-relaxed italic">
                            Please enter the registered mobile number (Indian Users) or email address (International Users) for the specific patient.
                        </p>

                        {/* Input Section */}
                        <div className="flex space-x-4">
                            <div className="w-32">
                                <select className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500 font-medium text-gray-700">
                                    <option>India (+91)</option>
                                    <option>USA (+1)</option>
                                    <option>UK (+44)</option>
                                </select>
                            </div>
                            <div className="flex-1 relative">
                                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="tel"
                                    placeholder="Enter Mobile Number"
                                    className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500 font-medium"
                                />
                            </div>
                        </div>

                        {/* Pricing Details */}
                        <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Consultation Fee</span>
                                <span className="text-gray-900 font-bold">₹500.00</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">GST (0%)</span>
                                <span className="text-gray-900 font-bold">₹0.00</span>
                            </div>
                            <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-gray-900 font-bold uppercase tracking-wider text-xs">Total Amount</span>
                                <span className="text-xl font-black text-primary-600">₹500.00</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <button
                            disabled={!selectedTime}
                            className={`w-full py-4 rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center space-x-2 ${selectedTime
                                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-500/20 active:scale-[0.98]'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                }`}
                            onClick={() => {
                                alert(`Booking Confirmed for ${dates[selectedDate].fullDate} at ${selectedTime}!`);
                                onClose();
                            }}
                        >
                            {selectedTime && <FiCheck className="w-5 h-5" />}
                            <span>{selectedTime ? 'Confirm Booking' : 'Select a Time Slot'}</span>
                        </button>
                    </div>
                </div>

                {/* Footer Info (Optional, matching source) */}
                <div className="bg-gray-50 border-t border-gray-100 p-4 text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Secure Healthcare Powered by Clinixa</p>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
