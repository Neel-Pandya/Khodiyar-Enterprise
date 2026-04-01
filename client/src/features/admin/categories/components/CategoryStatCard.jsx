import { Folder, FolderCheck, FolderOpen, Layers } from 'lucide-react';

const iconMap = {
    Folder: { icon: Folder, color: 'text-[#1e3a5f]', bg: 'bg-[#f0f4f8]' },
    FolderCheck: { icon: FolderCheck, color: 'text-[#059669]', bg: 'bg-[#ecfdf5]' },
    FolderOpen: { icon: FolderOpen, color: 'text-[#d97706]', bg: 'bg-[#fffbeb]' },
    Layers: { icon: Layers, color: 'text-[#7c3aed]', bg: 'bg-[#f5f3ff]' },
};

const CategoryStatCard = ({ label, value, icon }) => {
    const meta = iconMap[icon] || iconMap.Folder;
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
                    {value.toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default CategoryStatCard;
