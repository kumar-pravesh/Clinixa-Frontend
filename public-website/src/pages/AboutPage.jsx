import { motion } from "framer-motion";
import { CheckCircle, Award, Users, Heart } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="overflow-x-hidden">
      {/* PAGE HEADER */}
      <section className="bg-slate-950 text-white pt-40 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
          <Heart size={400} className="text-primary" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-4"
          >
            About Clinixa
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-teal-100 max-w-2xl mx-auto"
          >
            Dedicated to providing the highest quality healthcare with compassion and excellence.
          </motion.p>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop"
              alt="Hospital Team"
              className="rounded-3xl shadow-2xl"
            />
          </motion.div>
          <div>
            <h3 className="text-secondary font-bold uppercase tracking-wider mb-2">Our Mission</h3>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Healing with Heart & Science</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              At Clinixa, our mission is to provide exceptional, patient-centered care that improves the health and well-being of our community. We combine state-of-the-art medical technology with a compassionate human touch.
            </p>
            <ul className="space-y-4">
              {[
                "Patient-First Approach",
                "Excellence in Clinical Care",
                "Innovation & Research",
                "Integrity & Transparency"
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 text-gray-800 font-medium"
                >
                  <CheckCircle className="text-secondary" /> {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-primary text-center">
              <Award className="mx-auto text-primary mb-4" size={48} />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Certified Excellence</h3>
              <p className="text-gray-600">Accredited by JCI and National Health Boards.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-secondary text-center">
              <Users className="mx-auto text-secondary mb-4" size={48} />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Top Specialists</h3>
              <p className="text-gray-600">Over 500 board-certified doctors.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-accent text-center">
              <Heart className="mx-auto text-accent mb-4" size={48} />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Patient Satisfaction</h3>
              <p className="text-gray-600">Rated 4.9/5 by over 10,000 patients.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
