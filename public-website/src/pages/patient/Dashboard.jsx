import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Calendar, FileText, PlusCircle, ArrowRight, Activity, Clock, ShieldCheck } from 'lucide-react';
import { patientService } from '../../services/patientService';

const PatientDashboard = () => {
    const profile = JSON.parse(localStorage.getItem("user"));
    const rawName = profile?.name || 'Patient';
    const cleanName = rawName.replace(/^(Dr\.|Dr|Mr\.|Mr|Mrs\.|Mrs|Ms\.|Ms|Miss)\s+/i, '');
    const firstName = cleanName.split(' ')[0] || 'Patient';

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        patientService.getDashboardStats()
            .then(data => setStats(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const nextAppointmentText = stats?.nextAppointment
        ? `${new Date(stats.nextAppointment.date).toLocaleDateString('en-US', { weekday: 'short' })}, ${stats.nextAppointment.time}`
        : 'No upcoming visits';

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Welcome Hero */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-teal-500 p-8 text-white shadow-xl">
                <div className="absolute top-0 right-0 -translate-y-10 translate-x-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">
                            {getGreeting()}, <span className="text-secondary">{firstName}!</span>
                        </h1>
                        <p className="text-base opacity-90 max-w-lg leading-relaxed">
                            Your health is our priority. You have <span className="font-bold underline decoration-secondary decoration-2 underline-offset-4">
                                {stats?.todayCount || 0} appointment{stats?.todayCount !== 1 ? 's' : ''}
                            </span> today.
                        </p>
                    </div>
                </div>
            </div>

            {/* Health Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card p-4 rounded-2xl flex items-center space-x-3 border-l-4 border-primary shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Activity size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Health Score</p>
                        <h3 className="text-xl font-bold text-gray-800">{stats?.healthScore || '--'}/100</h3>
                    </div>
                </div>
                <div className="glass-card p-4 rounded-2xl flex items-center space-x-3 border-l-4 border-accent shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Next Booking</p>
                        <h3 className="text-sm font-bold text-gray-800 leading-tight">
                            {loading ? 'Loading...' : nextAppointmentText}
                        </h3>
                    </div>
                </div>
                <div className="glass-card p-4 rounded-2xl flex items-center space-x-3 border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Status</p>
                        <h3 className="text-xl font-bold text-gray-800">{stats?.status || 'Active'}</h3>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                {/* Book Appointment Card */}
                <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                    <div className="absolute top-0 right-0 bg-primary/5 w-24 h-24 rounded-bl-full -mr-6 -mt-6 transition-all group-hover:bg-primary/10"></div>
                    <div className="p-6">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/20 transform transition-transform group-hover:rotate-6">
                            <PlusCircle size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1.5">Book Appointment</h2>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">Schedule a visit with our specialists in seconds.</p>
                        <Link to="/patient/book-appointment" className="btn-premium py-2.5 px-5 text-sm flex items-center justify-center space-x-2 group/btn rounded-lg">
                            <span>Book Now</span>
                            <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                    </div>
                </div>

                {/* My Appointments Card */}
                <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl border-b-4 border-secondary">
                    <div className="p-6">
                        <div className="w-12 h-12 bg-secondary/30 rounded-xl flex items-center justify-center text-primary mb-4 transform transition-transform group-hover:-rotate-6">
                            <Calendar size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1.5">My Appointments</h2>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">Stay on track with your upcoming medical visits.</p>
                        <Link to="/patient/appointments" className="text-primary text-sm font-bold flex items-center space-x-2 hover:opacity-80 transition-opacity">
                            <span>View Schedule</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* Medical Records Card */}
                <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl border-b-4 border-accent">
                    <div className="p-6">
                        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-4 transform transition-transform group-hover:scale-110">
                            <FileText size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1.5">Reports & History</h2>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                            {loading ? 'Refreshing records...' : `Access your ${stats?.totalRecords || 0} prescriptions and lab results.`}
                        </p>
                        <Link to="/patient/prescriptions" className="text-accent text-sm font-bold flex items-center space-x-2 hover:opacity-80 transition-opacity">
                            <span>View Records</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
