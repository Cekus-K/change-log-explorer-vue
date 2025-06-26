
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const PricesTable = () => {
  const mockData = [
    { id: 1, date: '2025-06-26', roomType: 'STD01', systemReco: 'G6-450', current: 'G5-400' },
    { id: 2, date: '2025-06-27', roomType: 'DLX02', systemReco: 'G4-350', current: 'G3-300' },
    { id: 3, date: '2025-06-28', roomType: 'SU03', systemReco: 'G2-250', current: 'G1-200' },
  ];

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Room Type</TableHead>
            <TableHead>System RECO</TableHead>
            <TableHead>Current</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.roomType}</TableCell>
              <TableCell>{item.systemReco}</TableCell>
              <TableCell>{item.current}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PricesTable;
