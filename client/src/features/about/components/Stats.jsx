import React from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, Calendar, CheckCircle } from 'lucide-react';

const stats = [
  {
    icon: <Users className="w-8 h-8" />,
    value: "500+",
    label: "Happy Customers"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    value: "2MW+",
    label: "Energy Generated"
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    value: "5+",
    label: "Years Experience"
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    value: "50+",
    label: "Projects Completed"
  }
];

const Stats = () => {
  return (
    <section className="py-16 bg-primary">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center p-4 bg-secondary text-primary rounded-2xl mb-4 shadow-lg shadow-secondary/20">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-black text-white mb-2">
                {stat.value}
              </div>
              <div className="text-white/60 font-medium uppercase tracking-wider text-xs md:text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
