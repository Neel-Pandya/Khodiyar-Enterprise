import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Check } from 'lucide-react';

const ExportButton = ({ onExport, className = "" }) => {
    const [exported, setExported] = useState(false);

    const handleExport = () => {
        if (onExport) onExport();
        setExported(true);
        setTimeout(() => setExported(false), 2000);
    };

    return (
        <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleExport}
            className={`
        flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-300
        ${className}
        ${exported
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-[#1e293b] text-white hover:bg-[#0f172a] shadow-sm'}
      `}
        >
            {exported ? <Check size={14} strokeWidth={3} /> : <Download size={14} strokeWidth={2.5} />}
            {exported ? 'Exported!' : 'Export'}
        </motion.button>
    );
};

export default ExportButton;
