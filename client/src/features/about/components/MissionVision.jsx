import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye } from 'lucide-react';

const MissionVision = () => {
  return (
    <section className="section bg-bg-light">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-xl shadow-primary/5 border border-primary/5 flex flex-col items-start"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white mb-8 shadow-lg shadow-primary/20">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black text-primary mb-6">Our Mission</h3>
            <p className="text-text-muted text-lg leading-relaxed font-medium">
              To empower homes and businesses across Gujarat with cutting-edge solar energy solutions that are reliable, affordable, and sustainable. We strive to make renewable energy the preferred choice for every customer, contributing to a cleaner environment and a brighter future.
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-xl shadow-primary/5 border border-primary/5 flex flex-col items-start"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-primary mb-8 shadow-lg shadow-secondary/20">
              <Eye className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black text-primary mb-6">Our Vision</h3>
            <p className="text-text-muted text-lg leading-relaxed font-medium">
              To be Gujarat's most trusted solar energy provider, recognized for our innovation, quality, and commitment to customer satisfaction. We envision a future where every rooftop harnesses the power of the sun, creating energy independence and environmental sustainability for generations to come.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
