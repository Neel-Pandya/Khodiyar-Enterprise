import React, { useState } from 'react';
import { Package, Tag, Layers, IndianRupee, Save, RotateCcw } from 'lucide-react';
import FormSectionCard from '@admin/shared/components/FormSectionCard';
import FormField from '@admin/shared/components/FormField';
import ImageUploadArea from './ImageUploadArea';
import RichTextEditor from './RichTextEditor';

const CATEGORY_OPTIONS = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'tools', label: 'Tools' },
];

const ProductForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    stock: initialData?.stock || '',
    price: initialData?.price || '',
    image: initialData?.image || null,
    details: initialData?.details || '',
    specifications: initialData?.specifications || '',
  });

  const isEdit = !!initialData;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    if (onCancel) {
        onCancel();
        return;
    }
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
    if (onSubmit) {
        onSubmit(formData);
    } else {
        console.log('Submitting Product:', formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ─── Section 1: Basic Information ─────────────────────────── */}
      <FormSectionCard title="Basic Information" icon={Package}>
        <div className="flex flex-col gap-6">
          <ImageUploadArea 
            value={formData.image} 
            onChange={(file) => handleChange('image', file)} 
          />

          <FormField
            label="Product Name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            icon={Package}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                Category
              </label>
              <div className="relative">
                <Tag
                    size={16}
                    strokeWidth={2}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <select
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-[#111827] appearance-none transition-all duration-200 outline-none cursor-pointer focus:ring-2 focus:ring-[#fbc02d]/25 focus:border-[#fbc02d] hover:border-gray-300"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                >
                  <option value="" disabled>Select Category</option>
                  {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <FormField
              label="Stock Quantity"
              type="number"
              placeholder="0"
              value={formData.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
              icon={Layers}
            />
          </div>

          <FormField
            label="Price (₹)"
            type="number"
            placeholder="0.00"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            icon={IndianRupee}
          />
        </div>
      </FormSectionCard>

      {/* ─── Section 2: Product Details ────────────────────────────── */}
      <FormSectionCard title="Product Details" icon={Tag}>
        <div className="px-1 py-2">
          <RichTextEditor
            value={formData.details}
            onChange={(val) => handleChange('details', val)}
            placeholder="Enter product description and features..."
            helperText="Format your text with bold, italic, lists, and more. HTML formatting is preserved."
          />
        </div>
      </FormSectionCard>

      {/* ─── Section 3: Product Specifications ──────────────────────── */}
      <FormSectionCard title="Product Specifications" icon={Layers}>
        <div className="px-1 py-2">
          <RichTextEditor
            value={formData.specifications}
            onChange={(val) => handleChange('specifications', val)}
            placeholder="Enter technical specifications..."
            helperText="Format your text with bold, italic, lists, and more. HTML formatting is preserved."
          />
        </div>
      </FormSectionCard>

      {/* ─── Action Bar ────────────────────────────────────────────── */}
      <footer className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <RotateCcw size={15} strokeWidth={2.5} />
          {isEdit ? 'Cancel' : 'Reset'}
        </button>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold bg-[#fbc02d] hover:bg-[#fbbf24] text-[#1e3a5f] shadow-sm shadow-[#fbc02d]/20 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Package size={16} strokeWidth={2.5} />
          {isEdit ? 'Save Changes' : 'Add Product'}
        </button>
      </footer>
    </form>
  );
};

export default ProductForm;
