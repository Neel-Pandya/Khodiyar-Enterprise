import React, { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import CustomerForm from '../components/CustomerForm';
import { customersList } from '@data/adminMockData';

const EditCustomerPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Find customer in mock data
    const customerData = useMemo(() => {
        return customersList.find(c => c.id === id);
    }, [id]);

    const handleSubmit = (data) => {
        console.log('Update customer:', id, data);
        // TODO: API call to update
        navigate('/admin/customers');
    };

    if (!customerData) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <p className="text-gray-500 font-medium">Customer not found.</p>
                <button 
                  onClick={() => navigate('/admin/customers')}
                  className="text-[#1e3a5f] hover:underline"
                >
                  Return to Customers
                </button>
            </div>
        );
    }

    // Adapt mock data to form structure if necessary
    // customersList in mockData: { id, name, email, status, avatar }
    // INITIAL_FORM: { fullName, email, phone, password, street, city, state, zip }
    const adaptedData = {
        fullName: customerData.name,
        email: customerData.email,
        phone: '', // Not in mock data
        password: '', 
        street: '',
        city: '',
        state: '',
        zip: '',
        photo: customerData.image || null, // Mock data might use image or avatar
    };

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto pb-10 px-4 md:px-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/customers')}
                        className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
                        aria-label="Back to customers"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
                            Edit Customer
                        </h1>
                        <p className="text-gray-400 mt-0.5 text-xs sm:text-sm font-medium">
                            Update the customer information below
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Form */}
            <CustomerForm 
                initialData={adaptedData} 
                onSubmit={handleSubmit} 
                onCancel={() => navigate('/admin/customers')}
            />
        </div>
    );
};

export default EditCustomerPage;
