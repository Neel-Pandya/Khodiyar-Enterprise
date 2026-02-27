import React from 'react';
import { ClipboardList, Clock, CheckCircle, XCircle } from 'lucide-react';

const iconMap = {
    ClipboardList: { icon: ClipboardList, color: 'text-[#1e3a5f]', bg: 'bg-blue-50' },
    Clock: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    CheckCircle: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    XCircle: { icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
};

const OrderStatCard = ({ label, value, icon }) => {
    const meta = iconMap[icon] || iconMap.ClipboardList;
    const Icon = meta.icon;

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-default select-none">
            <div className={`p-3 rounded-xl w-fit transition-transform group-hover:scale-110 duration-300 mb-4 ${meta.bg}`}>
                <Icon size={24} className={meta.color} strokeWidth={2.5} />
            </div>
            <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
                    {label}
                </p>
                <p className="text-2xl font-black text-slate-800 tracking-tight">
                    {value.toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default OrderStatCard;
