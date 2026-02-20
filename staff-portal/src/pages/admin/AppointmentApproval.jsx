import React, { useState } from 'react';
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
import api from '../../api/axios';

const AppointmentApproval = () => {
    const { addNotification } = useNotification();
    const [activeTab, setActiveTab] = useState('Pending');
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/admin/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            addNotification({
                type: 'error',
                title: 'Data Fetch Error',
                message: 'Failed to retrieve live appointment records.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchAppointments();
    }, []);

    const handleStatusUpdate = async (id, newStatus, patientName) => {
        try {
            if (newStatus === 'Approved' || newStatus === 'Scheduled') {
                await api.put(`/admin/appointments/${id}/approve`);
            } else if (newStatus === 'Cancelled') {
                await api.put(`/admin/appointments/${id}/reject`);
            } else {
                await api.put(`/admin/appointments/${id}/status`, { status: newStatus });
            }

            addNotification({
                type: (newStatus === 'Approved' || newStatus === 'Scheduled') ? 'success' : 'info',
                title: `Status Updated`,
                message: `Consultation for ${patientName} is now ${newStatus.toLowerCase()}.`
            });

            fetchAppointments(); // Re-fetch to get consistent status from DB
        } catch (error) {
            console.error('Error updating appointment:', error);
            addNotification({
                type: 'error',
                title: 'Action Failed',
                message: `Failed to update status for ${patientName}.`
            });
        }
    };

    const getStatusStyle = (status) => {
        const s = status?.toUpperCase();
        switch (s) {
            case 'PENDING':
            case 'CREATED': return "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/10";
            case 'APPROVED':
            case 'SCHEDULED':
            case 'CONFIRMED': return "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/10";
            case 'RESCHEDULED': return "bg-blue-50 text-blue-600 border-blue-100 shadow-blue-100/10";
            case 'CANCELLED': return "bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100/10";
            default: return "bg-slate-50 text-slate-500 border-slate-100";
        }
    };

    const filteredAppointments = appointments.filter(app => {
        const status = app.status?.toUpperCase();
        if (activeTab === 'Schedules') return true;
        if (activeTab === 'Pending') return status === 'PENDING' || status === 'CREATED';
        if (activeTab === 'Approved') return status === 'APPROVED' || status === 'CONFIRMED' || status === 'SCHEDULED';
        return status === activeTab.toUpperCase();
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
                    {['Pending', 'Approved', 'Rescheduled', 'Cancelled', 'Schedules'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                activeTab === tab ? "bg-white text-primary shadow-lg shadow-primary/5" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filteredAppointments.length > 0 ? filteredAppointments.map((app) => (
                    <div key={app.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 hover:shadow-xl hover:shadow-slate-200/30 transition-all group relative overflow-hidden">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors flex-shrink-0">
                                    <User className="w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-black text-slate-800 tracking-tight">{app.patient}</h3>
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                            getStatusStyle(app.status)
                                        )}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            <Stethoscope className="w-3.5 h-3.5" /> {app.doctor} • {app.dept}
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
                                {(app.status === 'Pending' || app.status === 'CREATED') && (
                                    <>
                                        <button
                                            onClick={() => handleStatusUpdate(app.id, 'Rescheduled', app.patient)}
                                            className="flex-1 lg:flex-initial h-14 px-8 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100 hover:bg-slate-100 transition-all"
                                        >
                                            Reschedule
                                        </button>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleStatusUpdate(app.id, 'Cancelled', app.patient)}
                                                className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-100/20"
                                            >
                                                <XCircle className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(app.id, 'Scheduled', app.patient)}
                                                className="h-14 px-8 bg-emerald-500 text-white rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                            >
                                                <CheckCircle2 className="w-6 h-6" />
                                                <span className="font-black uppercase tracking-widest text-xs">Approve</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                                {(app.status === 'Approved' || app.status === 'Confirmed' || app.status === 'Scheduled') && (
                                    <button
                                        onClick={() => handleStatusUpdate(app.id, 'Cancelled', app.patient)}
                                        className="h-14 px-8 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100 hover:text-rose-500 transition-all"
                                    >
                                        Cancel Appointment
                                    </button>
                                )}
                                {(app.status === 'Cancelled' || app.status === 'Rescheduled') && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleStatusUpdate(app.id, 'Pending', app.patient)}
                                            className="h-14 px-8 bg-primary/5 text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest border border-primary/10 hover:bg-primary hover:text-white transition-all whitespace-nowrap"
                                        >
                                            Restore to Pending
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(app.id, 'Approved', app.patient)}
                                            className="h-14 px-8 bg-emerald-500 text-white rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                        >
                                            <CheckCircle2 className="w-6 h-6" />
                                            <span className="font-black uppercase tracking-widest text-xs">Approve</span>
                                        </button>
                                    </div>
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
        </div>
    );
};

export default AppointmentApproval;
