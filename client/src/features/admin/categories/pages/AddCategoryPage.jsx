import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useCreateCategoryMutation } from '@/hooks/useCategoryQueries';
import CategoryForm from '../components/CategoryForm';
import * as toast from '@/utils/toast';

const AddCategoryPage = () => {
    const navigate = useNavigate();
    const { mutateAsync: createCategory, isPending } = useCreateCategoryMutation();

    const handleSubmit = async (data) => {
        try {
            await createCategory(data);
            toast.success('Category created successfully!');
            navigate('/admin/categories');
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Failed to create category';
            toast.error(errorMessage);
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

            {/* Form */}
            <CategoryForm onSubmit={handleSubmit} isSubmitting={isPending} />
        </div>
    );
};

export default AddCategoryPage;
