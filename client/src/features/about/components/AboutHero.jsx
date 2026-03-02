
const AboutHero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-primary overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -mr-48 -mt-48"></div>

      <div className="container relative z-10 text-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            About <span className="text-secondary">Khodiyar</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto font-medium leading-relaxed">
            Illuminating Gujarat with sustainable solar energy solutions since our inception.
            Based in Rajkot, we are committed to powering a cleaner, greener future.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
