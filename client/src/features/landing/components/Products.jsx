
const products = [
  {
    id: 1,
    name: 'Earthing Cable',
    description: 'Protective grounding cable for safe installations.',
    image: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    name: 'DC Cable',
    description: 'High-quality grounding earth cable for DC systems.',
    image: 'https://images.unsplash.com/photo-1526649661456-89c7ed4d00e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    name: 'AC Cable',
    description: 'Solar panel AC power cable for efficient grid connection.',
    image: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    name: 'Earthing Kit',
    description: 'Complete solar panel grounding kit for maximum security.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 5,
    name: 'Solar Inverter',
    description: 'Solar inverter converts DC to AC for home use.',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
];

import { useNavigate } from 'react-router';

const Products = () => {
  const navigate = useNavigate();

  return (
    <section className="section bg-white text-text-dark">
      <div className="container">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-16 text-center">
          Solar Products
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-bg-light rounded-2xl overflow-hidden shadow-lg border border-slate-100 flex flex-col group transform-gpu hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-primary mb-2">{product.name}</h3>
                <p className="text-sm text-text-muted mb-8 flex-grow leading-relaxed font-medium">
                  {product.description}
                </p>
                <button
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-accent hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/10 cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
