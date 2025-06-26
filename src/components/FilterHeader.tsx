
import React from 'react';
import { TableHead } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronUp, ChevronDown, Filter } from 'lucide-react';

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
  sortDirection,
  className,
  filterContent
}) => {
  return (
    <TableHead className={className} style={{ fontSize: '10px' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <span>{title}</span>
          {sortable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSort}
              className="h-6 w-6 p-0 hover:bg-gray-200"
            >
              {sortDirection === 'asc' ? (
                <ChevronUp className="h-3 w-3" />
              ) : sortDirection === 'desc' ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <div className="h-3 w-3" />
              )}
            </Button>
          )}
        </div>
        {filterable && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-200"
              >
                <Filter className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              {filterContent}
            </PopoverContent>
          </Popover>
        )}
      </div>
    </TableHead>
  );
};

export default FilterHeader;
