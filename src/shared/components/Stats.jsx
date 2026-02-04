import { useEffect, useState, useRef } from 'react';
import { FiAward, FiUsers, FiCalendar, FiHeart } from 'react-icons/fi';

const Stats = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [counts, setCounts] = useState({ years: 0, doctors: 0, patients: 0, awards: 0 });
    const statsRef = useRef(null);

    const finalStats = {
        years: 25,
        doctors: 150,
        patients: 50000,
        awards: 35,
    };

    const statsData = [
        {
            icon: <FiCalendar className="w-8 h-8" />,
            value: counts.years,
            suffix: '+',
            label: 'Years of Excellence',
            gradient: 'from-primary-500 to-primary-600',
        },
        {
            icon: <FiUsers className="w-8 h-8" />,
            value: counts.doctors,
            suffix: '+',
            label: 'Expert Doctors',
            gradient: 'from-secondary-500 to-secondary-600',
        },
        {
            icon: <FiHeart className="w-8 h-8" />,
            value: counts.patients,
            suffix: '+',
            label: 'Happy Patients',
            gradient: 'from-accent-500 to-accent-600',
        },
        {
            icon: <FiAward className="w-8 h-8" />,
            value: counts.awards,
            suffix: '+',
            label: 'Awards Won',
            gradient: 'from-purple-500 to-pink-600',
        },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => {
            if (statsRef.current) {
                observer.unobserve(statsRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;

        const intervals = Object.keys(finalStats).map((key) => {
            const increment = finalStats[key] / steps;
            let current = 0;

            return setInterval(() => {
                current += increment;
                if (current >= finalStats[key]) {
                    current = finalStats[key];
                    clearInterval(intervals[Object.keys(finalStats).indexOf(key)]);
                }
                setCounts((prev) => ({ ...prev, [key]: Math.floor(current) }));
            }, stepDuration);
        });

        return () => intervals.forEach(clearInterval);
    }, [isVisible]);

    const formatValue = (value) => {
        if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}k`;
        }
        return value;
    };

    return (
        <section ref={statsRef} className="py-20 bg-gradient-primary relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Our Achievements
                    </h2>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Numbers that reflect our commitment to excellence in healthcare
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {statsData.map((stat, index) => (
                        <div
                            key={index}
                            className="text-center animate-slide-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${stat.gradient} rounded-2xl text-white mb-4 shadow-xl`}>
                                {stat.icon}
                            </div>
                            <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                                {formatValue(stat.value)}
                                {stat.suffix}
                            </div>
                            <div className="text-lg text-white/90 font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
