type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const effectiveTotalPages = Math.max(1, totalPages);

  const getPageNumbers = (): PageItem[] => {
    const pages: PageItem[] = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < effectiveTotalPages - 2;

    if (effectiveTotalPages <= 7) {
      for (let i = 1; i <= effectiveTotalPages; i += 1) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (showEllipsisStart) {
        pages.push('ellipsis-start');
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(effectiveTotalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i += 1) {
        pages.push(i);
      }
      if (showEllipsisEnd) {
        pages.push('ellipsis-end');
      }
      pages.push(effectiveTotalPages);
    }

    return pages;
  };

  const baseButtonClass =
    'flex items-center justify-center min-w-[40px] h-10 px-3 text-sm font-medium rounded-lg transition-all duration-150';
  const activeClass = 'glass-button text-white';
  const inactiveClass = 'text-blue-950 hover:bg-blue-950/10';
  const disabledClass = 'opacity-40 cursor-not-allowed';

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${baseButtonClass} ${currentPage === 1 ? disabledClass : inactiveClass}`}
        aria-label="Previous page"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 12L6 8l4-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {getPageNumbers().map((page) =>
        typeof page === 'string' ? (
          <span
            key={page}
            className="flex items-center justify-center w-10 h-10 text-slate-400"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`${baseButtonClass} ${page === currentPage ? activeClass : inactiveClass}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === effectiveTotalPages}
        className={`${baseButtonClass} ${currentPage === effectiveTotalPages ? disabledClass : inactiveClass}`}
        aria-label="Next page"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M6 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </nav>
  );
};
