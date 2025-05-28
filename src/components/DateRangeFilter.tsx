
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
  const [fromTime, setFromTime] = useState<string>('00:00:00');
  const [toTime, setToTime] = useState<string>('23:59:59');

  const handleDateSelect = (date: Date | undefined) => {
    if (!fromDate || (fromDate && toDate)) {
      // Start new selection
      setFromDate(date);
      setToDate(undefined);
      if (onDateRangeChange) {
        onDateRangeChange(date, undefined);
      }
    } else if (fromDate && !toDate) {
      // Complete the range
      if (date && date < fromDate) {
        // If selected date is before start date, swap them
        setFromDate(date);
        setToDate(fromDate);
        if (onDateRangeChange) {
          onDateRangeChange(date, fromDate);
        }
      } else {
        setToDate(date);
        if (onDateRangeChange) {
          onDateRangeChange(fromDate, date);
        }
      }
      
      // Auto-apply when both dates are selected
      if (date && onFilterApply) {
        setTimeout(() => {
          onFilterApply();
        }, 100);
      }
    }
  };

  const clearFilter = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setFromTime('00:00:00');
    setToTime('23:59:59');
    if (onDateRangeChange) {
      onDateRangeChange(undefined, undefined);
    }
    if (onFilterApply) {
      onFilterApply();
    }
  };

  const isDateInRange = (date: Date) => {
    if (!fromDate || !toDate) return false;
    return date >= fromDate && date <= toDate;
  };

  const isDateRangeStart = (date: Date) => {
    return fromDate && date.getTime() === fromDate.getTime();
  };

  const isDateRangeEnd = (date: Date) => {
    return toDate && date.getTime() === toDate.getTime();
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
              !fromDate && "text-muted-foreground"
            )}
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
              !toDate && "text-muted-foreground"
            )}
          >
            {toDate ? toDate.toLocaleDateString() : "Select date"}
          </Button>
        </div>
      </div>

      <Calendar
        mode="single"
        selected={fromDate}
        onSelect={handleDateSelect}
        className={cn("p-3 pointer-events-auto border rounded-md")}
        initialFocus
        modifiers={{
          range_start: fromDate ? [fromDate] : [],
          range_end: toDate ? [toDate] : [],
          range_middle: fromDate && toDate ? (date: Date) => {
            return date > fromDate && date < toDate;
          } : () => false,
        }}
        modifiersClassNames={{
          range_start: "bg-[#FF732D] text-white rounded-l-md hover:bg-[#FF732D] hover:text-white",
          range_end: "bg-[#FF732D] text-white rounded-r-md hover:bg-[#FF732D] hover:text-white",
          range_middle: "bg-[#FF732D]/20 text-[#FF732D] hover:bg-[#FF732D]/30",
        }}
      />

      {includeTime && (
        <div className="flex space-x-2 mt-4">
          <div className="flex-1">
            <label className="block text-xs text-gray-600 mb-1">From Time</label>
            <input
              type="time"
              step="1"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-[#FF732D] focus:border-[#FF732D]"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-600 mb-1">To Time</label>
            <input
              type="time"
              step="1"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-[#FF732D] focus:border-[#FF732D]"
            />
          </div>
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
