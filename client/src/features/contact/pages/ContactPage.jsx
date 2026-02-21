import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import ContactHero from '../components/ContactHero';
import ContactInfo from '../components/ContactInfo';
import ContactForm from '../components/ContactForm';

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);



  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ContactHero />

      {/* Main Content Sections */}
      <section className="flex-grow pb-24 -mt-10 md:-mt-16 relative z-20  px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-[43%_1fr] gap-8 lg:gap-12 items-start"
          >
            <ContactInfo fadeUp={fadeUp} />
            <ContactForm fadeUp={fadeUp} />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
