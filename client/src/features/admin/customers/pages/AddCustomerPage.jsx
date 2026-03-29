import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import useCustomerStore from '@/store/useCustomerStore';
import CustomerForm from '../components/CustomerForm';
import * as toast from '@/utils/toast';

const AddCustomerPage = () => {
    const navigate = useNavigate();
    const { createCustomer, isLoading, error } = useCustomerStore();

    const handleSubmit = async (data) => {
        try {
            await createCustomer(data);
            toast.success('Customer created successfully!');
            // Wait 1.5 seconds before navigating to show the success message
            setTimeout(() => {
                navigate('/admin/customers');
            }, 1500);
        } catch (err) {
            toast.error(err?.message || 'Failed to create customer');
        }
    };

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto pb-10 px-4 md:px-0">
            {/* ─── Page Header — matches CustomerHeader layout ─────────── */}
            <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div className="flex items-center gap-3">
                    {/* Back button — ghost, same border/hover style as reset button */}
                    <button
                        onClick={() => navigate('/admin/customers')}
                        className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
                        aria-label="Back to customers"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
                            Add New Customer
                        </h1>
                        <p className="text-gray-400 mt-0.5 text-xs sm:text-sm font-medium">
                            Fill in the details below to register a new customer
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
                    Creating customer...
                </div>
            )}

            {/* ─── Form ─────────────────────────────────────────────────── */}
            <CustomerForm onSubmit={handleSubmit} />
        </div>
    );
};

export default AddCustomerPage;
