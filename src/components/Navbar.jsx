import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiPhone, FiUser, FiSearch, FiChevronDown } from 'react-icons/fi';
import { MdNotificationsActive } from 'react-icons/md';

const Navbar = ({ searchTerm, setSearchTerm, onOpenBooking }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const location = useLocation();

    // Mock doctors for suggestions
    const doctors = [
        { name: 'Dr. Pravesh Kumar', specialty: 'Cardiologist' },
        { name: 'Dr. Subham Shekhar Das', specialty: 'Pediatrician' },
        { name: 'Dr. Chandan Shashank', specialty: 'Orthopedic Surgeon' },
        { name: 'Dr. Nikitha Reddy', specialty: 'Gynecologist' },
        { name: 'Dr. Achyut Shivarao', specialty: 'Neurologist' },
        { name: 'Dr. Aishwarya', specialty: 'Cardiologist' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'Centres', href: '#centres' },
        { name: 'Doctors', href: '#doctors' },
        { name: 'Services', href: '#services' },
        { name: 'Contact', href: '#contact' },
    ];

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        const element = document.getElementById('doctors');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md'}`}>
            {/* Top Row: Utility & Search (Desktop Only) */}
            <div className="hidden lg:block border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link to="/" className="flex items-center space-x-3">
                                <img
                                    src="/logo.png"
                                    alt="Clinixa Logo"
                                    className="w-12 h-12 object-contain rounded-lg shadow-sm"
                                />
                                <span className="text-2xl font-bold font-display text-gradient">
                                    Clinixa
                                </span>
                            </Link>
                        </div>

                        {/* Centered Search Bar */}
                        <div className="flex-1 max-w-lg mx-8">
                            <form onSubmit={handleSearchSubmit} className="relative group">
                                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full pl-6 pr-1 py-1 focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/5 transition-all w-full shadow-sm hover:shadow-md">
                                    <input
                                        type="text"
                                        placeholder="Search Doctor's, Speciality, Blog"
                                        value={searchTerm}
                                        onFocus={() => setShowSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="bg-transparent border-none outline-none text-sm w-full font-medium text-gray-700 placeholder-gray-400"
                                    />
                                    <button type="submit" className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 active:scale-95">
                                        <FiSearch className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Suggestions Dropdown */}
                                {showSuggestions && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in z-50">
                                        <div className="p-4 bg-gray-50 border-b border-gray-100">
                                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Recommended Doctors</p>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto">
                                            {doctors
                                                .filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.specialty.toLowerCase().includes(searchTerm.toLowerCase()))
                                                .map((doc, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => {
                                                            setSearchTerm(doc.name);
                                                            setShowSuggestions(false);
                                                            handleSearchSubmit();
                                                        }}
                                                        className="w-full text-left px-6 py-4 hover:bg-primary-50 transition-colors flex items-center space-x-4 border-b border-gray-50 last:border-none"
                                                    >
                                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                                            {doc.name.charAt(4)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">{doc.name}</p>
                                                            <p className="text-xs text-gray-500">{doc.specialty}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Action Buttons & Profile */}
                        <div className="flex items-center space-x-4">
                            {/* Action Blocks */}
                            <div className="flex items-center rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                                <button
                                    onClick={onOpenBooking}
                                    className="flex items-center space-x-3 px-5 py-2.5 bg-primary-600 text-white hover:bg-primary-700 transition-all group border-none outline-none"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
                                        <FiPhone className="w-4 h-4" />
                                    </div>
                                    <div className="leading-tight text-left">
                                        <div className="text-[10px] uppercase font-bold opacity-80 tracking-wider">Fees: ₹500</div>
                                        <div className="text-sm font-black whitespace-nowrap">Book Now</div>
                                    </div>
                                </button>
                                <a href="tel:7997079970" className="flex items-center space-x-3 px-5 py-2.5 bg-accent-600 text-white hover:bg-accent-700 transition-all border-l border-white/10 group">
                                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center animate-pulse">
                                        <MdNotificationsActive className="w-4 h-4" />
                                    </div>
                                    <div className="leading-tight">
                                        <div className="text-[10px] uppercase font-bold opacity-80 tracking-wider">Pediatric Emergency</div>
                                        <div className="text-sm font-black whitespace-nowrap">79970 79970</div>
                                    </div>
                                </a>
                            </div>

                            {/* Profile Icon */}
                            <Link
                                to="/login"
                                className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary-600 shadow-md hover:shadow-lg transition-all border border-gray-100 group relative"
                                title="Patient Login"
                            >
                                <FiUser className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile View: Single Compact Row */}
            <div className="lg:hidden">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <img src="/logo.png" alt="Clinixa" className="w-10 h-10 object-contain" />
                            <span className="text-xl font-bold font-display text-gradient">Clinixa</span>
                        </Link>

                        {/* Mobile Actions */}
                        <div className="flex items-center space-x-3">
                            <a href="tel:7997079970" className="w-10 h-10 bg-accent-600 text-white rounded-full flex items-center justify-center shadow-md">
                                <MdNotificationsActive className="w-5 h-5" />
                            </a>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 text-gray-700 hover:text-primary-600 transition-colors bg-gray-100 rounded-lg"
                            >
                                {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-[100] bg-white animate-fade-in pt-4 overflow-y-auto">
                    <div className="p-6 space-y-8">
                        {/* Drawer Header */}
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <span className="text-xl font-black text-gray-900">Menu</span>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-50 rounded-full">
                                <FiX className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        {/* Search in Drawer */}
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                                type="text"
                                placeholder="Search Doctors..."
                                value={searchTerm}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-14 pl-6 pr-14 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-primary-500"
                            />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white">
                                <FiSearch className="w-5 h-5" />
                            </button>

                            {/* Mobile Suggestions Dropdown */}
                            {showSuggestions && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[110] animate-fade-in">
                                    <div className="max-h-[250px] overflow-y-auto">
                                        {doctors
                                            .filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.specialty.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .map((doc, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => {
                                                        setSearchTerm(doc.name);
                                                        setShowSuggestions(false);
                                                        handleSearchSubmit();
                                                        setIsMenuOpen(false);
                                                    }}
                                                    className="w-full text-left px-5 py-3 hover:bg-primary-50 transition-colors flex items-center space-x-3 border-b border-gray-50 last:border-none"
                                                >
                                                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xs">
                                                        {doc.name.charAt(4)}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-900">{doc.name}</p>
                                                        <p className="text-[10px] text-gray-500">{doc.specialty}</p>
                                                    </div>
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </form>

                        {/* Links */}
                        <div className="space-y-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl text-lg font-bold text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span>{link.name}</span>
                                    <FiChevronDown className="w-5 h-5 -rotate-90 opacity-30" />
                                </a>
                            ))}
                        </div>

                        {/* Critical Actions */}
                        <div className="pt-6 grid grid-cols-1 gap-4">
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    onOpenBooking();
                                }}
                                className="flex items-center justify-center space-x-3 p-5 bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-primary-500/20 border-none outline-none"
                            >
                                <FiPhone className="w-5 h-5" />
                                <div className="text-left">
                                    <div className="text-[10px] uppercase font-bold opacity-80 tracking-wider">Fees: ₹500</div>
                                    <div className="text-sm font-black whitespace-nowrap">Appointment: 1800 2122</div>
                                </div>
                            </button>
                            <a href="tel:7997079970" className="flex items-center justify-center space-x-3 p-5 bg-accent-600 text-white rounded-2xl font-black shadow-xl shadow-accent-500/20">
                                <MdNotificationsActive className="w-5 h-5" />
                                <span>Emergency: 79970 79970</span>
                            </a>
                            <Link
                                to="/login"
                                className="flex items-center justify-center space-x-3 p-5 bg-gray-900 text-white rounded-2xl font-black"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <FiUser className="w-5 h-5" />
                                <span>Patient Portal Login</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
