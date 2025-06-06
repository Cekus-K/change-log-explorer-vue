import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Download } from 'lucide-react';
import FilterHeader from './FilterHeader';
import DateRangeFilter from './DateRangeFilter';
import DropdownFilter from './DropdownFilter';
import ActiveFilters from './ActiveFilters';

interface RestrictionEntry {
  id: string;
  reservationDate: string;
  createdDate: string;
  createdBy: string;
  action: 'RECOMMENDED' | 'OVERRIDDEN' | 'ACCEPTED' | 'REJECTED';
  reco: string;
  recoSystem: string;
  rml: string;
  groupType: string;
  roomType: string;
  description: string;
}

const mockRestrictionsData: RestrictionEntry[] = [
  {
    id: '1',
    reservationDate: '2025-01-01',
    createdDate: '10:00:00',
    createdBy: 'Jan Kowalski',
    action: 'ACCEPTED',
    reco: 'CLOSED',
    recoSystem: 'CLOSED',
    rml: 'A',
    groupType: 'STD',
    roomType: 'STD01, STD02',
    description: 'Abc due to xyz'
  },
  {
    id: '2',
    reservationDate: '2025-01-01',
    createdDate: '9:00:00',
    createdBy: 'proRMS',
    action: 'RECOMMENDED',
    reco: 'CLOSED',
    recoSystem: 'CLOSED',
    rml: 'A',
    groupType: 'STD',
    roomType: 'STD01, STD02',
    description: ''
  },
  {
    id: '3',
    reservationDate: '2025-01-01',
    createdDate: '8:00:00',
    createdBy: 'Adam Nowak',
    action: 'ACCEPTED',
    reco: 'MINLOS 2',
    recoSystem: 'MINLOS 2',
    rml: 'A',
    groupType: 'STD',
    roomType: 'STD01, STD02',
    description: ''
  },
  {
    id: '4',
    reservationDate: '2025-01-01',
    createdDate: '7:00:00',
    createdBy: 'Adam Nowak',
    action: 'OVERRIDDEN',
    reco: 'MINLOS 2',
    recoSystem: 'MINLOS 3',
    rml: 'A',
    groupType: 'STD',
    roomType: 'STD01, STD02',
    description: ''
  },
  {
    id: '5',
    reservationDate: '2025-01-01',
    createdDate: '6:00:00',
    createdBy: 'Adam Nowak',
    action: 'REJECTED',
    reco: 'MINLOS 3',
    recoSystem: 'MINLOS 3',
    rml: 'A',
    groupType: 'STD',
    roomType: 'STD01, STD02',
    description: ''
  },
  {
    id: '6',
    reservationDate: '2025-01-01',
    createdDate: '5:00:00',
    createdBy: 'proRMS',
    action: 'RECOMMENDED',
    reco: 'MINLOS 3',
    recoSystem: 'MINLOS 3',
    rml: 'A',
    groupType: 'STD',
    roomType: 'STD01, STD02',
    description: ''
  },
  {
    id: '7',
    reservationDate: '2025-01-02',
    createdDate: '14:30:00',
    createdBy: 'Maria Garcia',
    action: 'ACCEPTED',
    reco: 'OPEN',
    recoSystem: 'OPEN',
    rml: 'B',
    groupType: 'DLX',
    roomType: 'DLX01, DLX02',
    description: 'Opening restrictions for weekend'
  },
  {
    id: '8',
    reservationDate: '2025-01-02',
    createdDate: '13:45:00',
    createdBy: 'proRMS',
    action: 'RECOMMENDED',
    reco: 'CTA',
    recoSystem: 'CTA',
    rml: 'C',
    groupType: 'SU',
    roomType: 'SU01',
    description: ''
  },
  {
    id: '9',
    reservationDate: '2025-01-03',
    createdDate: '16:20:00',
    createdBy: 'John Smith',
    action: 'OVERRIDDEN',
    reco: 'MAXLOS 5',
    recoSystem: 'MAXLOS 3',
    rml: 'A, B',
    groupType: 'STD, DLX',
    roomType: 'STD01, DLX01',
    description: 'Extended stay allowed for group'
  },
  {
    id: '10',
    reservationDate: '2025-01-03',
    createdDate: '15:15:00',
    createdBy: 'Anna Mueller',
    action: 'REJECTED',
    reco: 'CLOSED',
    recoSystem: 'OPEN',
    rml: 'ALL',
    groupType: 'ALL',
    roomType: 'ALL',
    description: 'Maintenance period scheduled'
  },
  {
    id: '11',
    reservationDate: '2025-01-04',
    createdDate: '11:30:00',
    createdBy: 'proRMS',
    action: 'RECOMMENDED',
    reco: 'MINLOS 4',
    recoSystem: 'MINLOS 4',
    rml: 'B',
    groupType: 'DLX',
    roomType: 'DLX02, DLX03',
    description: ''
  },
  {
    id: '12',
    reservationDate: '2025-01-04',
    createdDate: '10:45:00',
    createdBy: 'Lisa Chen',
    action: 'ACCEPTED',
    reco: 'OPEN',
    recoSystem: 'MINLOS 2',
    rml: 'C',
    groupType: 'SU',
    roomType: 'SU02, SU03',
    description: 'Special event accommodation'
  },
  {
    id: '13',
    reservationDate: '2025-01-05',
    createdDate: '09:20:00',
    createdBy: 'Robert Brown',
    action: 'OVERRIDDEN',
    reco: 'CTA',
    recoSystem: 'CLOSED',
    rml: 'A',
    groupType: 'STD',
    roomType: 'STD03',
    description: 'Manual override for corporate booking'
  },
  {
    id: '14',
    reservationDate: '2025-01-05',
    createdDate: '08:55:00',
    createdBy: 'proRMS',
    action: 'RECOMMENDED',
    reco: 'MAXLOS 3',
    recoSystem: 'MAXLOS 3',
    rml: 'B, C',
    groupType: 'DLX, SU',
    roomType: 'DLX01, SU01',
    description: ''
  },
  {
    id: '15',
    reservationDate: '2025-01-06',
    createdDate: '17:40:00',
    createdBy: 'Sarah Wilson',
    action: 'ACCEPTED',
    reco: 'MINLOS 5',
    recoSystem: 'MINLOS 5',
    rml: 'ALL',
    groupType: 'ALL',
    roomType: 'ALL',
    description: 'Holiday period restrictions'
  },
  {
    id: '16',
    reservationDate: '2025-01-06',
    createdDate: '16:25:00',
    createdBy: 'Michael Davis',
    action: 'REJECTED',
    reco: 'OPEN',
    recoSystem: 'CLOSED',
    rml: 'A',
    groupType: 'STD',
    roomType: 'STD01',
    description: 'Conflicting with maintenance schedule'
  }
];

