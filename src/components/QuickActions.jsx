import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiUsers, FiActivity, FiFileText } from 'react-icons/fi';
import { MdEmergency } from 'react-icons/md';

const QuickActions = () => {
    const navigate = useNavigate();
    const actions = [
        {
            icon: <FiCalendar className="w-8 h-8" />,
            title: 'Book Appointment',
            description: 'Schedule a visit with our expert doctors',
            color: 'primary',
        },
        {
            icon: <FiUsers className="w-8 h-8" />,
            title: 'Find a Doctor',
            description: 'Browse our specialized medical professionals',
            color: 'secondary',
        },
        {
            icon: <MdEmergency className="w-8 h-8" />,
            title: 'Emergency Care',
            description: '24/7 immediate medical assistance',
            color: 'accent',
        },
        {
            icon: <FiFileText className="w-8 h-8" />,
            title: 'Lab Reports',
            description: 'Access your medical test results',
            color: 'primary',
        },
    ];

    const colorClasses = {
        primary: {
            bg: 'from-primary-500 to-primary-600',
            text: 'text-primary-600',
            hover: 'group-hover:from-primary-600 group-hover:to-primary-700',
        },
        secondary: {
            bg: 'from-secondary-500 to-secondary-600',
            text: 'text-secondary-600',
            hover: 'group-hover:from-secondary-600 group-hover:to-secondary-700',
        },
        accent: {
            bg: 'from-accent-500 to-accent-600',
            text: 'text-accent-600',
            hover: 'group-hover:from-accent-600 group-hover:to-accent-700',
        },
    };

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {actions.map((action, index) => (
                        <div
                            key={index}
                            className="group card p-6 cursor-pointer hover:scale-105 transition-all duration-300"
                            style={{ animationDelay: `${index * 100}ms` }}
                            onClick={() => {
                                const targetId =
                                    action.title === 'Find a Doctor' ? 'doctors' :
                                        action.title === 'Emergency Care' ? 'services' :
                                            action.title === 'Lab Reports' ? 'services' : null;

                                if (action.title === 'Book Appointment') {
                                    navigate('/login');
                                } else if (targetId) {
                                    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                        >
                            <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses[action.color].bg} ${colorClasses[action.color].hover} rounded-xl flex items-center justify-center text-white mb-4 transition-all duration-300 shadow-lg`}>
                                {action.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {action.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {action.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default QuickActions;
