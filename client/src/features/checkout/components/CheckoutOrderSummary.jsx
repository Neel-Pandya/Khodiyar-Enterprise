import React from 'react';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import Button from '@common/Button';
import useCartStore from '@/store/useCartStore';

const CheckoutOrderSummary = ({ onPlaceOrder, isSubmitting }) => {
  const { cartItems } = useCartStore();

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const total = subtotal; // add tax/shipping if needed

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>

      <div className="space-y-5 mb-6">
        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Your cart is empty</p>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="flex gap-4">
              <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 p-1 flex-shrink-0">
                <img 
                  src={item.product.images?.[0] || '/placeholder.jpg'} 
                  alt={item.product.name} 
                  className="w-full h-full object-cover rounded-lg" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">{item.product.name}</h4>
                <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
              </div>
              <div className="text-sm font-bold text-gray-800">
                ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-gray-100 pt-5 space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal (Products)</span>
          <span className="font-semibold text-gray-800">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Delivery</span>
          <span className="font-semibold text-emerald-600">Free</span>
        </div>
      </div>

      <div className="border-t border-gray-100 mt-5 pt-5 flex justify-between items-center mb-6">
        <span className="text-base font-bold text-gray-800">Total Amount</span>
        <span className="text-2xl font-black text-primary">₹{total.toLocaleString('en-IN')}</span>
      </div>

      <Button 
        className="w-full flex items-center justify-center gap-2" 
        onClick={onPlaceOrder}
        disabled={isSubmitting || cartItems.length === 0}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Place Order 
            <ArrowRight size={20} />
          </>
        )}
      </Button>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-gray-500 bg-emerald-50 text-emerald-700 py-3 rounded-lg">
        <ShieldCheck className="w-4 h-4" />
        Your payment information is secure and encrypted
      </div>
    </div>
  );
};

export default CheckoutOrderSummary;
