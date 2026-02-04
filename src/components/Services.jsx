import { FiClock, FiActivity, FiTruck, FiShield, FiZap, FiPackage } from 'react-icons/fi';
import { MdLocalPharmacy, MdHealthAndSafety } from 'react-icons/md';

const Services = () => {
    const services = [
        {
            icon: <FiClock className="w-8 h-8" />,
            title: '24/7 Emergency Care',
            description: 'Round-the-clock emergency medical services with immediate response team.',
            gradient: 'from-red-500 to-orange-600',
        },
        {
            icon: <FiActivity className="w-8 h-8" />,
            title: 'Advanced Diagnostics',
            description: 'State-of-the-art diagnostic equipment for accurate and timely results.',
            gradient: 'from-blue-500 to-cyan-600',
        },
        {
            icon: <MdHealthAndSafety className="w-8 h-8" />,
            title: 'Specialized Treatments',
            description: 'Expert care across multiple specialties with personalized treatment plans.',
            gradient: 'from-purple-500 to-pink-600',
        },
        {
            icon: <FiShield className="w-8 h-8" />,
            title: 'Health Checkups',
            description: 'Comprehensive preventive health screening packages for all age groups.',
            gradient: 'from-green-500 to-teal-600',
        },
        {
            icon: <FiTruck className="w-8 h-8" />,
            title: 'Home Healthcare',
            description: 'Professional medical care and nursing services at your doorstep.',
            gradient: 'from-indigo-500 to-purple-600',
        },
        {
            icon: <MdLocalPharmacy className="w-8 h-8" />,
            title: 'Pharmacy Services',
            description: '24/7 pharmacy with home delivery and medication counseling.',
            gradient: 'from-orange-500 to-amber-600',
        },
        {
            icon: <FiZap className="w-8 h-8" />,
            title: 'Quick Lab Reports',
            description: 'Fast and accurate laboratory testing with digital report access.',
            gradient: 'from-cyan-500 to-blue-600',
        },
        {
            icon: <FiPackage className="w-8 h-8" />,
            title: 'Health Packages',
            description: 'Customized healthcare packages designed for your specific needs.',
            gradient: 'from-pink-500 to-rose-600',
        },
    ];

    return (
        <section id="services" className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="section-title">Our Services</h2>
                    <p className="section-subtitle">
                        Comprehensive healthcare solutions designed to meet all your medical needs
                        with excellence and compassion.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group card p-6 hover:scale-105 transition-all duration-300"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {service.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
