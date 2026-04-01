import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const FormField = ({
    label,
    icon: Icon,
    type = 'text',
    placeholder = '',
    value,
    onChange,
    disabled = false,
    className = '',
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                {label}
            </label>

            <div className="relative">
                {Icon && (
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Icon size={16} strokeWidth={2} />
                    </div>
                )}

                <input
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    readOnly={disabled}
                    className={`
                        w-full ${Icon ? 'pl-10' : 'pl-4'} ${isPassword ? 'pr-10' : 'pr-4'}
                        py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#111827]
                        placeholder:text-gray-400 font-medium
                        transition-all duration-200 outline-none
                        focus:ring-2 focus:ring-[#fbc02d]/25 focus:border-[#fbc02d]
                        hover:border-gray-300
                        ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-60' : ''}
                    `}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default FormField;
