import React, { useState } from 'react';
import { Filter } from 'lucide-react';

const FilterButton = ({ options = [], onFilter, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeFilterValue, setActiveFilterValue] = useState('all');
    const buttonRef = React.useRef(null);
    const [dropdownStyle, setDropdownStyle] = React.useState({ top: 0, left: 0 });

    React.useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownStyle({
                top: rect.bottom + 8,
                left: rect.right - 192,
            });
        }
    }, [isOpen]);

    const handleFilterClick = (opt) => {
        setActiveFilterValue(opt.value);
        if (onFilter) onFilter(opt.value);
        setIsOpen(false);
    };

    const activeFilterLabel = options.find(opt => opt.value === activeFilterValue)?.label || 'All';

    return (
        <div className={`relative ${className}`} ref={buttonRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95
          ${isOpen || activeFilterValue !== 'all'
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'border border-slate-200 text-gray-600 hover:bg-slate-50'}
        `}
            >
                <Filter size={14} strokeWidth={2.5} />
                {activeFilterValue === 'all' ? 'Filter' : activeFilterLabel}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div
                        className="fixed w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50"
                        style={dropdownStyle}
                    >
                        <p className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Filter By</p>
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => handleFilterClick(opt)}
                                className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-slate-50 hover:text-[#1e3a5f] transition-colors ${
                                    activeFilterValue === opt.value ? 'text-[#1e3a5f] font-semibold bg-slate-50' : 'text-slate-600'
                                }`}
                            >
                                <Filter size={14} className="opacity-60" />
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default FilterButton;
