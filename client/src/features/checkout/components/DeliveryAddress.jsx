import React from 'react';
import { User, Phone, Mail, MapPin, Building2, MapPinned, Landmark } from 'lucide-react';
import Input from '@common/Input';
import useAuthStore from '@/store/useAuthStore';

const DeliveryAddress = ({ register, errors }) => {
  const { user } = useAuthStore();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
        Delivery Address
      </h3>

      <div className="space-y-5">
        <Input
          id="full_name"
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          icon={User}
          required
          register={register('full_name', { 
            required: 'Full name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' }
          })}
          error={errors.full_name?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                disabled
                className="w-full py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed pl-11 pr-4"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={18} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Email is linked to your account</p>
          </div>

          <Input
            id="phone"
            label="Phone Number"
            type="tel"
            placeholder="+91 00000 00000"
            icon={Phone}
            required
            register={register('phone', { 
              required: 'Phone number is required',
              minLength: { value: 10, message: 'Phone must be at least 10 digits' }
            })}
            error={errors.phone?.message}
          />
        </div>

        <Input
          id="address"
          label="Address"
          type="text"
          placeholder="House No., Building Name, Street"
          icon={MapPin}
          required
          register={register('address', { 
            required: 'Address is required',
            minLength: { value: 5, message: 'Address must be at least 5 characters' }
          })}
          error={errors.address?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Input
            id="city"
            label="City"
            type="text"
            placeholder="City"
            icon={Building2}
            required
            register={register('city', { 
              required: 'City is required',
              minLength: { value: 2, message: 'City must be at least 2 characters' }
            })}
            error={errors.city?.message}
          />

          <Input
            id="state"
            label="State"
            type="text"
            placeholder="State"
            icon={MapPinned}
            required
            register={register('state', { 
              required: 'State is required',
              minLength: { value: 2, message: 'State must be at least 2 characters' }
            })}
            error={errors.state?.message}
          />

          <Input
            id="pincode"
            label="Pincode"
            type="text"
            placeholder="000000"
            icon={Landmark}
            required
            register={register('pincode', { 
              required: 'Pincode is required',
              minLength: { value: 6, message: 'Pincode must be at least 6 digits' }
            })}
            error={errors.pincode?.message}
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddress;
