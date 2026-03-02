import React from 'react';
import { Shield, Lock } from 'lucide-react';
import Input from '@common/Input';
import Button from '@common/Button';

const ChangePasswordForm = () => {
    return (
        <div className="bg-white w-full max-w-[480px] rounded-3xl shadow-2xl shadow-primary/10 px-10 py-10 border border-slate-50">
            {/* Shield Icon Header */}
            <div className="flex justify-center mb-8">
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary transition-transform duration-500 hover:scale-110">
                    <Shield size={32} strokeWidth={2} />
                </div>
            </div>

            {/* Title & Subtitle */}
            <div className="text-center mb-10">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                    Change Password
                </h2>
                <p className="text-slate-400 text-sm mt-2 font-medium">
                    Update your password to keep your account secure
                </p>
            </div>

            <form className="space-y-6">
                {/* Current Password */}
                <Input
                    id="currentPassword"
                    label="Current Password"
                    type="password"
                    placeholder="Enter your current password"
                    icon={Lock}
                    required
                />

                {/* New Password */}
                <Input
                    id="newPassword"
                    label="New Password"
                    type="password"
                    placeholder="Enter your new password"
                    icon={Lock}
                    required
                />

                {/* Confirm Password */}
                <Input
                    id="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm your new password"
                    icon={Lock}
                    required
                />

                {/* Submit Button */}
                <div className="pt-2">
                    <Button 
                        type="submit" 
                        className="w-full h-12 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        Update Password
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ChangePasswordForm;
