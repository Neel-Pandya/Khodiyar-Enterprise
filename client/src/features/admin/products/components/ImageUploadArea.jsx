import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const MAX_IMAGES = 4;
const MAX_FILE_SIZE = 500 * 1024; // 500KB limit (matching backend)

const ImageUploadArea = ({ value = [], onChange }) => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  
  // Ensure value is always an array
  const images = Array.isArray(value) ? value : [];

  // Helper to get preview URL
  const getPreviewUrl = useCallback((file) => {
    if (!file) return null;
    if (typeof file === 'string') return file;
    if (file instanceof File || file instanceof Blob) {
      try {
        return URL.createObjectURL(file);
      } catch (e) {
        console.error("Failed to create object URL", e);
        return null;
      }
    }
    return null;
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setError(null);
    
    if (files.length === 0) return;
    
    // Check if adding these files would exceed max
    if (images.length + files.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed. You can only add ${MAX_IMAGES - images.length} more.`);
      return;
    }
    
    // Validate file sizes
    const validFiles = [];
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File "${file.name}" exceeds 500KB limit.`);
        continue;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError(`File "${file.name}" is not an image.`);
        continue;
      }
      
      validFiles.push(file);
    }
    
    if (validFiles.length > 0) {
      const newImages = [...images, ...validFiles];
      onChange(newImages);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index) => {
    const imageToRemove = images[index];
    
    // Revoke object URL if it's a blob URL
    if (imageToRemove instanceof File) {
      const url = getPreviewUrl(imageToRemove);
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    }
    
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
    setError(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    
    setError(null);
    
    // Check if adding these files would exceed max
    if (images.length + files.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed. You can only add ${MAX_IMAGES - images.length} more.`);
      return;
    }
    
    // Validate file sizes
    const validFiles = [];
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File "${file.name}" exceeds 500KB limit.`);
        continue;
      }
      
      if (!file.type.startsWith('image/')) {
        setError(`File "${file.name}" is not an image.`);
        continue;
      }
      
      validFiles.push(file);
    }
    
    if (validFiles.length > 0) {
      const newImages = [...images, ...validFiles];
      onChange(newImages);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700">
          Product Images <span className="text-rose-500">*</span>
          <span className="text-xs text-slate-400 font-normal ml-2">
            ({images.length}/{MAX_IMAGES})
          </span>
        </label>
      </div>
      
      {error && (
        <div className="text-xs text-rose-500 bg-rose-50 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((image, index) => {
            const previewUrl = getPreviewUrl(image);
            return (
              <div 
                key={index} 
                className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-50"
              >
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt={`Product ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <ImageIcon size={32} />
                  </div>
                )}
                <button 
                  onClick={() => handleRemove(index)}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  type="button"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/30 text-white text-xs py-1 px-2 text-center">
                  {index === 0 ? 'Primary' : `${index + 1}`}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Upload Area - Show only if less than max images */}
      {images.length < MAX_IMAGES && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="
            relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300
            border-slate-200 hover:border-[#1e3a5f]/40 hover:bg-[#1e3a5f]/5
          "
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/jpeg,image/png,image/jpg,image/webp" 
            className="hidden"
            multiple
          />
          
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:text-[#1e3a5f] transition-colors">
            <Upload size={20} />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-600">
              {images.length === 0 ? 'Click or drag to upload images' : 'Add more images'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              JPG, PNG, WEBP (Max. 500KB each)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadArea;
