import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Upload } from 'lucide-react';

const PhotoUpload = ({ preview, onFileChange }) => {
    const inputRef = useRef(null);

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file && onFileChange) onFileChange(file);
    };

    return (
        <div className="flex flex-col items-center gap-3">
            {/* Avatar Preview */}
            <div className="relative w-24 h-24 rounded-full bg-[#f0f4f8] border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {preview ? (
                    <img
                        src={preview}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <User size={36} className="text-gray-300" strokeWidth={1.5} />
                )}
            </div>

            {/* Upload Button — reuses whileHover/whileTap pattern from ExportButton & FilterButton */}
            <div className="flex flex-col items-center gap-1">
                <motion.button
                    type="button"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => inputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:border-[#fbc02d] hover:text-[#1e3a5f] transition-all duration-200"
                >
                    <Upload size={13} strokeWidth={2.5} />
                    Upload Photo
                </motion.button>
                <p className="text-[10px] text-gray-400 font-medium tracking-wide">
                    JPG, PNG, JPEG
                </p>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpg,image/png,image/jpeg"
                className="hidden"
                onChange={handleChange}
            />
        </div>
    );
};

export default PhotoUpload;
