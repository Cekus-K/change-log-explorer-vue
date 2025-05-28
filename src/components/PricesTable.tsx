
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import FilterHeader from './FilterHeader';

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
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setData(sortedData);
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

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reservation Date</label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF732D] focus:border-[#FF732D]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF732D] focus:border-[#FF732D]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
          <Select>
            <SelectTrigger className="focus:ring-[#FF732D] focus:border-[#FF732D]">
              <SelectValue placeholder="Select users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prorms">proRMS</SelectItem>
              <SelectItem value="jan">Jan Kowalski</SelectItem>
              <SelectItem value="adam">Adam Nowak</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
          <Select>
            <SelectTrigger className="focus:ring-[#FF732D] focus:border-[#FF732D]">
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
        <div className="col-span-2 flex items-end">
          <Button className="bg-[#FF732D] hover:bg-[#E5652A] text-white mr-2">
            Apply Filters
          </Button>
          <Button variant="outline" className="border-[#FF732D] text-[#FF732D] hover:bg-[#FF732D] hover:text-white">
            Clear
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-[#FF732D]">
            <TableRow>
              <FilterHeader 
                title="Res. Date" 
                sortable 
                onSort={() => handleSort('reservationDate')}
                className="text-white hover:text-gray-200"
              />
              <FilterHeader 
                title="Created date" 
                sortable 
                onSort={() => handleSort('createdDate')}
                className="text-white hover:text-gray-200"
              />
              <FilterHeader 
                title="Created By" 
                sortable 
                onSort={() => handleSort('createdBy')}
                className="text-white hover:text-gray-200"
              />
              <FilterHeader 
                title="Action" 
                sortable 
                onSort={() => handleSort('action')}
                className="text-white hover:text-gray-200"
              />
              <TableHead className="text-white">RECO</TableHead>
              <TableHead className="text-white">proRMS RECO</TableHead>
              <TableHead className="text-white">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((entry) => (
              <TableRow key={entry.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{entry.reservationDate}</TableCell>
                <TableCell>{entry.createdDate}</TableCell>
                <TableCell>{entry.createdBy}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionBadgeClass(entry.action)}`}>
                    {entry.action}
                  </span>
                </TableCell>
                <TableCell>{entry.reco}</TableCell>
                <TableCell>{entry.systemReco}</TableCell>
                <TableCell>{entry.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Show</span>
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-700">entries</span>
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
