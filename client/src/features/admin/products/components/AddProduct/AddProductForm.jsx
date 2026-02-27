import React, { useState } from 'react';
import { Package, Tag, Layers, IndianRupee, Save, RotateCcw } from 'lucide-react';
import Input from '@common/Input';
import Button from '@common/Button';
import ImageUploadArea from './ImageUploadArea';
import RichTextEditor from './RichTextEditor';

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    stock: '',
    price: '',
    image: null,
    details: '',
    specifications: '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormData({
      name: '',
      category: '',
      stock: '',
      price: '',
      image: null,
      details: '',
      specifications: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting Product:', formData);
    // Add submission logic here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Basic Information Section */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
          <div className="p-2 bg-[#f0f4f8] rounded-xl">
            <Package size={16} className="text-[#1e3a5f]" strokeWidth={2.5} />
          </div>
          <h2 className="text-sm md:text-base font-semibold text-[#111827] tracking-tight">
            Basic Information
          </h2>
        </div>

        <div className="px-6 py-6 space-y-6">
          <ImageUploadArea 
            value={formData.image} 
            onChange={(file) => handleChange('image', file)} 
          />

          <Input
            label="Product Name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            icon={Package}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium text-slate-700">
                Category <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#1E3A5F]/5 focus:border-[#1E3A5F]/50 appearance-none transition-all duration-200"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                >
                  <option value="" disabled>Select Category</option>
                  <option value="electronics">Electronics</option>
                  <option value="furniture">Furniture</option>
                  <option value="tools">Tools</option>
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Tag size={18} />
                </div>
              </div>
            </div>

            <Input
              label="Stock Quantity"
              type="number"
              placeholder="0"
              value={formData.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
              required
              icon={Layers}
            />
          </div>

          <Input
            label="Price (₹)"
            type="number"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            required
            icon={IndianRupee}
          />
        </div>
      </section>

      {/* 2. Product Details Section */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
          <div className="p-2 bg-[#f0f4f8] rounded-xl">
            <Tag size={16} className="text-[#1e3a5f]" strokeWidth={2.5} />
          </div>
          <h2 className="text-sm md:text-base font-semibold text-[#111827] tracking-tight">
            Product Details
          </h2>
        </div>
        <div className="px-6 py-6">
          <RichTextEditor
            value={formData.details}
            onChange={(val) => handleChange('details', val)}
            placeholder="Enter product description and features..."
            helperText="Format your text with bold, italic, lists, and more. HTML formatting is preserved."
          />
        </div>
      </section>

      {/* 3. Product Specifications Section */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
          <div className="p-2 bg-[#f0f4f8] rounded-xl">
            <Layers size={16} className="text-[#1e3a5f]" strokeWidth={2.5} />
          </div>
          <h2 className="text-sm md:text-base font-semibold text-[#111827] tracking-tight">
            Product Specifications
          </h2>
        </div>
        <div className="px-6 py-6">
          <RichTextEditor
            value={formData.specifications}
            onChange={(val) => handleChange('specifications', val)}
            placeholder="Enter technical specifications..."
            helperText="Format your text with bold, italic, lists, and more. HTML formatting is preserved."
          />
        </div>
      </section>

      {/* Footer Actions */}
      <footer className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <RotateCcw size={15} strokeWidth={2.5} />
          Reset
        </button>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold bg-[#fbc02d] hover:bg-[#fbbf24] text-[#1e3a5f] shadow-sm shadow-[#fbc02d]/20 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Package size={16} strokeWidth={2.5} />
          Add Product
        </button>
      </footer>
    </form>
  );
};

export default AddProductForm;