const RestrictionsTable = () => {
  const [data, setData] = useState<RestrictionEntry[]>(mockRestrictionsData);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: keyof RestrictionEntry; direction: 'asc' | 'desc' } | null>(null);
  const [activeFilters, setActiveFilters] = useState<Array<{ id: string; label: string; value: string }>>([]);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  const handleSort = (key: keyof RestrictionEntry) => {
    if (!sortConfig || sortConfig.key !== key) {
      // First click: ascending
      setSortConfig({ key, direction: 'asc' });
    } else if (sortConfig.direction === 'asc') {
      // Second click: descending
      setSortConfig({ key, direction: 'desc' });
    } else {
      // Third click: deactivate sorting
      setSortConfig(null);
    }

    // Apply sorting if active
    if (sortConfig?.key !== key || sortConfig?.direction !== 'desc') {
      const direction = !sortConfig || sortConfig.key !== key ? 'asc' : 'desc';
      const sortedData = [...data].sort((a, b) => {
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
      });
      setData(sortedData);
    } else {
      // Reset to original order when deactivating
      setData([...mockRestrictionsData]);
    }
  };

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'RECOMMENDED':
        return 'bg-blue-100 text-blue-800';
      case 'OVERRIDDEN':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDateRangeFilter = (field: string, from: Date | undefined, to: Date | undefined) => {
    const filterId = `date-${field}`;
    const newFilters = activeFilters.filter(f => f.id !== filterId);
    
    if (from && to) {
      newFilters.push({
        id: filterId,
        label: field === 'reservationDate' ? 'Reservation Date' : 'Created Date',
        value: `${from.toLocaleDateString()} - ${to.toLocaleDateString()}`
      });
    }
    
    setActiveFilters(newFilters);
  };

  const handleDropdownFilter = (field: string, value: string, label: string) => {
    const filterId = `dropdown-${field}`;
    const newFilters = activeFilters.filter(f => f.id !== filterId);
    
    newFilters.push({
      id: filterId,
      label,
      value
    });
    
    setActiveFilters(newFilters);
  };

  const removeFilter = (filterId: string) => {
    setActiveFilters(activeFilters.filter(f => f.id !== filterId));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  const userOptions = [
    { value: 'prorms', label: 'proRMS' },
    { value: 'jan', label: 'Jan Kowalski' },
    { value: 'adam', label: 'Adam Nowak' },
    { value: 'maria', label: 'Maria Garcia' },
    { value: 'john', label: 'John Smith' }
  ];

  const actionOptions = [
    { value: 'recommended', label: 'RECOMMENDED' },
    { value: 'overridden', label: 'OVERRIDDEN' },
    { value: 'accepted', label: 'ACCEPTED' },
    { value: 'rejected', label: 'REJECTED' }
  ];

  const rmlOptions = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
    { value: 'c', label: 'C' },
    { value: 'all', label: 'ALL' }
  ];

  const groupTypeOptions = [
    { value: 'std', label: 'STD' },
    { value: 'dlx', label: 'DLX' },
    { value: 'su', label: 'SU' },
    { value: 'all', label: 'ALL' }
  ];

  return (
    <div className="space-y-6">
      {/* Active Filters and Export Button */}
      <div className="flex items-center justify-between">
        {activeFilters.length > 0 ? (
          <ActiveFilters
            filters={activeFilters}
            onRemoveFilter={removeFilter}
            onClearAll={clearAllFilters}
          />
        ) : (
          <div />
        )}
        <Button className="bg-[#FF732D] hover:bg-[#E5652A] text-white shadow-md hover:shadow-lg transition-all duration-200">
          <Download className="w-4 h-4 mr-2" />
          Export XLSX
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <TableRow>
              <FilterHeader 
                title="Reservation Date" 
                sortable 
                filterable
                onSort={() => handleSort('reservationDate')}
                sortDirection={sortConfig?.key === 'reservationDate' ? sortConfig.direction : null}
                className="text-gray-700 font-semibold border-r border-gray-200 last:border-r-0"
                filterContent={
                  <DateRangeFilter 
                    onDateRangeChange={(from, to) => handleDateRangeFilter('reservationDate', from, to)}
                  />
                }
              />
              <FilterHeader 
                title="Created date" 
                sortable 
                filterable
                onSort={() => handleSort('createdDate')}
                sortDirection={sortConfig?.key === 'createdDate' ? sortConfig.direction : null}
                className="text-gray-700 font-semibold border-r border-gray-200 last:border-r-0"
                filterContent={
                  <DateRangeFilter 
                    includeTime 
                    onDateRangeChange={(from, to) => handleDateRangeFilter('createdDate', from, to)}
                  />
                }
              />
              <FilterHeader 
                title="Created By" 
                sortable 
                filterable
                onSort={() => handleSort('createdBy')}
                sortDirection={sortConfig?.key === 'createdBy' ? sortConfig.direction : null}
                className="text-gray-700 font-semibold border-r border-gray-200 last:border-r-0"
                filterContent={
                  <DropdownFilter
                    options={userOptions}
                    placeholder="Select users"
                    onValueChange={(value) => {
                      const option = userOptions.find(opt => opt.value === value);
                      if (option) handleDropdownFilter('createdBy', option.label, 'Created By');
                    }}
                  />
                }
              />
              <FilterHeader 
                title="Action" 
                sortable 
                filterable
                onSort={() => handleSort('action')}
                sortDirection={sortConfig?.key === 'action' ? sortConfig.direction : null}
                className="text-gray-700 font-semibold border-r border-gray-200 last:border-r-0"
                filterContent={
                  <DropdownFilter
                    options={actionOptions}
                    placeholder="Select actions"
                    onValueChange={(value) => {
                      const option = actionOptions.find(opt => opt.value === value);
                      if (option) handleDropdownFilter('action', option.label, 'Action');
                    }}
                  />
                }
              />
              <TableHead className="text-gray-700 font-semibold border-r border-gray-200 last:border-r-0" style={{ fontSize: '10px' }}>RECO</TableHead>
              <FilterHeader 
                title="RML" 
                sortable 
                filterable
                onSort={() => handleSort('rml')}
                sortDirection={sortConfig?.key === 'rml' ? sortConfig.direction : null}
                className="text-gray-700 font-semibold border-r border-gray-200 last:border-r-0"
                filterContent={
                  <DropdownFilter
                    options={rmlOptions}
                    placeholder="Select RML"
                    onValueChange={(value) => {
                      const option = rmlOptions.find(opt => opt.value === value);
                      if (option) handleDropdownFilter('rml', option.label, 'RML');
                    }}
                  />
                }
              />
              <FilterHeader 
                title="Group Type" 
                sortable 
                filterable
                onSort={() => handleSort('groupType')}
                sortDirection={sortConfig?.key === 'groupType' ? sortConfig.direction : null}
                className="text-gray-700 font-semibold border-r border-gray-200 last:border-r-0"
                filterContent={
                  <DropdownFilter
                    options={groupTypeOptions}
                    placeholder="Select type"
                    onValueChange={(value) => {
                      const option = groupTypeOptions.find(opt => opt.value === value);
                      if (option) handleDropdownFilter('groupType', option.label, 'Group Type');
                    }}
                  />
                }
              />
              <FilterHeader 
                title="Room Type" 
                sortable 
                onSort={() => handleSort('roomType')}
                sortDirection={sortConfig?.key === 'roomType' ? sortConfig.direction : null}
                className="text-gray-700 font-semibold border-r border-gray-200 last:border-r-0"
              />
              <TableHead className="text-gray-700 font-semibold border-r border-gray-200 last:border-r-0" style={{ fontSize: '10px' }}>proRMS RECO</TableHead>
              <TableHead className="text-gray-700 font-semibold border-r border-gray-200 last:border-r-0" style={{ fontSize: '10px' }}>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((entry, index) => (
              <TableRow 
                key={entry.id} 
                className={`
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} 
                  hover:bg-blue-50/50 border-b border-gray-100 last:border-b-0
                `}
              >
                <TableCell className="font-medium border-r border-gray-100 last:border-r-0" style={{ fontSize: '10px' }}>{entry.reservationDate}</TableCell>
                <TableCell className="border-r border-gray-100 last:border-r-0" style={{ fontSize: '10px' }}>{entry.createdDate}</TableCell>
                <TableCell className="border-r border-gray-100 last:border-r-0" style={{ fontSize: '10px' }}>{entry.createdBy}</TableCell>
                <TableCell className="border-r border-gray-100 last:border-r-0">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionBadgeClass(entry.action)}`} style={{ fontSize: '10px' }}>
                    {entry.action}
                  </span>
                </TableCell>
                <TableCell className="border-r border-gray-100 last:border-r-0" style={{ fontSize: '10px' }}>{entry.reco}</TableCell>
                <TableCell className="border-r border-gray-100 last:border-r-0" style={{ fontSize: '10px' }}>{entry.rml}</TableCell>
                <TableCell className="border-r border-gray-100 last:border-r-0" style={{ fontSize: '10px' }}>{entry.groupType}</TableCell>
                <TableCell className="border-r border-gray-100 last:border-r-0" style={{ fontSize: '10px' }}>{entry.roomType}</TableCell>
                <TableCell className="border-r border-gray-100 last:border-r-0" style={{ fontSize: '10px' }}>{entry.recoSystem}</TableCell>
                <TableCell className="border-r border-gray-100 last:border-r-0" style={{ fontSize: '10px' }}>{entry.description}</TableCell>
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
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-gray-700">entries</span>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-[#FF732D] hover:text-white'}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                  isActive={currentPage === page}
                  className={currentPage === page ? 'bg-[#FF732D] text-white' : 'hover:bg-[#FF732D] hover:text-white'}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-[#FF732D] hover:text-white'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default RestrictionsTable;
