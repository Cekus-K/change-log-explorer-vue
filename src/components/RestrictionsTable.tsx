
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const RestrictionsTable = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <TableRow>
            <TableHead className="text-gray-700 font-semibold border-r border-gray-200">Date</TableHead>
            <TableHead className="text-gray-700 font-semibold border-r border-gray-200">Room Type</TableHead>
            <TableHead className="text-gray-700 font-semibold border-r border-gray-200">System RECO</TableHead>
            <TableHead className="text-gray-700 font-semibold">Current Restriction</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="border-r border-gray-100">2025-06-30</TableCell>
            <TableCell className="border-r border-gray-100">STD01</TableCell>
            <TableCell className="border-r border-gray-100">CLOSED</TableCell>
            <TableCell>OPEN</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default RestrictionsTable;
