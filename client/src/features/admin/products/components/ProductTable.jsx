import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import ProductTableRow from './ProductTableRow';
import FilterButton from '@admin/shared/components/FilterButton';
import ExportButton from '@admin/shared/components/ExportButton';
import ExportModal from '@admin/shared/components/ExportModal';
import * as toast from '@/utils/toast';
import { exportToPDF, exportToExcel, exportToCSV } from '@/utils/exportUtils';
import logoSrc from '@/assets/Khodiyar_Enterprise.svg?raw';

const ProductTable = ({ products, status = 'all', isActive = 'all', search = '', onFilterChange, isLoading }) => {
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

    // Sync searchInput with prop changes
    useEffect(() => {
        setSearchInput(search);
    }, [search]);

    const filterOptions = [
        { label: 'All', value: 'all' },
        { label: 'Available', value: 'available' },
        { label: 'Out of Stock', value: 'out_of_stock' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
    ];

    const handleFilter = (value) => {
        // Handle both stock status and active status in one filter
        if (value === 'available' || value === 'out_of_stock') {
            onFilterChange({ status: value, isActive: 'all' });
        } else if (value === 'active' || value === 'inactive') {
            onFilterChange({ status: 'all', isActive: value === 'active' ? 'true' : 'false' });
        } else {
            onFilterChange({ status: 'all', isActive: 'all' });
        }
    };

    const clearSearch = () => {
        setSearchInput('');
        onFilterChange({ search: null });
    };
    const handleExport = (format) => {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `products-${timestamp}`;

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
            const headers = [['Product Name', 'Category', 'Price', 'Stock', 'Status', 'Stock Status']];
            const data = products.map(p => [
                p.name || '',
                p.category?.name || 'N/A',
                `INR ${Number(p.price).toLocaleString()}`,
                String(p.stock_quantity || 0),
                p.is_active !== false ? 'Active' : 'Inactive',
                p.status === 'available' ? 'Available' : 'Out of Stock'
            ]);

            const filterDescription = [
                search && `Search: "${search}"`,
                status !== 'all' && `Status: ${status}`,
                isActive !== 'all' && `Active: ${isActive === 'true' ? 'Yes' : 'No'}`
            ].filter(Boolean).join(' | ') || 'All products';

            await exportToPDF({
                filename,
                title: 'Products Report',
                subtitle: `Total Records: ${products.length} | ${filterDescription}`,
                headers,
                data,
                logoSrc,
                footerText: 'Khodiyar Enterprise - Product Management System',
                columnStyles: {
                    4: { halign: 'center', fontStyle: 'bold' },
                    5: { halign: 'center', fontStyle: 'bold' }
                },
                cellCallback: (data) => {
                    // Apply color styling to status columns
                    if (data.row.section === 'body') {
                        if (data.column.index === 4) {
                            // Status column (Active/Inactive)
                            const status = data.cell.raw?.toLowerCase();
                            if (status === 'active') {
                                data.cell.styles.textColor = [5, 150, 105];
                            } else {
                                data.cell.styles.textColor = [100, 100, 100];
                            }
                        } else if (data.column.index === 5) {
                            // Stock Status column (Available/Out of Stock)
                            const stockStatus = data.cell.raw?.toLowerCase();
                            if (stockStatus === 'available') {
                                data.cell.styles.textColor = [5, 150, 105];
                            } else {
                                data.cell.styles.textColor = [220, 38, 38];
                            }
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
            const data = products.map(p => ({
                'Product Name': p.name,
                'Category': p.category?.name || 'N/A',
                'Price': Number(p.price),
                'Stock': p.stock_quantity || 0,
                'Status': p.is_active !== false ? 'Active' : 'Inactive',
                'Stock Status': p.status === 'available' ? 'Available' : 'Out of Stock',
            }));

            const filterDescription = [
                search && `Search: "${search}"`,
                status !== 'all' && `Status: ${status}`,
                isActive !== 'all' && `Active: ${isActive === 'true' ? 'Yes' : 'No'}`
            ].filter(Boolean).join(' | ') || 'All products';

            exportToExcel({
                filename,
                sheetName: 'Products',
                data,
                metadata: {
                    title: 'Products Report',
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
            const data = products.map(p => ({
                'Product Name': p.name,
                'Category': p.category?.name || 'N/A',
                'Price': Number(p.price),
                'Stock': p.stock_quantity || 0,
                'Status': p.is_active !== false ? 'Active' : 'Inactive',
                'Stock Status': p.status === 'available' ? 'Available' : 'Out of Stock',
            }));

            const filterDescription = [
                search && `Search: "${search}"`,
                status !== 'all' && `Status: ${status}`,
                isActive !== 'all' && `Active: ${isActive === 'true' ? 'Yes' : 'No'}`
            ].filter(Boolean).join(' | ') || 'All products';

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
                    <h2 className="text-lg font-bold text-[#111827]">All Products</h2>
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
                        placeholder="Search products by name or category..."
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
                <table className="w-full text-left min-w-[800px] table-fixed">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap w-[30%]">Product</th>
                            <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap w-[20%]">Category</th>
                            <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap w-[15%]">Price</th>
                            <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap w-[10%]">Stock</th>
                            <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap w-[15%]">Status</th>
                            <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-right w-[10%]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-16 text-center">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-5 h-5 border-2 border-slate-200 border-t-[#fbc02d] rounded-full animate-spin" />
                                        <p className="text-sm font-medium text-slate-500">Loading products...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-16 text-center">
                                    <p className="text-sm font-medium text-slate-400">
                                        {search || status !== 'all' || isActive !== 'all'
                                            ? `No products found${search ? ` matching "${search}"` : ''}${status !== 'all' ? ` with status "${status}"` : ''}${isActive !== 'all' ? ` with active "${isActive === 'true' ? 'Yes' : 'No'}"` : ''}`
                                            : 'No products available'}
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            products.map((product, i) => (
                                <ProductTableRow key={product.id} product={product} index={i} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
                <p className="text-xs font-medium text-slate-400">
                    Showing <span className="text-slate-800 font-bold">{products.length}</span> of <span className="text-slate-800 font-bold">{products.length}</span> products
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
                title="Export Products"
            />
        </div>
    );
};

export default ProductTable;
