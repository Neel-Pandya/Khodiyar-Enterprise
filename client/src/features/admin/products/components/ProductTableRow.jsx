import { Link } from 'react-router';
import { Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import * as toast from '@/utils/toast';
import { useDeleteProductMutation } from '@/hooks/useProductQueries';
import ConfirmationModal from '@/components/ConfirmationModal';

const ProductTableRow = ({ product }) => {
    const { mutateAsync: deleteProduct, isPending } = useDeleteProductMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = () => {
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteProduct(product.id);
            toast.success('Product deleted successfully!');
        } catch (error) {
            toast.error(error?.message || 'Failed to delete product');
        }
    };

    return (
        <>
            <tr
                className="hover:bg-slate-50/50 transition-colors group border-b border-slate-200 last:border-0"
            >
                <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                        <img
                            src={product.images?.[0] || '/placeholder-product.png'}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover shadow-sm bg-slate-100"
                        />
                        <p className="font-semibold text-slate-800 text-sm leading-tight">{product.name}</p>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <p className="text-xs text-slate-700 font-medium">{product.category?.name || 'N/A'}</p>
                </td>
                <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700 whitespace-nowrap">
                        ₹{Number(product.price).toLocaleString()}
                    </p>
                </td>
                <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-600">{product.stock_quantity}</p>
                </td>
                <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ring-1 ${product.is_active !== false
                        ? 'bg-[#ecfdf5] text-[#059669] ring-emerald-200'
                        : 'bg-[#fef2f2] text-[#dc2626] ring-red-200'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${product.is_active !== false ? 'bg-emerald-500' : 'bg-red-500'
                            }`} />
                        {product.is_active !== false ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td className="px-3 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Link 
                            to={`/admin/products/edit/${product.id}`}
                            className="p-2 text-slate-400 hover:text-[#1e3a5f] hover:bg-[#1e3a5f]/8 rounded-lg transition-all hover:scale-110 active:scale-95"
                        >
                            <Edit2 size={16} />
                        </Link>
                        <button 
                            onClick={handleDelete}
                            disabled={isPending}
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </td>
            </tr>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Product"
                message={`Are you sure you want to deactivate "${product.name}"? The product will be marked as inactive.`}
                confirmText="Delete"
                confirmColor="bg-rose-500 hover:bg-rose-600"
            />
        </>
    );
};

export default ProductTableRow;
