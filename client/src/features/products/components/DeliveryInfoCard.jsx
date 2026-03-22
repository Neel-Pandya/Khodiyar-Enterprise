import { Truck, Wrench, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

const DeliveryInfoCard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-blue-950 to-indigo-900 text-white rounded-3xl p-8 shadow-2xl sticky top-24 border border-blue-800/60 overflow-hidden relative">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-[80px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 rounded-full mix-blend-screen filter blur-[80px] opacity-20 -ml-10 -mb-10 pointer-events-none"></div>
      
      <div className="relative z-10">
        <h4 className="font-extrabold text-2xl mb-8 flex items-center gap-3 tracking-tight">
          <Truck className="w-7 h-7 text-blue-400" />
          Delivery & Services
        </h4>

        <div className="space-y-4">
          <div className="flex items-start gap-5 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
            <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-2.5 rounded-xl shadow-inner text-white shrink-0 mt-0.5">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-lg text-white mb-0.5 tracking-tight">Free Delivery</p>
              <p className="text-blue-200/80 text-sm font-medium">For orders above ₹50,000</p>
            </div>
          </div>
          
          <div className="flex items-start gap-5 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
             <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-2.5 rounded-xl shadow-inner text-white shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-lg text-white mb-0.5 tracking-tight">Authentic Products</p>
              <p className="text-blue-200/80 text-sm font-medium">Direct from Khodiyar</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/checkout')}
          className="group w-full flex items-center justify-center gap-2 bg-yellow-400 text-blue-950 text-center py-4 rounded-2xl font-black text-lg tracking-wide hover:bg-yellow-300 transition-all duration-300 mt-10 shadow-[0_0_20px_rgba(250,204,21,0.2)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] cursor-pointer hover:-translate-y-1"
        >
          Proceed to Checkout
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default DeliveryInfoCard;
