import { motion } from "framer-motion";
import { Activity, Brain, Baby, Bone, Eye, HeartPulse, Stethoscope, Microscope } from "lucide-react";
import { Link } from "react-router-dom";

const departments = [
  { name: "Cardiology", icon: HeartPulse, desc: "Leading heart care with advanced imaging & surgery.", img: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=800&auto=format&fit=crop" },
  { name: "Neurology", icon: Brain, desc: "Comprehensive brain & spine disorder treatments.", img: "https://images.unsplash.com/photo-1559757131-408743e8d265?q=80&w=800&auto=format&fit=crop" },
  { name: "Pediatrics", icon: Baby, desc: "Specialized care for infants to adolescents.", img: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=800&auto=format&fit=crop" },
  { name: "Orthopedics", icon: Bone, desc: "Joint replacements, sports medicine, and trauma care.", img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop" },
  { name: "Ophthalmology", icon: Eye, desc: "Advanced eye care, laser surgeries, and vision correction.", img: "https://images.unsplash.com/photo-1579165466741-7f35a4755657?q=80&w=800&auto=format&fit=crop" },
  { name: "General Medicine", icon: Stethoscope, desc: "Primary care, diagnostics, and preventive health.", img: "https://images.unsplash.com/photo-1666214280157-c603db711811?q=80&w=800&auto=format&fit=crop" },
];

const DepartmentsPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-primary text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Our Departments</h1>
        <p className="text-teal-100 max-w-2xl mx-auto px-4">
          Explore our specialized medical departments staffed by world-class experts.
        </p>
      </section>

      <div className="container mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 group"
            >
              <div className="h-56 relative overflow-hidden">
                <img src={dept.img} alt={dept.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white flex items-center gap-2">
                  <div className="bg-secondary p-2 rounded-lg text-black">
                    <dept.icon size={20} />
                  </div>
                  <h3 className="text-xl font-bold">{dept.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6">{dept.desc}</p>
                <Link
                  to="/patient/book-appointment"
                  className="block w-full text-center border-2 border-primary text-primary font-bold py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  Book Consultation
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
