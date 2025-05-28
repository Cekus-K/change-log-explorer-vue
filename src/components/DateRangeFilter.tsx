
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
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
  const [hoveredDate, setHoveredDate] = useState<Date | undefined>(undefined);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (!fromDate || (fromDate && toDate)) {
      // Start new selection
      setFromDate(date);
      setToDate(undefined);
      setHoveredDate(undefined);
      if (onDateRangeChange) {
        onDateRangeChange(date, undefined);
      }
    } else if (fromDate && !toDate) {
      // Complete the range
      if (date < fromDate) {
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
      setHoveredDate(undefined);
      
      // Auto-apply when both dates are selected
      if (onFilterApply) {
        setTimeout(() => {
          onFilterApply();
        }, 100);
      }
    }
  };

  const handleDateHover = (date: Date | undefined) => {
    if (fromDate && !toDate && date) {
      setHoveredDate(date);
    }
  };

  const isDateInRange = (date: Date) => {
    if (fromDate && toDate) {
      return date >= fromDate && date <= toDate;
    }
    return false;
  };

  const isDateInHoverRange = (date: Date) => {
    if (fromDate && !toDate && hoveredDate) {
      const start = fromDate < hoveredDate ? fromDate : hoveredDate;
      const end = fromDate < hoveredDate ? hoveredDate : fromDate;
      return date >= start && date <= end;
    }
    return false;
  };

  const isDateRangeStart = (date: Date) => {
    if (fromDate && toDate) {
      return date.getTime() === fromDate.getTime();
    }
    if (fromDate && !toDate && hoveredDate) {
      const start = fromDate < hoveredDate ? fromDate : hoveredDate;
      return date.getTime() === start.getTime();
    }
    return fromDate && date.getTime() === fromDate.getTime();
  };

  const isDateRangeEnd = (date: Date) => {
    if (fromDate && toDate) {
      return date.getTime() === toDate.getTime();
    }
    if (fromDate && !toDate && hoveredDate) {
      const end = fromDate < hoveredDate ? hoveredDate : fromDate;
      return date.getTime() === end.getTime();
    }
    return false;
  };

  const isDateInMiddle = (date: Date) => {
    if (fromDate && toDate) {
      return date > fromDate && date < toDate;
    }
    if (fromDate && !toDate && hoveredDate) {
      const start = fromDate < hoveredDate ? fromDate : hoveredDate;
      const end = fromDate < hoveredDate ? hoveredDate : fromDate;
      return date > start && date < end;
    }
    return false;
  };

  return (
    <div className="p-4">
      {label && <label className="block text-xs font-medium text-gray-700 mb-4">{label}</label>}
      
      <Calendar
        mode="single"
        selected={fromDate}
        onSelect={handleDateSelect}
        onDayMouseEnter={handleDateHover}
        onDayMouseLeave={() => setHoveredDate(undefined)}
        className={cn("p-3 pointer-events-auto border rounded-md")}
        initialFocus
        modifiers={{
          range_start: (date: Date) => isDateRangeStart(date),
          range_end: (date: Date) => isDateRangeEnd(date),
          range_middle: (date: Date) => isDateInMiddle(date),
          in_range: (date: Date) => isDateInRange(date) || isDateInHoverRange(date),
        }}
        modifiersClassNames={{
          range_start: "bg-[#FF732D] text-white hover:bg-[#FF732D] hover:text-white",
          range_end: "bg-[#FF732D] text-white hover:bg-[#FF732D] hover:text-white",
          range_middle: "bg-[#FF732D]/20 text-[#FF732D] hover:bg-[#FF732D]/30",
          in_range: "bg-[#FF732D]/20 text-[#FF732D]",
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
    </div>
  );
};

export default DateRangeFilter;
