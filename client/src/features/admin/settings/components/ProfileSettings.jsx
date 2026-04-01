import React, { useState, useRef, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { User, Mail, Save, Camera, Loader2, X } from 'lucide-react';
import FormField from '@admin/shared/components/FormField';
import useAuthStore from '../../../../store/useAuthStore';
import * as toast from '@/utils/toast';

const ProfileSettings = () => {
    const { user, updateProfile, isLoading } = useAuthStore();
    const fileInputRef = useRef(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isDirty }, 
    } = useForm({
        defaultValues: {
            name: '',
        },
    });

    // Initialize form data when user data is available
    useEffect(() => {
        if (user) {
            reset({
                name: user.name || '',
            });
            setAvatarPreview(user.avatar || null);
        }
    }, [user, reset]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select a valid image file');
                return;
            }
            // Validate file size (max 1MB)
            if (file.size > 1 * 1024 * 1024) {
                toast.error('Image size should not exceed 1MB');
                return;
            }

            setAvatarFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            await updateProfile(formData);
            setAvatarFile(null);
            toast.success('Profile updated successfully!');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update profile';
            toast.error(errorMessage);
        }
    };

    // Get initials for avatar fallback
    const getInitials = (name) => {
        if (!name) return '??';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleClearAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(user?.avatar || null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const hasChanges = isDirty || avatarFile !== null;

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 text-center sm:text-left">Profile Information</h2>
                    <p className="text-sm text-gray-400 mt-0.5 text-center sm:text-left">Update your name and profile picture</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    {/* Left side: Avatar Upload */}
                    <div className="flex flex-col items-center gap-4 lg:col-span-1">
                        <div className="relative group">
                            <div
                                onClick={handleAvatarClick}
                                className="w-32 h-32 rounded-3xl bg-[#fbc02d] flex items-center justify-center text-[#1e3a5f] text-4xl font-black shadow-xl shadow-[#fbc02d]/20 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                            >
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    getInitials(user?.name)
                                )}
                            </div>
                            {avatarPreview && avatarFile && (
                                <button
                                    type="button"
                                    onClick={handleClearAvatar}
                                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full shadow-lg text-white hover:bg-red-600 transition-colors z-10"
                                    title="Remove selected image"
                                >
                                    <X size={14} />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleAvatarClick}
                                className="absolute -bottom-2 -right-2 p-2.5 bg-white rounded-2xl shadow-xl border border-gray-100 text-[#1e3a5f] hover:text-[#fbc02d] transition-colors group-hover:scale-110 duration-200"
                            >
                                <Camera size={18} />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-gray-800">{user?.name || 'Loading...'}</p>
                            <p className="text-xs text-gray-400 font-medium tracking-wide uppercase mt-0.5">
                                {user?.role || 'Admin'}
                            </p>
                        </div>
                        <p className="text-xs text-gray-400 text-center">
                            Click to upload new avatar
                            <br />
                            Max 1MB, JPG/PNG
                        </p>
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
                                <div className="md:col-span-2">
                                    <Controller
                                        name="name"
                                        control={control}
                                        rules={{
                                            required: 'Full name is required',
                                            validate: (value) =>
                                                value.trim().length >= 2 ||
                                                'Name must be at least 2 characters long',
                                        }}
                                        render={({ field }) => (
                                            <FormField
                                                label="Full Name"
                                                icon={User}
                                                placeholder="Enter your full name"
                                                value={field.value}
                                                onChange={field.onChange}
                                                className="md:col-span-2"
                                            />
                                        )}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs font-medium text-red-500">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <FormField
                                        label="Email Address"
                                        icon={Mail}
                                        type="email"
                                        value={user?.email || ''}
                                        disabled={true}
                                        placeholder="Your email address"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                Email address cannot be changed. Contact support if you need to update it.
                            </p>
                        </div>

                        {/* Action Bar */}
                        <div className="pt-8 border-t border-gray-50 flex justify-end">
                            <button
                                type="submit"
                                disabled={!hasChanges || isLoading}
                                className={`
                                    flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold
                                    transition-all hover:scale-105 active:scale-95 shadow-lg
                                    w-full sm:w-auto
                                    ${hasChanges && !isLoading
                                        ? 'bg-[#1e3a5f] text-white shadow-[#1e3a5f]/20 hover:bg-[#152943]'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                    }
                                `}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProfileSettings;
