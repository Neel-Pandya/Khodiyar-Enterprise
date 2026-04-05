import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import DeliveryAddress from '../components/DeliveryAddress';
import PaymentMethod from '../components/PaymentMethod';
import CheckoutOrderSummary from '../components/CheckoutOrderSummary';
import { useCreateOrderMutation } from '@/hooks/useOrderQueries';
import { useCreateRazorpayOrderMutation, useVerifyPaymentMutation } from '@/hooks/usePaymentQueries';
import { useRazorpay } from '@/hooks/useRazorpay';
import useCartStore from '@/store/useCartStore';
import useAuthStore from '@/store/useAuthStore';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems } = useCartStore();
  const { user } = useAuthStore();
  const createOrderMutation = useCreateOrderMutation();
  const createRazorpayOrderMutation = useCreateRazorpayOrderMutation();
  const verifyPaymentMutation = useVerifyPaymentMutation();
  const { openRazorpayModal } = useRazorpay();

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [paymentType, setPaymentType] = useState('cod');

  const onSubmit = async (formData) => {
    if (cartItems.length === 0) {
      return;
    }

    if (paymentType === 'online') {
      try {
        // 1. Create Razorpay order
        const response = await createRazorpayOrderMutation.mutateAsync();
        const { order_id, amount, currency, key_id } = response.data;

        // 2. Open Razorpay checkout modal
        const razorpayResponse = await openRazorpayModal({
          key: key_id,
          amount: amount,
          currency: currency,
          order_id: order_id,
          name: 'Khodiyar Enterprise',
          description: 'Order Payment',
          prefill: {
            name: formData.full_name,
            email: user?.email || '',
            contact: formData.phone,
          },
          theme: {
            color: '#1e3a5f',
          },
        });

        // 3. Verify payment and create order
        await verifyPaymentMutation.mutateAsync({
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        }, {
          onSuccess: () => {
            navigate('/orders');
          },
        });
      } catch (error) {
        // Error is handled by mutation onError callbacks
        console.error('Payment flow error:', error);
      }
    } else {
      // COD flow - existing behavior
      const orderData = {
        ...formData,
        payment_type: 'cod',
      };

      createOrderMutation.mutate(orderData, {
        onSuccess: () => {
          navigate('/orders');
        },
      });
    }
  };

  const isSubmitting = createOrderMutation.isPending || 
                       createRazorpayOrderMutation.isPending || 
                       verifyPaymentMutation.isPending;
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
              isSubmitting={isSubmitting}
              paymentType={paymentType}
            />
          </div>

        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
