
const Hero = () => {
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent"></div>
      </div>

      <div className="container relative z-10">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Powering Your Future With <br />
            <span className="text-secondary inline-block">
              Solar Energy Solutions
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-10 leading-relaxed font-medium">
            Expert Solar solutions for home and business. Efficient, sustainable, and reliable energy for a better tomorrow. Join the green revolution today.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              className="btn btn-secondary text-lg px-8 py-4 shadow-xl shadow-secondary/20 hover:scale-105 active:scale-95 transition-transform"
            >
              Explore Solutions
            </button>
            <button
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:bg-white hover:text-primary active:scale-95"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
