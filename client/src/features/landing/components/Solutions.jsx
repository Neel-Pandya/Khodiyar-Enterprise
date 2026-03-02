
const solutions = [
  {
    title: 'Residential Solar Solutions',
    description: 'Efficient energy conversion for your home, reducing costs and providing reliable power.',
    icon: '🏠',
  },
  {
    title: 'Commercial Solar Solutions',
    description: 'Scalable solar systems for businesses to lower operational expenses and meet ESG goals.',
    icon: '🏢',
  },
  {
    title: 'Industrial Energy Systems',
    description: 'High-capacity solar installations designed for heavy-duty industrial requirements.',
    icon: '🏭',
  },
];

const Solutions = () => {
  return (
    <section className="section bg-bg-light overflow-hidden">
      <div className="container grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6 md:mb-8 text-center md:text-left">Our Solar Solutions</h2>
          <p className="text-lg md:text-xl text-slate-700 mb-8 md:mb-12 leading-relaxed font-medium text-center md:text-left">
            Our solar solutions are designed to deliver efficient energy conversion, reduced electricity costs, and reliable performance through the use of quality solar panels and system components.
          </p>
          <div className="flex flex-col gap-8">
            {solutions.map((item, index) => (
              <div 
                key={index}
                className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center sm:items-start p-6 md:p-8 bg-white rounded-2xl shadow-md border border-slate-100 group transform-gpu hover:scale-102 hover:translate-x-2 transition-all duration-300"
              >
                <div className="w-14 h-14 md:w-16 h-16 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl md:text-3xl shadow-lg shadow-primary/20 group-hover:bg-accent transition-colors">
                  {item.icon}
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-xl md:text-2xl font-bold text-primary mb-2 md:mb-3">{item.title}</h4>
                  <p className="text-text-muted leading-relaxed font-medium text-base md:text-lg">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative transform-gpu">
          <div className="absolute -inset-4 bg-secondary rounded-[2rem] opacity-20 blur-2xl"></div>
          <img 
            src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Solar Panels on Roof" 
            className="w-full relative z-10 rounded-[2rem] shadow-2xl hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  );
};

export default Solutions;
