
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import FilterHeader from './FilterHeader';
import DateRangeFilter from './DateRangeFilter';
import DropdownFilter from './DropdownFilter';

interface ChangelogEntry {
  id: string;
  reservationDate: string;
  createdDate: string;
  createdBy: string;
  action: 'RECOMMENDED' | 'OVERRIDDEN';
  type: 'Rate' | 'Restriction';
  rml: string;
  groupType: string;
  roomType: string;
  systemReco: string;
  previous: string | null;
  currentRate?: string;
  description?: string;
}

const mockData: ChangelogEntry[] = [
  {
    id: '1',
    reservationDate: '2025-06-30',
    createdDate: '2025-06-26 10:12:06',
    createdBy: 'System',
    action: 'RECOMMENDED',
    type: 'Rate',
    rml: 'RML001',
    groupType: 'Corporate',
    roomType: 'Standard',
    systemReco: 'G6-450',
    previous: null,
    currentRate: 'G6-450',
    description: 'Rate update'
  },
  {
    id: '2',
    reservationDate: '2025-07-05',
    createdDate: '2025-06-26 10:12:06',
    createdBy: 'System',
    action: 'RECOMMENDED',
    type: 'Rate',
    rml: 'RML002',
    groupType: 'Leisure',
    roomType: 'Deluxe',
    systemReco: 'G6-450',
    previous: 'G5-400',
    currentRate: 'G6-450',
    description: 'Rate adjustment'
  },
  {
    id: '3',
    reservationDate: '2025-07-19',
    createdDate: '2025-06-26 10:12:06',
    createdBy: 'System',
    action: 'RECOMMENDED',
    type: 'Rate',
    rml: 'RML003',
    groupType: 'Corporate',
    roomType: 'Suite',
    systemReco: 'G1-200',
    previous: null,
    currentRate: 'G1-200',
    description: 'New rate'
  },
  {
    id: '4',
    reservationDate: '2025-06-26',
    createdDate: '2025-06-26 10:12:06',
    createdBy: 'System',
    action: 'OVERRIDDEN',
    type: 'Restriction',
    rml: 'RML004',
    groupType: 'Group',
    roomType: 'Standard',
    systemReco: 'G3-293',
    previous: 'G2-250',
    currentRate: 'G3-293',
    description: 'Restriction override'
  }
];

