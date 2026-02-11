import { motion } from "framer-motion";
import { Activity, Brain, Baby, Bone, Eye, HeartPulse, Stethoscope, Microscope } from "lucide-react";
import { Link } from "react-router-dom";

const departments = [
  {
    name: "Cardiology",
    icon: HeartPulse,
    desc: "Leading heart care with advanced imaging & surgery.",
    img: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=800&auto=format&fit=crop",
    head: "Dr. Vikram Sethi",
    stats: { success: "98%", patients: "5k+", beds: "40" },
    procedures: ["TAVI/TAVR", "Bypass", "Pacemaker"],
    tech: "Hybrid Cath Lab"
  },
  {
    name: "Neurology",
    icon: Brain,
    desc: "Comprehensive brain & spine disorder treatments.",
    img: "https://images.unsplash.com/photo-1559757131-408743e8d265?q=80&w=800&auto=format&fit=crop",
    head: "Dr. Ananya Rao",
    stats: { success: "95%", patients: "3k+", beds: "25" },
    procedures: ["Microdiscectomy", "Tumor Resection"],
    tech: "3T MRI & CT"
  },
  {
    name: "Pediatrics",
    icon: Baby,
    desc: "Specialized care for infants to adolescents.",
    img: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=800&auto=format&fit=crop",
    head: "Dr. Sarah Smith",
    stats: { success: "99%", patients: "8k+", beds: "35" },
    procedures: ["Neonatology", "Immunizations"],
    tech: "Level III NICU"
  },
  {
    name: "Orthopedics",
    icon: Bone,
    desc: "Joint replacements, sports medicine, and trauma care.",
    img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop",
    head: "Dr. Robert Jones",
    stats: { success: "97%", patients: "4k+", beds: "30" },
    procedures: ["Knee Replace", "ACL Repair"],
    tech: "Robot-Assisted Surgery"
  },
  {
    name: "Ophthalmology",
    icon: Eye,
    desc: "Advanced eye care, laser surgeries, and vision correction.",
    img: "https://images.unsplash.com/photo-1579165466741-7f35a4755657?q=80&w=800&auto=format&fit=crop",
    head: "Dr. Emily Chen",
    stats: { success: "99%", patients: "10k+", beds: "15" },
    procedures: ["LASIK", "Cataract Surgery"],
    tech: "IntraLase Femtosecond"
  },
  {
    name: "Emergency Medicine",
    icon: Activity,
    desc: "24/7 critical care and rapid response coordination.",
    img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop",
    head: "Dr. Mark Wilson",
    stats: { success: "100%", patients: "15k+", beds: "50" },
    procedures: ["Trauma Care", "Resuscitation"],
    tech: "Critical Care Transport"
  },
];

const DepartmentsPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-slate-950 text-white pt-36 pb-20 text-center relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <h1 className="text-4xl font-bold mb-4 relative z-10">Our Departments</h1>
        <p className="text-teal-100 max-w-2xl mx-auto px-4 relative z-10">
          Explore our specialized medical departments staffed by world-class experts.
        </p>
      </section>

      <div className="container mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {departments.map((dept, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[40px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group border border-slate-100 flex flex-col md:flex-row"
            >
              <div className="md:w-1/2 h-72 md:h-auto relative overflow-hidden">
                <img src={dept.img} alt={dept.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-transparent"></div>
                <div className="absolute top-6 left-6">
                  <div className="bg-primary p-3 rounded-2xl text-white shadow-lg">
                    <dept.icon size={24} />
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 p-8 flex flex-col">
                <div className="flex-grow">
                  <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">{dept.name}</h3>
                  <p className="text-primary font-bold text-[10px] uppercase tracking-widest mb-4">Led by {dept.head}</p>

                  <div className="grid grid-cols-3 gap-4 mb-6 border-b border-slate-100 pb-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Success</p>
                      <p className="text-slate-900 font-bold">{dept.stats.success}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Patients</p>
                      <p className="text-slate-900 font-bold">{dept.stats.patients}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Beds</p>
                      <p className="text-slate-900 font-bold">{dept.stats.beds}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Key Procedures</p>
                      <div className="flex flex-wrap gap-2">
                        {dept.procedures.map(p => (
                          <span key={p} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{p}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Technology</p>
                      <p className="text-xs font-bold text-slate-800">{dept.tech}</p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/patient/book-appointment"
                  className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl hover:bg-primary transition-all shadow-lg active:scale-95"
                >
                  Book Consultation <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentsPage;
