
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DropdownFilterProps {
  options: { value: string; label: string }[];
  placeholder?: string;
  onFilterApply?: () => void;
  onValueChange?: (value: string) => void;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({
  options,
  placeholder = "Select option",
  onFilterApply,
  onValueChange
}) => {
  const handleValueChange = (value: string) => {
    if (onValueChange) {
      onValueChange(value);
    }
    // Auto-apply filter after selection
    if (onFilterApply) {
      setTimeout(() => {
        onFilterApply();
      }, 100);
    }
  };

  return (
    <Select onValueChange={handleValueChange} defaultOpen>
      <SelectTrigger className="focus:ring-[#FF732D] focus:border-[#FF732D] h-8 text-xs min-w-[180px] opacity-0 pointer-events-none">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DropdownFilter;
