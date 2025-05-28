
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Filter {
  id: string;
  label: string;
  value: string;
}

interface ActiveFiltersProps {
  filters: Filter[];
  onRemoveFilter: (filterId: string) => void;
  onClearAll: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
  onClearAll
}) => {
  if (filters.length === 0) return null;

  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs text-gray-600">Active filters:</span>
      {filters.map((filter) => (
        <div
          key={filter.id}
          className="flex items-center bg-[#FF732D]/10 text-[#FF732D] px-2 py-1 rounded-md text-xs"
        >
          <span className="mr-1">{filter.label}: {filter.value}</span>
          <button
            onClick={() => onRemoveFilter(filter.id)}
            className="hover:bg-[#FF732D]/20 rounded p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={onClearAll}
        className="text-xs h-6"
      >
        Clear all
      </Button>
    </div>
  );
};

export default ActiveFilters;
