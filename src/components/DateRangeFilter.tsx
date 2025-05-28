
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DateRangeFilterProps {
  label?: string;
  includeTime?: boolean;
  onFilterApply?: () => void;
  onDateRangeChange?: (from: Date | undefined, to: Date | undefined) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ 
  label, 
  includeTime = false,
  onFilterApply,
  onDateRangeChange
}) => {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [selectingFrom, setSelectingFrom] = useState(true);

  const handleDateSelect = (date: Date | undefined) => {
    if (selectingFrom) {
      setFromDate(date);
      setSelectingFrom(false);
      if (onDateRangeChange) {
        onDateRangeChange(date, toDate);
      }
    } else {
      setToDate(date);
      setSelectingFrom(true);
      if (onDateRangeChange) {
        onDateRangeChange(fromDate, date);
      }
      // Auto-apply when both dates are selected
      if (fromDate && date && onFilterApply) {
        setTimeout(() => {
          onFilterApply();
        }, 100);
      }
    }
  };

  const clearFilter = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setSelectingFrom(true);
    if (onDateRangeChange) {
      onDateRangeChange(undefined, undefined);
    }
    if (onFilterApply) {
      onFilterApply();
    }
  };

  return (
    <div className="p-4">
      {label && <label className="block text-xs font-medium text-gray-700 mb-4">{label}</label>}
      
      <div className="flex space-x-2 mb-4">
        <div className="flex-1">
          <label className="block text-xs text-gray-600 mb-1">From</label>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "w-full justify-start text-left font-normal text-xs h-8",
              !fromDate && "text-muted-foreground",
              selectingFrom && "ring-2 ring-[#FF732D]"
            )}
            onClick={() => setSelectingFrom(true)}
          >
            {fromDate ? fromDate.toLocaleDateString() : "Select date"}
          </Button>
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-600 mb-1">To</label>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "w-full justify-start text-left font-normal text-xs h-8",
              !toDate && "text-muted-foreground",
              !selectingFrom && "ring-2 ring-[#FF732D]"
            )}
            onClick={() => setSelectingFrom(false)}
          >
            {toDate ? toDate.toLocaleDateString() : "Select date"}
          </Button>
        </div>
      </div>

      <Calendar
        mode="single"
        selected={selectingFrom ? fromDate : toDate}
        onSelect={handleDateSelect}
        className={cn("p-3 pointer-events-auto border rounded-md")}
        initialFocus
      />

      {includeTime && (fromDate || toDate) && (
        <div className="flex space-x-2 mt-4">
          {fromDate && (
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">From Time</label>
              <input
                type="time"
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-[#FF732D] focus:border-[#FF732D]"
              />
            </div>
          )}
          {toDate && (
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1">To Time</label>
              <input
                type="time"
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-[#FF732D] focus:border-[#FF732D]"
              />
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between space-x-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilter}
          className="text-xs"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default DateRangeFilter;
