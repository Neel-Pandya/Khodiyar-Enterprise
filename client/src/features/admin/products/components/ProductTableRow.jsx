import { Link } from 'react-router';
import { Edit2, Trash2 } from 'lucide-react';

const ProductTableRow = ({ product }) => {
    return (
        <tr
            className="hover:bg-slate-50/50 transition-colors group border-b border-slate-200 last:border-0"
        >
            <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-xl object-cover shadow-sm bg-slate-100"
                    />
                    <p className="font-semibold text-slate-800 text-sm leading-tight">{product.name}</p>
                </div>
            </td>
            <td className="px-6 py-4">
                <p className="text-xs text-slate-700 font-medium">{product.category}</p>
            </td>
            <td className="px-6 py-4">
                <p className="text-sm font-bold text-slate-700 whitespace-nowrap">
                    ₹{product.price.toLocaleString()}
                </p>
            </td>
            <td className="px-6 py-4">
                <p className="text-sm font-semibold text-slate-600">{product.stock}</p>
            </td>
            <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ring-1 ${product.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-600 ring-emerald-100'
                    : product.status === 'Out of Stock'
                        ? 'bg-rose-50 text-rose-600 ring-rose-100'
                        : 'bg-amber-50 text-amber-600 ring-amber-100'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${product.status === 'Active' ? 'bg-emerald-500'
                        : product.status === 'Out of Stock' ? 'bg-rose-500'
                            : 'bg-amber-500'
                        }`} />
                    {product.status}
                </span>
            </td>
            <td className="px-3 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <Link 
                        to={`/admin/products/edit/${product.id}`}
                        className="p-2 text-slate-400 hover:text-[#1e3a5f] hover:bg-[#1e3a5f]/8 rounded-lg transition-all hover:scale-110 active:scale-95"
                    >
                        <Edit2 size={16} />
                    </Link>
                    <button className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all hover:scale-110 active:scale-95">
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default ProductTableRow;
