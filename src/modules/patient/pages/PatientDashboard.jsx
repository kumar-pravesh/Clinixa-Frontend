import { FiCalendar, FiFileText, FiHeart, FiClock } from 'react-icons/fi';

const PatientOverview = () => {
    const stats = [
        { label: 'Upcoming Appointments', value: '1', icon: <FiCalendar />, color: 'bg-primary-500' },
        { label: 'Health Score', value: '92%', icon: <FiHeart />, color: 'bg-red-500' },
        { label: 'Recent Reports', value: '3', icon: <FiFileText />, color: 'bg-secondary-500' },
        { label: 'Last Visit', value: 'Dec 22', icon: <FiClock />, color: 'bg-gray-500' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Patient Portal</h1>
                    <p className="text-gray-500 font-medium">Hello John! Manage your health records and bookings here.</p>
                </div>
                <button className="btn-primary">Book New Appointment</button>
            </div>

            {/* Welcome Banner */}
            <div className="bg-gradient-primary rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden group">
                <div className="relative z-10 max-w-lg">
                    <h2 className="text-2xl font-bold mb-2">Need a medical consultation?</h2>
                    <p className="text-white/80 font-medium mb-6">Connect with our top specialists within minutes. Fast, secure and reliable healthcare at your fingertips.</p>
                    <button className="bg-white text-primary-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all">Get Started</button>
                </div>
                {/* Decorative floating shapes */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="hidden lg:block">
                    <FiHeart className="w-32 h-32 opacity-20 transform -rotate-12" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="card p-6 border-l-4 border-l-transparent hover:border-l-primary-500 transition-all">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 ${stat.color}`}>
                            <span className="text-2xl">{stat.icon}</span>
                        </div>
                        <p className="text-gray-500 text-sm font-bold">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Appointment Record Table */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Recent Medical History</h3>
                    <button className="text-sm font-bold text-primary-600">View History</button>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map(item => (
                        <div key={item} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <FiFileText className="w-5 h-5 text-primary-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">General Checkup Report</p>
                                    <p className="text-xs font-semibold text-gray-500">Jan {10 + item}, 2026 • Dr. Sharma</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 border-2 border-primary-100 text-primary-600 rounded-xl text-xs font-bold hover:bg-primary-600 hover:text-white transition-all">Download PDF</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PatientOverview;
