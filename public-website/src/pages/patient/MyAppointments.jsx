import { useEffect, useState } from 'react';
import { patientService } from '../../services/patientService';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, CreditCard, ChevronRight } from 'lucide-react';

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        patientService.getMyAppointments()
            .then(data => setAppointments(data))
            .catch(error => console.error('Error fetching appointments:', error))
            .finally(() => setLoading(false));
    }, []);

    const getStatusStyle = (status) => {
        switch (status?.toUpperCase()) {
            case 'CONFIRMED': return 'bg-green-100 text-green-700 border-green-200 icon-green';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200 icon-red';
            case 'CREATED': return 'bg-yellow-100 text-yellow-700 border-yellow-200 icon-yellow';
            default: return 'bg-gray-100 text-gray-700 border-gray-200 icon-gray';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toUpperCase()) {
            case 'CONFIRMED': return <CheckCircle size={14} />;
            case 'CANCELLED': return <XCircle size={14} />;
            case 'CREATED': return <AlertCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">My Appointments</h1>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Manage your health schedule</p>
                </div>
                <div className="bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/40 shadow-sm flex items-center gap-2">
                    <Calendar className="text-primary" size={18} />
                    <span className="text-xs font-bold text-gray-700">{appointments.length} Scheduled</span>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter">Syncing Schedule...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {appointments.map((appt) => (
                        <div key={appt.id} className="glass-card group hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden border border-white/40 flex flex-col md:flex-row shadow-lg">
                            {/* Date Badge */}
                            <div className="bg-primary/5 md:w-32 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-white/20 group-hover:bg-primary/10 transition-colors">
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                                    {new Date(appt.date).toLocaleDateString('en-US', { month: 'short' })}
                                </span>
                                <span className="text-3xl font-black text-gray-800 leading-none my-1">
                                    {new Date(appt.date).getDate()}
                                </span>
                                <span className="text-xs font-bold text-gray-400">
                                    {new Date(appt.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                </span>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-bold shadow-sm shadow-primary/10 overflow-hidden border-2 border-white">
                                            {appt.image_url ? (
                                                <img
                                                    src={`${import.meta.env.VITE_API_ROOT || 'http://localhost:5000'}/${appt.image_url}`}
                                                    alt={appt.doctor_name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.parentElement.innerText = appt.doctor_name.charAt(0);
                                                    }}
                                                />
                                            ) : (
                                                appt.doctor_name?.charAt(0) || 'D'
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 leading-tight group-hover:text-primary transition-colors">{appt.doctor_name}</h3>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{appt.specialization}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <Clock className="text-gray-300" size={16} />
                                            <span className="text-sm font-bold text-gray-700 tracking-tight">{appt.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="text-gray-300" size={16} />
                                            <span className="text-xs font-semibold text-gray-500">
                                                Fees: ₹{appt.paid_amount ? parseFloat(appt.paid_amount).toFixed(0) : (parseFloat(appt.consultation_fee || 500) * 1.18).toFixed(0)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border shadow-sm ${getStatusStyle(appt.status)}`}>
                                        {getStatusIcon(appt.status)}
                                        {appt.status}
                                    </span>
                                    <button className="p-2 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {appointments.length === 0 && (
                        <div className="bg-white/30 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
                                <Calendar size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-400">No Appointments Yet</h3>
                            <p className="text-sm text-gray-300 mt-2 max-w-xs mx-auto">Your upcoming consultations will appear here once you book them.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyAppointments;
