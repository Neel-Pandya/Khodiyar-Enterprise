import React from 'react';

const ContactHero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-[#1E3A5F] shrink-0">
      <div className="container relative z-10 text-center px-4 mx-auto max-w-6xl">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            Get in <span className="text-secondary">Touch</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto font-medium leading-relaxed">
            Have questions about solar energy? Need a consultation or support?
            Our team of experts is ready to help you shine brighter.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
