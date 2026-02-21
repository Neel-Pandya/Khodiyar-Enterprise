import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Products from '../components/Products';
import Solutions from '../components/Solutions';

const LandingPage = () => {
  return (
    <div className="landing-page overflow-x-hidden">
      <Hero />
      <Products />
      <Solutions />
      
      {/* Call to Action Section */}
      <section className="section bg-white">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-primary rounded-[3rem] p-12 md:p-24 text-center text-white shadow-2xl shadow-primary/30 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                Ready to Switch to <br /> Solar Energy?
              </h2>
              <p className="text-xl text-white/80 mb-12 max-w-2xl font-medium leading-relaxed">
                Join thousands of happy customers who are saving energy and protecting the planet with our world-class solar solutions.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
