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
      
         </div>
  );
};

export default AboutPage;
