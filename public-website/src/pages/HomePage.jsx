import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Star, Shield, Activity, Users, Award } from "lucide-react";

// Animations
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const HomePage = () => {
  return (
    <div className="overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative h-[85vh] flex items-center bg-gray-900">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2000&auto=format&fit=crop")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-4">
              <span className="bg-secondary/20 text-secondary border border-secondary/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                World-Class Healthcare
              </span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Your Health,<br />
              <span className="text-secondary">Our Priority</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-gray-300 mb-8 leading-relaxed max-w-lg">
              Experience premier medical care with advanced technology and compassionate experts. We are dedicated to providing the best possible outcomes for every patient.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/patient/book-appointment"
                className="bg-accent text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-orange-500/50 hover:bg-orange-600 transition flex items-center justify-center gap-3 group"
              >
                Book Appointment <Activity className="group-hover:animate-pulse" />
              </Link>
              <Link
                to="/doctors"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition flex items-center justify-center"
              >
                Find a Doctor
              </Link>
            </motion.div>
          </motion.div>

          {/* Animated Float Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="hidden md:block"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl max-w-sm ml-auto shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-accent p-3 rounded-full text-white">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">24/7 Service</h3>
                  <p className="text-gray-300 text-sm">Emergency Care Always Open</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary p-3 rounded-full text-white">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Expert Doctors</h3>
                  <p className="text-gray-300 text-sm">Qualified Specialists</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-secondary p-3 rounded-full text-gray-900">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Best Technology</h3>
                  <p className="text-gray-300 text-sm">Advanced Lab & Diagnostics</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-white py-12 border-b">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "25+", label: "Years Experience" },
              { number: "500+", label: "Doctors" },
              { number: "10k+", label: "Happy Patients" },
              { number: "50+", label: "Departments" }
            ].map((stat, i) => (
              <motion.div
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                key={i}
              >
                <h2 className="text-4xl font-extrabold text-primary mb-2">{stat.number}</h2>
                <p className="text-gray-500 font-medium uppercase text-sm tracking-wide">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES / SERVICES PREVIEW */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h4 className="text-primary font-bold uppercase tracking-wider mb-2">Departments</h4>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Specialized Clinical Services</h2>
            <p className="text-gray-600">We offer a wide array of specialized medical services to ensure comprehensive care for you and your family.</p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { title: "Cardiology", icon: Activity, desc: "Comprehensive care for heart conditions with advanced diagnostics.", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop" },
              { title: "Neurology", icon: Award, desc: "Expert diagnosis and treatment for disorders of the nervous system.", img: "https://images.unsplash.com/photo-1559757131-408743e8d265?q=80&w=800&auto=format&fit=crop" },
              { title: "Pediatrics", icon: Users, desc: "Dedicated care for infants, children, and adolescents.", img: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?q=80&w=800&auto=format&fit=crop" }
            ].map((dept, i) => (
              <motion.div
                variants={fadeInUp}
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="h-48 overflow-hidden relative">
                  <img src={dept.img} alt={dept.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors"></div>
                </div>
                <div className="p-8">
                  <div className="bg-secondary/10 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-6">
                    <dept.icon size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{dept.title}</h3>
                  <p className="text-gray-600 mb-6">{dept.desc}</p>
                  <Link to="/departments" className="text-primary font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                    Learn More <ArrowRight size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="https://images.unsplash.com/photo-1584982751601-97dcc096657c?q=80&w=1000&auto=format&fit=crop"
              alt="Surgeon"
              className="rounded-3xl shadow-2xl relative z-10"
            />
            {/* Decorative shape */}
            <div className="absolute top-10 left-10 w-full h-full border-4 border-secondary/30 rounded-3xl -z-0 translate-x-4 translate-y-4"></div>
          </motion.div>

          <div className="relative">
            <h4 className="text-accent font-bold uppercase tracking-wider mb-2">Why Choose Us</h4>
            <h2 className="text-4xl font-bold text-gray-900 mb-8 max-w-lg">We Are Committed To Your Health</h2>

            <div className="space-y-8">
              {[
                { title: "Modern Technology", desc: "We use the latest medical devices and technology for accurate diagnosis." },
                { title: "Professional Doctors", desc: "Our team consists of highly qualified and experienced medical professionals." },
                { title: "Affordable Care", desc: "High-quality medical services at competitive prices for everyone." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="flex gap-4"
                >
                  <div className="bg-primary/10 rounded-full p-1 h-fit">
                    <div className="bg-primary text-white p-2 rounded-full">
                      <Star size={18} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Activity size={300} />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-8"
          >
            Ready to Prioritize Your Health?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-teal-100 mb-12 max-w-2xl mx-auto"
          >
            Book an appointment today with our leading specialists and take the first step towards a healthier future.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/patient/book-appointment"
              className="bg-white text-primary px-10 py-5 rounded-full font-bold text-xl shadow-2xl hover:bg-gray-100 transition inline-flex items-center gap-3"
            >
              Book Appointment Now <ArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
