import { useCallback } from 'react';

export const useRazorpay = () => {
  /**
   * Open Razorpay checkout modal
   * Returns a promise that resolves with payment response or rejects on failure
   */
  const openRazorpayModal = useCallback((options) => {
    return new Promise((resolve, reject) => {
      if (!window.Razorpay) {
        reject(new Error('Razorpay SDK not loaded. Please refresh the page and try again.'));
        return;
      }

      const rzp = new window.Razorpay({
        ...options,
        handler: (response) => {
          // Payment successful
          resolve(response);
        },
      });

      rzp.on('payment.failed', (response) => {
        reject(new Error(response.error.description || 'Payment failed. Please try again.'));
      });

      rzp.open();
    });
  }, []);

  return { openRazorpayModal };
};
