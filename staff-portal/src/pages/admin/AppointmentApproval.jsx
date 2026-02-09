import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import {
    CalendarCheck,
    Calendar,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Clock,
    User,
    ArrowUpRight,
    Stethoscope,
    Phone,
    AlertCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNotification } from '../../context/NotificationContext';

import { adminService } from '../../services/adminService';

const AppointmentApproval = () => {
    const { addNotification } = useNotification();
    const [activeTab, setActiveTab] = useState('Scheduled');
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);
    const [assignmentModal, setAssignmentModal] = useState(null); // { appointmentId, dept, patientName }
    const [availableDoctors, setAvailableDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');

    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminService.getAppointments();
            setAppointments(data);
        } catch (err) {
            console.error('Error fetching appointments:', err);
            addNotification({
                type: 'error',
                title: 'Sync Error',
                message: 'Could not retrieve appointment list.'
            });
        } finally {
            setLoading(false);
        }
    }, [addNotification]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleStatusUpdate = async (id, newStatus, patientName, appointment) => {
        // Check if approving and no doctor assigned
        if (newStatus === 'Confirmed' && !appointment.doctor_id) {
            // Open assignment modal
            setAssignmentModal({
                appointmentId: id,
                dept: appointment.dept,
                patientName: patientName
            });
            // Fetch available doctors for this department
            try {
                const response = await api.get('/doctors');
                const deptDoctors = response.data.filter(d =>
                    d.dept === appointment.dept && d.status === 'Active'
                );
                setAvailableDoctors(deptDoctors);
            } catch (err) {
                console.error('Error fetching doctors:', err);
            }
            return;
        }

        try {
            await adminService.updateAppointmentStatus(id, newStatus);

            const type = newStatus === 'Confirmed' ? 'success' : newStatus === 'Rejected' ? 'info' : 'appointment';
            addNotification({
                type,
                title: `Appointment ${newStatus}`,
                message: `Consultation for ${patientName} has been ${newStatus.toLowerCase()}.`
            });
            fetchAppointments(); // Refresh list
        } catch (err) {
            addNotification({
                type: 'error',
                title: 'Action Failed',
                message: `Failed to update appointment status to ${newStatus}.`
            });
        }
    };

    const handleAssignAndApprove = async () => {
        if (!selectedDoctor) {
            addNotification({
                type: 'error',
                title: 'Selection Required',
                message: 'Please select a doctor before approving.'
            });
            return;
        }

        try {
            // Assign doctor first
            await adminService.assignDoctor(assignmentModal.appointmentId, selectedDoctor);
            // Then approve
            await adminService.updateAppointmentStatus(assignmentModal.appointmentId, 'Confirmed');

            addNotification({
                type: 'success',
                title: 'Appointment Confirmed',
                message: `Doctor assigned and appointment approved for ${assignmentModal.patientName}.`
            });

            setAssignmentModal(null);
            setSelectedDoctor('');
            fetchAppointments();
        } catch (err) {
            addNotification({
                type: 'error',
                title: 'Action Failed',
                message: 'Could not assign doctor and approve appointment.'
            });
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Scheduled': return "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/10";
            case 'Confirmed': return "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/10";
            case 'Rejected': return "bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100/10";
            default: return "bg-slate-50 text-slate-500 border-slate-100";
        }
    };

    const filteredAppointments = appointments.filter(app => {
        if (activeTab === 'All') return true;
        return app.status === activeTab;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <CalendarCheck className="w-8 h-8 text-primary" /> Appointment Control
                    </h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Review & Dispatch Clinical Schedules</p>
                </div>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner box-content">
                    {[['Scheduled', 'Pending'], ['Confirmed', 'Approved'], ['Rejected', 'Cancelled'], ['All', 'All']].map(([val, label]) => (
                        <button
                            key={val}
                            onClick={() => setActiveTab(val)}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                activeTab === val ? "bg-white text-primary shadow-lg shadow-primary/5" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-100">
                        <p className="text-slate-400 font-bold italic text-sm">Synchronizing clinical schedules...</p>
                    </div>
                ) : filteredAppointments.length > 0 ? filteredAppointments.map((app) => (
                    <div key={app.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 hover:shadow-xl hover:shadow-slate-200/30 transition-all group relative overflow-hidden">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors flex-shrink-0">
                                    <User className="w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-black text-slate-800 tracking-tight">{app.patient_name}</h3>
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                            getStatusStyle(app.status)
                                        )}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            <Stethoscope className="w-3.5 h-3.5" /> {app.doctor_name || <span className="text-amber-600">Requires Assignment</span>} • {app.dept}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            <Calendar className="w-3.5 h-3.5" /> {app.date}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            <Clock className="w-3.5 h-3.5" /> {app.time}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {app.status === 'Scheduled' && (
                                    <>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleStatusUpdate(app.id, 'Rejected', app.patient_name)}
                                                className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-100/20"
                                            >
                                                <XCircle className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(app.id, 'Confirmed', app.patient_name, app)}
                                                className="h-14 px-8 bg-emerald-500 text-white rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                            >
                                                <CheckCircle2 className="w-6 h-6" />
                                                <span className="font-black uppercase tracking-widest text-xs">Approve</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                                {(app.status === 'Confirmed' || app.status === 'Rejected') && (
                                    <button
                                        onClick={() => handleStatusUpdate(app.id, 'Scheduled', app.patient_name)}
                                        className="h-14 px-8 bg-primary/5 text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest border border-primary/10 hover:bg-primary hover:text-white transition-all"
                                    >
                                        Restore to Pending
                                    </button>
                                )}
                            </div>
                        </div>

                        {app.type === 'Emergency' && app.status === 'Pending' && (
                            <div className="mt-6 flex items-center gap-3 p-4 bg-orange-50/50 border border-orange-100 rounded-2xl box-content">
                                <AlertCircle className="w-5 h-5 text-orange-500" />
                                <p className="text-[10px] font-black text-orange-700 uppercase tracking-[0.1em]">High Priority Patient: Immediate review required for emergency clinical consultation.</p>
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-100 border-dashed">
                        <CalendarCheck className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold italic text-sm">No {activeTab.toLowerCase()} appointments found.</p>
                    </div>
                )}
            </div>

            {/* Doctor Assignment Modal */}
            {assignmentModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden relative">
                        <div className="p-12">
                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Assign Doctor</h2>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1">Select physician for {assignmentModal.patientName}</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Available Doctors ({assignmentModal.dept})</label>
                                    <select
                                        className="input-field h-14 bg-slate-50 border-slate-100 !pl-6 text-sm font-bold appearance-none w-full"
                                        value={selectedDoctor}
                                        onChange={(e) => setSelectedDoctor(e.target.value)}
                                    >
                                        <option value="">Select a doctor...</option>
                                        {availableDoctors.map(doc => (
                                            <option key={doc.id} value={doc.id}>{doc.name} - ₹{doc.consultation_fee}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setAssignmentModal(null);
                                            setSelectedDoctor('');
                                        }}
                                        className="flex-1 h-14 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAssignAndApprove}
                                        className="flex-1 h-14 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        Assign & Approve
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentApproval;
