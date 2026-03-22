import React, { useEffect } from 'react';
import ContactHero from '../components/ContactHero';
import ContactInfo from '../components/ContactInfo';
import ContactForm from '../components/ContactForm';

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ContactHero />

      {/* Main Content Sections */}
      <section className="flex-grow pb-24 -mt-10 md:-mt-16 relative z-20  px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div 
            className="grid grid-cols-1 lg:grid-cols-[43%_1fr] gap-8 lg:gap-12 items-start"
          >
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
