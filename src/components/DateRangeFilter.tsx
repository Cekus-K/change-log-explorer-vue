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
  const [hoveredDate, setHoveredDate] = useState<Date | undefined>(undefined);
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const [lastClickedDate, setLastClickedDate] = useState<Date | undefined>(undefined);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime;
    const isDoubleClick = timeDiff < 300 && lastClickedDate && date.getTime() === lastClickedDate.getTime();

    if (isDoubleClick) {
      // Double-click: create a range from the clicked date to 7 days later
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 6); // 7-day range
      
      setFromDate(date);
      setToDate(endDate);
      setHoveredDate(undefined);
      
      if (onDateRangeChange) {
        onDateRangeChange(date, endDate);
      }
      
      // Auto-apply when range is created via double-click
      if (onFilterApply) {
        setTimeout(() => {
          onFilterApply();
        }, 100);
      }
    } else {
      // Single click: existing logic
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
    }

    // Update last click tracking
    setLastClickTime(currentTime);
    setLastClickedDate(date);
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
        selected={undefined}
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
          range_start: "!bg-[#FF732D] !text-white hover:!bg-[#FF732D] hover:!text-white !rounded-full border-0",
          range_end: "!bg-[#FF732D] !text-white hover:!bg-[#FF732D] hover:!text-white !rounded-full border-0",
          range_middle: "!bg-[#FFF4F0] !text-[#FF732D] hover:!bg-[#FFF4F0] !rounded-none",
          in_range: "!bg-[#FFF4F0] !text-[#FF732D] !rounded-none",
        }}
      />
    </div>
  );
};

export default DateRangeFilter;
