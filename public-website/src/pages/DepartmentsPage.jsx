import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Brain, Baby, Bone, Eye, HeartPulse, Stethoscope, Microscope, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { patientService } from "../services/patientService";

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

const getIcon = (name) => {
  for (const key in iconMap) {
    if (name.includes(key)) return iconMap[key];
  }
  return Activity;
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
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-slate-950 text-white pt-44 pb-20 text-center relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <h1 className="text-4xl font-bold mb-4 relative z-10">Our Departments</h1>
        <p className="text-teal-100 max-w-2xl mx-auto px-4 relative z-10">
          Explore our specialized medical departments staffed by world-class experts.
        </p>
      </section>

      <div className="container mx-auto px-6 mt-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {departments.map((dept, i) => {
              const Icon = getIcon(dept.name);
              const procedures = dept.procedures ? dept.procedures.split(',').map(p => p.trim()) : [];

              return (
                <MotionDiv
                  key={dept.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-[40px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group border border-slate-100 flex flex-col md:flex-row"
                >
                  <div className="md:w-1/2 h-72 md:h-auto relative overflow-hidden">
                    <img
                      src={dept.image_url || "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop"}
                      alt={dept.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-transparent"></div>
                    <div className="absolute top-6 left-6">
                      <div className="bg-primary p-3 rounded-2xl text-white shadow-lg">
                        <Icon size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="md:w-1/2 p-8 flex flex-col">
                    <div className="flex-grow">
                      <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">{dept.name}</h3>
                      <p className="text-primary font-bold text-[10px] uppercase tracking-widest mb-4">Led by {dept.head || 'Elite Specialist'}</p>

                      <div className="grid grid-cols-3 gap-4 mb-6 border-b border-slate-100 pb-6">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Success</p>
                          <p className="text-slate-900 font-bold">{dept.success_rate || '95%'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Patients</p>
                          <p className="text-slate-900 font-bold">{dept.patients || '1k+'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Beds</p>
                          <p className="text-slate-900 font-bold">{dept.beds || '20'}</p>
                        </div>
                      </div>

                      <div className="space-y-4 mb-8">
                        {procedures.length > 0 && (
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Key Procedures</p>
                            <div className="flex flex-wrap gap-2">
                              {procedures.map(p => (
                                <span key={p} className="text-[10px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{p}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {dept.tech && (
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Technology</p>
                            <p className="text-xs font-bold text-slate-800">{dept.tech}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <Link
                      to="/patient/book-appointment"
                      className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl hover:bg-primary transition-all shadow-lg active:scale-95"
                    >
                      Book Consultation <ArrowRight size={16} />
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
