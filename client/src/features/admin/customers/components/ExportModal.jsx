import { X, FileText, FileSpreadsheet, FileCode } from 'lucide-react';

const ExportModal = ({ isOpen, onClose, onExport, title = 'Export Customers' }) => {
    if (!isOpen) return null;

    const handleExport = (format) => {
        if (onExport) onExport(format);
        onClose();
    };

    const exportOptions = [
        {
            id: 'pdf',
            label: 'PDF',
            description: 'Export as PDF document',
            icon: FileText,
            color: 'bg-red-500 hover:bg-red-600',
            borderColor: 'border-red-200',
            bgColor: 'bg-red-50',
        },
        {
            id: 'excel',
            label: 'Excel',
            description: 'Export as Excel spreadsheet',
            icon: FileSpreadsheet,
            color: 'bg-emerald-500 hover:bg-emerald-600',
            borderColor: 'border-emerald-200',
            bgColor: 'bg-emerald-50',
        },
        {
            id: 'csv',
            label: 'CSV',
            description: 'Export as CSV file',
            icon: FileCode,
            color: 'bg-blue-500 hover:bg-blue-600',
            borderColor: 'border-blue-200',
            bgColor: 'bg-blue-50',
        },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="bg-[#1e3a5f] px-8 py-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 p-2 rounded-full hover:bg-white/10 transition-colors border border-white/20"
                    >
                        <X size={20} />
                    </button>

                    <h2 className="text-xl font-extrabold tracking-tight pr-12">
                        {title}
                    </h2>
                    <p className="text-white/70 text-sm mt-1">
                        Choose your preferred export format
                    </p>
                </div>

                {/* Export Options */}
                <div className="p-8">
                    <div className="space-y-3">
                        {exportOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleExport(option.id)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl border ${option.borderColor} ${option.bgColor} hover:shadow-md transition-all duration-200 group`}
                                >
                                    <div className={`w-12 h-12 rounded-xl ${option.color} text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                                        <Icon size={24} strokeWidth={2} />
                                    </div>
                                    <div className="text-left flex-1">
                                        <h3 className="font-bold text-[#1e293b] text-base">
                                            {option.label}
                                        </h3>
                                        <p className="text-slate-500 text-sm">
                                            {option.description}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Cancel Button */}
                    <button
                        onClick={onClose}
                        className="w-full mt-6 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
