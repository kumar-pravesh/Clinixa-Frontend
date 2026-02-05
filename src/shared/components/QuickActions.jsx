import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiUsers, FiFileText, FiArrowRight } from 'react-icons/fi';
import { MdEmergency } from 'react-icons/md';

const QuickActions = ({ onOpenBooking }) => {
    const navigate = useNavigate();

    const actions = [
        {
            icon: <FiCalendar className="w-6 h-6" />,
            title: 'Book Appointment',
            desc: 'Instant slot booking',
            color: 'bg-primary-600',
            bgLight: 'bg-primary-50',
            action: onOpenBooking
        },
        {
            icon: <FiUsers className="w-6 h-6" />,
            title: 'Find a Doctor',
            desc: 'Expert specialists',
            color: 'bg-secondary-600',
            bgLight: 'bg-secondary-50',
            action: () => document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' })
        },
        {
            icon: <MdEmergency className="w-6 h-6" />,
            title: 'Emergency',
            desc: '24/7 Priority Care',
            color: 'bg-accent-600',
            bgLight: 'bg-accent-50',
            action: () => window.location.href = 'tel:7997079970'
        },
        {
            icon: <FiFileText className="w-6 h-6" />,
            title: 'Lab Reports',
            desc: 'View test results',
            color: 'bg-gray-900',
            bgLight: 'bg-gray-100',
            action: () => navigate('/dashboard/patient/records')
        },
    ];

    return (
        <section className="relative -mt-16 z-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* The Ribbon Body */}
                <div className="bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-3 md:p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                        {actions.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={item.action}
                                className="group relative flex items-center p-4 rounded-3xl transition-all duration-500 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 text-left overflow-hidden"
                            >
                                {/* Background Decorative Glow */}
                                <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity blur-2xl ${item.color}`}></div>

                                {/* Icon Frame */}
                                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg ${item.color}`}>
                                    {item.icon}
                                </div>

                                {/* Text Content */}
                                <div className="ml-4 flex-1">
                                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-0.5 whitespace-nowrap">
                                        {item.title}
                                    </h4>
                                    <div className="flex items-center text-xs font-bold text-gray-500">
                                        <span className="group-hover:text-primary-600 transition-colors">{item.desc}</span>
                                        <FiArrowRight className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 w-3 h-3 text-primary-600" />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bottom Decorative Element */}
                <div className="flex justify-center mt-6">
                    <div className="flex items-center space-x-2 px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">All services are currently operational</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QuickActions;
