import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import useCategoryStore from '@/store/useCategoryStore';
import CategoryForm from '../components/CategoryForm';
import * as toast from '@/utils/toast';

const AddCategoryPage = () => {
    const navigate = useNavigate();
    const { createCategory, isLoading, error } = useCategoryStore();

    const handleSubmit = async (data) => {
        try {
            await createCategory(data);
            toast.success('Category created successfully!');
        } catch (err) {
            toast.error(err?.message || 'Failed to create category');
        }
    };

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto pb-10 px-4 md:px-0">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/categories')}
                        className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
                        aria-label="Back to categories"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
                            Add New Category
                        </h1>
                        <p className="text-gray-400 mt-0.5 text-xs sm:text-sm font-medium">
                            Fill in the details below to create a new category
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            {isLoading && (
                <div className="bg-blue-50 border border-blue-200 text-blue-600 text-sm font-medium rounded-xl px-4 py-3">
                    Creating category...
                </div>
            )}

            {/* Form */}
            <CategoryForm onSubmit={handleSubmit} />
        </div>
    );
};

export default AddCategoryPage;
