import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import CategoryForm from '../components/CategoryForm';
import { useCategoryQuery, useUpdateCategoryMutation } from '@/hooks/useCategoryQueries';
import useCategoryStore from '@/store/useCategoryStore';
import * as toast from '@/utils/toast';

const EditCategoryPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: category, isLoading: isFetching, error } = useCategoryQuery(id);
    const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategoryMutation();
    const { category: storeCategory } = useCategoryStore();
    
    const currentCategory = category || storeCategory;
    const isLoading = isFetching || isUpdating;

    const handleSubmit = async (data) => {
        try {
            await updateCategory({ id, categoryData: data });
            toast.success('Category updated successfully!');
            navigate('/admin/categories');
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Failed to update category';
            toast.error(errorMessage);
        }
    };

    if (isFetching && !currentCategory) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <p className="text-gray-500 font-medium">Loading category...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <p className="text-red-500 font-medium">Error: {error.message || 'Failed to load category'}</p>
                <button 
                  onClick={() => navigate('/admin/categories')}
                  className="text-[#1e3a5f] hover:underline"
                >
                  Return to Categories
                </button>
            </div>
        );
    }

    if (!currentCategory) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <p className="text-gray-500 font-medium">Category not found.</p>
                <button 
                  onClick={() => navigate('/admin/categories')}
                  className="text-[#1e3a5f] hover:underline"
                >
                  Return to Categories
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
                        onClick={() => navigate('/admin/categories')}
                        className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
                        aria-label="Back to categories"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
                            Edit Category
                        </h1>
                        <p className="text-gray-400 mt-0.5 text-xs sm:text-sm font-medium">
                            Update the category information below
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Form */}
            <CategoryForm 
                initialData={currentCategory} 
                onSubmit={handleSubmit} 
                onCancel={() => navigate('/admin/categories')}
                isSubmitting={isLoading}
            />
        </div>
    );
};

export default EditCategoryPage;
