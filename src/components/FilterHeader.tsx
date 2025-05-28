
import React from 'react';
import { TableHead } from '@/components/ui/table';
import { ArrowUp, ArrowDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface FilterHeaderProps {
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  onSort?: () => void;
  sortDirection?: 'asc' | 'desc' | null;
  className?: string;
  filterContent?: React.ReactNode;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({
  title,
  sortable = false,
  filterable = false,
  onSort,
  sortDirection = null,
  className = '',
  filterContent
}) => {
  return (
    <TableHead className={className}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
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
        </div>
        
        {filterable && filterContent && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-white/20">
                <Filter className="w-3 h-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              {filterContent}
            </PopoverContent>
          </Popover>
        )}
      </div>
    </TableHead>
  );
};

export default FilterHeader;
