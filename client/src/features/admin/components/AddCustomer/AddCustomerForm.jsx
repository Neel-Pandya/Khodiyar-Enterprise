import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, Lock, MapPin, Home, Building2,
    Hash, UserPlus, RotateCcw,
} from 'lucide-react';

import FormSectionCard from './FormSectionCard';
import FormField from './FormField';
import PhotoUpload from './PhotoUpload';

// Stagger container — matches pattern from CustomersPage
const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
};

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

const REQUIRED_FIELDS = ['fullName', 'email', 'phone', 'password', 'street', 'city', 'state', 'zip'];

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
    const [errors, setErrors] = useState({});
    const [photoPreview, setPhotoPreview] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handlePhotoChange = (file) => {
        const url = URL.createObjectURL(file);
        setPhotoPreview(url);
    };

    const validate = () => {
        const newErrors = {};
        REQUIRED_FIELDS.forEach((key) => {
            if (!form[key].trim()) newErrors[key] = 'This field is required';
        });
        if (form.email && !/\S+@\S+\.\S+/.test(form.email))
            newErrors.email = 'Enter a valid email address';
        if (form.phone && !/^\+?[\d\s\-()]{7,15}$/.test(form.phone))
            newErrors.phone = 'Enter a valid phone number';
        if (form.password && form.password.length < 6)
            newErrors.password = 'Password must be at least 6 characters';
        return newErrors;
    };

    const handleReset = () => {
        setForm(INITIAL_FORM);
        setErrors({});
        setPhotoPreview(null);
        setSubmitted(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length === 0) {
            setSubmitted(true);
            if (onSuccess) onSuccess(form);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
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
                                required
                                value={form.fullName}
                                onChange={handleChange('fullName')}
                                error={errors.fullName}
                                className="sm:col-span-2"
                            />
                            <FormField
                                label="Email Address"
                                icon={Mail}
                                type="email"
                                placeholder="email@example.com"
                                required
                                value={form.email}
                                onChange={handleChange('email')}
                                error={errors.email}
                            />
                            <FormField
                                label="Phone Number"
                                icon={Phone}
                                type="tel"
                                placeholder="+91 98765 43210"
                                required
                                value={form.phone}
                                onChange={handleChange('phone')}
                                error={errors.phone}
                            />
                            <FormField
                                label="Password"
                                icon={Lock}
                                type="password"
                                placeholder="Min. 6 characters"
                                required
                                value={form.password}
                                onChange={handleChange('password')}
                                error={errors.password}
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
                            required
                            value={form.street}
                            onChange={handleChange('street')}
                            error={errors.street}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FormField
                                label="City"
                                icon={Building2}
                                placeholder="Ahmedabad"
                                required
                                value={form.city}
                                onChange={handleChange('city')}
                                error={errors.city}
                            />

                            {/* State — native select, styled to match FormField */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                    State <span className="text-[#fbc02d]">*</span>
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
                                        className={`
                                            w-full pl-10 pr-4 py-3 bg-white border rounded-xl
                                            text-sm font-medium text-[#111827] appearance-none
                                            transition-all duration-200 outline-none cursor-pointer
                                            focus:ring-2 focus:ring-[#fbc02d]/25 focus:border-[#fbc02d]
                                            ${errors.state ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'}
                                        `}
                                    >
                                        <option value="" disabled>Select State</option>
                                        {STATE_OPTIONS.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                                {errors.state && (
                                    <p className="text-xs text-red-500 font-medium">{errors.state}</p>
                                )}
                            </div>

                            <FormField
                                label="ZIP / PIN Code"
                                icon={Hash}
                                placeholder="380001"
                                required
                                value={form.zip}
                                onChange={handleChange('zip')}
                                error={errors.zip}
                            />
                        </div>
                    </div>
                </FormSectionCard>

                {/* ─── Action Bar ──────────────────────────────────────── */}
                <motion.div
                    variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }}
                    className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3"
                >
                    {/* Reset — ghost style matching the table pagination ghost buttons */}
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleReset}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                    >
                        <RotateCcw size={15} strokeWidth={2.5} />
                        Reset
                    </motion.button>

                    {/* Submit — amber solid, same style as CustomerHeader "Add New Customer" button */}
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`
                            flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm
                            ${submitted
                                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                : 'bg-[#fbc02d] hover:bg-[#fbbf24] text-[#1e3a5f] shadow-[#fbc02d]/20'
                            }
                        `}
                    >
                        <UserPlus size={16} strokeWidth={2.5} />
                        {submitted ? 'Customer Added!' : 'Add Customer'}
                    </motion.button>
                </motion.div>
            </motion.div>
        </form>
    );
};

export default AddCustomerForm;
