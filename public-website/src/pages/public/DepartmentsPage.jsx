import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Brain, Baby, Bone, Eye, HeartPulse, Stethoscope, Microscope, ArrowRight, Server, Shield, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { patientService } from "../../services/patientService";

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

const getImageUrl = (url) => {
  if (!url) return null;
  return url.startsWith('http') ? url : `http://localhost:5000/${url}`;
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
  { border: "border-emerald-500/20", accent: "text-emerald-400", bg: "bg-emerald-500/10" },
  { border: "border-sky-500/20", accent: "text-sky-400", bg: "bg-sky-500/10" },
  { border: "border-orange-500/20", accent: "text-accent", bg: "bg-orange-500/10" },
  { border: "border-indigo-500/20", accent: "text-indigo-400", bg: "bg-indigo-500/10" },
  { border: "border-purple-500/20", accent: "text-purple-400", bg: "bg-purple-500/10" },
  { border: "border-rose-500/20", accent: "text-rose-400", bg: "bg-rose-500/10" }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const MotionDiv = motion.div;

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const data = await patientService.getPublicDepartments();
        setDepartments(data);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepts();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* 🚀 CINEMATIC HEADER: Clinical Operations Hub */}
      <section className="bg-slate-950 text-white pt-32 pb-16 text-center relative overflow-hidden">
        {/* Animated Medical Grid Background */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/80" />

        <div className="container mx-auto px-6 relative z-10">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 mb-6 bg-white/5 backdrop-blur-md px-6 py-2 rounded-full border border-white/10"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">Clinical Operations Hub</span>
          </MotionDiv>

          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter leading-none">
            Our <span className="text-gradient">Specializations.</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto font-medium text-base leading-relaxed">
            Global healthcare matrix powered by advanced clinical intelligence and world-class specialists.
          </p>

          {/* Header Stats Bar */}
          <div className="flex justify-center flex-wrap gap-8 mt-10 pt-8 border-t border-white/5">
            <div className="flex items-center gap-3">
              <Shield className="text-primary" size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">ISO Certified</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="text-sky-400" size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">24/7 Global Sync</span>
            </div>
            <div className="flex items-center gap-3">
              <Server className="text-emerald-400" size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Neural Response</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 relative">
        {/* Decorative Grid for Content Area */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #0D9488 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        {loading ? (
          <div className="flex justify-center items-center py-40">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
            {departments.map((dept, i) => {
              const Icon = getIcon(dept.name);
              const module = moduleMap[i % moduleMap.length];
              const procedures = dept.procedures ? dept.procedures.split(',').map(p => p.trim()) : [];

              return (
                <MotionDiv
                  key={dept.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 2) * 0.1, duration: 0.8 }}
                  className="group relative flex flex-col md:flex-row bg-slate-950 rounded-[48px] overflow-hidden border-2 border-slate-900 hover:border-white/10 transition-all duration-700 shadow-2xl"
                >
                  {/* Image Section */}
                  <div className="md:w-5/12 h-80 md:h-auto relative overflow-hidden">
                    <img
                      src={getImageUrl(dept.image_url) || getDeptImage(dept.name)}
                      alt={dept.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-40 group-hover:opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Pulsing Status Overlay */}
                    <div className="absolute top-8 left-8">
                      <div className={`w-14 h-14 rounded-2xl ${module.bg} backdrop-blur-xl border border-white/10 flex items-center justify-center ${module.accent} shadow-2xl`}>
                        <Icon size={28} className="group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="md:w-7/12 p-10 flex flex-col relative">
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-4xl font-black text-white tracking-tighter leading-none group-hover:text-primary transition-colors">{dept.name}</h3>
                        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                          <div className={`w-1.5 h-1.5 rounded-full ${module.accent.replace('text-', 'bg-')} animate-pulse`} />
                          <span className="text-[8px] font-black uppercase tracking-widest text-white/60">Live Operational</span>
                        </div>
                      </div>

                      <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mb-8">Directed by <span className="text-white">{dept.head || 'Board Executive'}</span></p>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-3 gap-6 mb-8 pt-8 border-t border-white/5">
                        <div>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Success Rate</p>
                          <p className="text-white font-black text-xl">{dept.success_rate || '95.4%'}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Annual Cases</p>
                          <p className="text-white font-black text-xl">{dept.patients || '12k+'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Unit Beds</p>
                          <p className="text-white font-black text-xl">{dept.beds || '20'}</p>
                        </div>
                      </div>

                      {/* Technical Specs */}
                      <div className="space-y-6 mb-10">
                        {procedures.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {procedures.map(p => (
                              <span key={p} className="text-[9px] font-black text-slate-300 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 uppercase tracking-widest hover:bg-white/10 transition-colors">
                                {p}
                              </span>
                            ))}
                          </div>
                        )}
                        {dept.tech && (
                          <div className="flex items-center gap-3 bg-white/5 p-4 rounded-3xl border border-white/5">
                            <Server size={14} className="text-slate-500" />
                            <p className="text-[10px] font-bold text-slate-400 tracking-tight uppercase"><span className="text-white mr-2">Tech:</span> {dept.tech}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <Link
                      to="/patient/book-appointment"
                      className="group/btn flex items-center justify-center gap-3 w-full bg-white text-slate-950 font-black uppercase tracking-[0.2em] text-[10px] py-5 rounded-[24px] hover:bg-primary hover:text-white transition-all duration-500 shadow-2xl active:scale-95"
                    >
                      Establish Medical Link <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </MotionDiv>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentsPage;
