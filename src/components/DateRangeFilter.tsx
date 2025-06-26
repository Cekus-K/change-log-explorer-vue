
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';

const DateRangeFilter = () => {
  return (
    <div className="space-y-2">
      <div>
        <label className="text-sm font-medium">From Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Select date
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <label className="text-sm font-medium">To Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Select date
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" />
          </PopoverContent>
        </Popover>
      </div>
      <Button className="w-full" size="sm">Apply Filter</Button>
    </div>
  );
};

export default DateRangeFilter;
