
import React from 'react';
import { TableHead } from '@/components/ui/table';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface FilterHeaderProps {
  title: string;
  sortable?: boolean;
  onSort?: () => void;
  sortDirection?: 'asc' | 'desc' | null;
  className?: string;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({
  title,
  sortable = false,
  onSort,
  sortDirection = null,
  className = ''
}) => {
  return (
    <TableHead className={className}>
      {sortable ? (
        <button
          onClick={onSort}
          className="flex items-center space-x-1 hover:opacity-80 transition-opacity"
        >
          <span>{title}</span>
          {sortDirection === 'asc' && <ArrowUp className="w-4 h-4" />}
          {sortDirection === 'desc' && <ArrowDown className="w-4 h-4" />}
          {!sortDirection && (
            <div className="flex flex-col">
              <ArrowUp className="w-3 h-3 opacity-50" />
              <ArrowDown className="w-3 h-3 opacity-50 -mt-1" />
            </div>
          )}
        </button>
      ) : (
        <span>{title}</span>
      )}
    </TableHead>
  );
};

export default FilterHeader;
