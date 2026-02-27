import React, { useState } from 'react';
import { Download, Check } from 'lucide-react';

const ExportButton = ({ onExport, className = "" }) => {
    const [exported, setExported] = useState(false);

    const handleExport = () => {
        if (onExport) onExport();
        setExported(true);
        setTimeout(() => setExported(false), 2000);
    };

    return (
        <button
            onClick={handleExport}
            className={`
        flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95
        ${className}
        ${exported
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-[#1e3a5f] text-white hover:bg-[#2c5282] shadow-sm'}
      `}
        >
            {exported ? <Check size={14} strokeWidth={3} /> : <Download size={14} strokeWidth={2.5} />}
            {exported ? 'Exported!' : 'Export'}
        </button>
    );
};

export default ExportButton;
