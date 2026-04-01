import { Link } from 'react-router';
import { Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import * as toast from '@/utils/toast';
import useCategoryStore from '@/store/useCategoryStore';
import ConfirmationModal from '@/components/ConfirmationModal';

const CategoryTableRow = ({ category }) => {
    const { deleteCategory } = useCategoryStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = () => {
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteCategory(category.id);
            toast.success('Category deactivated successfully!');
        } catch (error) {
            toast.error(error?.message || 'Failed to deactivate category');
        }
    };

    const status = category.status?.toLowerCase() || 'inactive';

    return (
        <>
            <tr
                className="hover:bg-slate-50/50 transition-colors group border-b border-slate-200 last:border-0"
            >
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#1e3a5f]/10 text-[#1e3a5f] flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {category.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <p className="font-semibold text-slate-800 text-sm">{category.name}</p>
                    </div>
                </td>
                <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${
                        status === 'active'
                            ? 'bg-[#ecfdf5] text-[#059669] ring-emerald-200'
                            : 'bg-[#fef2f2] text-[#dc2626] ring-red-200'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                            status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                        }`} />
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                </td>
                <td className="px-3 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                        <Link 
                            to={`/admin/categories/edit/${category.id}`}
                            className="p-2 text-slate-400 hover:text-[#1e3a5f] hover:bg-[#1e3a5f]/8 rounded-lg transition-all hover:scale-110 active:scale-95"
                        >
                            <Edit2 size={16} />
                        </Link>
                        <button 
                            onClick={handleDelete}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all hover:scale-110 active:scale-95"
                            disabled={status === 'inactive'}
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
                title="Deactivate Category"
                message={`Are you sure you want to deactivate "${category.name}"? This will set the category to inactive.`}
            />
        </>
    );
};

export default CategoryTableRow;
