import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import FilterHeader from './FilterHeader';
import DropdownFilter from './DropdownFilter';
import DateRangeFilter from './DateRangeFilter';
import { Toggle } from '@/components/ui/toggle';

interface ChangelogEntry {
  id: string;
  reservationDate: string;
  createdDate: string;
  createdBy: string;
  action: 'RECOMMENDED' | 'OVERRIDDEN';
  rateRestriction: 'Rate' | 'Restriction' | 'Rate & Restriction';
  rml: string;
  groupType: string;
  roomType: string;
  systemReco: string;
  previous: string | null;
  selected: boolean;
}

const Changelog = () => {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [categoryFilter, setCategoryFilter] = useState<'rates' | 'restrictions' | 'both'>('both');
  const [mandatorySelectionMessage, setMandatorySelectionMessage] = useState<string | null>(null);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockData: ChangelogEntry[] = [
      {
        id: '1',
        reservationDate: '2025-06-30',
        createdDate: '2025-06-26 10:12:06',
        createdBy: 'System',
        action: 'RECOMMENDED',
        rateRestriction: 'Rate',
        rml: 'G6-450',
        groupType: 'Standard',
        roomType: 'Deluxe',
        systemReco: 'G6-450',
        previous: null,
        selected: false
      },
      {
        id: '2',
        reservationDate: '2025-06-30',
        createdDate: '2025-06-26 10:12:06',
        createdBy: 'System',
        action: 'RECOMMENDED',
        rateRestriction: 'Restriction',
        rml: 'G6-450',
        groupType: 'Standard',
        roomType: 'Deluxe',
        systemReco: 'G6-450',
        previous: null,
        selected: false
      },
      {
        id: '3',
        reservationDate: '2025-07-05',
        createdDate: '2025-06-26 10:12:06',
        createdBy: 'System',
        action: 'OVERRIDDEN',
        rateRestriction: 'Rate & Restriction',
        rml: 'G1-200',
        groupType: 'Premium',
        roomType: 'Suite',
        systemReco: 'G1-200',
        previous: 'G2-300',
        selected: false
      },
    ];
    setEntries(mockData);
  }, []);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilter = (column: string, value: any) => {
    setFilters(prev => ({ ...prev, [column]: value }));
  };

  const handleEntrySelection = (entryId: string, checked: boolean) => {
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return;

    const newSelected = new Set(selectedEntries);
    
    if (checked) {
      newSelected.add(entryId);
      
      // If entry has no previous, auto-select other entries for same reservation date without previous
      if (!entry.previous) {
        const sameReservationDateEntries = entries.filter(e => 
          e.reservationDate === entry.reservationDate && !e.previous && e.id !== entryId
        );
        
        sameReservationDateEntries.forEach(e => newSelected.add(e.id));
        
        if (sameReservationDateEntries.length > 0) {
          setMandatorySelectionMessage(
            `There are other entries for selected reservation dates that will be accepted on a mandatory basis.`
          );
        }
      }
    } else {
      newSelected.delete(entryId);
      
      // If this was an entry without previous, also deselect related entries
      if (!entry.previous) {
        const sameReservationDateEntries = entries.filter(e => 
          e.reservationDate === entry.reservationDate && !e.previous
        );
        
        sameReservationDateEntries.forEach(e => newSelected.delete(e.id));
        setMandatorySelectionMessage(null);
      }
    }
    
    setSelectedEntries(newSelected);
  };

  const filteredEntries = entries.filter(entry => {
    // Category filter
    if (categoryFilter === 'rates' && !entry.rateRestriction.includes('Rate')) return false;
    if (categoryFilter === 'restrictions' && !entry.rateRestriction.includes('Restriction')) return false;
    
    // Other filters
    for (const [key, value] of Object.entries(filters)) {
      if (value && entry[key as keyof ChangelogEntry] !== value) return false;
    }
    
    return true;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key as keyof ChangelogEntry];
    const bValue = b[sortConfig.key as keyof ChangelogEntry];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedEntries = sortedEntries.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(sortedEntries.length / pageSize);
  const hasSelectedEntriesWithoutPrevious = Array.from(selectedEntries).some(id => {
    const entry = entries.find(e => e.id === id);
    return entry && !entry.previous;
  });

  const actionOptions = [
    { value: 'RECOMMENDED', label: 'Recommended' },
    { value: 'OVERRIDDEN', label: 'Overridden' }
  ];

  const createdByOptions = [
    { value: 'System', label: 'System' },
    { value: 'User', label: 'User' }
  ];

  const rmlOptions = [
    { value: 'G6-450', label: 'G6-450' },
    { value: 'G1-200', label: 'G1-200' },
    { value: 'G3-293', label: 'G3-293' }
  ];

  const groupTypeOptions = [
    { value: 'Standard', label: 'Standard' },
    { value: 'Premium', label: 'Premium' },
    { value: 'Deluxe', label: 'Deluxe' }
  ];

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <Toggle
            pressed={categoryFilter === 'rates'}
            onPressedChange={() => setCategoryFilter('rates')}
            className="data-[state=on]:bg-[#FF732D] data-[state=on]:text-white"
          >
            Rates
          </Toggle>
          <Toggle
            pressed={categoryFilter === 'restrictions'}
            onPressedChange={() => setCategoryFilter('restrictions')}
            className="data-[state=on]:bg-[#FF732D] data-[state=on]:text-white"
          >
            Restrictions
          </Toggle>
          <Toggle
            pressed={categoryFilter === 'both'}
            onPressedChange={() => setCategoryFilter('both')}
            className="data-[state=on]:bg-[#FF732D] data-[state=on]:text-white"
          >
            Rates + Restrictions
          </Toggle>
        </div>
      </div>

      {/* Mandatory selection message */}
      {mandatorySelectionMessage && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertDescription className="text-yellow-800">
            {mandatorySelectionMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <FilterHeader
                title="Reservation Date"
                sortable
                filterable
                onSort={() => handleSort('reservationDate')}
                sortDirection={sortConfig?.key === 'reservationDate' ? sortConfig.direction : null}
                filterContent={
                  <DateRangeFilter
                    label="Filter by Reservation Date"
                    onDateRangeChange={(from, to) => handleFilter('reservationDate', { from, to })}
                  />
                }
              />
              <FilterHeader
                title="Created Date"
                sortable
                filterable
                onSort={() => handleSort('createdDate')}
                sortDirection={sortConfig?.key === 'createdDate' ? sortConfig.direction : null}
                filterContent={
                  <DateRangeFilter
                    label="Filter by Created Date"
                    onDateRangeChange={(from, to) => handleFilter('createdDate', { from, to })}
                  />
                }
              />
              <FilterHeader
                title="Created By"
                sortable
                filterable
                onSort={() => handleSort('createdBy')}
                sortDirection={sortConfig?.key === 'createdBy' ? sortConfig.direction : null}
                filterContent={
                  <DropdownFilter
                    options={createdByOptions}
                    placeholder="Filter by Created By"
                    onValueChange={(value) => handleFilter('createdBy', value)}
                  />
                }
              />
              <FilterHeader
                title="Action"
                sortable
                filterable
                onSort={() => handleSort('action')}
                sortDirection={sortConfig?.key === 'action' ? sortConfig.direction : null}
                filterContent={
                  <DropdownFilter
                    options={actionOptions}
                    placeholder="Filter by Action"
                    onValueChange={(value) => handleFilter('action', value)}
                  />
                }
              />
              <TableHead>Rate & Restriction</TableHead>
              <FilterHeader
                title="RML"
                sortable
                filterable
                onSort={() => handleSort('rml')}
                sortDirection={sortConfig?.key === 'rml' ? sortConfig.direction : null}
                filterContent={
                  <DropdownFilter
                    options={rmlOptions}
                    placeholder="Filter by RML"
                    onValueChange={(value) => handleFilter('rml', value)}
                  />
                }
              />
              <FilterHeader
                title="Group Type"
                sortable
                filterable
                onSort={() => handleSort('groupType')}
                sortDirection={sortConfig?.key === 'groupType' ? sortConfig.direction : null}
                filterContent={
                  <DropdownFilter
                    options={groupTypeOptions}
                    placeholder="Filter by Group Type"
                    onValueChange={(value) => handleFilter('groupType', value)}
                  />
                }
              />
              <TableHead>Room Type</TableHead>
              <TableHead>System RECO</TableHead>
              <TableHead>Previous</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEntries.map((entry) => (
              <TableRow 
                key={entry.id}
                className={selectedEntries.has(entry.id) ? 'bg-blue-50' : ''}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedEntries.has(entry.id)}
                    onCheckedChange={(checked) => handleEntrySelection(entry.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell>{entry.reservationDate}</TableCell>
                <TableCell>{entry.createdDate}</TableCell>
                <TableCell>{entry.createdBy}</TableCell>
                <TableCell>
                  <Badge variant={entry.action === 'RECOMMENDED' ? 'default' : 'secondary'}>
                    {entry.action}
                  </Badge>
                </TableCell>
                <TableCell>{entry.rateRestriction}</TableCell>
                <TableCell>{entry.rml}</TableCell>
                <TableCell>{entry.groupType}</TableCell>
                <TableCell>{entry.roomType}</TableCell>
                <TableCell>{entry.systemReco}</TableCell>
                <TableCell>{entry.previous || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button 
            variant="default" 
            className="bg-green-600 hover:bg-green-700"
            disabled={selectedEntries.size === 0}
          >
            Accept ({selectedEntries.size})
          </Button>
          <Button 
            variant="destructive"
            disabled={selectedEntries.size === 0 || hasSelectedEntriesWithoutPrevious}
          >
            Reject ({selectedEntries.size})
          </Button>
        </div>
        
        <div className="text-sm text-gray-500">
          Total records: {sortedEntries.length}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default Changelog;
