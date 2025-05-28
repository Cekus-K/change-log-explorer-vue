
import React, { useState } from 'react';
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
  onFilterApply?: () => void;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({
  title,
  sortable = false,
  filterable = false,
  onSort,
  sortDirection = null,
  className = '',
  filterContent,
  onFilterApply
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterApply = () => {
    setIsFilterOpen(false);
    if (onFilterApply) {
      onFilterApply();
    }
  };

  return (
    <TableHead className={className} style={{ fontSize: '10px' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {sortable ? (
            <button
              onClick={onSort}
              className="flex items-center space-x-1 hover:opacity-80 transition-opacity"
              style={{ fontSize: '10px' }}
            >
              <span>{title}</span>
              {sortDirection === 'asc' && <ArrowUp className="w-3 h-3" />}
              {sortDirection === 'desc' && <ArrowDown className="w-3 h-3" />}
              {!sortDirection && (
                <div className="flex flex-col">
                  <ArrowUp className="w-2 h-2 opacity-30" />
                  <ArrowDown className="w-2 h-2 opacity-30 -mt-0.5" />
                </div>
              )}
            </button>
          ) : (
            <span style={{ fontSize: '10px' }}>{title}</span>
          )}
        </div>
        
        {filterable && filterContent && (
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 hover:bg-white/20"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter className="w-2 h-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              {React.cloneElement(filterContent as React.ReactElement, { 
                onFilterApply: handleFilterApply 
              })}
            </PopoverContent>
          </Popover>
        )}
      </div>
    </TableHead>
  );
};

export default FilterHeader;
