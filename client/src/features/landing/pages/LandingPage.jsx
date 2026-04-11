import { Suspense, lazy } from 'react';
import Hero from '../components/Hero';

const Products = lazy(() => import('../components/Products'));
const Solutions = lazy(() => import('../components/Solutions'));

const ProductsFallback = () => (
  <section className="section bg-white text-text-dark">
    <div className="container">
      <h2 className="text-4xl md:text-5xl font-bold text-primary mb-16 text-center">
        Solar Products
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-bg-light rounded-2xl overflow-hidden shadow-lg border border-slate-100 flex flex-col"
          >
            <div className="h-48 bg-gray-200 animate-pulse" />
            <div className="p-6 flex flex-col flex-grow">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-3" />
              <div className="h-5 bg-gray-200 rounded animate-pulse mb-6 w-1/2" />
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const SolutionsFallback = () => (
  <section className="section bg-bg-light overflow-hidden">
    <div className="container grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center">
      <div className="space-y-6">
        <div className="h-12 w-72 bg-slate-200 rounded animate-pulse" />
        <div className="space-y-4">
          <div className="h-6 bg-slate-200 rounded animate-pulse" />
          <div className="h-6 bg-slate-200 rounded animate-pulse w-11/12" />
          <div className="h-6 bg-slate-200 rounded animate-pulse w-10/12" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-24 bg-white rounded-2xl shadow-md border border-slate-100 animate-pulse" />
          ))}
        </div>
      </div>
      <div className="h-[420px] bg-slate-200 rounded-[2rem] animate-pulse" />
    </div>
  </section>
);

const LandingPage = () => {
  return (
    <div className="landing-page overflow-x-hidden">
      <Hero />
      <Suspense fallback={<ProductsFallback />}>
        <Products />
      </Suspense>
      <Suspense fallback={<SolutionsFallback />}>
        <Solutions />
      </Suspense>
      
      {/* Call to Action Section */}
      <section className="section bg-white">
        <div className="container">
          <div 
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
