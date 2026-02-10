import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Twitter, Instagram, MapPin, Phone, Mail, Menu, X, Activity } from 'lucide-react';
import Logo from '../components/Logo';

const PublicLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle Scroll for Navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Departments", path: "/departments" },
    { name: "Doctors", path: "/doctors" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
      {/* MODERN NAVBAR */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-3" : "bg-white py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center gap-4">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="bg-white border border-gray-100 shadow-sm p-1.5 rounded-xl group-hover:shadow-md transition-all">
              <Logo className="h-8" />
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-bold text-primary tracking-tight">Clinix</span>
              <span className="text-2xl font-bold text-accent tracking-tight">a</span>
            </div>
          </Link>

          {/* Navigation Links - Centered */}
          <nav className="hidden lg:flex items-center space-x-10 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[13px] font-bold uppercase tracking-[1px] transition-all hover:text-primary ${location.pathname === link.path ? "text-primary" : "text-gray-500"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Section */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {/* Book Now Button */}
            <Link
              to="/patient/book-appointment"
              className="group flex items-center bg-primary text-white rounded-2xl overflow-hidden hover:bg-teal-700 transition-all shadow-sm border border-teal-600/20"
            >
              <div className="bg-white/10 p-3 flex items-center justify-center">
                <Phone size={20} className="text-white" />
              </div>
              <div className="px-5 py-2 flex flex-col items-start">
                <span className="text-[10px] font-medium opacity-90 uppercase tracking-wider leading-none mb-1">FEES: ₹500</span>
                <span className="text-sm font-bold leading-none tracking-wide">Book Now</span>
              </div>
            </Link>

            {/* Emergency Button */}
            <div className="flex items-center bg-accent text-white rounded-2xl overflow-hidden shadow-sm border border-orange-600/20">
              <div className="bg-white/10 p-3 flex items-center justify-center">
                <Activity size={20} className="text-white" />
              </div>
              <div className="px-5 py-2 flex flex-col items-start cursor-default">
                <span className="text-[10px] font-medium opacity-90 uppercase tracking-wider leading-none mb-1">PEDIATRIC EMERGENCY</span>
                <span className="text-sm font-bold leading-none tracking-wide">79970 79970</span>
              </div>
            </div>

            {/* User Profile */}
            <Link to="/login" className="relative ml-2 group">
              <div className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50 group-hover:border-primary transition-all overflow-hidden">
                <div className="text-gray-400 group-hover:text-primary transition-colors">
                  <Menu size={20} />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm status-pulsate"></div>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="md:hidden absolute top-20 inset-x-4 z-40 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            <nav className="flex flex-col p-6 space-y-5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-base font-bold uppercase tracking-wider ${location.pathname === link.path ? "text-primary" : "text-gray-600"
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-gray-100" />
              <div className="flex flex-col gap-3">
                <Link
                  to="/patient/book-appointment"
                  className="bg-primary text-white py-4 rounded-xl font-bold text-center shadow-lg"
                >
                  BOOK APPOINTMENT
                </Link>
                <div className="bg-accent text-white py-3 rounded-xl font-bold flex flex-col items-center">
                  <span className="text-[10px] opacity-90">EMERGENCY</span>
                  <span>79970 79970</span>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Logo className="h-12 w-auto bg-white p-1 rounded-xl" />
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Providing world-class medical care with a personal touch. Your health is our priority.
            </p>
            <div className="flex space-x-4 text-gray-400">
              <Facebook className="hover:text-primary cursor-pointer transition" />
              <Twitter className="hover:text-primary cursor-pointer transition" />
              <Instagram className="hover:text-primary cursor-pointer transition" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-primary">Quick Links</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/doctors" className="hover:text-white transition">Our Doctors</Link></li>
              <li><Link to="/departments" className="hover:text-white transition">Departments</Link></li>
              <li><Link to="/patient/book-appointment" className="hover:text-white transition">Book Appointment</Link></li>
              <li><Link to="#" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-primary">Contact Us</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-primary mt-1" />
                <span>123 Medical Center Dr,<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-primary" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-primary" />
                <span>contact@clinixa.life</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-primary">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe for health tips and updates.</p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="bg-primary text-white font-bold py-3 rounded-lg hover:bg-teal-700 transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Clinixa Specialist Hospital. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
