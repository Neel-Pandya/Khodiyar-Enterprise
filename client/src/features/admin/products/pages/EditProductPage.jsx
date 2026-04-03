import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import ProductForm from '../components/ProductForm';
import { useProductQuery, useUpdateProductMutation } from '@/hooks/useProductQueries';
import * as toast from '@/utils/toast';

const EditProductPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: product, isLoading: isFetching } = useProductQuery(id);
    const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProductMutation();
    const isLoading = isFetching || isUpdating;

    const handleSubmit = async (data) => {
        try {
            await updateProduct({ id, productData: data });
            toast.success('Product updated successfully!');
            navigate('/admin/products');
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Failed to update product';
            toast.error(errorMessage);
            console.error('Error updating product:', err);
        }
    };

    if (isFetching && !product) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fbc02d]"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <p className="text-gray-500 font-medium">
                    Product not found.
                </p>
                <button 
                  onClick={() => navigate('/admin/products')}
                  className="text-[#1e3a5f] hover:underline"
                >
                  Return to Products
                </button>
            </div>
        );
    }

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
                            Edit Product
                        </h1>
                        <p className="text-gray-400 mt-0.5 text-xs sm:text-sm font-medium">
                            Update the product information below
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Form */}
            <ProductForm 
                initialData={product} 
                onSubmit={handleSubmit} 
                onCancel={() => navigate('/admin/products')}
                isLoading={isLoading}
            />
        </div>
    );
};

export default EditProductPage;
