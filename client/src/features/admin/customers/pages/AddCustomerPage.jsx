import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import CustomerForm from '../components/CustomerForm';

const AddCustomerPage = () => {
    const navigate = useNavigate();

    const handleSubmit = (data) => {
        // TODO: wire to API — for now navigate back to customers list
        console.log('New customer:', data);
        navigate('/admin/customers');
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

            {/* ─── Form ─────────────────────────────────────────────────── */}
            <CustomerForm onSubmit={handleSubmit} />
        </div>
    );
};

export default AddCustomerPage;
