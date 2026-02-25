import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router';

const ProductHeader = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
                    Products Management
                </h1>
                <p className="text-gray-500 mt-1 text-sm font-medium">
                    View and manage all your solar product inventory
                </p>
            </div>
            <button
                onClick={() => navigate('/admin/products/add')}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#fbc02d] hover:bg-[#fbbf24] hover:scale-105 active:scale-95 text-[#1e3a5f] rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm shadow-[#fbc02d]/20"
            >
                <Plus size={18} strokeWidth={2.5} />
                Add New Product
            </button>
        </div>
    );
};

export default ProductHeader;
