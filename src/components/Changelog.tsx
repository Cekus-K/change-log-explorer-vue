import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, X } from 'lucide-react';
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
  ratesRestriction: string;
  rml: string;
  groupType: string;
  roomType: string;
  systemReco: string;
  previous: string | null;
  currentRate?: string;
  description?: string;
}

const mockData: ChangelogEntry[] = [
  // Rate entries
  {
    id: '1',
    reservationDate: '2025-06-30',
    createdDate: '2025-06-26 10:12:06',
    createdBy: 'System',
    action: 'RECOMMENDED',
    type: 'Rate',
    ratesRestriction: 'G6-450',
    rml: 'A',
    groupType: 'STD',
    roomType: 'STD01',
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
    ratesRestriction: 'G6-450',
    rml: 'B',
    groupType: 'DLX',
    roomType: 'DLX02',
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
    ratesRestriction: 'G1-200',
    rml: 'C',
    groupType: 'SU',
    roomType: 'SU03',
    systemReco: 'G1-200',
    previous: null,
    currentRate: 'G1-200',
    description: 'New rate'
  },
  // Restriction entries
  {
    id: '4',
    reservationDate: '2025-06-26',
    createdDate: '2025-06-26 10:12:06',
    createdBy: 'System',
    action: 'OVERRIDDEN',
    type: 'Restriction',
    ratesRestriction: 'CLOSED',
    rml: 'A',
    groupType: 'STD',
    roomType: 'STD01',
    systemReco: 'CLOSED',
    previous: 'OPEN',
    description: 'Restriction override'
  },
  {
    id: '5',
    reservationDate: '2025-07-01',
    createdDate: '2025-06-26 11:15:30',
    createdBy: 'Admin',
    action: 'RECOMMENDED',
    type: 'Restriction',
    ratesRestriction: 'CTA',
    rml: 'B',
    groupType: 'DLX',
    roomType: 'DLX02',
    systemReco: 'CTA',
    previous: 'OPEN',
    description: 'Close to arrival restriction'
  },
  {
    id: '6',
    reservationDate: '2025-07-15',
    createdDate: '2025-06-26 14:22:45',
    createdBy: 'System',
    action: 'RECOMMENDED',
    type: 'Restriction',
    ratesRestriction: 'MINLOS 2',
    rml: 'C',
    groupType: 'SU',
    roomType: 'SU03',
    systemReco: 'MINLOS 2',
    previous: null,
    description: 'Minimum length of stay restriction'
  },
  // Additional mock data with mixed rates and restrictions
  ...Array.from({ length: 150 }, (_, i) => {
    const isRate = Math.random() > 0.5;
    const restrictionTypes = ['OPEN', 'CLOSED', 'CTA', 'MINLOS 2'];
    const ratePrefix = `G${Math.floor(Math.random() * 6) + 1}`;
    const rateValue = `${ratePrefix}-${Math.floor(Math.random() * 500) + 100}`;
    const restrictionValue = restrictionTypes[Math.floor(Math.random() * restrictionTypes.length)];
    
    return {
      id: `${i + 7}`,
      reservationDate: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      createdDate: `2025-06-26 ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      createdBy: ['System', 'John Doe', 'Jane Smith', 'Admin'][Math.floor(Math.random() * 4)],
      action: (Math.random() > 0.5 ? 'RECOMMENDED' : 'OVERRIDDEN') as 'RECOMMENDED' | 'OVERRIDDEN',
      type: (isRate ? 'Rate' : 'Restriction') as 'Rate' | 'Restriction',
      ratesRestriction: isRate ? rateValue : restrictionValue,
      rml: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      groupType: ['STD', 'DLX', 'SU'][Math.floor(Math.random() * 3)],
      roomType: (() => {
        const types = ['STD', 'DLX', 'SU', 'PREM'];
        const type = types[Math.floor(Math.random() * types.length)];
        const num = String(Math.floor(Math.random() * 3) + 1).padStart(2, '0');
        return `${type}${num}`;
      })(),
      systemReco: isRate ? rateValue : restrictionValue,
      previous: Math.random() > 0.3 ? (isRate ? `G${Math.floor(Math.random() * 6) + 1}-${Math.floor(Math.random() * 500) + 100}` : restrictionTypes[Math.floor(Math.random() * restrictionTypes.length)]) : null,
      currentRate: isRate ? rateValue : undefined,
      description: Math.random() > 0.7 ? ['Rate update', 'Price adjustment', 'System recommendation', 'Manual override'][Math.floor(Math.random() * 4)] : ''
    };
  })
];

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

  const filteredData = data.filter(item => {
    if (activeFilters.includes('rates') && activeFilters.includes('restrictions')) return true;
    if (activeFilters.includes('rates') && item.type === 'Rate') return true;
    if (activeFilters.includes('restrictions') && item.type === 'Restriction') return true;
    return false;
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

  return (
    <div className="w-full space-y-6">
      {/* Warning Alert */}
      {hasRowsWithoutPrevious && autoSelectedRows.size > 0 && (
        <Alert className="border-yellow-500 bg-yellow-50">
          <AlertDescription className="text-yellow-800">
            There are other entries for selected reservation dates that will be accepted on a mandatory basis.
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end items-center mb-4">
        <div className="flex gap-2">
          <Button 
            variant="outline"
            disabled={selectedRows.size === 0 || hasRowsWithoutPrevious}
            className="disabled:opacity-50 bg-red-600 text-white hover:bg-red-700 border-red-600"
          >
            <X className="w-4 h-4 mr-2" />
            Reject
          </Button>
          <Button 
            disabled={selectedRows.size === 0}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="w-4 h-4 mr-2" />
            Accept
          </Button>
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
                filterContent={<DateRangeFilter />}
              />
              
              <FilterHeader
                title="Created Date"
                sortable
                filterable
                onSort={() => handleSort('createdDate')}
                sortDirection={sortConfig.key === 'createdDate' ? sortConfig.direction : null}
                className="text-gray-700 font-semibold border-r border-gray-200"
                filterContent={<DateRangeFilter />}
              />
              
              <FilterHeader
                title="Created By"
                sortable
                filterable
                onSort={() => handleSort('createdBy')}
                sortDirection={sortConfig.key === 'createdBy' ? sortConfig.direction : null}
                className="text-gray-700 font-semibold border-r border-gray-200"
                filterContent={<DropdownFilter options={createdByOptions} placeholder="Select creator" />}
              />
              
              <FilterHeader
                title="Action"
                sortable
                filterable
                onSort={() => handleSort('action')}
                sortDirection={sortConfig.key === 'action' ? sortConfig.direction : null}
                className="text-gray-700 font-semibold border-r border-gray-200"
                filterContent={<DropdownFilter options={actionOptions} placeholder="Select action" />}
              />
              
              <FilterHeader
                title="Rates & Restriction"
                sortable
                filterable
                onSort={() => handleSort('ratesRestriction')}
                sortDirection={sortConfig.key === 'ratesRestriction' ? sortConfig.direction : null}
                className="text-gray-700 font-semibold border-r border-gray-200"
                filterContent={<DropdownFilter options={[]} placeholder="Select rates/restriction" />}
              />
              
              <FilterHeader
                title="RML"
                sortable
                filterable
                onSort={() => handleSort('rml')}
                sortDirection={sortConfig.key === 'rml' ? sortConfig.direction : null}
                className="text-gray-700 font-semibold border-r border-gray-200"
                filterContent={<DropdownFilter options={rmlOptions} placeholder="Select RML" />}
              />
              
              <FilterHeader
                title="Group Type"
                sortable
                filterable
                onSort={() => handleSort('groupType')}
                sortDirection={sortConfig.key === 'groupType' ? sortConfig.direction : null}
                className="text-gray-700 font-semibold border-r border-gray-200"
                filterContent={<DropdownFilter options={groupTypeOptions} placeholder="Select group type" />}
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
                    className={`${entry.action === 'RECOMMENDED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} text-xs font-medium`}
                    style={{ fontSize: '9px' }}
                  >
                    {entry.action}
                  </Badge>
                </TableCell>
                <TableCell className="border-r border-gray-100" style={{ fontSize: '10px' }}>{entry.ratesRestriction}</TableCell>
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
  );
};

export default Changelog;
