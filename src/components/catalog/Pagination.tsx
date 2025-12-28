'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-2 mt-12"
    >
      {/* First page button */}
      <PaginationButton
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        aria-label="First page"
      >
        <ChevronsLeft className="w-4 h-4" />
      </PaginationButton>

      {/* Previous button */}
      <PaginationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </PaginationButton>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="w-10 h-10 flex items-center justify-center text-white/30 font-mono"
            >
              ...
            </span>
          ) : (
            <PaginationButton
              key={page}
              onClick={() => onPageChange(page)}
              isActive={currentPage === page}
            >
              {page}
            </PaginationButton>
          )
        )}
      </div>

      {/* Next button */}
      <PaginationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </PaginationButton>

      {/* Last page button */}
      <PaginationButton
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Last page"
      >
        <ChevronsRight className="w-4 h-4" />
      </PaginationButton>
    </motion.nav>
  );
}

interface PaginationButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
}

function PaginationButton({
  children,
  onClick,
  isActive = false,
  disabled = false,
  'aria-label': ariaLabel,
}: PaginationButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'relative w-10 h-10 rounded-xl font-inter font-semibold text-sm',
        'flex items-center justify-center',
        'transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
        disabled && 'opacity-30 cursor-not-allowed',
        isActive
          ? 'text-white'
          : 'text-white/60 hover:text-white bg-void-300 border border-neon-purple-500/20 hover:border-neon-purple-500/40'
      )}
    >
      {/* Active state background */}
      {isActive && (
        <>
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-purple-500 to-neon-purple-500 opacity-60 blur-md" />
          {/* Solid background */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-purple-500 to-neon-purple-600" />
        </>
      )}

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
