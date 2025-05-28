
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
      <SelectTrigger className="sr-only">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="min-w-[180px] p-0 border-0 shadow-md">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} className="first:rounded-t-md last:rounded-b-md">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DropdownFilter;
