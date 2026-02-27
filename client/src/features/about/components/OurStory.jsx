import React from 'react';
import AboutStoryImage from '@/assets/images/about_image_1.png';

const OurStory = () => {
  return (
    <section className="section bg-white overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-bold tracking-widest uppercase rounded-full mb-6 border border-secondary/20">
              Our Story
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-primary mb-8 leading-tight">
              Leading the Solar Revolution in <span className="text-secondary">Gujarat</span>
            </h2>
            <div className="space-y-6 text-text-muted text-lg leading-relaxed">
              <p>
                Khodiyar was founded with a vision to make clean, renewable energy accessible to homes and businesses across Gujarat. Based in the vibrant city of Rajkot, we have grown from a small team of passionate solar enthusiasts to a trusted name in solar energy solutions.
              </p>
              <p>
                Our journey began with a simple belief: that every household and business deserves access to reliable, cost-effective, and sustainable energy. Today, we've helped hundreds of customers reduce their carbon footprint while significantly lowering their electricity costs.
              </p>
            </div>
            
            {/* Quick Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
              {[
                "Premium Quality Panels",
                "Expert Installation",
                "24/7 Support",
                "Certified Engineers"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-secondary font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-semibold text-primary">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image Content */}
          <div className="relative">
            <div className="relative rounded-[3rem] overflow-hidden">
              <img 
                src={AboutStoryImage} 
                alt="Solar Panel Installation" 
                className="w-full h-[500px] object-cover scale-105 hover:scale-110 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
