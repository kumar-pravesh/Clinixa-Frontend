import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Activity, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

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
      {/* TOP BAR */}
      <div className="bg-primary text-white py-2 px-4 text-sm hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex space-x-6">
            <span className="flex items-center gap-2"><Phone size={14} /> +1 (555) 123-4567</span>
            <span className="flex items-center gap-2"><Mail size={14} /> info@hospital.com</span>
          </div>
          <div className="flex space-x-4">
            <Link to="#" className="hover:text-secondary transition-colors">Emergency: 911</Link>
            <span className="mx-2">|</span>
            <div className="flex space-x-3">
              <Facebook size={14} className="cursor-pointer hover:text-secondary" />
              <Twitter size={14} className="cursor-pointer hover:text-secondary" />
              <Instagram size={14} className="cursor-pointer hover:text-secondary" />
              <Linkedin size={14} className="cursor-pointer hover:text-secondary" />
            </div>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md py-2" : "bg-white/95 backdrop-blur-sm py-4"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-white p-2 rounded-lg group-hover:bg-teal-700 transition-colors">
              <Activity size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 tracking-tight leading-none">MEDICARE</span>
              <span className="text-xs text-primary font-semibold tracking-widest uppercase">Specialist Hospital</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold uppercase tracking-wide transition-colors relative hover:text-primary ${location.pathname === link.path ? "text-primary" : "text-gray-600"
                  }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 top-full mt-1 w-full h-0.5 bg-primary"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-primary font-semibold hover:text-teal-700 transition">
              Login
            </Link>
            <Link
              to="/patient/book-appointment"
              className="bg-accent text-white px-5 py-2.5 rounded-full font-semibold shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:scale-105 transition-all duration-300 active:scale-95"
            >
              Book Appointment
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b shadow-lg overflow-hidden"
          >
            <nav className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-lg font-medium ${location.pathname === link.path ? "text-primary" : "text-gray-700"
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="my-2" />
              <Link to="/login" className="block text-center text-primary font-bold py-2">
                Patient Login
              </Link>
              <Link
                to="/patient/book-appointment"
                className="block text-center bg-accent text-white px-4 py-3 rounded-lg font-bold shadow-md"
              >
                Book Appointment
              </Link>
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
              <div className="bg-primary p-2 rounded-lg">
                <Activity size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tight">MEDICARE</span>
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
                <span>contact@medicare.com</span>
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
          © {new Date().getFullYear()} Medicare Specialist Hospital. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
