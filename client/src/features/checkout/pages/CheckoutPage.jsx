import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import DeliveryAddress from '../components/DeliveryAddress';
import PaymentMethod from '../components/PaymentMethod';
import CheckoutOrderSummary from '../components/CheckoutOrderSummary';
import { useCreateOrderMutation } from '@/hooks/useOrderQueries';
import useCartStore from '@/store/useCartStore';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems } = useCartStore();
  const createOrderMutation = useCreateOrderMutation();

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [paymentType, setPaymentType] = useState('cod');

  const onSubmit = (formData) => {
    if (cartItems.length === 0) {
      return;
    }

    const orderData = {
      ...formData,
      payment_type: paymentType,
    };

    createOrderMutation.mutate(orderData, {
      onSuccess: () => {
        navigate('/orders');
      },
    });
  };
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

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Side: Forms */}
          <div className="lg:col-span-8 flex flex-col gap-2">
            <DeliveryAddress 
              register={register}
              errors={errors}
            />
            <PaymentMethod 
              selectedMethod={paymentType} 
              setSelectedMethod={setPaymentType} 
            />
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-4 relative">
            <CheckoutOrderSummary 
              onPlaceOrder={handleSubmit(onSubmit)}
              isSubmitting={createOrderMutation.isPending}
            />
          </div>

        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
