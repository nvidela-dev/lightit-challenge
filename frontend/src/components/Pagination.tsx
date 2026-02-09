import type { ComponentType, SVGProps } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from './icons';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

const baseButtonClass =
  'flex items-center justify-center min-w-[40px] h-10 px-3 text-sm font-medium rounded-lg transition-all duration-150';
const activeClass = 'glass-button text-white';
const inactiveClass = 'text-gray-500 hover:bg-gray-100';
const disabledClass = 'opacity-40 cursor-not-allowed';

type NavButtonProps = {
  onClick: () => void;
  disabled: boolean;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const NavButton = ({ onClick, disabled, label, icon: Icon }: NavButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`${baseButtonClass} ${disabled ? disabledClass : inactiveClass}`}
    aria-label={label}
  >
    <Icon width="16" height="16" />
  </button>
);

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

  const atStart = currentPage === 1;
  const atEnd = currentPage === effectiveTotalPages;

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <NavButton onClick={() => onPageChange(1)} disabled={atStart} label="First page" icon={ChevronsLeftIcon} />
      <NavButton onClick={() => onPageChange(currentPage - 1)} disabled={atStart} label="Previous page" icon={ChevronLeftIcon} />

      {getPageNumbers().map((page) =>
        typeof page === 'string' ? (
          <span key={page} className="flex items-center justify-center w-10 h-10 text-slate-400">
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

      <NavButton onClick={() => onPageChange(currentPage + 1)} disabled={atEnd} label="Next page" icon={ChevronRightIcon} />
      <NavButton onClick={() => onPageChange(effectiveTotalPages)} disabled={atEnd} label="Last page" icon={ChevronsRightIcon} />
    </nav>
  );
};
