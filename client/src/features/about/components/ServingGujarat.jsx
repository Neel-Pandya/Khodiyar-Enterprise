import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import OurReachImage from "../../../assets/images/about_image_2.png"

const ServingGujarat = () => {
  return (
    <section className="section bg-white overflow-hidden pb-24 md:pb-32">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1 relative"
          >
            <div className="absolute inset-0 bg-secondary/5 rounded-[3rem] rotate-3 scale-105"></div>
            <div className="relative rounded-[3rem] overflow-hidden">
              <img 
                src={OurReachImage} 
                alt="Rajkot Gujarat" 
                className="w-full h-[500px] object-cover scale-105 hover:scale-110 transition-transform duration-700"
              />
            </div>
            
            {/* Location Tag */}
            {/* <div className="absolute -bottom-6 -right-6 bg-primary text-white p-6 rounded-3xl shadow-xl flex items-center gap-4 animate-bounce-slow">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <div className="text-secondary text-xs font-bold uppercase tracking-widest mb-1">Based in</div>
                <div className="text-xl font-black">Rajkot, Gujarat</div>
              </div>
            </div> */}
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-sm font-bold tracking-widest uppercase rounded-full mb-6 border border-accent/20">
              Our Reach
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-primary mb-8 leading-tight">
              Serving All of <span className="text-secondary">Gujarat</span>
            </h2>
            <div className="space-y-6 text-text-muted text-lg leading-relaxed mb-10">
              <p>
                Our headquarters in Rajkot serves as the hub for our operations across Gujarat. From Ahmedabad to Surat, Vadodara to Bhavnagar, we bring our solar expertise to communities throughout the state.
              </p>
              <p>
                With a deep understanding of Gujarat's unique climate conditions, abundant sunshine, and energy requirements, we design solar solutions perfectly tailored to maximize efficiency and savings for our customers.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {["Residential", "Commercial", "Industrial", "Agricultural"].map((sector) => (
                <div key={sector} className="px-6 py-3 bg-bg-light border border-primary/10 rounded-2xl font-bold text-primary hover:bg-secondary hover:border-secondary transition-all duration-300">
                  {sector}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServingGujarat;
