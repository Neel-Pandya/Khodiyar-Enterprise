import { Package, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

const iconMap = {
    Package: { icon: Package, color: 'text-[#1e3a5f]', bg: 'bg-[#f0f4f8]' },
    CheckCircle: { icon: CheckCircle, color: 'text-[#059669]', bg: 'bg-[#ecfdf5]' },
    XCircle: { icon: XCircle, color: 'text-[#d97706]', bg: 'bg-[#fffbeb]' },
    TrendingUp: { icon: TrendingUp, color: 'text-[#7c3aed]', bg: 'bg-[#f5f3ff]' },
};

const ProductStatCard = ({ label, value, icon, prefix = '', suffix = '' }) => {
    const meta = iconMap[icon] || iconMap.Package;
    const Icon = meta.icon;

    return (
        <div
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default select-none"
        >
            <div className={`p-3 rounded-xl w-fit ${meta.bg}`}>
                <Icon size={24} className={meta.color} strokeWidth={2} />
            </div>
            <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    {label}
                </p>
                <p className="text-2xl font-bold text-[#111827]">
                    {prefix}{value.toLocaleString()}{suffix}
                </p>
            </div>
        </div>
    );
};

export default ProductStatCard;
