import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, Camera } from 'lucide-react';
import FormField from '@admin/shared/components/FormField';

const ProfileSettings = () => {
    const [formData, setFormData] = useState({
        fullName: 'Neel Pandya',
        email: 'npandya2601@gmail.com',
        phone: '+91 98765 43210',
        role: 'Super Admin',
        location: 'Gujarat, India',
        street: '123 Solar Heights',
        city: 'Ahmedabad',
        state: 'Gujarat',
        zip: '380001'
    });

    const handleChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const STATE_OPTIONS = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
        'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
        'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
        'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    ];

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 text-center sm:text-left">Profile Information</h2>
                    <p className="text-sm text-gray-400 mt-0.5 text-center sm:text-left">Update your personal details and office location</p>
                </div>
            </div>

            <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    {/* Left side: Avatar Upload */}
                    <div className="flex flex-col items-center gap-4 lg:col-span-1">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-3xl bg-[#fbc02d] flex items-center justify-center text-[#1e3a5f] text-4xl font-black shadow-xl shadow-[#fbc02d]/20 overflow-hidden">
                                NP
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-2.5 bg-white rounded-2xl shadow-xl border border-gray-100 text-[#1e3a5f] hover:text-[#fbc02d] transition-colors group-hover:scale-110 duration-200">
                                <Camera size={18} />
                            </button>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-gray-800">{formData.fullName}</p>
                            <p className="text-xs text-gray-400 font-medium tracking-wide uppercase mt-0.5">{formData.role}</p>
                        </div>
                    </div>

                    {/* Right side: Form Details */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Personal Details */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <User size={16} className="text-slate-400" />
                                Personal Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    label="Full Name"
                                    icon={User}
                                    value={formData.fullName}
                                    onChange={(e) => handleChange(e, 'fullName')}
                                    placeholder="Enter your full name"
                                    className="md:col-span-2"
                                />
                                <FormField
                                    label="Email Address"
                                    icon={Mail}
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange(e, 'email')}
                                    placeholder="Enter your email"
                                />
                                <FormField
                                    label="Phone Number"
                                    icon={Phone}
                                    value={formData.phone}
                                    onChange={(e) => handleChange(e, 'phone')}
                                    placeholder="Enter your phone number"
                                />
                            </div>
                        </div>

                        {/* Address Details */}
                        <div className="pt-8 border-t border-gray-50">
                            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <MapPin size={16} className="text-slate-400" />
                                Address Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    label="Street Address"
                                    icon={MapPin}
                                    value={formData.street}
                                    onChange={(e) => handleChange(e, 'street')}
                                    placeholder="Enter street path"
                                    className="md:col-span-3"
                                />
                                <FormField
                                    label="City"
                                    icon={MapPin}
                                    value={formData.city}
                                    onChange={(e) => handleChange(e, 'city')}
                                    placeholder="City"
                                />
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                        State
                                    </label>
                                    <div className="relative">
                                        <MapPin
                                            size={16}
                                            strokeWidth={2}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                        />
                                        <select
                                            value={formData.state}
                                            onChange={(e) => handleChange(e, 'state')}
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-[#111827] appearance-none transition-all duration-200 outline-none cursor-pointer focus:ring-2 focus:ring-[#fbc02d]/25 focus:border-[#fbc02d] hover:border-gray-300"
                                        >
                                            <option value="" disabled>Select State</option>
                                            {STATE_OPTIONS.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <FormField
                                    label="ZIP Code"
                                    icon={MapPin}
                                    value={formData.zip}
                                    onChange={(e) => handleChange(e, 'zip')}
                                    placeholder="ZIP Code"
                                />
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="pt-8 border-t border-gray-50 flex justify-end">
                            <button className="flex items-center justify-center gap-2 px-8 py-3 bg-[#1e3a5f] text-white rounded-xl text-sm font-semibold hover:bg-[#152943] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#1e3a5f]/20 w-full sm:w-auto">
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
