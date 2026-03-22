import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, RefreshCw } from 'lucide-react';
import FormField from '@admin/shared/components/FormField';

const SecuritySettings = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 text-center sm:text-left">Security & Privacy</h2>
                    <p className="text-sm text-gray-400 mt-0.5 text-center sm:text-left">Manage your password and security preferences</p>
                </div>
            </div>

            <div className="p-8">
                <div className="max-w-2xl mx-auto space-y-8">
                    {/* Security Info Card */}
                    <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                        <div className="p-2 bg-white rounded-xl text-[#1e3a5f] shadow-sm border border-blue-100">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-blue-900">Keep your account secure</p>
                            <p className="text-xs text-blue-700/70 mt-0.5">We recommend using a strong password that you don't use elsewhere. Minimum 8 characters with a mix of letters, numbers, and symbols.</p>
                        </div>
                    </div>

                    {/* Password Form - Vertical Stack */}
                    <div className="flex flex-col gap-6">
                        <FormField
                            label="Current Password"
                            icon={Lock}
                            type="password"
                            value={formData.currentPassword}
                            onChange={(e) => handleChange(e, 'currentPassword')}
                            placeholder="Type your current password"
                        />
                        <FormField
                            label="New Password"
                            icon={KeyRound}
                            type="password"
                            value={formData.newPassword}
                            onChange={(e) => handleChange(e, 'newPassword')}
                            placeholder="Min. 8 characters"
                        />
                        <FormField
                            label="Confirm New Password"
                            icon={KeyRound}
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleChange(e, 'confirmPassword')}
                            placeholder="Repeat new password"
                        />
                    </div>

                    {/* Action Bar */}
                    <div className="pt-8 border-t border-gray-50 flex justify-end">
                        <button className="flex items-center justify-center gap-2 px-8 py-3 bg-[#1e3a5f] text-white rounded-xl text-sm font-semibold hover:bg-[#152943] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#1e3a5f]/20 w-full sm:w-auto">
                            <RefreshCw size={18} />
                            Update Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecuritySettings;
