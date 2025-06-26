import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, X } from 'lucide-react';
import FilterHeader from './FilterHeader';
import DateRangeFilter from './DateRangeFilter';
import DropdownFilter from './DropdownFilter';
import ActiveFilters from './ActiveFilters';

interface ChangelogEntry {
  id: string;
  reservationDate: string;
  createdDate: string;
  createdBy: string;
  action: 'RECOMMENDED' | 'OVERRIDDEN';
  type: 'Rate' | 'Restriction';
  rateRestriction: string;
  rml: string;
  groupType: string;
  roomType: string;
  systemReco: string;
  previous: string | null;
  currentRate?: string;
  description?: string;
}

const mockData: ChangelogEntry[] = [
  // Rate entry without previous at the top
  {
    id: '1',
    reservationDate: '2025-06-30',
    createdDate: '2025-06-26 10:12:06',
    createdBy: 'System',
    action: 'RECOMMENDED',
    type: 'Rate',
    rateRestriction: 'LV4-450',
    rml: 'A',
    groupType: 'STD',
    roomType: 'STD01',
    systemReco: 'LV4-450',
    previous: null,
    currentRate: 'LV4-450',
    description: 'Rate update'
  },
  // Restriction entry without previous at the top
  {
    id: '2',
    reservationDate: '2025-06-30',
    createdDate: '2025-06-26 10:12:06',
    createdBy: 'System',
    action: 'RECOMMENDED',
    type: 'Restriction',
    rateRestriction: 'CLOSED',
    rml: 'A',
    groupType: 'STD',
    roomType: 'STD01',
    systemReco: 'CLOSED',
    previous: null,
    currentRate: 'CLOSED',
    description: 'Restriction update'
  },
  // Rate entry with previous
  {
    id: '3',
    reservationDate: '2025-07-05',
    createdDate: '2025-06-26 10:12:06',
    createdBy: 'System',
    action: 'RECOMMENDED',
    type: 'Rate',
    rateRestriction: 'LV5-520',
    rml: 'B',
    groupType: 'DLX',
    roomType: 'DLX02',
    systemReco: 'LV5-520',
    previous: 'LV4-480',
    currentRate: 'LV5-520',
    description: 'Rate adjustment'
  },
  // Additional mock data with proper rate/restriction values
  ...Array.from({ length: 150 }, (_, i) => {
    const isRate = Math.random() > 0.5;
    const restrictionValues = ['OPEN', 'CLOSED', 'CTA', 'MINLOS 2'];
    const rateValue = `LV${Math.floor(Math.random() * 6) + 1}-${Math.floor(Math.random() * 500) + 100}`;
    const restrictionValue = restrictionValues[Math.floor(Math.random() * restrictionValues.length)];
    
    return {
      id: `${i + 4}`,
      reservationDate: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      createdDate: `2025-06-26 ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      createdBy: ['System', 'John Doe', 'Jane Smith', 'Admin'][Math.floor(Math.random() * 4)],
      action: (Math.random() > 0.5 ? 'RECOMMENDED' : 'OVERRIDDEN') as 'RECOMMENDED' | 'OVERRIDDEN',
      type: (isRate ? 'Rate' : 'Restriction') as 'Rate' | 'Restriction',
      rateRestriction: isRate ? rateValue : restrictionValue,
      rml: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      groupType: ['STD', 'DLX', 'SU'][Math.floor(Math.random() * 3)],
      roomType: (() => {
        const types = ['STD', 'DLX', 'SU', 'PREM'];
        const type = types[Math.floor(Math.random() * types.length)];
        const num = String(Math.floor(Math.random() * 3) + 1).padStart(2, '0');
        return `${type}${num}`;
      })(),
      systemReco: isRate ? `LV${Math.floor(Math.random() * 6) + 1}-${Math.floor(Math.random() * 500) + 100}` : restrictionValues[Math.floor(Math.random() * restrictionValues.length)],
      previous: Math.random() > 0.3 ? (isRate ? `LV${Math.floor(Math.random() * 6) + 1}-${Math.floor(Math.random() * 500) + 100}` : restrictionValues[Math.floor(Math.random() * restrictionValues.length)]) : null,
      currentRate: isRate ? `LV${Math.floor(Math.random() * 6) + 1}-${Math.floor(Math.random() * 500) + 100}` : restrictionValues[Math.floor(Math.random() * restrictionValues.length)],
      description: Math.random() > 0.7 ? ['Rate update', 'Price adjustment', 'System recommendation', 'Manual override'][Math.floor(Math.random() * 4)] : ''
    };
  })
];

interface Filter {
  id: string;
  label: string;
  value: string;
}

interface ChangelogProps {
  activeFilters: string[];
}

const Changelog: React.FC<ChangelogProps> = ({ activeFilters }) => {
  const [data, setData] = useState<ChangelogEntry[]>(mockData);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({ key: '', direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [autoSelectedRows, setAutoSelectedRows] = useState<Set<string>>(new Set());
  const [appliedFilters, setAppliedFilters] = useState<Filter[]>([]);
  const [dateFilters, setDateFilters] = useState<{
    reservationDate?: { from?: Date; to?: Date };
    createdDate?: { from?: Date; to?: Date };
  }>({});
  const [columnFilters, setColumnFilters] = useState<{
    createdBy?: string;
    action?: string;
    rml?: string;
    groupType?: string;
  }>({});

  const applyFilters = (data: ChangelogEntry[]) => {
    let filtered = [...data];

    // Apply type filters (rates/restrictions)
    if (activeFilters.length > 0) {
      filtered = filtered.filter(item => {
        if (activeFilters.includes('rates') && activeFilters.includes('restrictions')) return true;
        if (activeFilters.includes('rates') && item.type === 'Rate') return true;
        if (activeFilters.includes('restrictions') && item.type === 'Restriction') return true;
        return false;
      });
    }

    // Apply date filters
    if (dateFilters.reservationDate?.from || dateFilters.reservationDate?.to) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.reservationDate);
        if (dateFilters.reservationDate?.from && itemDate < dateFilters.reservationDate.from) return false;
        if (dateFilters.reservationDate?.to && itemDate > dateFilters.reservationDate.to) return false;
        return true;
      });
    }

    if (dateFilters.createdDate?.from || dateFilters.createdDate?.to) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.createdDate);
        if (dateFilters.createdDate?.from && itemDate < dateFilters.createdDate.from) return false;
        if (dateFilters.createdDate?.to && itemDate > dateFilters.createdDate.to) return false;
        return true;
      });
    }

    // Apply column filters
    if (columnFilters.createdBy) {
      filtered = filtered.filter(item => item.createdBy.toLowerCase().includes(columnFilters.createdBy!.toLowerCase()));
    }

    if (columnFilters.action) {
      filtered = filtered.filter(item => item.action.toLowerCase() === columnFilters.action!.toLowerCase());
    }

    if (columnFilters.rml) {
      filtered = filtered.filter(item => item.rml.toLowerCase() === columnFilters.rml!.toLowerCase());
    }

    if (columnFilters.groupType) {
      filtered = filtered.filter(item => item.groupType.toLowerCase() === columnFilters.groupType!.toLowerCase());
    }

    return filtered;
  };

  const filteredData = applyFilters(data);

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) return 0;
    
    const aValue = a[sortConfig.key as keyof ChangelogEntry] || '';
    const bValue = b[sortConfig.key as keyof ChangelogEntry] || '';
    
    if (sortConfig.direction === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRowSelect = (id: string, entry: ChangelogEntry) => {
    const newSelectedRows = new Set(selectedRows);
    const newAutoSelectedRows = new Set(autoSelectedRows);
    
    if (selectedRows.has(id)) {
      newSelectedRows.delete(id);
      // Remove auto-selected rows for this reservation date if this was the trigger
      if (!entry.previous) {
        data.forEach(item => {
          if (item.reservationDate === entry.reservationDate && !item.previous && item.id !== id) {
            newSelectedRows.delete(item.id);
            newAutoSelectedRows.delete(item.id);
          }
        });
      }
    } else {
      newSelectedRows.add(id);
      // Auto-select other rows for the same reservation date without previous
      if (!entry.previous) {
        data.forEach(item => {
          if (item.reservationDate === entry.reservationDate && !item.previous && item.id !== id) {
            newSelectedRows.add(item.id);
            newAutoSelectedRows.add(item.id);
          }
        });
      }
    }
    
    setSelectedRows(newSelectedRows);
    setAutoSelectedRows(newAutoSelectedRows);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
      setAutoSelectedRows(new Set());
    } else {
      const newSelectedRows = new Set(paginatedData.map(item => item.id));
      setSelectedRows(newSelectedRows);
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    const currentPageIds = new Set(paginatedData.map(item => item.id));
    const selectedInCurrentPage = Array.from(selectedRows).filter(id => currentPageIds.has(id));
    setSelectAll(selectedInCurrentPage.length === paginatedData.length && paginatedData.length > 0);
  }, [selectedRows, paginatedData]);

  const hasRowsWithoutPrevious = Array.from(selectedRows).some(id => {
    const entry = data.find(item => item.id === id);
    return entry && !entry.previous;
  });

  const hasHiddenEntriesWithoutPrevious = () => {
    const selectedRowsWithoutPrevious = Array.from(selectedRows).filter(id => {
      const entry = data.find(item => item.id === id);
      return entry && !entry.previous;
    });

    if (selectedRowsWithoutPrevious.length === 0) return false;

    // Get all reservation dates from selected rows without previous
    const reservationDates = new Set(
      selectedRowsWithoutPrevious.map(id => {
        const entry = data.find(item => item.id === id);
        return entry?.reservationDate;
      })
    );

    // Check if there are entries for the same dates that are not visible due to filtering
    return Array.from(reservationDates).some(date => {
      const allEntriesForDate = data.filter(item => item.reservationDate === date && !item.previous);
      const visibleEntriesForDate = filteredData.filter(item => item.reservationDate === date && !item.previous);
      return allEntriesForDate.length > visibleEntriesForDate.length;
    });
  };

  const createdByOptions = [
    { value: 'system', label: 'System' },
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' }
  ];

  const actionOptions = [
    { value: 'recommended', label: 'RECOMMENDED' },
    { value: 'overridden', label: 'OVERRIDDEN' }
  ];

  const rmlOptions = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
    { value: 'c', label: 'C' }
  ];

  const groupTypeOptions = [
    { value: 'std', label: 'STD' },
    { value: 'dlx', label: 'DLX' },
    { value: 'su', label: 'SU' }
  ];

  const handleDateRangeChange = (column: 'reservationDate' | 'createdDate', from: Date | undefined, to: Date | undefined) => {
    setDateFilters(prev => ({
      ...prev,
      [column]: { from, to }
    }));
    
    if (from || to) {
      const newFilter: Filter = {
        id: `${column}-${Date.now()}`,
        label: column === 'reservationDate' ? 'Reservation Date' : 'Created Date',
        value: `${from?.toDateString() || '...'} - ${to?.toDateString() || '...'}`
      };
      setAppliedFilters(prev => [...prev.filter(f => !f.id.startsWith(column)), newFilter]);
    } else {
      setAppliedFilters(prev => prev.filter(f => !f.id.startsWith(column)));
    }
  };

  const handleColumnFilterChange = (column: keyof typeof columnFilters, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value
    }));

    const filterLabels = {
      createdBy: 'Created By',
      action: 'Action',
      rml: 'RML',
      groupType: 'Group Type'
    };

    const newFilter: Filter = {
      id: `${column}-${Date.now()}`,
      label: filterLabels[column],
      value: value.toUpperCase()
    };
    setAppliedFilters(prev => [...prev.filter(f => !f.id.startsWith(column)), newFilter]);
  };

  const handleRemoveFilter = (filterId: string) => {
    const filterType = filterId.split('-')[0];
    
    if (filterType === 'reservationDate' || filterType === 'createdDate') {
      setDateFilters(prev => ({
        ...prev,
        [filterType]: {}
      }));
    } else {
      setColumnFilters(prev => ({
        ...prev,
        [filterType]: undefined
      }));
    }
    
    setAppliedFilters(prev => prev.filter(f => f.id !== filterId));
  };

  const handleClearAllFilters = () => {
    setDateFilters({});
    setColumnFilters({});
    setAppliedFilters([]);
  };

  return (
    <TooltipProvider>
      <div className="w-full space-y-6">
        {/* Warning Alert */}
        {hasRowsWithoutPrevious && autoSelectedRows.size > 0 && (
          <Alert className="border-yellow-500 bg-yellow-50">
            <AlertDescription className="text-yellow-800">
              There are other entries for selected reservation dates that will be accepted on a mandatory basis.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons and Active Filters */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1">
            <ActiveFilters
              filters={appliedFilters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button 
                      variant="outline"
                      disabled={selectedRows.size === 0 || hasRowsWithoutPrevious}
                      className="bg-red-600 text-white hover:bg-red-700 border-red-600 disabled:bg-red-600 disabled:text-white disabled:border-red-600 disabled:opacity-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </span>
                </TooltipTrigger>
                {hasRowsWithoutPrevious && (
                  <TooltipContent>
                    <p>Entries without previous cannot be rejected</p>
                  </TooltipContent>
                )}
              </Tooltip>
              <Button 
                disabled={selectedRows.size === 0}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Accept
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <TableRow>
                <TableHead className="w-12 text-gray-700 font-semibold border-r border-gray-200">
                  <Checkbox 
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    className="data-[state=checked]:bg-[#FF732D] data-[state=checked]:border-[#FF732D]"
                  />
                </TableHead>
                
                <FilterHeader
                  title="Reservation Date"
                  sortable
                  filterable
                  onSort={() => handleSort('reservationDate')}
                  sortDirection={sortConfig.key === 'reservationDate' ? sortConfig.direction : null}
                  className="text-gray-700 font-semibold border-r border-gray-200"
                  filterContent={
                    <DateRangeFilter 
                      onDateRangeChange={(from, to) => handleDateRangeChange('reservationDate', from, to)}
                    />
                  }
                />
                
                <FilterHeader
                  title="Created Date"
                  sortable
                  filterable
                  onSort={() => handleSort('createdDate')}
                  sortDirection={sortConfig.key === 'createdDate' ? sortConfig.direction : null}
                  className="text-gray-700 font-semibold border-r border-gray-200"
                  filterContent={
                    <DateRangeFilter 
                      onDateRangeChange={(from, to) => handleDateRangeChange('createdDate', from, to)}
                    />
                  }
                />
                
                <FilterHeader
                  title="Created By"
                  sortable
                  filterable
                  onSort={() => handleSort('createdBy')}
                  sortDirection={sortConfig.key === 'createdBy' ? sortConfig.direction : null}
                  className="text-gray-700 font-semibold border-r border-gray-200"
                  filterContent={
                    <DropdownFilter 
                      options={createdByOptions} 
                      placeholder="Select creator"
                      onValueChange={(value) => handleColumnFilterChange('createdBy', value)}
                    />
                  }
                />
                
                <FilterHeader
                  title="Action"
                  sortable
                  filterable
                  onSort={() => handleSort('action')}
                  sortDirection={sortConfig.key === 'action' ? sortConfig.direction : null}
                  className="text-gray-700 font-semibold border-r border-gray-200"
                  filterContent={
                    <DropdownFilter 
                      options={actionOptions} 
                      placeholder="Select action"
                      onValueChange={(value) => handleColumnFilterChange('action', value)}
                    />
                  }
                />
                
                <TableHead className="text-gray-700 font-semibold border-r border-gray-200" style={{ fontSize: '10px' }}>Rate & Restriction</TableHead>
                
                <FilterHeader
                  title="RML"
                  sortable
                  filterable
                  onSort={() => handleSort('rml')}
                  sortDirection={sortConfig.key === 'rml' ? sortConfig.direction : null}
                  className="text-gray-700 font-semibold border-r border-gray-200"
                  filterContent={
                    <DropdownFilter 
                      options={rmlOptions} 
                      placeholder="Select RML"
                      onValueChange={(value) => handleColumnFilterChange('rml', value)}
                    />
                  }
                />
                
                <FilterHeader
                  title="Group Type"
                  sortable
                  filterable
                  onSort={() => handleSort('groupType')}
                  sortDirection={sortConfig.key === 'groupType' ? sortConfig.direction : null}
                  className="text-gray-700 font-semibold border-r border-gray-200"
                  filterContent={
                    <DropdownFilter 
                      options={groupTypeOptions} 
                      placeholder="Select group type"
                      onValueChange={(value) => handleColumnFilterChange('groupType', value)}
                    />
                  }
                />
                
                <TableHead className="text-gray-700 font-semibold border-r border-gray-200" style={{ fontSize: '10px' }}>Room Type</TableHead>
                <TableHead className="text-gray-700 font-semibold border-r border-gray-200" style={{ fontSize: '10px' }}>System RECO</TableHead>
                <TableHead className="text-gray-700 font-semibold" style={{ fontSize: '10px' }}>Previous</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {paginatedData.map((entry, index) => (
                <TableRow 
                  key={entry.id}
                  className={`
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                    ${selectedRows.has(entry.id) ? 'bg-blue-50' : ''}
                    ${autoSelectedRows.has(entry.id) ? 'bg-yellow-50' : ''}
                    hover:bg-blue-50/50 border-b border-gray-100 last:border-b-0
                  `}
                >
                  <TableCell className="border-r border-gray-100">
                    <Checkbox 
                      checked={selectedRows.has(entry.id)}
                      onCheckedChange={() => handleRowSelect(entry.id, entry)}
                      className="data-[state=checked]:bg-[#FF732D] data-[state=checked]:border-[#FF732D]"
                    />
                  </TableCell>
                  <TableCell className="font-medium border-r border-gray-100" style={{ fontSize: '10px' }}>{entry.reservationDate}</TableCell>
                  <TableCell className="border-r border-gray-100" style={{ fontSize: '10px' }}>{entry.createdDate}</TableCell>
                  <TableCell className="border-r border-gray-100" style={{ fontSize: '10px' }}>{entry.createdBy}</TableCell>
                  <TableCell className="border-r border-gray-100">
                    <Badge 
                      variant={entry.action === 'RECOMMENDED' ? 'default' : 'secondary'}
                      className={`${entry.action === 'RECOMMENDED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} text-xs font-medium pointer-events-none`}
                      style={{ fontSize: '9px' }}
                    >
                      {entry.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="border-r border-gray-100" style={{ fontSize: '10px' }}>{entry.rateRestriction}</TableCell>
                  <TableCell className="border-r border-gray-100" style={{ fontSize: '10px' }}>{entry.rml}</TableCell>
                  <TableCell className="border-r border-gray-100" style={{ fontSize: '10px' }}>{entry.groupType}</TableCell>
                  <TableCell className="border-r border-gray-100" style={{ fontSize: '10px' }}>{entry.roomType}</TableCell>
                  <TableCell className="border-r border-gray-100" style={{ fontSize: '10px' }}>{entry.systemReco}</TableCell>
                  <TableCell style={{ fontSize: '10px' }}>{entry.previous || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow border border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-700">Show</span>
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger className="w-16 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-gray-700">entries</span>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-[#FF732D] hover:text-white'}`}
                />
              </PaginationItem>
              
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => setCurrentPage(pageNum)}
                      isActive={currentPage === pageNum}
                      className={`cursor-pointer ${currentPage === pageNum ? 'bg-[#FF732D] text-white' : 'hover:bg-[#FF732D] hover:text-white'}`}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-[#FF732D] hover:text-white'}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Changelog;
