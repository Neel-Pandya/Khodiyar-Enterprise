import React from 'react';
import DeliveryAddress from '../components/DeliveryAddress';
import PaymentMethod from '../components/PaymentMethod';
import CheckoutOrderSummary from '../components/CheckoutOrderSummary';

const CheckoutPage = () => {
  return (
    <div className="min-h-screen pt-12 pb-24 bg-[#FAFBFC]">
      <div className="container px-6 mx-auto">
        
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight">
            Checkout
          </h1>
          <p className="text-gray-500 font-medium">
            Complete your order with delivery and payment information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Side: Forms */}
          <div className="lg:col-span-8 flex flex-col gap-2">
            <DeliveryAddress />
            <PaymentMethod />
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-4 relative">
            <CheckoutOrderSummary />
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