const Changelog: React.FC = () => {
  const [data, setData] = useState<ChangelogEntry[]>(mockData);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({ key: '', direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [autoSelectedRows, setAutoSelectedRows] = useState<Set<string>>(new Set());
  const itemsPerPage = 20;

  const filteredData = data.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'rates') return item.type === 'Rate';
    if (activeFilter === 'restrictions') return item.type === 'Restriction';
    return true;
  });

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
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

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
    { value: 'rml001', label: 'RML001' },
    { value: 'rml002', label: 'RML002' },
    { value: 'rml003', label: 'RML003' },
    { value: 'rml004', label: 'RML004' }
  ];

  const groupTypeOptions = [
    { value: 'corporate', label: 'Corporate' },
    { value: 'leisure', label: 'Leisure' },
    { value: 'group', label: 'Group' }
  ];

  return (
    <div className="w-full space-y-4">
      {/* Warning Alert */}
      {hasRowsWithoutPrevious && autoSelectedRows.size > 0 && (
        <Alert className="border-yellow-500 bg-yellow-50">
          <AlertDescription className="text-yellow-800">
            There are other entries for selected reservation dates that will be accepted on a mandatory basis.
          </AlertDescription>
        </Alert>
      )}

      {/* Filter Tabs */}
      <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="grid w-fit grid-cols-3">
            <TabsTrigger value="all">Rates + Restrictions</TabsTrigger>
            <TabsTrigger value="rates">Rates</TabsTrigger>
            <TabsTrigger value="restrictions">Restrictions</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              disabled={selectedRows.size === 0 || hasRowsWithoutPrevious}
              className="disabled:opacity-50"
            >
              Reject
            </Button>
            <Button 
              disabled={selectedRows.size === 0}
              className="bg-[#FF732D] hover:bg-[#FF732D]/90"
            >
              Accept
            </Button>
          </div>
        </div>

        <TabsContent value={activeFilter} className="mt-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  
                  <FilterHeader
                    title="Reservation Date"
                    sortable
                    filterable
                    onSort={() => handleSort('reservationDate')}
                    sortDirection={sortConfig.key === 'reservationDate' ? sortConfig.direction : null}
                    filterContent={<DateRangeFilter />}
                  />
                  
                  <FilterHeader
                    title="Created Date"
                    sortable
                    filterable
                    onSort={() => handleSort('createdDate')}
                    sortDirection={sortConfig.key === 'createdDate' ? sortConfig.direction : null}
                    filterContent={<DateRangeFilter />}
                  />
                  
                  <FilterHeader
                    title="Created By"
                    sortable
                    filterable
                    onSort={() => handleSort('createdBy')}
                    sortDirection={sortConfig.key === 'createdBy' ? sortConfig.direction : null}
                    filterContent={<DropdownFilter options={createdByOptions} placeholder="Select creator" />}
                  />
                  
                  <FilterHeader
                    title="Action"
                    sortable
                    filterable
                    onSort={() => handleSort('action')}
                    sortDirection={sortConfig.key === 'action' ? sortConfig.direction : null}
                    filterContent={<DropdownFilter options={actionOptions} placeholder="Select action" />}
                  />
                  
                  <FilterHeader
                    title="RML"
                    sortable
                    filterable
                    onSort={() => handleSort('rml')}
                    sortDirection={sortConfig.key === 'rml' ? sortConfig.direction : null}
                    filterContent={<DropdownFilter options={rmlOptions} placeholder="Select RML" />}
                  />
                  
                  <FilterHeader
                    title="Group Type"
                    sortable
                    filterable
                    onSort={() => handleSort('groupType')}
                    sortDirection={sortConfig.key === 'groupType' ? sortConfig.direction : null}
                    filterContent={<DropdownFilter options={groupTypeOptions} placeholder="Select group type" />}
                  />
                  
                  <TableHead style={{ fontSize: '10px' }}>Room Type</TableHead>
                  <TableHead style={{ fontSize: '10px' }}>System RECO</TableHead>
                  <TableHead style={{ fontSize: '10px' }}>Previous</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {paginatedData.map((entry) => (
                  <TableRow 
                    key={entry.id}
                    className={`
                      ${selectedRows.has(entry.id) ? 'bg-blue-50' : ''}
                      ${autoSelectedRows.has(entry.id) ? 'bg-yellow-50' : ''}
                      hover:bg-gray-50
                    `}
                  >
                    <TableCell>
                      <Checkbox 
                        checked={selectedRows.has(entry.id)}
                        onCheckedChange={() => handleRowSelect(entry.id, entry)}
                      />
                    </TableCell>
                    <TableCell style={{ fontSize: '11px' }}>{entry.reservationDate}</TableCell>
                    <TableCell style={{ fontSize: '11px' }}>{entry.createdDate}</TableCell>
                    <TableCell style={{ fontSize: '11px' }}>{entry.createdBy}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={entry.action === 'RECOMMENDED' ? 'default' : 'secondary'}
                        className={entry.action === 'RECOMMENDED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                        style={{ fontSize: '9px' }}
                      >
                        {entry.action}
                      </Badge>
                    </TableCell>
                    <TableCell style={{ fontSize: '11px' }}>{entry.rml}</TableCell>
                    <TableCell style={{ fontSize: '11px' }}>{entry.groupType}</TableCell>
                    <TableCell style={{ fontSize: '11px' }}>{entry.roomType}</TableCell>
                    <TableCell style={{ fontSize: '11px' }}>{entry.systemReco}</TableCell>
                    <TableCell style={{ fontSize: '11px' }}>{entry.previous || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-gray-500">
              Total records {sortedData.length}
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Changelog;
