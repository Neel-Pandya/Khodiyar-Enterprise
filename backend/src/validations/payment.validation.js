import { z } from 'zod';

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1, 'Razorpay order ID is required'),
  razorpay_payment_id: z.string().min(1, 'Razorpay payment ID is required'),
  razorpay_signature: z.string().min(1, 'Razorpay signature is required'),
  full_name: z.string().min(2, 'Full name is required').max(100),
  phone: z.string().min(10, 'Phone number is required').max(20),
  address: z.string().min(5, 'Address is required').max(255),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  pincode: z.string().min(6, 'Valid pincode required').max(10),
});
