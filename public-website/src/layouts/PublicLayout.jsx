import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Twitter, Instagram, Phone, Menu, X, ArrowRight, ShieldCheck, Bell } from 'lucide-react';
import Logo from "../components/shared/Logo";

const MotionDiv = motion.div;

const PublicLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "ABOUT US", path: "/about" },
    { name: "DEPARTMENTS", path: "/departments" },
    { name: "DOCTORS", path: "/doctors" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] font-sans text-slate-800 flex flex-col">
      {/* 🚀 Dynamic Header */}
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/50 py-3 shadow-md"
          : "bg-transparent py-4"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo forceLight={!isScrolled} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-bold tracking-wider transition-colors duration-200 ${location.pathname === link.path
                  ? "text-primary"
                  : isScrolled ? "text-slate-600 hover:text-primary" : "text-white/80 hover:text-white"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Combined Navbar Actions */}
          <div className="hidden lg:flex items-center">
            <div className="flex bg-teal-600 rounded-[2rem] overflow-hidden shadow-lg shadow-primary/10">
              {/* Book Now Section */}
              <Link
                to="/patient/book-appointment"
                className="group flex items-center bg-teal-600 hover:bg-teal-700 transition-colors py-2 pl-3 pr-6 border-r border-white/10"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white mr-4 shadow-inner">
                  <Phone size={20} />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-lg font-black text-white tracking-tight">Book Now</span>
                </div>
              </Link>

              {/* Emergency Section */}
              <a
                href="tel:7997079970"
                className="group flex items-center bg-orange-500 hover:bg-orange-600 transition-colors py-2 pl-6 pr-8"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white mr-4 shadow-inner">
                  <Bell size={20} />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Pediatric Emergency</span>
                  <span className="text-lg font-black text-white tracking-tight">79970 79970</span>
                </div>
              </a>
            </div>

            {/* Menu/Auth Access */}
            <Link to="/login" className="relative group p-1 ml-4">
              <div className="w-12 h-12 rounded-full bg-white/10 border border-slate-200/20 flex items-center justify-center transition-all group-hover:bg-primary group-hover:border-primary group-hover:text-white">
                <Menu size={22} className={isScrolled ? "text-slate-600 group-hover:text-white" : "text-white"} />
              </div>
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className={`lg:hidden p-2 transition-colors ${isScrolled ? "text-slate-600 hover:text-primary" : "text-white hover:text-primary"
              }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed top-24 inset-x-4 z-[60] glass-card rounded-3xl p-8 border-primary/10"
          >
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xl font-black text-slate-800 flex justify-between items-center group"
                >
                  {link.name} <ArrowRight className="opacity-0 group-hover:opacity-100 transition-all text-primary" size={20} />
                </Link>
              ))}
              <div className="h-px bg-slate-100 my-2" />
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xl font-black text-slate-800 flex justify-between items-center group"
              >
                Patient Login <ArrowRight className="opacity-0 group-hover:opacity-100 transition-all text-primary" size={20} />
              </Link>
              <Link
                to="/patient/book-appointment"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-primary text-white py-4 rounded-2xl font-bold text-center shadow-lg shadow-primary/20"
              >
                Schedule Visit
              </Link>
            </nav>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <main className="flex-1 pt-2">
        <Outlet />
      </main>

      {/* 💎 Premium Footer */}
      <footer className="bg-slate-900 text-white relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            {/* Brand Block */}
            <div className="space-y-8">
              <Logo showText={true} forceLight={true} className="hover:opacity-80 transition-opacity" />
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                Pioneering the future of healthcare through bespoke digital ecosystems and unmatched clinical precision.
              </p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
                    <Icon size={18} />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Experience */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-8">Navigation</h4>
              <ul className="space-y-4">
                {navLinks.map((l) => (
                  <li key={l.path}>
                    <Link to={l.path} className="text-slate-300 hover:text-white hover:translate-x-2 transition-all flex items-center gap-2 group">
                      <div className="w-1 h-1 bg-primary rounded-full group-hover:scale-150 transition-all" />
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct Channel */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-8">Contact Channel</h4>
              <div className="space-y-6">
                <div className="group">
                  <p className="text-[10px] uppercase font-black text-slate-500 mb-1 group-hover:text-primary transition-colors">Headquarters</p>
                  <p className="text-slate-300 font-medium">Clinixa smart hospital,<br />Priyansh Technologies Hyderabad</p>
                </div>
                <div className="group">
                  <p className="text-[10px] uppercase font-black text-slate-500 mb-1 group-hover:text-primary transition-colors">Direct Desk</p>
                  <p className="text-slate-300 font-medium">+91 9128521728</p>
                </div>
                <div className="group">
                  <p className="text-[10px] uppercase font-black text-slate-500 mb-1 group-hover:text-primary transition-colors">Digital Mail</p>
                  <p className="text-slate-300 font-medium tracking-tight">contact@clinixa.life</p>
                </div>
              </div>
            </div>

            {/* Trust Certification */}
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <ShieldCheck className="text-primary mb-4" size={32} />
              <h4 className="text-sm font-black mb-2">Patient Privacy First</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                All data is encrypted with enterprise-grade protocols to ensure absolute confidentiality.
              </p>
              <div className="bg-primary/10 text-primary text-[10px] font-black py-2 px-4 rounded-full inline-block border border-primary/20">
                HIPAA COMPLIANT
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black text-slate-500 tracking-widest uppercase">
          <span>© {new Date().getFullYear()} Clinixa Health Ecosystem</span>
          <div className="flex gap-8">
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Care</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Shield</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
