
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DropdownFilterProps {
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  onFilterApply?: () => void;
  onValueChange?: (value: string) => void;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({
  label,
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
    <div className="p-4">
      <label className="block text-xs font-medium text-gray-700 mb-2">{label}</label>
      <Select onValueChange={handleValueChange}>
        <SelectTrigger className="focus:ring-[#FF732D] focus:border-[#FF732D] h-8 text-xs">
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
    </div>
  );
};

export default DropdownFilter;
