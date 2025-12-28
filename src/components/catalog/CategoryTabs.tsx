'use client';

/**
 * Category Tabs Component
 * Quick category switching with animated tabs and product counts
 */

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CategoryTab, PREDEFINED_CATEGORY_TABS } from '@/types/catalog';

/**
 * Tab item component with animation
 */
interface TabItemProps {
  tab: CategoryTab;
  isActive: boolean;
  onClick: () => void;
}

function TabItem({ tab, isActive, onClick }: TabItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative px-4 py-2.5 rounded-lg',
        'text-sm font-medium font-inter',
        'transition-colors duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/50',
        isActive
          ? 'text-white'
          : 'text-zinc-400 hover:text-zinc-200'
      )}
    >
      {/* Background indicator */}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className={cn(
            'absolute inset-0 rounded-lg',
            'bg-gradient-to-r from-[#8B5CF6]/20 to-[#8B5CF6]/20',
            'border border-[#8B5CF6]/30',
            'shadow-[0_0_20px_rgba(139,92,246,0.15)]'
          )}
          initial={false}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 35,
          }}
        />
      )}

      {/* Tab content */}
      <span className="relative z-10 flex items-center gap-2">
        {tab.name}
        {/* Product count badge */}
        <AnimatePresence mode="wait">
          <motion.span
            key={tab.count}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'px-2 py-0.5 text-xs font-mono rounded-full',
              'transition-colors duration-200',
              isActive
                ? 'bg-[#8B5CF6]/30 text-[#A855F7]'
                : 'bg-zinc-800 text-zinc-500'
            )}
          >
            {tab.count}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}

/**
 * CategoryTabs Props
 */
export interface CategoryTabsProps {
  /** Currently active tab ID */
  activeTab: string;
  /** Callback when tab is clicked */
  onTabChange: (tabId: string) => void;
  /** Category counts (id -> count) */
  categoryCounts?: Record<string, number>;
  /** Total products count (for "all" tab) */
  totalCount?: number;
  /** Custom tabs (overrides predefined) */
  tabs?: Omit<CategoryTab, 'count'>[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * Category Tabs Component
 * Displays category tabs with product counts and animated switching
 */
export function CategoryTabs({
  activeTab,
  onTabChange,
  categoryCounts = {},
  totalCount = 0,
  tabs = PREDEFINED_CATEGORY_TABS,
  className,
}: CategoryTabsProps) {
  // Build tabs with counts
  const tabsWithCounts = useMemo<CategoryTab[]>(() => {
    return tabs.map((tab) => ({
      ...tab,
      count: tab.id === 'all' ? totalCount : (categoryCounts[tab.id] ?? 0),
    }));
  }, [tabs, categoryCounts, totalCount]);

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1',
        'p-1.5 rounded-xl',
        'bg-[#0a0a0a]/80 backdrop-blur-sm',
        'border border-zinc-800/50',
        className
      )}
    >
      {tabsWithCounts.map((tab) => (
        <TabItem
          key={tab.id}
          tab={tab}
          isActive={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        />
      ))}
    </div>
  );
}

/**
 * Compact Category Tabs for mobile
 */
export interface CategoryTabsCompactProps extends Omit<CategoryTabsProps, 'className'> {
  className?: string;
}

export function CategoryTabsCompact({
  activeTab,
  onTabChange,
  categoryCounts = {},
  totalCount = 0,
  tabs = PREDEFINED_CATEGORY_TABS,
  className,
}: CategoryTabsCompactProps) {
  const tabsWithCounts = useMemo<CategoryTab[]>(() => {
    return tabs.map((tab) => ({
      ...tab,
      count: tab.id === 'all' ? totalCount : (categoryCounts[tab.id] ?? 0),
    }));
  }, [tabs, categoryCounts, totalCount]);

  return (
    <div
      className={cn(
        'flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4',
        'scrollbar-none',
        className
      )}
    >
      {tabsWithCounts.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'flex-shrink-0 px-4 py-2 rounded-full',
            'text-sm font-medium font-inter',
            'transition-all duration-200',
            'border',
            activeTab === tab.id
              ? [
                  'bg-gradient-to-r from-[#8B5CF6] to-[#8B5CF6]',
                  'text-white border-transparent',
                  'shadow-[0_0_20px_rgba(139,92,246,0.3)]',
                ]
              : [
                  'bg-zinc-900/50 text-zinc-400',
                  'border-zinc-800 hover:border-zinc-700',
                  'hover:text-zinc-200',
                ]
          )}
        >
          <span className="flex items-center gap-1.5">
            {tab.name}
            <span
              className={cn(
                'text-xs font-mono',
                activeTab === tab.id ? 'text-white/80' : 'text-zinc-500'
              )}
            >
              ({tab.count})
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

/**
 * Category Pills - Alternative style with icons
 */
export interface CategoryPillsProps {
  activeCategories: string[];
  onToggle: (id: string) => void;
  categories: Array<{ id: string; name: string; icon?: React.ReactNode }>;
  className?: string;
}

export function CategoryPills({
  activeCategories,
  onToggle,
  categories,
  className,
}: CategoryPillsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {categories.map((category) => {
        const isActive = activeCategories.includes(category.id);
        return (
          <motion.button
            key={category.id}
            type="button"
            onClick={() => onToggle(category.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full',
              'text-sm font-medium font-inter',
              'transition-all duration-200',
              'border',
              isActive
                ? [
                    'bg-[#8B5CF6]/20 text-[#A855F7]',
                    'border-[#8B5CF6]/50',
                    'shadow-[0_0_15px_rgba(139,92,246,0.2)]',
                  ]
                : [
                    'bg-zinc-900/50 text-zinc-400',
                    'border-zinc-800 hover:border-zinc-700',
                    'hover:text-zinc-200',
                  ]
            )}
          >
            {category.icon}
            {category.name}
            {isActive && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="size-4 rounded-full bg-[#8B5CF6]/30 flex items-center justify-center"
              >
                <svg
                  className="size-3 text-[#8B5CF6]"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M2 6l3 3 5-5" />
                </svg>
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

export default CategoryTabs;
