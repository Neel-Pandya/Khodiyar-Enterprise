import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Package, Tag, Layers, IndianRupee, RotateCcw, Loader2 } from 'lucide-react';
import FormSectionCard from '@admin/shared/components/FormSectionCard';
import ImageUploadArea from './ImageUploadArea';
import RichTextEditor from './RichTextEditor';
import useCategoryStore from '@/store/useCategoryStore';

const ProductForm = ({ initialData, onSubmit, onCancel, isLoading = false }) => {
  const { categories, hasFetched, fetchCategories, isLoading: categoriesLoading, error: categoriesError } = useCategoryStore();
  
  const isEdit = !!initialData;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      category_id: initialData?.category_id || '',
      stock_quantity: initialData?.stock_quantity ?? 0,
      price: initialData?.price || '',
      is_active: initialData?.is_active ?? true,
      images: initialData?.images || [],
      description: initialData?.description || '',
      included: initialData?.included || '',
      specification: initialData?.specification || '',
    },
  });

  // Fetch active categories on mount
  useEffect(() => {
    if (!hasFetched) {
      fetchCategories({ status: 'active', limit: 100 });
    }
  }, [hasFetched, fetchCategories]);

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        category_id: initialData.category_id || '',
        stock_quantity: initialData.stock_quantity ?? 0,
        price: initialData.price || '',
        is_active: initialData.is_active ?? true,
        images: initialData.images || [],
        description: initialData.description || '',
        included: initialData.included || '',
        specification: initialData.specification || '',
      });
    }
  }, [initialData, reset]);

  const handleReset = () => {
    if (onCancel) {
      onCancel();
      return;
    }
    reset({
      name: '',
      category_id: '',
      stock_quantity: 0,
      price: '',
      is_active: true,
      images: [],
      description: '',
      included: '',
      specification: '',
    });
  };

  const onFormSubmit = (data) => {
    // Convert stock_quantity to number before submitting
    const payload = {
      ...data,
      stock_quantity: parseInt(data.stock_quantity) || 0,
      price: parseFloat(data.price) || 0,
      is_active: data.is_active,
    };
    
    if (onSubmit) onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6" noValidate>
      {/* ─── Section 1: Basic Information ─────────────────────────── */}
      <FormSectionCard title="Basic Information" icon={Package}>
        <div className="flex flex-col gap-6">
          {/* Images */}
          <Controller
            name="images"
            control={control}
            rules={{
              validate: (value) => value && value.length > 0 || 'At least one image is required',
            }}
            render={({ field }) => (
              <div>
                <ImageUploadArea 
                  value={field.value} 
                  onChange={field.onChange} 
                />
                {errors.images && (
                  <p className="mt-1 text-xs font-medium text-red-500">{errors.images.message}</p>
                )}
              </div>
            )}
          />

          {/* Product Name */}
          <Controller
            name="name"
            control={control}
            rules={{
              required: 'Product name is required',
              validate: (value) => value.trim().length >= 2 || 'Name must be at least 2 characters',
            }}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Package
                    size={16}
                    strokeWidth={2}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Enter product name"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#111827] font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-[#fbc02d]/25 focus:border-[#fbc02d] hover:border-gray-300"
                  />
                </div>
                {errors.name && (
                  <p className="text-xs font-medium text-red-500">{errors.name.message}</p>
                )}
              </div>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <Controller
              name="category_id"
              control={control}
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag
                      size={16}
                      strokeWidth={2}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <select
                      value={field.value}
                      onChange={field.onChange}
                      disabled={categoriesLoading}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-[#111827] appearance-none transition-all duration-200 outline-none cursor-pointer focus:ring-2 focus:ring-[#fbc02d]/25 focus:border-[#fbc02d] hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="" disabled>
                        {categoriesLoading ? 'Loading categories...' : 'Select Category'}
                      </option>
                      {categories.filter(c => c.status === 'active').map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  {errors.category_id && (
                    <p className="text-xs font-medium text-red-500">{errors.category_id.message}</p>
                  )}
                  {categoriesError && (
                    <p className="text-xs text-rose-500">{categoriesError}</p>
                  )}
                </div>
              )}
            />

            {/* Stock Quantity - Fixed to allow proper editing */}
            <Controller
              name="stock_quantity"
              control={control}
              rules={{
                required: 'Stock quantity is required',
                validate: (value) => {
                  const num = parseInt(value);
                  return (!isNaN(num) && num >= 0) || 'Stock must be 0 or greater';
                },
              }}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    Stock Quantity <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Layers
                      size={16}
                      strokeWidth={2}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                      type="number"
                      min="0"
                      value={field.value}
                      onChange={(e) => {
                        // Allow empty string during typing, store as-is
                        const val = e.target.value;
                        field.onChange(val === '' ? '' : val);
                      }}
                      onBlur={() => {
                        // Convert to number on blur
                        const num = parseInt(field.value);
                        field.onChange(isNaN(num) ? 0 : num);
                      }}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#111827] font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-[#fbc02d]/25 focus:border-[#fbc02d] hover:border-gray-300"
                    />
                  </div>
                  {errors.stock_quantity && (
                    <p className="text-xs font-medium text-red-500">{errors.stock_quantity.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price */}
            <Controller
              name="price"
              control={control}
              rules={{
                required: 'Price is required',
                validate: (value) => {
                  const num = parseFloat(value);
                  return (!isNaN(num) && num > 0) || 'Price must be greater than 0';
                },
              }}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <IndianRupee
                      size={16}
                      strokeWidth={2}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#111827] font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-[#fbc02d]/25 focus:border-[#fbc02d] hover:border-gray-300"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-xs font-medium text-red-500">{errors.price.message}</p>
                  )}
                </div>
              )}
            />

            {/* Active Status Toggle */}
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Status
                  </label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#fbc02d]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#fbc02d]"></div>
                    </label>
                    <span className={`text-sm font-medium ${field.value ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {field.value ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Toggle to activate or deactivate the product
                  </p>
                </div>
              )}
            />
          </div>
        </div>
      </FormSectionCard>

      {/* ─── Section 2: Product Description ────────────────────────── */}
      <FormSectionCard title="Product Description" icon={Tag}>
        <div className="px-1 py-2">
          <Controller
            name="description"
            control={control}
            rules={{
              required: 'Description is required',
              validate: (value) => value.trim().length >= 10 || 'Description must be at least 10 characters',
            }}
            render={({ field }) => (
              <div>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter product description..."
                  helperText="Describe the product features, benefits, and details."
                />
                {errors.description && (
                  <p className="mt-1 text-xs font-medium text-red-500">{errors.description.message}</p>
                )}
              </div>
            )}
          />
        </div>
      </FormSectionCard>

      {/* ─── Section 3: What's Included ─────────────────────────────── */}
      <FormSectionCard title="What's Included" icon={Package}>
        <div className="px-1 py-2">
          <Controller
            name="included"
            control={control}
            rules={{
              required: 'Included items is required',
              validate: (value) => value.trim().length >= 2 || 'Must be at least 2 characters',
            }}
            render={({ field }) => (
              <div>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter items included with the product..."
                  helperText="List all items that come with the product."
                />
                {errors.included && (
                  <p className="mt-1 text-xs font-medium text-red-500">{errors.included.message}</p>
                )}
              </div>
            )}
          />
        </div>
      </FormSectionCard>

      {/* ─── Section 4: Product Specifications ──────────────────────── */}
      <FormSectionCard title="Product Specifications" icon={Layers}>
        <div className="px-1 py-2">
          <Controller
            name="specification"
            control={control}
            rules={{
              required: 'Specifications are required',
              validate: (value) => value.trim().length >= 2 || 'Must be at least 2 characters',
            }}
            render={({ field }) => (
              <div>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter technical specifications..."
                  helperText="Include dimensions, weight, materials, and other specs."
                />
                {errors.specification && (
                  <p className="mt-1 text-xs font-medium text-red-500">{errors.specification.message}</p>
                )}
              </div>
            )}
          />
        </div>
      </FormSectionCard>

      {/* ─── Action Bar ────────────────────────────────────────────── */}
      <footer className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={handleReset}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <RotateCcw size={15} strokeWidth={2.5} />
          {isEdit ? 'Cancel' : 'Reset'}
        </button>
        <button
          type="submit"
          disabled={isLoading || categoriesLoading}
          className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold bg-[#fbc02d] hover:bg-[#fbbf24] text-[#1e3a5f] shadow-sm shadow-[#fbc02d]/20 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
          ) : (
            <Package size={16} strokeWidth={2.5} />
          )}
          {isEdit ? 'Save Changes' : 'Add Product'}
        </button>
      </footer>
    </form>
  );
};

export default ProductForm;
