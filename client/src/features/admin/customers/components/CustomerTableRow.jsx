import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const CustomerTableRow = ({ customer, index }) => {
    return (
        <tr
            className="hover:bg-slate-50/50 transition-colors group border-b border-slate-200 last:border-0"
        >
            <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#1e293b] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {customer.avatar}
                    </div>
                    <p className="font-semibold text-slate-800 text-sm">{customer.name}</p>
                </div>
            </td>
            <td className="px-6 py-4">
                <p className="text-xs text-slate-400 font-medium">{customer.email}</p>
            </td>
            <td className="px-6 py-4 text-center">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${customer.status === 'Active'
                    ? 'bg-[#ecfdf5] text-[#059669] ring-emerald-200'
                    : customer.status === 'Pending'
                        ? 'bg-[#fffbeb] text-[#d97706] ring-amber-200'
                        : 'bg-gray-100 text-gray-500 ring-gray-200'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${customer.status === 'Active' ? 'bg-emerald-500'
                        : customer.status === 'Pending' ? 'bg-amber-400'
                            : 'bg-gray-400'
                        }`} />
                    {customer.status}
                </span>
            </td>
            <td className="px-3 py-4 text-right">
                <div className="flex items-center justify-end gap-3">
                    <button className="p-2 text-slate-400 hover:text-[#1e3a5f] hover:bg-[#1e3a5f]/8 rounded-lg transition-all hover:scale-110 active:scale-95">
                        <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all hover:scale-110 active:scale-95">
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default CustomerTableRow;
