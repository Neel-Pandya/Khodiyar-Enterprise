import { Link } from 'react-router';
import { Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import * as toast from '@/utils/toast';
import { useDeleteCustomerMutation } from '@/hooks/useCustomerQueries';
import ConfirmationModal from '@/components/ConfirmationModal';

const CustomerTableRow = ({ customer }) => {
    const { mutateAsync: deleteCustomer, isPending } = useDeleteCustomerMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = () => {
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteCustomer(customer.id);
            toast.success('Customer deleted successfully!');
        } catch (error) {
            toast.error(error?.message || 'Failed to delete customer');
        }
    };

    return (
        <>
            <tr
                className="hover:bg-slate-50/50 transition-colors group border-b border-slate-200 last:border-0"
            >
                <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#1e293b] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 overflow-hidden">
                            {customer.avatar && (customer.avatar.startsWith('data:') || customer.avatar.startsWith('http')) ? (
                                <img src={customer.avatar} className="w-10 h-10 rounded-full object-cover" alt="Avatar" />
                            ) : (
                                <span className="text-sm">{customer.name?.charAt(0)?.toUpperCase() || '?'}</span>
                            )}
                        </div>
                        <p className="font-semibold text-slate-800 text-sm">{customer.name}</p>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <p className="text-xs text-slate-400 font-medium">{customer.email}</p>
                </td>
                <td className="px-6 py-4 text-center">
                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${customer.status.toLowerCase() === 'active'
                        ? 'bg-[#ecfdf5] text-[#059669] ring-emerald-200'
                        : customer.status.toLowerCase() === 'suspended'
                            ? 'bg-gray-100 text-gray-500 ring-gray-200'
                            : 'bg-[#fef2f2] text-[#dc2626] ring-red-200'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${customer.status.toLowerCase() === 'active' ? 'bg-emerald-500'
                            : customer.status.toLowerCase() === 'suspended' ? 'bg-gray-400'
                                : 'bg-red-500'
                            }`} />
                        {customer.status.toLowerCase().charAt(0).toUpperCase() + customer.status.toLowerCase().slice(1)}
                    </span>
                </td>
                <td className="px-3 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                        <Link 
                            to={`/admin/customers/edit/${customer.id}`}
                            className="p-2 text-slate-400 hover:text-[#1e3a5f] hover:bg-[#1e3a5f]/8 rounded-lg transition-all hover:scale-110 active:scale-95"
                        >
                            <Edit2 size={16} />
                        </Link>
                        <button 
                            onClick={handleDelete}
                            disabled={isPending}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
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
                title="Delete Customer"
                message={`Are you sure you want to delete ${customer.name}? This action cannot be undone.`}
            />
        </>
    );
};

export default CustomerTableRow;
