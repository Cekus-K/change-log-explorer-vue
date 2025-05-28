import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import FilterHeader from './FilterHeader';
import DateRangeFilter from './DateRangeFilter';

interface PriceEntry {
  id: string;
  reservationDate: string;
  createdDate: string;
  createdBy: string;
  action: 'RECOMMENDED' | 'OVERRIDDEN' | 'ACCEPTED' | 'REJECTED';
  reco: string;
  systemReco: string;
  description: string;
}

const mockPricesData: PriceEntry[] = [
  {
    id: '1',
    reservationDate: '2025-01-01',
    createdDate: '10:00:00',
    createdBy: 'Jan Kowalski',
    action: 'ACCEPTED',
    reco: 'LV6-600',
    systemReco: 'LV6-600',
    description: 'Abc due to xyz'
  },
  {
    id: '2',
    reservationDate: '2025-01-01',
    createdDate: '9:00:00',
    createdBy: 'proRMS',
    action: 'RECOMMENDED',
    reco: 'LV6-600',
    systemReco: 'LV6-600',
    description: ''
  },
  {
    id: '3',
    reservationDate: '2025-01-01',
    createdDate: '8:00:00',
    createdBy: 'Adam Nowak',
    action: 'ACCEPTED',
    reco: 'LV5-500',
    systemReco: 'LV4-400',
    description: ''
  },
  {
    id: '4',
    reservationDate: '2025-01-01',
    createdDate: '7:00:00',
    createdBy: 'Adam Nowak',
    action: 'OVERRIDDEN',
    reco: 'LV5-500',
    systemReco: 'LV4-400',
    description: ''
  },
  {
    id: '5',
    reservationDate: '2025-01-01',
    createdDate: '6:00:00',
    createdBy: 'Adam Nowak',
    action: 'REJECTED',
    reco: 'LV4-400',
    systemReco: 'LV4-400',
    description: ''
  },
  {
    id: '6',
    reservationDate: '2025-01-01',
    createdDate: '5:00:00',
    createdBy: 'proRMS',
    action: 'RECOMMENDED',
    reco: 'LV4-400',
    systemReco: 'LV4-400',
    description: ''
  },
  // Additional sample data
  {
    id: '7',
    reservationDate: '2025-01-02',
    createdDate: '14:30:00',
    createdBy: 'Maria Garcia',
    action: 'ACCEPTED',
    reco: 'LV3-300',
    systemReco: 'LV3-300',
    description: 'Rate adjusted for group booking'
  },
  {
    id: '8',
    reservationDate: '2025-01-02',
    createdDate: '13:45:00',
    createdBy: 'proRMS',
    action: 'RECOMMENDED',
    reco: 'LV2-200',
    systemReco: 'LV2-200',
    description: ''
  },
  {
    id: '9',
    reservationDate: '2025-01-03',
    createdDate: '16:20:00',
    createdBy: 'John Smith',
    action: 'OVERRIDDEN',
    reco: 'LV5-500',
    systemReco: 'LV3-300',
    description: 'Manual override for VIP guest'
  },
  {
    id: '10',
    reservationDate: '2025-01-03',
    createdDate: '15:15:00',
    createdBy: 'Anna Mueller',
    action: 'REJECTED',
    reco: 'LV1-100',
    systemReco: 'LV2-200',
    description: 'Rate too low for peak period'
  },
  {
    id: '11',
    reservationDate: '2025-01-04',
    createdDate: '11:30:00',
    createdBy: 'proRMS',
    action: 'RECOMMENDED',
    reco: 'LV4-400',
    systemReco: 'LV4-400',
    description: ''
  },
  {
    id: '12',
    reservationDate: '2025-01-04',
    createdDate: '10:45:00',
    createdBy: 'Lisa Chen',
    action: 'ACCEPTED',
    reco: 'LV6-600',
    systemReco: 'LV5-500',
    description: 'Corporate rate approved'
  },
  {
    id: '13',
    reservationDate: '2025-01-05',
    createdDate: '09:20:00',
    createdBy: 'Robert Brown',
    action: 'OVERRIDDEN',
    reco: 'LV3-300',
    systemReco: 'LV4-400',
    description: 'Promotional rate applied'
  },
  {
    id: '14',
    reservationDate: '2025-01-05',
    createdDate: '08:55:00',
    createdBy: 'proRMS',
    action: 'RECOMMENDED',
    reco: 'LV5-500',
    systemReco: 'LV5-500',
    description: ''
  },
  {
    id: '15',
    reservationDate: '2025-01-06',
    createdDate: '17:40:00',
    createdBy: 'Sarah Wilson',
    action: 'ACCEPTED',
    reco: 'LV2-200',
    systemReco: 'LV2-200',
    description: 'Early bird discount confirmed'
  },
  {
    id: '16',
    reservationDate: '2025-01-06',
    createdDate: '16:25:00',
    createdBy: 'Michael Davis',
    action: 'REJECTED',
    reco: 'LV6-600',
    systemReco: 'LV4-400',
    description: 'Rate exceeds budget limits'
  }
];

