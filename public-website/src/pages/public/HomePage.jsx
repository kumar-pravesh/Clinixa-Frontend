import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Star, Shield, Activity, Users, Award, Heart, MousePointer2, Plus, Stethoscope, Microscope, HeartPulse, Brain, Baby, Bone, Eye } from "lucide-react";
import { patientService } from "../../services/patientService";

const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionH2 = motion.h2;
const MotionP = motion.p;

// 🌀 Unique Motion Signatures
const floatSide = {
  animate: {
    y: [0, -20, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const iconMap = {
  "Cardiology": HeartPulse,
  "Neurology": Brain,
  "Pediatrics": Baby,
  "Orthopedics": Bone,
  "Ophthalmology": Eye,
  "Emergency": Activity,
  "General": Stethoscope,
  "Lab": Microscope
};

const departmentImageMap = {
  "Cardio": "https://images.unsplash.com/photo-1530026405186-ed1f139313f3?q=80&w=800&auto=format&fit=crop",
  "Neuro": "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=800&auto=format&fit=crop",
  "Pediatr": "https://images.unsplash.com/photo-1504439904031-93ded9f93e4e?q=80&w=800&auto=format&fit=crop",
  "Orthop": "https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=800&auto=format&fit=crop",
  "Ophthalm": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop",
  "Dermat": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
  "Gynec": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
  "Emerg": "https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=800&auto=format&fit=crop",
  "Surgeon": "https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=800&auto=format&fit=crop",
  "General": "https://images.unsplash.com/photo-1666214280577-5d9e8e7e0e4c?q=80&w=800&auto=format&fit=crop",
  "Lab": "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=800&auto=format&fit=crop"
};

const getImageUrl = (url) => {
  if (!url) return null;
  return url.startsWith('http') ? url : `http://localhost:5000/${url}`;
};

const getDeptImage = (name) => {
  if (!name) return "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop";
  for (const key in departmentImageMap) {
    if (name.toLowerCase().includes(key.toLowerCase())) return departmentImageMap[key];
  }
  return "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop";
};

const getIcon = (name) => {
  if (!name) return Activity;
  for (const key in iconMap) {
    if (name.includes(key)) return iconMap[key];
  }
  return Activity;
};

const moduleMap = [
  { border: "border-emerald-500/20", accent: "text-emerald-400", bg: "bg-emerald-500/10", glow: "emerald" },
  { border: "border-sky-500/20", accent: "text-sky-400", bg: "bg-sky-500/10", glow: "sky" },
  { border: "border-orange-500/20", accent: "text-accent", bg: "bg-orange-500/10", glow: "orange" },
  { border: "border-indigo-500/20", accent: "text-indigo-400", bg: "bg-indigo-500/10", glow: "indigo" },
  { border: "border-purple-500/20", accent: "text-purple-400", bg: "bg-purple-500/10", glow: "purple" },
  { border: "border-rose-500/20", accent: "text-rose-400", bg: "bg-rose-500/10", glow: "rose" }
];

const HomePage = () => {
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState({
    accuracy: "99%",
    support: "24/7",
    doctors: "500+",
    transformations: "12k+"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔍 Fetching public data...');
        const [deptsData, statsData] = await Promise.all([
          patientService.getPublicDepartments(),
          patientService.getPublicStats()
        ]);

        console.log('✅ Data fetched:', { deptsData, statsData });
        setDepartments(deptsData.slice(0, 6));
        setStats(statsData);
      } catch (err) {
        console.error("❌ Failed to fetch public data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="overflow-x-hidden selection:bg-primary/30">
      {/* 🚀 ULTIMATE HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center bg-slate-950 px-6 pt-24 pb-12">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <MotionDiv
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-primary/40 rounded-full blur-[150px]"
          />
          <MotionDiv
            animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }}
            transition={{ duration: 15, repeat: Infinity, delay: 2 }}
            className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-accent/30 rounded-full blur-[120px]"
          />
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <MotionDiv
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <MotionDiv variants={fadeInUp} className="inline-flex items-center gap-2 mb-8 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-accent status-pulsate" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-accent">Clinical Excellence Redefined</span>
            </MotionDiv>

            <MotionH1 variants={fadeInUp} className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-10 tracking-tighter">
              Your Health, <br />
              <span className="text-gradient drop-shadow-2xl">Our Priority.</span>
            </MotionH1>

            <MotionP variants={fadeInUp} className="text-xl text-slate-400 mb-12 leading-relaxed max-w-xl font-medium">
              At Clinixa, we believe healthcare should feel personal, clear, and reliable.
              We combine advanced medical technology with compassionate care to support you at every step from diagnosis to recovery.

              Our focus is simple: listen carefully, treat responsibly, and care completely.

            </MotionP>

            <MotionDiv variants={fadeInUp} className="flex flex-wrap gap-4 items-center">
              <Link
                to="/patient/book-appointment"
                className="btn-premium group relative bg-primary text-white p-1 rounded-3xl"
              >
                <div className="bg-primary group-hover:bg-teal-700 transition-colors px-8 py-4 rounded-[22px] flex items-center gap-3">
                  <span className="text-base font-black uppercase tracking-widest">Book Appointment</span>
                  <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                </div>
              </Link>

              <Link
                to="/doctors"
                className="group flex items-center gap-4 text-white hover:text-primary transition-all p-2"
              >
                <div className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center group-hover:scale-110 transition-all font-black text-xs p-1">
                  <Users size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase font-black tracking-widest text-slate-500 mb-0.5 group-hover:text-primary transition-colors">Our Specialists</p>
                  <p className="font-bold text-sm">Meet the Elite Team</p>
                </div>
              </Link>
            </MotionDiv>
          </MotionDiv>

          {/* 🧩 Unique 3D Composition */}
          <div className="relative h-[600px] hidden lg:flex items-center justify-center">
            {/* Main Visual */}
            <MotionDiv
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-full h-full"
            >
              <img
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1600&auto=format&fit=crop"
                alt="Premium Clinical Care"
                className="w-full h-full object-cover rounded-[80px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent rounded-[60px]" />
            </MotionDiv>

            {/* Feature List Card - Centered and Transparent */}
            <MotionDiv
              variants={floatSide}
              animate="animate"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-card p-8 rounded-[2.5rem] border-white/10 shadow-2xl backdrop-blur-2xl w-full max-w-[320px] bg-white/5"
            >
              <div className="space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-orange-500/80 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 backdrop-blur-md">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-white leading-tight mb-1">24/7 Service</p>
                    <p className="text-sm font-medium text-slate-300">Emergency Care Always Open</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-primary/80 flex items-center justify-center text-white shadow-lg shadow-primary/20 backdrop-blur-md">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-white leading-tight mb-1">Expert Doctors</p>
                    <p className="text-sm font-medium text-slate-300">Qualified Specialists</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-cyan-400/80 flex items-center justify-center text-white shadow-lg shadow-cyan-400/20 backdrop-blur-md">
                    <Shield size={24} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-white leading-tight mb-1">Best Technology</p>
                    <p className="text-sm font-medium text-slate-300">Advanced Lab & Diagnostics</p>
                  </div>
                </div>
              </div>
            </MotionDiv>


          </div>
        </div>
      </section>

      {/* 📊 CLINICAL NERVE CENTER (Redesigned Metrics) */}
      <section className="py-24 relative bg-white overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #0D9488 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <MotionDiv variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="inline-flex items-center gap-2 mb-6 bg-primary/5 px-6 py-2 rounded-full border border-primary/10">
              <Activity size={14} className="text-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Live Clinical Ecosystem</span>
            </MotionDiv>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
              Our Clinical <span className="text-gradient">Nerve Center.</span>
            </h2>
            <p className="text-slate-500 max-w-2xl font-medium">
              Real-time monitoring and advanced medical analytics driving precision healthcare delivery across our global network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 🛡️ Card 01: Surgical Precision */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative p-8 rounded-[48px] bg-slate-950 border-2 border-slate-900 hover:border-emerald-500/30 transition-all duration-700 overflow-hidden shadow-2xl"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Shield size={28} />
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active Matrix</span>
                  </div>
                </div>
                <h3 className="text-5xl font-black text-white tracking-tighter mb-2 group-hover:text-emerald-400 transition-colors uppercase">{stats.accuracy}</h3>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Clinical Accuracy</p>
                <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[8px] font-bold text-white">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">Elite Surgeons Live</span>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] group-hover:bg-emerald-500/10 transition-all" />
            </MotionDiv>

            {/* 🤖 Card 02: Neural Analytics */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="group relative p-8 rounded-[48px] bg-slate-950 border-2 border-slate-900 hover:border-sky-500/30 transition-all duration-700 overflow-hidden shadow-2xl"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400">
                    <Brain size={28} />
                  </div>
                  <div className="flex items-center gap-2 bg-sky-500/10 px-3 py-1 rounded-full">
                    <span className="text-[9px] font-black text-sky-500 uppercase tracking-widest">AI Hub</span>
                  </div>
                </div>
                <h3 className="text-5xl font-black text-white tracking-tighter mb-2 group-hover:text-sky-400 transition-colors uppercase">98.4%</h3>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Neural Precision</p>

                {/* Visual AI Waveform Placeholder */}
                <div className="h-10 flex items-end gap-1 mb-2 opacity-30 group-hover:opacity-60 transition-opacity">
                  {[...Array(12)].map((_, i) => (
                    <MotionDiv
                      key={i}
                      animate={{ height: [10, 40, 10] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                      className="w-full bg-sky-500/40 rounded-t-sm"
                    />
                  ))}
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-[50px] group-hover:bg-sky-500/10 transition-all" />
            </MotionDiv>

            {/* 💓 Card 03: Cardiac Vitals */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="group relative p-8 rounded-[48px] bg-slate-900 border-2 border-slate-800 hover:border-accent/30 transition-all duration-700 overflow-hidden shadow-2xl"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    <HeartPulse size={28} />
                  </div>
                  <div className="flex items-center gap-2 bg-accent/10 px-3 py-1 rounded-full">
                    <span className="text-[9px] font-black text-accent uppercase tracking-widest leading-none">Vitals Sync</span>
                  </div>
                </div>
                <h3 className="text-5xl font-black text-white tracking-tighter mb-2 group-hover:text-accent transition-colors uppercase">{stats.support}</h3>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Emergency Uptime</p>

                {/* 🏥 Animated ECG Line */}
                <div className="h-12 w-full relative">
                  <svg viewBox="0 0 100 20" className="w-full h-full text-accent opacity-40 group-hover:opacity-100 transition-opacity">
                    <MotionDiv
                      as="path"
                      d="M0,10 L30,10 L35,2 L45,18 L50,10 L100,10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1, pathOffset: [0, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </svg>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[50px] group-hover:bg-accent/10 transition-all" />
            </MotionDiv>

            {/* 🏥 Card 04: Rapid Response */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="group relative p-8 rounded-[48px] bg-slate-950 border-2 border-slate-900 hover:border-indigo-500/30 transition-all duration-700 overflow-hidden shadow-2xl"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Activity size={28} />
                  </div>
                  <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                    <span className="text-[9px] font-black text-red-500 uppercase tracking-widest leading-none">Emergency Live</span>
                  </div>
                </div>
                <h3 className="text-5xl font-black text-white tracking-tighter mb-2 group-hover:text-indigo-400 transition-colors uppercase">{stats.transformations}</h3>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Patient Success</p>
                <div className="flex gap-1.5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`w-3 h-1.5 rounded-full ${i < 4 ? 'bg-indigo-500' : 'bg-slate-800'}`} />
                  ))}
                  <span className="text-[9px] font-bold text-slate-400 ml-2">94% Retention</span>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] group-hover:bg-indigo-500/10 transition-all" />
            </MotionDiv>
          </div>
        </div>
      </section>

      {/* 🧬 CLINICAL EXCELLENCE (Services Overhaul) */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Floating Numbers Decoration */}
        <div className="absolute top-0 right-0 text-[300px] font-black leading-none opacity-[0.02] translate-x-1/2 -translate-y-1/2 pointer-events-none">01</div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-24">
            <div className="max-w-xl">
              <span className="text-accent font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Our Specializations</span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                Pioneering Interventions in <span className="text-primary italic">Modern Medicine.</span>
              </h2>
            </div>
            <Link to="/departments" className="group flex items-center gap-3 text-slate-900 font-black uppercase tracking-widest text-xs py-4 px-8 border-2 border-slate-900 rounded-2xl hover:bg-slate-900 hover:text-white transition-all">
              View All Departments <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept, i) => {
              const Icon = getIcon(dept.name);
              const module = moduleMap[i % moduleMap.length];

              return (
                <MotionDiv
                  key={dept.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className={`group relative h-[560px] rounded-[48px] overflow-hidden shadow-2xl bg-slate-950 border-2 border-slate-900 hover:${module.border} transition-all duration-700`}
                >
                  {/* 📸 Background Image with Dark Overlay */}
                  <img
                    src={getImageUrl(dept.image_url) || getDeptImage(dept.name)}
                    alt={dept.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out opacity-40 group-hover:opacity-60"
                  />

                  {/* Medical Grid Overlay */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                  {/* Gradient Depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Content Container */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    {/* Top Bar */}
                    <div className="flex justify-between items-start leading-none">
                      <div className={`w-14 h-14 rounded-2xl ${module.bg} backdrop-blur-xl border border-white/5 flex items-center justify-center ${module.accent} shadow-2xl group-hover:scale-110 transition-all duration-500`}>
                        <Icon size={26} />
                      </div>
                      <div className="flex flex-col items-end gap-1.5 pt-1">
                        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 leading-none">
                          <div className={`w-1.5 h-1.5 rounded-full ${module.accent.replace('text-', 'bg-')} animate-pulse`} />
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/90">Clinical Module</span>
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 mr-2">Module 0{i + 1}</span>
                      </div>
                    </div>

                    {/* Bottom Details */}
                    <div className="relative">
                      {/* Doctor Link Card */}
                      <MotionDiv className="absolute -top-20 left-0 right-0 opacity-0 group-hover:opacity-100 group-hover:-top-24 transition-all duration-500 flex justify-center">
                        <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/5 p-3 rounded-full flex items-center gap-3 shadow-2xl pr-6">
                          <div className={`w-10 h-10 rounded-full ${module.bg} flex items-center justify-center text-white font-black text-sm`}>
                            {dept.head?.charAt(0) || 'D'}
                          </div>
                          <div>
                            <p className="text-[8px] font-black uppercase text-slate-500 tracking-tighter mb-0.5">Principal Lead</p>
                            <p className="text-white font-bold text-xs leading-none">{dept.head || 'Board Specialist'}</p>
                          </div>
                        </div>
                      </MotionDiv>

                      {/* Info Panel */}
                      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 overflow-hidden group-hover:bg-white/10 transition-all duration-500">
                        <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight group-hover:text-primary transition-colors">{dept.name}</h3>

                        <div className="grid grid-cols-2 gap-6 border-t border-white/5 pt-6">
                          <div>
                            <p className="text-2xl font-black text-white">{dept.doctor_count || dept.staff || 0}</p>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Specialists</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-white">{dept.beds || 0}</p>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Unit Capacity</p>
                          </div>
                        </div>

                        <Link to="/departments" className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between group/btn">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover/btn:text-white transition-colors">Analytical Review</span>
                          <ArrowRight size={16} className="text-primary group-hover/btn:translate-x-2 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </MotionDiv>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🖤 HUMAN CENTRIC EXPERIENCE (CTA Overhaul) */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <MotionDiv
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -left-20 w-[400px] h-[400px] border border-primary/10 rounded-full"
            />
            <img
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop"
              alt="Medical Consultation"
              className="relative z-10 w-full h-[600px] object-cover rounded-[60px] shadow-3xl grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />
          </div>

          <div className="space-y-12">
            <div>
              <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Care Delivery Model</span>
              <h2 className="text-6xl font-black text-slate-900 tracking-tighter leading-none mb-8">
                Medicine Made <span className="text-gradient">Personal.</span>
              </h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg mb-12">
                We believe that true healing begins when technology meets empathy. Our patient portal is designed to put control back in your hands.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {[
                { title: "Bespoke Portals", desc: "Role-specific interfaces for doctors and patients ensuring clarity.", icon: MousePointer2 },
                { title: "Encrypted Records", desc: "Military-grade security protocols for your sensitive health data.", icon: Shield },
                { title: "Real-time Sync", desc: "Instant notifications and updates on your clinical progress.", icon: Activity }
              ].map((item) => (
                <MotionDiv
                  key={item.title}
                  whileHover={{ x: 10 }}
                  className="flex gap-6 items-start"
                >
                  <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-primary group hover:bg-primary hover:text-white transition-all">
                    <item.icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">{item.title}</h3>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xs">{item.desc}</p>
                  </div>
                </MotionDiv>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 💎 SIGNATURE CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto h-[500px] rounded-[50px] bg-primary relative overflow-hidden flex items-center justify-center text-center">
          {/* Dynamic Background */}
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <MotionDiv
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/20 rounded-full blur-[100px]"
          />

          <div className="relative z-10 p-8 max-w-3xl">
            <MotionH2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-10 leading-none"
            >
              Experience the <br />Future Today.
            </MotionH2>
            <div className="flex wrap items-center justify-center gap-6">
              <Link to="/patient/book-appointment" className="bg-white text-primary px-10 py-5 rounded-[25px] font-black uppercase tracking-widest text-base hover:scale-105 transition-all shadow-2xl">
                Book Instant Visit
              </Link>
              <Link to="/login" className="px-10 py-5 rounded-[25px] border-2 border-white/30 text-white font-black uppercase tracking-widest text-base hover:bg-white hover:text-primary transition-all">
                Access Portal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
