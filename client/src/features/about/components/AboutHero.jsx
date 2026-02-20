import React from 'react';
import { motion } from 'framer-motion';

const AboutHero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-primary overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
      
      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tight">
            About <span className="text-secondary">Khodiyar</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto font-medium leading-relaxed">
            Illuminating Gujarat with sustainable solar energy solutions since our inception. 
            Based in Rajkot, we are committed to powering a cleaner, greener future.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