const PricesTable = () => {
  const [data, setData] = useState<PriceEntry[]>(mockPricesData);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: keyof PriceEntry; direction: 'asc' | 'desc' } | null>(null);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  const handleSort = (key: keyof PriceEntry) => {
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
      setData([...mockPricesData]);
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

  const UserFilter = () => (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-700">Filter by user</label>
      <Select>
        <SelectTrigger className="focus:ring-[#FF732D] focus:border-[#FF732D] h-8 text-xs">
          <SelectValue placeholder="Select users" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="prorms">proRMS</SelectItem>
          <SelectItem value="jan">Jan Kowalski</SelectItem>
          <SelectItem value="adam">Adam Nowak</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const ActionFilter = () => (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-700">Filter by action</label>
      <Select>
        <SelectTrigger className="focus:ring-[#FF732D] focus:border-[#FF732D] h-8 text-xs">
          <SelectValue placeholder="Select actions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recommended">RECOMMENDED</SelectItem>
          <SelectItem value="overridden">OVERRIDDEN</SelectItem>
          <SelectItem value="accepted">ACCEPTED</SelectItem>
          <SelectItem value="rejected">REJECTED</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Table */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50 border-b border-gray-200">
            <TableRow>
              <FilterHeader 
                title="Reservation Date" 
                sortable 
                filterable
                onSort={() => handleSort('reservationDate')}
                sortDirection={sortConfig?.key === 'reservationDate' ? sortConfig.direction : null}
                className="text-gray-700 font-semibold border-r border-gray-200 last:border-r-0"
                filterContent={<DateRangeFilter label="Filter by date range" />}
              />
              <FilterHeader 
                title="Created date" 
                sortable 
                filterable
                onSort={() => handleSort('createdDate')}
                sortDirection={sortConfig?.key === 'createdDate' ? sortConfig.direction : null}
                className="text-gray-700 font-semibold border-r border-gray-200 last:border-r-0"
                filterContent={<DateRangeFilter label="Filter by date & time range" includeTime />}
              />
              <FilterHeader 
                title="Created By" 
                sortable 
                filterable
                onSort={() => handleSort('createdBy')}
                sortDirection={sortConfig?.key === 'createdBy' ? sortConfig.direction : null}
                className="text-gray-700 font-semibold border-r border-gray-200 last:border-r-0"
                filterContent={<UserFilter />}
              />
              <FilterHeader 
                title="Action" 
                sortable 
                filterable
                onSort={() => handleSort('action')}
                sortDirection={sortConfig?.key === 'action' ? sortConfig.direction : null}
                className="text-gray-700 font-semibold border-r border-gray-200 last:border-r-0"
                filterContent={<ActionFilter />}
              />
              <TableHead className="text-gray-700 font-semibold border-r border-gray-200 last:border-r-0" style={{ fontSize: '10px' }}>RECO</TableHead>
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
                <TableCell className="border-r border-gray-100 last:border-r-0" style={{ fontSize: '10px' }}>{entry.systemReco}</TableCell>
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

export default PricesTable;
