import React, { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import ProductForm from '../components/ProductForm';
import { productsList } from '@data/adminMockData';

const EditProductPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Find product in mock data
    const productData = useMemo(() => {
        return productsList.find(p => p.id === parseInt(id));
    }, [id]);

    const handleSubmit = (data) => {
        console.log('Update product:', id, data);
        // TODO: API call to update
        navigate('/admin/products');
    };

    if (!productData) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <p className="text-gray-500 font-medium">Product not found.</p>
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
                initialData={productData} 
                onSubmit={handleSubmit} 
                onCancel={() => navigate('/admin/products')}
            />
        </div>
    );
};

export default EditProductPage;
