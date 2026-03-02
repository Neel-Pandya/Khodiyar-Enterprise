import React from 'react';
import { User, Mail, Phone, Lock, MapPin, Building2, Hash, Save, RotateCcw } from 'lucide-react';
import Input from '@common/Input';
import Button from '@common/Button';
import ProfileImageUpload from './ProfileImageUpload';

const EditProfileForm = () => {
    return (
        <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl shadow-primary/10 p-8 md:p-12 border border-slate-50">
            {/* Profile Image Section */}
            <ProfileImageUpload />

            {/* Title */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                    Edit Profile
                </h2>
                <p className="text-slate-400 text-sm mt-2 font-medium">
                    Keep your personal information up to date
                </p>
            </div>

            <form className="space-y-6">
                {/* Full Name */}
                <Input
                    id="fullName"
                    label="Full Name"
                    placeholder="Enter Full Name"
                    icon={User}
                    required
                />

                {/* Email + Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        id="email"
                        label="Email Address"
                        type="email"
                        placeholder="Enter Email ID"
                        icon={Mail}
                        required
                    />
                    <Input
                        id="phone"
                        label="Phone Number"
                        placeholder="1234567801"
                        icon={Phone}
                        required
                    />
                </div>

                {/* Password */}
                <Input
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="Enter Password to confirm changes"
                    icon={Lock}
                    required
                />

                {/* Street Address */}
                <Input
                    id="address"
                    label="Street Address"
                    placeholder="Enter Address"
                    icon={MapPin}
                    required
                />

                {/* City, State, Zip */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                        id="city"
                        label="City"
                        placeholder="Enter City"
                        icon={Building2}
                        required
                    />
                    <Input
                        id="state"
                        label="State"
                        placeholder="Enter State"
                        icon={MapPin}
                        required
                    />
                    <Input
                        id="zip"
                        label="ZIP Code"
                        placeholder="Enter ZIP Code"
                        icon={Hash}
                        required
                    />
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-slate-100">
                    <Button 
                        type="reset" 
                        variant="outline"
                        className="flex items-center justify-center gap-2 hover:bg-slate-100 text-slate-500 font-semibold"
                    >
                        <RotateCcw size={18} />
                        Reset
                    </Button>
                    <Button 
                        type="submit" 
                        className="px-8 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                    >
                        <Save size={18} />
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditProfileForm;
