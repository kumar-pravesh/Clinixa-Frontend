import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlayCircle } from 'react-icons/fi';

const Hero = () => {
    return (
        <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-white -z-10"></div>

            {/* Animated Background Shapes */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="animate-slide-in">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-tight mb-6">
                            Your Health is Our{' '}
                            <span className="text-gradient">Priority</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Experience world-class healthcare with our team of expert doctors,
                            state-of-the-art facilities, and compassionate care. Your wellness
                            journey starts here.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/login" className="btn-primary flex items-center space-x-2">
                                <span>Book Appointment</span>
                                <FiArrowRight className="w-5 h-5" />
                            </Link>
                            <button
                                className="btn-outline flex items-center space-x-2"
                                onClick={() => document.getElementById('centres')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                <FiPlayCircle className="w-5 h-5" />
                                <span>Virtual Tour</span>
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-12 pt-12 border-t border-gray-200">
                            <div>
                                <div className="text-3xl font-bold text-primary-600 mb-1">25+</div>
                                <div className="text-sm text-gray-600">Years Experience</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-primary-600 mb-1">150+</div>
                                <div className="text-sm text-gray-600">Expert Doctors</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-primary-600 mb-1">50k+</div>
                                <div className="text-sm text-gray-600">Happy Patients</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Image/Illustration */}
                    <div className="relative animate-fade-in">
                        <div className="relative z-10">
                            <img
                                src="/hero-banner.png"
                                alt="Healthcare professionals"
                                className="rounded-2xl shadow-2xl border-4 border-white"
                            />
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute -top-4 -right-4 w-72 h-72 bg-accent-200/40 rounded-full blur-2xl -z-10"></div>
                        <div className="absolute -bottom-4 -left-4 w-64 h-64 bg-primary-200/40 rounded-full blur-2xl -z-10"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
