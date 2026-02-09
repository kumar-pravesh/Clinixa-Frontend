import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import {
    CalendarCheck,
    Users,
    TrendingUp,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Stethoscope,
    Building2,
    CheckCircle2,
    Check,
    X
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNotification } from '../../context/NotificationContext';
import { adminService } from '../../services/adminService';

const DashboardStat = ({ title, value, icon: Icon, color, trend, detail }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-primary/20 transition-all group overflow-hidden relative">
        <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700", color)}></div>

        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={cn("p-4 rounded-2xl text-white shadow-lg", color)}>
                <Icon className="w-6 h-6" />
            </div>
            {trend && (
                <div className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                    trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>
                    {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>

        <div className="relative z-10">
            <h3 className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-1">{title}</h3>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 tracking-tighter">{value}</span>
                <span className="text-xs font-bold text-slate-400">{detail}</span>
            </div>
        </div>
    </div>
);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        dailyAppointments: 0,
        activePatients: 0,
        dailyRevenue: 0,
        pendingApprovals: 0
    });
    const [todaySchedule, setTodaySchedule] = useState([]);
    const [assignmentModal, setAssignmentModal] = useState(null);
    const [availableDoctors, setAvailableDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');

    // Fetch Dashboard Data
    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [statsData, scheduleData] = await Promise.all([
                adminService.getDashboardStats(),
                adminService.getTodaysAppointments()
            ]);
            setStats(statsData);
            setTodaySchedule(scheduleData);
        } catch (err) {
            console.error('Error loading dashboard data:', err);
            addNotification({
                type: 'error',
                title: 'Data Sync Error',
                message: 'Failed to fetch latest dashboard updates.'
            });
        } finally {
            setIsLoading(false);
        }
    }, [addNotification]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleApprove = async (id, patientName, appointment) => {
        // Check if doctor is assigned
        if (!appointment.doctor_id) {
            setAssignmentModal({
                appointmentId: id,
                dept: appointment.dept,
                patientName: patientName
            });
            // Fetch available doctors
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
            await adminService.updateAppointmentStatus(id, 'Confirmed');
            addNotification({
                type: 'success',
                title: 'Slot Confirmed',
                message: `Appointment for ${patientName} has been approved.`
            });
            fetchDashboardData(); // Refresh data
        } catch (err) {
            addNotification({
                type: 'error',
                title: 'Action Failed',
                message: 'Could not approve the appointment.'
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
            await adminService.assignDoctor(assignmentModal.appointmentId, selectedDoctor);
            await adminService.updateAppointmentStatus(assignmentModal.appointmentId, 'Confirmed');

            addNotification({
                type: 'success',
                title: 'Appointment Confirmed',
                message: `Doctor assigned and appointment approved for ${assignmentModal.patientName}.`
            });

            setAssignmentModal(null);
            setSelectedDoctor('');
            fetchDashboardData();
        } catch (err) {
            addNotification({
                type: 'error',
                title: 'Action Failed',
                message: 'Could not assign doctor and approve appointment.'
            });
        }
    };

    const handleReject = async (id, patientName) => {
        if (window.confirm(`Are you sure you want to reject ${patientName}'s appointment?`)) {
            try {
                await adminService.updateAppointmentStatus(id, 'Rejected');
                addNotification({
                    type: 'info',
                    title: 'Appointment Rejected',
                    message: `Slot for ${patientName} has been declined.`
                });
                fetchDashboardData(); // Refresh data
            } catch (err) {
                addNotification({
                    type: 'error',
                    title: 'Action Failed',
                    message: 'Could not reject the appointment.'
                });
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Overview</h1>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Real-time Hospital Command Center</p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardStat
                    title="Appointments Today"
                    value={stats.dailyAppointments}
                    icon={CalendarCheck}
                    color="bg-primary"
                    trend={12}
                    detail="Scheduled Slots"
                />
                <DashboardStat
                    title="Active Patients"
                    value={stats.activePatients}
                    icon={Users}
                    color="bg-blue-500"
                    trend={8}
                    detail="Hospital Directory"
                />
                <DashboardStat
                    title="Daily Revenue"
                    value={`₹${(stats.dailyRevenue / 1000).toFixed(1)}k`}
                    icon={TrendingUp}
                    color="bg-emerald-500"
                    trend={15}
                    detail="Clinical Billing"
                />
                <DashboardStat
                    title="Pending Actions"
                    value={stats.pendingApprovals}
                    icon={Clock}
                    color="bg-amber-500"
                    trend={-2}
                    detail="Requires Review"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pending Actions */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-lg font-black text-slate-800">Critical Alerts</h2>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Requires your immediate approval</p>
                            </div>
                            <button className="p-3 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all">
                                <Clock className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {isLoading ? (
                                <p className="text-slate-400 text-xs italic p-4 text-center">Loading pending slots...</p>
                            ) : todaySchedule.filter(apt => apt.status === 'Scheduled').length === 0 ? (
                                <p className="text-slate-400 text-xs italic p-4 text-center">No pending approvals today.</p>
                            ) : todaySchedule.filter(apt => apt.status === 'Scheduled').map((apt) => (
                                <div key={apt.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100/50 flex items-center justify-between group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                                            {apt.patient_name?.[0] || 'P'}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-800">{apt.patient_name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold">{apt.time} • {apt.dept}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleApprove(apt.id, apt.patient_name)}
                                            className="p-2 bg-emerald-500 text-white rounded-lg hover:scale-110 active:scale-95 transition-all shadow-lg shadow-emerald-100"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleReject(apt.id, apt.patient_name)}
                                            className="p-2 bg-rose-500 text-white rounded-lg hover:scale-110 active:scale-95 transition-all shadow-lg shadow-rose-100"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Today's Schedule */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Today's Schedule</h3>
                            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Full View</button>
                        </div>
                        <div className="space-y-4">
                            {isLoading ? (
                                <p className="text-slate-400 text-xs italic p-4 text-center">Loading schedule...</p>
                            ) : todaySchedule.length === 0 ? (
                                <p className="text-slate-400 text-xs italic p-4 text-center">No appointments scheduled for today.</p>
                            ) : todaySchedule.map((apt) => (
                                <div key={apt.id} className="p-4 flex items-center justify-between border-b border-slate-50 last:border-0 hover:bg-slate-50/50 rounded-xl transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="text-center min-w-[60px]">
                                            <p className="text-xs font-black text-slate-900">{apt.time.split(' ')[0]}</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{apt.time.split(' ')[1]}</p>
                                        </div>
                                        <div className="w-px h-8 bg-slate-100" />
                                        <div>
                                            <p className="text-xs font-black text-slate-800">{apt.patient_name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold">with {apt.doctor_name || <span className="text-amber-600">Unassigned</span>}</p>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                        apt.status === 'Confirmed' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                    )}>
                                        {apt.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Staff Quick View */}
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h2 className="text-lg font-black tracking-tight mb-6">Staff Availability</h2>
                            <div className="space-y-6">
                                {[
                                    { name: "Dr. Arun Kumar", dept: "Cardiology", status: "Active", color: "bg-emerald-400" },
                                    { name: "Dr. Sarah Paul", dept: "Pediatrics", status: "On Leave", color: "bg-amber-400" },
                                    { name: "Dr. James Bond", dept: "Surgery", status: "In Surgery", color: "bg-sky-400" },
                                ].map((doc, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black border border-slate-700">
                                                {doc.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold tracking-tight">{doc.name}</p>
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{doc.dept}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={cn("w-2 h-2 rounded-full animate-pulse", doc.color)}></span>
                                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">{doc.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => navigate('/admin/doctors')}
                                className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all"
                            >
                                Manage All Doctors
                            </button>
                        </div>
                        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                    </div>


                </div>
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

export default AdminDashboard;
