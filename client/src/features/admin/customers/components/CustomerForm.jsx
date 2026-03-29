import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    User, Mail, Lock, UserPlus, RotateCcw, ChevronDown,
} from 'lucide-react';

import FormSectionCard from '@admin/shared/components/FormSectionCard';
import FormField from '@admin/shared/components/FormField';
import PhotoUpload from './PhotoUpload';

const INITIAL_FORM = {
    fullName: '',
    email: '',
    password: '',
    status: 'active',
};

const PASSWORD_COMPLEXITY_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/;

const CustomerForm = ({ initialData, onSubmit, onCancel }) => {
    const [photoPreview, setPhotoPreview] = useState(initialData?.photo || null);
    const [submitted, setSubmitted] = useState(false);

    const isEdit = !!initialData;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fullName: initialData?.name || '',
            email: initialData?.email || '',
            password: initialData?.password || '',
            status: (initialData?.status || 'active').toLowerCase(), // Normalize initial status
        },
    });

    useEffect(() => {
        reset({
            fullName: initialData?.name || '',
            email: initialData?.email || '',
            password: initialData?.password || '',
            status: (initialData?.status || 'active').toLowerCase(), // Normalize status on reset
        });
        setPhotoPreview(initialData?.photo || null);
        setSubmitted(false);
    }, [initialData, reset]);

    const handlePhotoChange = (file) => {
        const url = URL.createObjectURL(file);
        setPhotoPreview(url);
    };

    const handleReset = () => {
        if (onCancel) {
            onCancel();
            return;
        }
        reset(INITIAL_FORM);
        setPhotoPreview(null);
        setSubmitted(false);
    };

    const onFormSubmit = (data) => {
        const payload = {
            name: data.fullName.trim(),
            status: data.status.toLowerCase(), // Normalize to lowercase for backend
            role: 'user',
        };

        // Only include password if provided (required for create, optional for edit)
        if (data.password.trim()) {
            payload.password = data.password.trim();
        }

        setSubmitted(true);
        if (onSubmit) onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
            <div
                className="flex flex-col gap-6"
            >
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
                            <div className="sm:col-span-2">
                                <Controller
                                    name="fullName"
                                    control={control}
                                    rules={{
                                        required: 'Full name is required',
                                        validate: (value) => value.trim().length >= 2
                                            || 'Name must be at least 2 characters long',
                                    }}
                                    render={({ field }) => (
                                        <FormField
                                            label="Full Name"
                                            icon={User}
                                            placeholder="e.g. Neel Pandya"
                                            value={field.value}
                                            onChange={field.onChange}
                                            className="sm:col-span-2"
                                        />
                                    )}
                                />
                                {errors.fullName && (
                                    <p className="mt-1 text-xs font-medium text-red-500">{errors.fullName.message}</p>
                                )}
                            </div>

                            <div>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{
                                        required: 'Email is required',
                                        validate: (value) => {
                                            if (!value.trim()) return 'Email is required';
                                            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
                                                || 'Invalid email format';
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormField
                                            label="Email Address"
                                            icon={Mail}
                                            type="email"
                                            placeholder="email@example.com"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs font-medium text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <Controller
                                    name="status"
                                    control={control}
                                    rules={{
                                        required: 'Status is required',
                                    }}
                                    render={({ field }) => (
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                                Status
                                            </label>

                                            <div className="relative">
                                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                    <User size={16} strokeWidth={2} />
                                                </div>

                                                <select
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    className="
                                                        w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#111827]
                                                        font-medium transition-all duration-200 outline-none
                                                        focus:ring-2 focus:ring-[#fbc02d]/25 focus:border-[#fbc02d]
                                                        hover:border-gray-300 appearance-none
                                                    "
                                                >
                                                     <option value="active">Active</option>
                                                     <option value="inactive">Inactive</option>
                                                     <option value="suspended">Suspended</option>
                                                </select>

                                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                    <ChevronDown size={16} strokeWidth={2} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                />
                                {errors.status && (
                                    <p className="mt-1 text-xs font-medium text-red-500">{errors.status.message}</p>
                                )}
                            </div>

                            {!isEdit && (
                            <div className="sm:col-span-2">
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{
                                        required: isEdit ? false : 'Password is required',
                                        validate: (value) => {
                                            const trimmedPassword = value.trim();

                                            if (isEdit && !trimmedPassword) {
                                                return true;
                                            }

                                            if (trimmedPassword.length < 8) {
                                                return 'Password must be at least 8 characters long';
                                            }

                                            return PASSWORD_COMPLEXITY_REGEX.test(trimmedPassword)
                                                || 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormField
                                            label="Password"
                                            icon={Lock}
                                            type="password"
                                            placeholder="Min. 8 characters with complexity"
                                            value={field.value}
                                            onChange={field.onChange}
                                            className="sm:col-span-2"
                                        />
                                    )}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-xs font-medium text-red-500">{errors.password.message}</p>
                                )}
                            </div>
                            )}
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
                        {isEdit ? 'Cancel' : 'Reset'}
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
                        {isEdit ? <RotateCcw size={16} strokeWidth={2.5} /> : <UserPlus size={16} strokeWidth={2.5} />}
                        {submitted ? (isEdit ? 'Changes Saved!' : 'Customer Added!') : (isEdit ? 'Save Changes' : 'Add Customer')}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default CustomerForm;
