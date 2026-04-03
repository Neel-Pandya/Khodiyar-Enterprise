import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import ProductForm from '../components/ProductForm';
import { useCreateProductMutation } from '@/hooks/useProductQueries';
import * as toast from '@/utils/toast';

const AddProductPage = () => {
    const navigate = useNavigate();
    const { mutateAsync: createProduct, isPending } = useCreateProductMutation();

    const handleSubmit = async (data) => {
        // Validate at least one image
        if (!data.images || data.images.length === 0) {
            toast.error('Please upload at least one product image');
            return;
        }
        
        try {
            await createProduct(data);
            toast.success('Product created successfully!');
            navigate('/admin/products');
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Failed to create product';
            toast.error(errorMessage);
            console.error('Error creating product:', err);
        }
    };

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto pb-10 px-4 md:px-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
                        aria-label="Back to products"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
                            Add New Product
                        </h1>
                        <p className="text-gray-400 mt-0.5 text-xs sm:text-sm font-medium">
                            Fill in the product details below
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Form */}
            <ProductForm onSubmit={handleSubmit} isLoading={isPending} />
        </div>
    );
};

export default AddProductPage;
