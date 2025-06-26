
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface DropdownFilterProps {
  options: { value: string; label: string }[];
  placeholder: string;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({ options, placeholder }) => {
  return (
    <div className="space-y-2">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button className="w-full" size="sm">Apply Filter</Button>
    </div>
  );
};

export default DropdownFilter;
