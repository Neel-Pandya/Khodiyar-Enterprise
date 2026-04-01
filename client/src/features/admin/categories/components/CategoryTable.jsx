import { Search } from 'lucide-react';
import { useState } from 'react';
import CategoryTableRow from './CategoryTableRow';
import FilterButton from '@/features/admin/shared/components/FilterButton';
import ExportButton from '@/features/admin/shared/components/ExportButton';
import ExportModal from '@/features/admin/customers/components/ExportModal';
import * as toast from '@/utils/toast';
import { exportToPDF, exportToExcel, exportToCSV } from '@/utils/exportUtils';
import logoSrc from '@/assets/Khodiyar_Enterprise.svg?raw';

const filterOptions = [
    { label: 'All Categories', value: 'all' },
    { label: 'Active Only', value: 'active' },
    { label: 'Inactive Only', value: 'inactive' },
];

const CategoryTable = ({ categories }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const filteredCategories = categories.filter(category => {
        const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'all' || category.status?.toLowerCase() === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const handleExport = (format) => {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `categories-${timestamp}`;

        switch (format) {
            case 'pdf':
                handleExportPDF(filename);
                break;
            case 'excel':
                handleExportExcel(filename);
                break;
            case 'csv':
                handleExportCSV(filename);
                break;
            default:
                break;
        }
    };

    const handleExportPDF = async (filename) => {
        try {
            const headers = [['Category Name', 'Status']];
            const data = filteredCategories.map(c => [
                c.name || '',
                c.status?.toUpperCase() || ''
            ]);

            await exportToPDF({
                filename,
                title: 'Categories Report',
                subtitle: `Total Records: ${filteredCategories.length}`,
                headers,
                data,
                logoSrc,
                footerText: 'Khodiyar Enterprise - Category Management System',
                columnStyles: {
                    1: { halign: 'center', fontStyle: 'bold' }
                },
                cellCallback: (data) => {
                    if (data.column.index === 1 && data.row.section === 'body') {
                        const status = data.cell.raw?.toLowerCase();
                        if (status === 'active') {
                            data.cell.styles.textColor = [5, 150, 105];
                        } else if (status === 'inactive') {
                            data.cell.styles.textColor = [220, 38, 38];
                        }
                    }
                }
            });

            toast.success('PDF exported successfully!');
        } catch (error) {
            console.error('PDF Export Error:', error);
            toast.error('Failed to export PDF');
        }
    };

    const handleExportExcel = (filename) => {
        try {
            const data = filteredCategories.map(c => ({
                'Category Name': c.name,
                'Status': c.status,
            }));

            exportToExcel({ filename, sheetName: 'Categories', data });
            toast.success('Excel exported successfully!');
        } catch (error) {
            toast.error('Failed to export Excel');
        }
    };

    const handleExportCSV = (filename) => {
        try {
            const data = filteredCategories.map(c => ({
                'Category Name': c.name,
                'Status': c.status,
            }));

            exportToCSV({ filename, data });
            toast.success('CSV exported successfully!');
        } catch (error) {
            toast.error('Failed to export CSV');
        }
    };

    const openExportModal = () => {
        setIsExportModalOpen(true);
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-8">
            {/* Table Header and Search */}
            <div className="px-6 py-5 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-lg font-semibold text-[#111827]">All Categories</h2>
                    <div className="flex items-center gap-3">
                        <FilterButton options={filterOptions} onFilter={setActiveFilter} className="flex-1 sm:flex-none" />
                        <ExportButton onExport={openExportModal} className="flex-1 sm:flex-none" />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search categories by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/5 focus:border-[#fbbf24] transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px] table-fixed">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap w-[50%]">Category Name</th>
                            <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-center w-[20%]">Status</th>
                            <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-right w-[30%]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredCategories.map((category) => (
                            <CategoryTableRow key={category.id} category={category} />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {filteredCategories.length === 0 && (
                <div className="px-6 py-12 text-center">
                    <p className="text-sm text-slate-500 font-medium">No categories found.</p>
                </div>
            )}

            {/* Pagination */}
            <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
                <p className="text-xs font-medium text-slate-400">
                    Showing <span className="text-slate-800 font-bold">{filteredCategories.length}</span> of <span className="text-slate-800 font-bold">{categories.length}</span> categories
                </p>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-50 transition-colors">
                        Previous
                    </button>
                    <button className="w-8 h-8 bg-[#1e293b] text-white rounded-xl text-xs font-bold flex items-center justify-center">
                        1
                    </button>
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                        Next
                    </button>
                </div>
            </div>

            {/* Export Modal */}
            <ExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                onExport={handleExport}
                title="Export Categories"
            />
        </div>
    );
};

export default CategoryTable;
