import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Lock, ShieldCheck, KeyRound, RefreshCw, Loader2 } from 'lucide-react';
import FormField from '@admin/shared/components/FormField';
import { useChangePasswordMutation } from '@/hooks/useAuthQueries';
import useAuthStore from '../../../../store/useAuthStore';
import * as toast from '@/utils/toast';

const SecuritySettings = () => {
    const { logout } = useAuthStore();
    const { mutateAsync: changePassword, isPending } = useChangePasswordMutation();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const PASSWORD_COMPLEXITY_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/;

    const onSubmit = async (data) => {
        try {
            await changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            toast.success('Password changed successfully! Logging out...');
            reset();
            // Logout after 1 second
            setTimeout(() => {
                logout();
            }, 1000);
        } catch (error) {
            const errorMessage = error.message || 'Failed to change password';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 text-center sm:text-left">Security & Privacy</h2>
                    <p className="text-sm text-gray-400 mt-0.5 text-center sm:text-left">Manage your password and security preferences</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                <div className="max-w-2xl mx-auto space-y-8">
                    {/* Security Info Card */}
                    <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                        <div className="p-2 bg-white rounded-xl text-[#1e3a5f] shadow-sm border border-blue-100">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-blue-900">Keep your account secure</p>
                            <p className="text-xs text-blue-700/70 mt-0.5">We recommend using a strong password that you don&apos;t use elsewhere. Minimum 8 characters with a mix of letters, numbers, and symbols.</p>
                        </div>
                    </div>

                    {/* Password Form - Vertical Stack */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <Controller
                                name="currentPassword"
                                control={control}
                                rules={{
                                    required: 'Current password is required',
                                }}
                                render={({ field }) => (
                                    <FormField
                                        label="Current Password"
                                        icon={Lock}
                                        type="password"
                                        placeholder="Type your current password"
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors.currentPassword && (
                                <p className="mt-1 text-xs font-medium text-red-500">
                                    {errors.currentPassword.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Controller
                                name="newPassword"
                                control={control}
                                rules={{
                                    required: 'New password is required',
                                    validate: (value) => {
                                        if (value.length < 8) {
                                            return 'Password must be at least 8 characters long';
                                        }
                                        return PASSWORD_COMPLEXITY_REGEX.test(value)
                                            || 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
                                    },
                                }}
                                render={({ field }) => (
                                    <FormField
                                        label="New Password"
                                        icon={KeyRound}
                                        type="password"
                                        placeholder="Min. 8 characters"
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors.newPassword && (
                                <p className="mt-1 text-xs font-medium text-red-500">
                                    {errors.newPassword.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <Controller
                                name="confirmPassword"
                                control={control}
                                rules={{
                                    required: 'Please confirm your new password',
                                    validate: (value, formValues) =>
                                        value === formValues.newPassword || 'Passwords do not match',
                                }}
                                render={({ field }) => (
                                    <FormField
                                        label="Confirm New Password"
                                        icon={KeyRound}
                                        type="password"
                                        placeholder="Repeat new password"
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-xs font-medium text-red-500">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-8 border-t border-gray-50 flex justify-end">
                        <button
                            type="submit"
                            disabled={isPending}
                            className={`
                                flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold
                                transition-all hover:scale-105 active:scale-95 shadow-lg
                                w-full sm:w-auto
                                ${isPending
                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                    : 'bg-[#1e3a5f] text-white shadow-[#1e3a5f]/20 hover:bg-[#152943]'
                                }
                            `}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={18} />
                                    Update Password
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SecuritySettings;
