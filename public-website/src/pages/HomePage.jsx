import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Star, Shield, Activity, Users, Award, Heart, MousePointer2, Plus } from "lucide-react";

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

const HomePage = () => {
  return (
    <div className="overflow-x-hidden selection:bg-primary/30">
      {/* 🚀 ULTIMATE HERO SECTION */}
      <section className="relative min-h-[95vh] flex items-center bg-slate-950 px-6 pt-32">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-primary/40 rounded-full blur-[150px]"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }}
            transition={{ duration: 15, repeat: Infinity, delay: 2 }}
            className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-accent/30 rounded-full blur-[120px]"
          />
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-8 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-accent status-pulsate" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-accent">Clinical Excellence Redefined</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-10 tracking-tighter">
              Your Health, <br />
              <span className="text-gradient drop-shadow-2xl">Our Priority.</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl text-slate-400 mb-12 leading-relaxed max-w-xl font-medium">
              Clinixa integrates cutting-edge medical technologies with human-centric empathy to deliver healthcare that isn't just treatment—it's transformation.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-6 items-center">
              <Link
                to="/patient/book-appointment"
                className="btn-premium group relative bg-primary text-white p-1 rounded-3xl"
              >
                <div className="bg-primary group-hover:bg-teal-700 transition-colors px-10 py-5 rounded-[22px] flex items-center gap-4">
                  <span className="text-lg font-black uppercase tracking-widest">Book Appointment</span>
                  <Plus className="group-hover:rotate-90 transition-transform duration-500" />
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
            </motion.div>
          </motion.div>

          {/* 🧩 Unique 3D Composition */}
          <div className="relative h-[600px] hidden lg:flex items-center justify-center">
            {/* Main Visual */}
            <motion.div
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
            </motion.div>

            {/* Feature List Card - Centered and Transparent */}
            <motion.div
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
            </motion.div>


          </div>
        </div>
      </section>

      {/* 📊 LIVE METRICS (Bespoke Stats) */}
      <section className="py-32 relative bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { num: "99%", label: "Clinical Accuracy", icon: Shield },
              { num: "24/7", label: "Real-time Support", icon: Clock },
              { num: "500+", label: "Elite Specialists", icon: Award },
              { num: "12k+", label: "Transformations", icon: Users }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 rounded-3xl hover:bg-slate-50 transition-all duration-500 border border-transparent hover:border-slate-100"
              >
                <stat.icon className="text-primary/20 group-hover:text-primary transition-colors mb-6" size={32} />
                <h3 className="text-5xl font-black text-slate-900 tracking-tighter mb-2 group-hover:scale-110 origin-left transition-transform">{stat.num}</h3>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-600 transition-colors">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🧬 CLINICAL EXCELLENCE (Services Overhaul) */}
      <section className="py-40 bg-slate-50 relative overflow-hidden">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                title: "General Medicine",
                head: "Dr. Rajesh Sharma",
                headImg: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop",
                icon: Users,
                img: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?q=80&w=800&auto=format&fit=crop",
                stats: "97% Patient Satisfaction",
                staff: "32",
                beds: "60",
                theme: "from-emerald-600/20"
              },
              {
                title: "Regenerative Cardiology",
                head: "Dr. Arun Kumar",
                headImg: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop",
                icon: Activity,
                img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
                stats: "98% Precision",
                staff: "24",
                beds: "45",
                theme: "from-red-600/20"
              },
              {
                title: "Neural Precision",
                head: "Dr. John Doe",
                headImg: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=200&auto=format&fit=crop",
                icon: Award,
                img: "https://images.unsplash.com/photo-1659353888352-5dbb14b80eca?fm=jpg&q=60&w=3000",
                stats: "95% Accuracy",
                staff: "15",
                beds: "20",
                theme: "from-indigo-600/20"
              },
              {
                title: "Pediatric Wellness",
                head: "Dr. Sarah Paul",
                headImg: "https://images.unsplash.com/photo-1594824813573-c10fe5a09848?q=80&w=200&auto=format&fit=crop",
                icon: Heart,
                img: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?q=80&w=800&auto=format&fit=crop",
                stats: "99% Care Rate",
                staff: "18",
                beds: "30",
                theme: "from-cyan-600/20"
              },
              {
                title: "Orthopedic Surgery",
                head: "Dr. Michael Chen",
                headImg: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200&auto=format&fit=crop",
                icon: Shield,
                img: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=800&auto=format&fit=crop",
                stats: "96% Recovery Rate",
                staff: "22",
                beds: "35",
                theme: "from-blue-600/20"
              },
              {
                title: "Oncology Excellence",
                head: "Dr. Priya Patel",
                headImg: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?q=80&w=200&auto=format&fit=crop",
                icon: Star,
                img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=800&auto=format&fit=crop",
                stats: "94% Success Rate",
                staff: "28",
                beds: "40",
                theme: "from-purple-600/20"
              }
            ].map((dept, i) => (
              <motion.div
                key={dept.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                className="group relative h-[650px] rounded-[60px] overflow-hidden shadow-2xl bg-slate-900"
              >
                {/* 📸 High-Impact Background Image */}
                <img
                  src={dept.img}
                  alt={dept.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out opacity-60 group-hover:opacity-80"
                />

                {/* Deep Gradient & Theme Glow */}
                <div className={`absolute inset-0 bg-gradient-to-t ${dept.theme} via-slate-950/60 to-transparent opacity-90 transition-opacity duration-500`} />

                {/* 🧪 Floating Content - Professional Glass Panel */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  {/* Top Bar: Icon & Status */}
                  <div className="flex justify-between items-center">
                    <div className="w-16 h-16 rounded-[2rem] bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center text-white shadow-2xl group-hover:bg-primary transition-all duration-500">
                      <dept.icon size={28} />
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Active Ecosystem</p>
                    </div>
                  </div>

                  {/* Bottom: Glass Details Section */}
                  <div className="relative">
                    {/* Head Doctor Reveal Card */}
                    <motion.div
                      className="absolute -top-24 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 group-hover:-top-28 transition-all duration-700 delay-100"
                    >
                      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-4 rounded-[2.5rem] flex items-center gap-4 shadow-3xl">
                        <div className="relative">
                          <img src={dept.headImg} alt={dept.head} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/20" />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900" />
                        </div>
                        <div className="pr-4">
                          <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-0.5">Department Head</p>
                          <p className="text-white font-bold text-sm tracking-tight">{dept.head}</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Main Glass Panel */}
                    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 overflow-hidden relative group-hover:bg-white/10 transition-all duration-500">
                      <div className="relative z-10">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight leading-tight group-hover:text-primary transition-colors">{dept.title}</h3>

                        <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8 mb-4">
                          <div className="space-y-1">
                            <p className="text-2xl font-black text-white group-hover:scale-110 origin-left transition-transform">{dept.staff}</p>
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Total Specialists</p>
                          </div>
                          <div className="space-y-1 text-right">
                            <p className="text-2xl font-black text-white group-hover:scale-110 origin-right transition-transform">{dept.beds}</p>
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Available Beds</p>
                          </div>
                        </div>

                        {/* Professional CTA */}
                        <div className="pt-6 border-t border-white/10 flex items-center justify-between group/link">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover/link:text-primary transition-colors">Analytical Review</span>
                          <Link to="/departments" className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest">
                            Explore <ArrowRight size={14} className="group-hover/link:translate-x-2 transition-transform text-primary" />
                          </Link>
                        </div>
                      </div>

                      {/* Animated Glow on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🖤 HUMAN CENTRIC EXPERIENCE (CTA Overhaul) */}
      <section className="py-40 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <motion.div
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
              ].map((item, i) => (
                <motion.div
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
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 💎 SIGNATURE CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto h-[600px] rounded-[60px] bg-primary relative overflow-hidden flex items-center justify-center text-center">
          {/* Dynamic Background */}
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/20 rounded-full blur-[100px]"
          />

          <div className="relative z-10 p-8 max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-12 leading-none"
            >
              Experience the <br />Future Today.
            </motion.h2>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link to="/patient/book-appointment" className="bg-white text-primary px-12 py-6 rounded-[30px] font-black uppercase tracking-widest text-lg hover:scale-105 transition-all shadow-2xl">
                Book Instant Visit
              </Link>
              <Link to="/login" className="px-12 py-6 rounded-[30px] border-2 border-white/30 text-white font-black uppercase tracking-widest text-lg hover:bg-white hover:text-primary transition-all">
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
