import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import FilterHeader from './FilterHeader';

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
  }
];

const RestrictionsTable = () => {
  const [data, setData] = useState<RestrictionEntry[]>(mockRestrictionsData);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: keyof RestrictionEntry; direction: 'asc' | 'desc' } | null>(null);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  const handleSort = (key: keyof RestrictionEntry) => {
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

  const DateFilter = () => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Filter by date</label>
      <input
        type="date"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF732D] focus:border-[#FF732D]"
      />
    </div>
  );

  const DateTimeFilter = () => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Filter by date & time</label>
      <input
        type="datetime-local"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF732D] focus:border-[#FF732D]"
      />
    </div>
  );

  const UserFilter = () => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Filter by user</label>
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
  );

  const ActionFilter = () => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Filter by action</label>
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
  );

  const RMLFilter = () => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Filter by RML</label>
      <Select>
        <SelectTrigger className="focus:ring-[#FF732D] focus:border-[#FF732D]">
          <SelectValue placeholder="Select RML" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
          <SelectItem value="b">B</SelectItem>
          <SelectItem value="c">C</SelectItem>
          <SelectItem value="all">ALL</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const GroupTypeFilter = () => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Filter by group type</label>
      <Select>
        <SelectTrigger className="focus:ring-[#FF732D] focus:border-[#FF732D]">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="std">STD</SelectItem>
          <SelectItem value="dlx">DLX</SelectItem>
          <SelectItem value="su">SU</SelectItem>
          <SelectItem value="all">ALL</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <FilterHeader 
                title="Res. Date" 
                sortable 
                filterable
                onSort={() => handleSort('reservationDate')}
                sortDirection={sortConfig?.key === 'reservationDate' ? sortConfig.direction : null}
                className="text-gray-700 font-medium"
                filterContent={<DateFilter />}
              />
              <FilterHeader 
                title="Created date" 
                sortable 
                filterable
                onSort={() => handleSort('createdDate')}
                sortDirection={sortConfig?.key === 'createdDate' ? sortConfig.direction : null}
                className="text-gray-700 font-medium"
                filterContent={<DateTimeFilter />}
              />
              <FilterHeader 
                title="Created By" 
                sortable 
                filterable
                onSort={() => handleSort('createdBy')}
                sortDirection={sortConfig?.key === 'createdBy' ? sortConfig.direction : null}
                className="text-gray-700 font-medium"
                filterContent={<UserFilter />}
              />
              <FilterHeader 
                title="Action" 
                sortable 
                filterable
                onSort={() => handleSort('action')}
                sortDirection={sortConfig?.key === 'action' ? sortConfig.direction : null}
                className="text-gray-700 font-medium"
                filterContent={<ActionFilter />}
              />
              <TableHead className="text-gray-700 font-medium">RECO</TableHead>
              <FilterHeader 
                title="RML" 
                sortable 
                filterable
                onSort={() => handleSort('rml')}
                sortDirection={sortConfig?.key === 'rml' ? sortConfig.direction : null}
                className="text-gray-700 font-medium"
                filterContent={<RMLFilter />}
              />
              <FilterHeader 
                title="Group Type" 
                sortable 
                filterable
                onSort={() => handleSort('groupType')}
                sortDirection={sortConfig?.key === 'groupType' ? sortConfig.direction : null}
                className="text-gray-700 font-medium"
                filterContent={<GroupTypeFilter />}
              />
              <FilterHeader 
                title="Room Type" 
                sortable 
                onSort={() => handleSort('roomType')}
                sortDirection={sortConfig?.key === 'roomType' ? sortConfig.direction : null}
                className="text-gray-700 font-medium"
              />
              <TableHead className="text-gray-700 font-medium">proRMS RECO</TableHead>
              <TableHead className="text-gray-700 font-medium">Description</TableHead>
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
                <TableCell>{entry.rml}</TableCell>
                <TableCell>{entry.groupType}</TableCell>
                <TableCell>{entry.roomType}</TableCell>
                <TableCell>{entry.recoSystem}</TableCell>
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

export default RestrictionsTable;
