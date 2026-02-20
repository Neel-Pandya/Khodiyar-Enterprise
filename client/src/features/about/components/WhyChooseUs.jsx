import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, BadgePercent, GraduationCap, Trophy, Globe } from 'lucide-react';

const reasons = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Local Expertise",
    description: "Based in Rajkot with a deep understanding of Gujarat's climate and energy needs."
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Quality Assurance",
    description: "Only premium-grade solar panels and components from trusted manufacturers."
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Comprehensive Support",
    description: "End-to-end service from consultation to maintenance and beyond."
  },
  {
    icon: <BadgePercent className="w-6 h-6" />,
    title: "Competitive Pricing",
    description: "Best-value solutions with transparent pricing and flexible payment options."
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Professional Installation",
    description: "Certified technicians ensuring safe and efficient system installation."
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: "Proven Track Record",
    description: "Hundreds of satisfied customers across residential and commercial sectors."
  }
];

const WhyChooseUs = () => {
  return (
    <section className="section bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/5 text-primary text-sm font-bold tracking-widest uppercase rounded-full mb-4 border border-primary/10">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-primary mb-6">
            Your Trusted Solar Partner
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto font-medium">
            We combine local knowledge with global best practices to deliver solar solutions that exceed expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-bg-light border border-primary/5 hover:border-secondary/50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-primary transition-colors duration-300">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{reason.title}</h3>
              <p className="text-text-muted font-medium leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
