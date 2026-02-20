import React, { useEffect } from 'react';
import AboutHero from '../components/AboutHero';
import OurStory from '../components/OurStory';
import Stats from '../components/Stats';
import MissionVision from '../components/MissionVision';
import WhyChooseUs from '../components/WhyChooseUs';
import ServingGujarat from '../components/ServingGujarat';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page overflow-x-hidden">
      <AboutHero />
      <OurStory />
      <Stats />
      <MissionVision />
      <WhyChooseUs />
      <ServingGujarat />
      
      {/* Final Call to Action - Reusing design language from landing page */}
      <section className="section bg-bg-light border-t border-primary/5">
        <div className="container">
          <div className="bg-primary rounded-[3rem] p-12 md:p-24 text-center text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                Ready to Join the <br /> Solar Revolution?
              </h2>
              <p className="text-xl text-white/80 mb-12 max-w-2xl font-medium leading-relaxed">
                Contact us today for a free consultation and take the first step towards sustainable energy.
              </p>
              <button className="btn btn-secondary text-lg px-10 py-4 rounded-2xl font-black">
                Get a Free Quote
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
