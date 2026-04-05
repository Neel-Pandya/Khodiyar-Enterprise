import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import CustomerTableRow from './CustomerTableRow';
import FilterButton from '@admin/shared/components/FilterButton';
import ExportButton from '@admin/shared/components/ExportButton';
import ExportModal from '@admin/shared/components/ExportModal';
import * as toast from '@/utils/toast';
import { exportToPDF, exportToExcel, exportToCSV } from '@/utils/exportUtils';
import logoSrc from '@/assets/Khodiyar_Enterprise.svg?raw';

const CustomerTable = ({ customers, status = 'all', search = '', onFilterChange, isLoading }) => {
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [searchInput, setSearchInput] = useState(search);

    // Debounced search update
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== search) {
                onFilterChange({ search: searchInput || null });
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput, search, onFilterChange]);

    // Sync searchInput with prop changes (e.g., from URL)
    useEffect(() => {
        setSearchInput(search);
    }, [search]);

    const filterOptions = [
        { label: 'All', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Suspended', value: 'suspended' },
    ];

    const handleFilter = (value) => {
        onFilterChange({ status: value });
    };

    const clearSearch = () => {
        setSearchInput('');
        onFilterChange({ search: null });
    };

    const handleExport = (format) => {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `customers-${timestamp}`;

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
            const headers = [['Name', 'Email Address', 'Status']];
            const data = customers.map(c => [
                c.name || '',
                c.email || '',
                c.status?.toUpperCase() || ''
            ]);

            const filterDescription = [
                search && `Search: "${search}"`,
                status !== 'all' && `Status: ${status}`
            ].filter(Boolean).join(' | ') || 'All customers';

            await exportToPDF({
                filename,
                title: 'Customers Report',
                subtitle: `Total Records: ${customers.length} | ${filterDescription}`,
                headers,
                data,
                logoSrc,
                footerText: 'Khodiyar Enterprise - Customer Management System',
                columnStyles: {
                    2: { halign: 'center', fontStyle: 'bold' }
                },
                cellCallback: (data) => {
                    // Apply color styling to status column
                    if (data.column.index === 2 && data.row.section === 'body') {
                        const status = data.cell.raw?.toLowerCase();
                        if (status === 'active') {
                            data.cell.styles.textColor = [5, 150, 105];
                        } else if (status === 'suspended') {
                            data.cell.styles.textColor = [100, 100, 100];
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
            const data = customers.map(c => ({
                Name: c.name,
                Email: c.email,
                Status: c.status,
            }));

            const filterDescription = [
                search && `Search: "${search}"`,
                status !== 'all' && `Status: ${status}`
            ].filter(Boolean).join(' | ') || 'All customers';
            
            exportToExcel({ 
                filename, 
                sheetName: 'Customers', 
                data,
                metadata: {
                    title: 'Customers Report',
                    filterDescription
                }
            });
            toast.success('Excel exported successfully!');
        } catch (error) {
            console.error('Excel Export Error:', error);
            toast.error('Failed to export Excel');
        }
    };

    const handleExportCSV = (filename) => {
        try {
            const data = customers.map(c => ({
                Name: c.name,
                Email: c.email,
                Status: c.status,
            }));

            const filterDescription = [
                search && `Search: "${search}"`,
                status !== 'all' && `Status: ${status}`
            ].filter(Boolean).join(' | ') || 'All customers';
            
            exportToCSV({ filename, data, metadata: { filterDescription } });
            toast.success('CSV exported successfully!');
        } catch (error) {
            console.error('CSV Export Error:', error);
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
                    <h2 className="text-lg font-semibold text-[#111827]">All Customers</h2>
                    <div className="flex items-center gap-3">
                        <FilterButton options={filterOptions} onFilter={handleFilter} className="flex-1 sm:flex-none" />
                        <ExportButton onExport={openExportModal} className="flex-1 sm:flex-none" />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search customers by name or email..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/5 focus:border-[#fbbf24] transition-all placeholder:text-slate-400"
                    />
                    {searchInput && (
                        <button
                            onClick={clearSearch}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px] table-fixed">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap w-[30%]">Customer</th>
                            <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap w-[40%]">Email Address</th>
                            <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-center w-[15%]">Status</th>
                            <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-right w-[15%]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-16 text-center">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-5 h-5 border-2 border-slate-200 border-t-[#fbc02d] rounded-full animate-spin" />
                                        <p className="text-sm font-medium text-slate-500">Loading customers...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : customers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-16 text-center">
                                    <p className="text-sm font-medium text-slate-400">
                                        {search || status !== 'all'
                                            ? `No customers found${search ? ` matching "${search}"` : ''}${status !== 'all' ? ` with status "${status}"` : ''}`
                                            : 'No customers available'}
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            customers.map((customer, i) => (
                                <CustomerTableRow key={customer.id} customer={customer} index={i} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
                <p className="text-xs font-medium text-slate-400">
                    Showing <span className="text-slate-800 font-bold">{customers.length}</span> of <span className="text-slate-800 font-bold">{customers.length}</span> customers
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
                title="Export Customers"
            />
        </div>
    );
};

export default CustomerTable;
