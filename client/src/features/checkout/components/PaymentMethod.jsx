import React from 'react';
import { CreditCard, Banknote } from 'lucide-react';

const PaymentMethod = ({ selectedMethod, setSelectedMethod }) => {

  const methods = [
    {
      id: 'cod',
      title: 'Cash on Delivery',
      description: 'Pay with cash when your order arrives',
      icon: <Banknote className="w-6 h-6 text-emerald-500" />,
      disabled: false
    },
    {
      id: 'online',
      title: 'Online Payment',
      description: 'Coming Soon - UPI, Credit/Debit Card, Net Banking',
      icon: <CreditCard className="w-6 h-6 text-blue-500" />,
      disabled: true
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
        Payment Method
      </h3>

      <div className="space-y-4">
        {methods.map((method) => (
          <label
            key={method.id}
            className={`flex items-start p-4 rounded-xl border-2 transition-all ${
              method.disabled
                ? 'border-gray-100 bg-gray-50/50 cursor-not-allowed opacity-60'
                : selectedMethod === method.id
                  ? 'border-primary bg-primary/5 shadow-sm cursor-pointer'
                  : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50 cursor-pointer'
            }`}
            onClick={() => !method.disabled && setSelectedMethod(method.id)}
          >
            <div className="flex items-center h-6">
              <input
                type="radio"
                name="payment_method"
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary"
                checked={selectedMethod === method.id}
                onChange={() => !method.disabled && setSelectedMethod(method.id)}
                disabled={method.disabled}
              />
            </div>
            
            <div className="ml-4 flex gap-4 w-full">
              <div className={`flex-shrink-0 p-2 rounded-lg shadow-sm border h-fit ${method.disabled ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-100'}`}>
                {method.icon}
              </div>
              <div className="flex-1">
                <p className={`font-bold ${method.disabled ? 'text-gray-500' : selectedMethod === method.id ? 'text-primary' : 'text-gray-800'}`}>
                  {method.title}
                </p>
                <p className="text-sm text-gray-500 mt-1">{method.description}</p>
                {method.disabled && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-gray-200 text-gray-600 rounded">Coming Soon</span>
                )}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethod;
