import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiPhone } from 'react-icons/fi';
import { MdEmail } from 'react-icons/md';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'Centres', href: '#centres' },
        { name: 'Doctors', href: '#doctors' },
        { name: 'Services', href: '#services' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a href="#home" className="flex items-center space-x-3">
                            <img
                                src="/logo.png"
                                alt="Clinixa Logo"
                                className="w-12 h-12 object-contain rounded-lg shadow-sm"
                            />
                            <span className="text-2xl font-bold font-display text-gradient">
                                Clinixa
                            </span>
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Emergency Contact Button */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/login" className="flex items-center space-x-2 text-accent-600 hover:text-accent-700 font-semibold transition-colors">
                            <FiPhone className="w-5 h-5" />
                            <span>Emergency: +91 123 456 7890</span>
                        </Link>
                        <Link to="/login" className="btn-accent">
                            Book Appointment
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-gray-700 hover:text-primary-600 transition-colors"
                    >
                        {isMenuOpen ? (
                            <FiX className="w-6 h-6" />
                        ) : (
                            <FiMenu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden glass border-t border-gray-200">
                    <div className="px-4 pt-2 pb-4 space-y-3">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="block py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                        <div className="pt-4 space-y-3">
                            <a
                                href="tel:+911234567890"
                                className="flex items-center space-x-2 text-accent-600 font-semibold"
                            >
                                <FiPhone className="w-5 h-5" />
                                <span>Emergency: +91 123 456 7890</span>
                            </a>
                            <button className="w-full btn-accent">
                                Book Appointment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
