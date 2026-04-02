import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="mt-20 flex justify-center items-center gap-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-4 rounded-2xl bg-white border border-gray-100 text-text-muted hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={24} />
      </button>
      <div className="flex gap-2">
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`w-12 h-12 rounded-2xl font-bold flex items-center justify-center transition-all ${
              page === currentPage
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : page === '...'
                ? 'bg-transparent text-text-muted cursor-default'
                : 'bg-white border border-gray-100 text-text-muted hover:border-primary/30'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-4 rounded-2xl bg-white border border-gray-100 text-text-muted hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default Pagination;
