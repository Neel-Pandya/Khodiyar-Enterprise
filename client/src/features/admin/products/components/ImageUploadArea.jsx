import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUploadArea = ({ value, onChange }) => {
  const fileInputRef = useRef(null);
  
  // Helper to get preview URL
  const getPreviewUrl = (val) => {
    if (!val) return null;
    if (typeof val === 'string') return val;
    if (val instanceof File || val instanceof Blob) {
      try {
        return URL.createObjectURL(val);
      } catch (e) {
        console.error("Failed to create object URL", e);
        return null;
      }
    }
    return null;
  };

  const [preview, setPreview] = useState(() => getPreviewUrl(value));

  // Sync preview if value changes externally (e.g. initial load)
  React.useEffect(() => {
    const newPreview = getPreviewUrl(value);
    setPreview(newPreview);

    // Cleanup: revoke object URLs if they were created from Files
    return () => {
      if (newPreview && newPreview.startsWith('blob:')) {
        URL.revokeObjectURL(newPreview);
      }
    };
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      
      // The useEffect will handle the setPreview and revokeold via value prop change
      onChange(file);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-700">
        Product Image <span className="text-rose-500">*</span>
      </label>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300
          ${preview ? 'border-slate-200 bg-slate-50' : 'border-slate-200 hover:border-[#1e3a5f]/40 hover:bg-[#1e3a5f]/5'}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/jpeg,image/png,image/jpg" 
          className="hidden" 
        />
        
        {preview ? (
          <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden shadow-sm group">
            <img src={preview} alt="Product preview" className="w-full h-full object-contain" />
            <button 
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:text-[#1e3a5f] transition-colors">
              <Upload size={24} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-600">Click to upload product image</p>
              <p className="text-xs text-slate-400 mt-1">JPG, PNG, or JPEG (Max. 5MB)</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploadArea;
