import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import AddCustomerForm from '../components/AddCustomer/AddCustomerForm';

// Same fadeUp used by CustomerHeader and CustomersPage
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const AddCustomerPage = () => {
    const navigate = useNavigate();

    const handleSuccess = (data) => {
        // TODO: wire to API — for now navigate back to customers list
        console.log('New customer:', data);
        navigate('/admin/customers');
    };

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto pb-10 px-4 md:px-0">
            {/* ─── Page Header — matches CustomerHeader layout ─────────── */}
            <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div className="flex items-center gap-3">
                    {/* Back button — ghost, same border/hover style as reset button */}
                    <motion.button
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => navigate('/admin/customers')}
                        className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                        aria-label="Back to customers"
                    >
                        <ArrowLeft size={18} />
                    </motion.button>

                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
                            Add New Customer
                        </h1>
                        <p className="text-gray-400 mt-0.5 text-xs sm:text-sm font-medium">
                            Fill in the details below to register a new customer
                        </p>
                    </div>
                </div>


            </motion.div>

            {/* ─── Form ─────────────────────────────────────────────────── */}
            <AddCustomerForm onSuccess={handleSuccess} />
        </div>
    );
};

export default AddCustomerPage;
