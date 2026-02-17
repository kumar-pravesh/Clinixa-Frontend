import React, { useState } from 'react';
import { Calendar, Clock, User, ChevronRight, Plus, Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useDoctor } from '../../context/DoctorContext';

const FollowUps = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const { appointments, patients, addAppointment, updateAppointmentStatus } = useDoctor();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [newAppointment, setNewAppointment] = useState({
        patientId: '',
        time: '',
        type: 'Follow-up',
        reason: ''
    });

    // Filter for appointments on selected date
    const filteredAppointments = appointments.filter(apt => apt.date === selectedDate);

    const handleAddAppointment = async (e) => {
        e.preventDefault();
        // Use loose equality to handle string vs numeric IDs safely
        const patient = patients.find(p => String(p.id) === String(newAppointment.patientId));
        if (patient) {
            const result = await addAppointment({
                patient: patient.name,
                patientId: patient.id,
                date: selectedDate,
                time: newAppointment.time,
                type: newAppointment.type,
                reason: newAppointment.reason
            });

            if (result?.success) {
                setShowAddModal(false);
                setNewAppointment({ patientId: '', time: '', type: 'Follow-up', reason: '' });
                alert('Appointment scheduled successfully!');
            } else {
                alert(result?.message || 'Failed to schedule appointment. Please try again.');
            }
        } else {
            alert('Please select a valid patient.');
        }
    };

    const toggleStatus = (id, currentStatus) => {
        const statuses = ['Scheduled', 'Waiting', 'In Progress', 'Completed'];
        const nextIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
        updateAppointmentStatus(id, statuses[nextIndex]);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Follow-up Appointments</h1>
                    <p className="text-slate-500">Schedule and manage patient return visits.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center gap-2 px-4 py-2.5"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">New Appointment</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar / Date Picker (Simplified) */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm h-fit">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" /> Select Date
                    </h3>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 mb-4"
                    />
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-sm text-blue-800 font-bold mb-1">Doctor's Schedule</p>
                        <p className="text-xs text-blue-600">You have {filteredAppointments.length} appointments on this date.</p>
                    </div>
                </div>

                {/* Appointments List */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-slate-800 mb-2">Upcoming Visits</h3>
                    {filteredAppointments.length > 0 ? (
                        <div className="space-y-3">
                            {filteredAppointments.map((apt) => (
                                <div key={apt.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex gap-4">
                                            <div className="flex flex-col items-center justify-center w-14 h-14 bg-slate-100 rounded-xl text-slate-500 font-bold">
                                                <span className="text-xs uppercase">{new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                                <span className="text-xl text-slate-800">{new Date(apt.date).getDate()}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-lg">{apt.patient || apt.patient_name || 'N/A'}</h4>
                                                <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" /> {apt.time}
                                                    </span>
                                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                    <span>{apt.reason}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <button
                                                onClick={() => toggleStatus(apt.id, apt.status)}
                                                className={cn(
                                                    "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all hover:scale-105 active:scale-95 cursor-pointer",
                                                    apt.status === 'Scheduled' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                        apt.status === 'Waiting' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                            apt.status === 'In Progress' ? "bg-purple-50 text-purple-600 border-purple-100" :
                                                                "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                )}>
                                                {apt.status}
                                            </button>
                                            <button className="p-2 text-slate-300 hover:text-primary transition-colors">
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-[2rem] border border-slate-200 border-dashed">
                            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">No appointments found for this date.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Appointment Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-800">New Appointment</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddAppointment} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Patient</label>
                                <select
                                    required
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
                                    value={newAppointment.patientId}
                                    onChange={(e) => setNewAppointment({ ...newAppointment, patientId: e.target.value })}
                                >
                                    <option value="">Select Patient</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Time</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
                                        value={newAppointment.time}
                                        onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                                    <select
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
                                        value={newAppointment.type}
                                        onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })}
                                    >
                                        <option value="Follow-up">Follow-up</option>
                                        <option value="Check-up">Check-up</option>
                                        <option value="Consultation">Consultation</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Reason</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Routine Checkup"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
                                    value={newAppointment.reason}
                                    onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary px-6 py-2.5"
                                >
                                    Schedule
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FollowUps;
