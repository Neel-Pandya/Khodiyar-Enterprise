import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import OrderStatusBadge from '../components/OrderStatusBadge';
import OrderItem from '../components/OrderItem';
import { Download, ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react';
import Button from '@common/Button';

/**
 * Detailed Order Page.
 * Displays shipping info, full item list, and detailed payment summary.
 */
const OrderDetailsPage = () => {
  const { id } = useParams();

  // Mocked data for demonstration
  const orderDetails = {
    id: "ORD-2024-1245",
    date: "February 12, 2026",
    status: "Delivered",
    shipping: {
      name: "Neel Pandya",
      address: "123 Main Street",
      city: "Mumbai, Maharashtra - 400001",
      country: "India",
      phone: "1234567801"
    },
    items: [
      {
        name: "Solar Panel - High Efficiency Module",
        quantity: 2,
        price: 29000,
        image:
          "https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      },
      {
        name: "Earthing Cable - 10mm",
        quantity: 3,
        price: 200,
        image:
          "https://images.unsplash.com/photo-1558449028-b53a39d100fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      }
    ],
    summary: {
      subtotal: 58600,
      shipping: 0
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `Order Details #${id} | Khodiyar Enterprise`;
  }, [id]);

  return (
    <div className="min-h-screen bg-[#fcfdfe] py-10 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-10 md:mb-16">
          <div className="space-y-4 md:space-y-6">
            <Link
              to="/orders"
              className="group inline-flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors"
            >
              <ArrowLeft size={14} md:size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to History
            </Link>

            <div>
              <h1 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-3 md:mb-4">
                Order <span className="text-primary">#{orderDetails.id}</span>
              </h1>

              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <OrderStatusBadge status={orderDetails.status} />
                <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-200"></span>

                <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                  Placed on {orderDetails.date}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-stretch md:items-end gap-3">
            <Button className="!py-3.5 md:!py-4 !px-8 md:!px-10 !rounded-xl md:!rounded-2xl shadow-xl shadow-primary/10 flex items-center justify-center gap-3 group/dl">
              <Download size={18} className="group-hover/dl:translate-y-0.5 transition-transform" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest whitespace-nowrap">
                Download Invoice
              </span>
            </Button>

            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1 text-center md:text-right">
              Available in PDF format
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8 items-start">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">

            {/* Items List */}
            <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-6 md:p-10">
              <div className="flex items-center gap-4 mb-6 md:mb-10 pb-4 md:pb-6 border-b border-slate-50">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center text-primary/40">
                  <Package size={20} md:size={22} />
                </div>

                <div>
                  <h3 className="text-lg md:text-xl font-black text-primary tracking-tight">
                    Items in this order
                  </h3>

                  <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
                    {orderDetails.items.length} Products
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {orderDetails.items.map((item, index) => (
                  <OrderItem key={index} item={item} />
                ))}
              </div>
            </div>

            {/* Shipping Card */}
            <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-6 md:p-10">
              
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center text-primary/40">
                  <MapPin size={20} md:size={22} />
                </div>

                <h3 className="text-lg md:text-xl font-black text-primary tracking-tight">
                  Shipping Details
                </h3>
              </div>

              <div className="flex flex-col md:flex-row gap-6 md:gap-8">

                <div className="flex-1 bg-slate-50/50 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-slate-50">
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 md:mb-4">
                    Delivery Address
                  </p>

                  <p className="text-primary font-black text-base md:text-lg mb-2">
                    {orderDetails.shipping.name}
                  </p>

                  <div className="space-y-1 text-slate-500 text-xs md:text-sm font-bold">
                    <p>{orderDetails.shipping.address}</p>
                    <p>{orderDetails.shipping.city}</p>
                    <p className="uppercase tracking-tight">
                      {orderDetails.shipping.country}
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-64 flex flex-col justify-center gap-4 bg-slate-50/30 p-6 md:p-8 rounded-2xl md:rounded-3xl border border-slate-50 border-dashed">

                  <div className="space-y-1">
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Contact Number
                    </p>

                    <p className="text-lg md:text-xl font-black text-primary">
                      {orderDetails.shipping.phone}
                    </p>
                  </div>

                  <div className="h-px w-full bg-slate-100"></div>

                  <div className="space-y-1">
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Method
                    </p>

                    <p className="text-xs md:text-sm font-black text-slate-600">
                      Standard Delivery
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 md:space-y-8">

            {/* Payment Summary */}
            <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 p-6 md:p-10 relative overflow-hidden group">

              <div className="flex items-center gap-4 mb-6 md:mb-8 relative z-10">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center text-primary/40 transition-colors group-hover:bg-primary group-hover:text-white duration-500">
                  <CreditCard size={20} md:size={22} />
                </div>

                <h3 className="text-lg md:text-xl font-black text-primary tracking-tight">
                  Payment
                </h3>
              </div>

              <div className="space-y-4 md:space-y-5 relative z-10">

                <div className="flex justify-between items-center text-xs md:text-sm font-bold">
                  <span className="text-slate-400 uppercase tracking-widest text-[9px] md:text-[10px]">
                    Subtotal
                  </span>

                  <span className="text-primary">
                    ₹{orderDetails.summary.subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs md:text-sm font-bold">
                  <span className="text-slate-400 uppercase tracking-widest text-[9px] md:text-[10px]">
                    Shipping Fee
                  </span>

                  <span className="text-green-600 font-black">
                    {orderDetails.summary.shipping === 0
                      ? "FREE"
                      : `₹${orderDetails.summary.shipping.toLocaleString()}`}
                  </span>
                </div>

                <div className="h-px w-full bg-slate-100 my-2"></div>

                <div className="pt-2 flex flex-col items-center gap-4 md:gap-6">
                  <div className="text-center">

                    <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1 md:mb-2">
                      Total Payable
                    </span>

                    <span className="text-4xl md:text-5xl font-black text-primary tracking-tighter">
                      ₹{(
                        orderDetails.summary.subtotal +
                        orderDetails.summary.shipping
                      ).toLocaleString()}
                    </span>
                  </div>

                  <div className="w-full inline-flex items-center justify-center gap-2 bg-green-50 text-green-600 px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-green-100 shadow-sm">
                    <CheckCircle2 size={16} />
                    Transaction Secure
                  </div>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-[0.02] rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 transition-opacity group-hover:opacity-[0.05] duration-500"></div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

const CheckCircle2 = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default OrderDetailsPage;