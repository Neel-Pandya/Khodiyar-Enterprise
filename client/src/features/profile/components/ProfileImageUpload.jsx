import React, { useState, useRef } from 'react';
import { Camera } from 'lucide-react';

const ProfileImageUpload = () => {
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="flex justify-center mb-8 relative">
            {/* Profile Image Wrapper */}
            <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-105 group">
                {preview ? (
                    <img 
                        src={preview} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-slate-300">
                        <Camera size={32} strokeWidth={1.5} />
                        <span className="text-[10px] uppercase tracking-widest font-bold mt-1">Profile</span>
                    </div>
                )}
            </div>

            {/* Camera Overlay/Button */}
            <button 
                type="button"
                onClick={triggerFileInput}
                className="absolute bottom-1 right-[38%] bg-primary text-white p-2.5 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 hover:rotate-12 group-hover:scale-110"
                aria-label="Upload profile picture"
            >
                <Camera size={18} strokeWidth={2.5} />
            </button>

            {/* Hidden File Input */}
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*" 
                className="hidden" 
            />
        </div>
    );
};

export default ProfileImageUpload;
