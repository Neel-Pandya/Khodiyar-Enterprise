import React, { useState } from 'react';
import {
    User, Mail, Phone, Lock, MapPin, Home, Building2,
    Hash, UserPlus, RotateCcw,
} from 'lucide-react';

import FormSectionCard from './FormSectionCard';
import FormField from './FormField';
import PhotoUpload from './PhotoUpload';

const INITIAL_FORM = {
    fullName: '',
    email: '',
    phone: '',
    password: '',
    street: '',
    city: '',
    state: '',
    zip: '',
};

const STATE_OPTIONS = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const AddCustomerForm = ({ onSuccess }) => {
    const [form, setForm] = useState(INITIAL_FORM);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handlePhotoChange = (file) => {
        const url = URL.createObjectURL(file);
        setPhotoPreview(url);
    };

    const handleReset = () => {
        setForm(INITIAL_FORM);
        setPhotoPreview(null);
        setSubmitted(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        if (onSuccess) onSuccess(form);
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div
                className="flex flex-col gap-6"
            >
                {/* ─── Section 1: Personal Information ─────────────────── */}
                <FormSectionCard title="Personal Information" icon={User}>
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Photo Upload — centered on mobile, left-aligned on large */}
                        <div className="flex justify-center lg:justify-start lg:pt-1 flex-shrink-0">
                            <PhotoUpload
                                preview={photoPreview}
                                onFileChange={handlePhotoChange}
                            />
                        </div>

                        {/* Fields grid */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                label="Full Name"
                                icon={User}
                                placeholder="e.g. Neel Pandya"
                                value={form.fullName}
                                onChange={handleChange('fullName')}
                                className="sm:col-span-2"
                            />
                            <FormField
                                label="Email Address"
                                icon={Mail}
                                type="email"
                                placeholder="email@example.com"
                                value={form.email}
                                onChange={handleChange('email')}
                            />
                            <FormField
                                label="Phone Number"
                                icon={Phone}
                                type="tel"
                                placeholder="+91 98765 43210"
                                value={form.phone}
                                onChange={handleChange('phone')}
                            />
                            <FormField
                                label="Password"
                                icon={Lock}
                                type="password"
                                placeholder="Min. 6 characters"
                                value={form.password}
                                onChange={handleChange('password')}
                                className="sm:col-span-2"
                            />
                        </div>
                    </div>
                </FormSectionCard>

                {/* ─── Section 2: Address Information ──────────────────── */}
                <FormSectionCard title="Address Information" icon={MapPin}>
                    <div className="grid grid-cols-1 gap-4">
                        <FormField
                            label="Street Address"
                            icon={Home}
                            placeholder="123 Main Street"
                            value={form.street}
                            onChange={handleChange('street')}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FormField
                                label="City"
                                icon={Building2}
                                placeholder="Ahmedabad"
                                value={form.city}
                                onChange={handleChange('city')}
                            />

                            {/* State — native select, styled to match FormField */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                    State
                                </label>
                                <div className="relative">
                                    <Building2
                                        size={16}
                                        strokeWidth={2}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                    />
                                    <select
                                        value={form.state}
                                        onChange={handleChange('state')}
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
                                label="ZIP / PIN Code"
                                icon={Hash}
                                placeholder="380001"
                                value={form.zip}
                                onChange={handleChange('zip')}
                            />
                        </div>
                    </div>
                </FormSectionCard>

                {/* ─── Action Bar ──────────────────────────────────────── */}
                <div
                    className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3"
                >
                    {/* Reset — ghost style matching the table pagination ghost buttons */}
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                        <RotateCcw size={15} strokeWidth={2.5} />
                        Reset
                    </button>

                    {/* Submit — amber solid, same style as CustomerHeader "Add New Customer" button */}
                    <button
                        type="submit"
                        className={`
                            flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm hover:scale-105 active:scale-95
                            ${submitted
                                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                : 'bg-[#fbc02d] hover:bg-[#fbbf24] text-[#1e3a5f] shadow-[#fbc02d]/20'
                            }
                        `}
                    >
                        <UserPlus size={16} strokeWidth={2.5} />
                        {submitted ? 'Customer Added!' : 'Add Customer'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AddCustomerForm;
