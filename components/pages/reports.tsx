'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

export function Reports() {
  const { brands, selectedBrand, setSelectedBrand } = useAppStore();
  const reports = [
    { id: 'r1', name: 'Weekly Summary', date: '2024-01-01', brandId: 'brand1' },
    { id: 'r2', name: 'Engagement Overview', date: '2024-01-02', brandId: 'brand2' },
  ].filter((r) => !selectedBrand || r.brandId === selectedBrand);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Reports</h1>
      <div className="max-w-xs">
        <Select value={selectedBrand ?? ''} onValueChange={setSelectedBrand}>
          <SelectTrigger>
            <SelectValue placeholder="Select Campaign" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.name}</TableCell>
              <TableCell>{r.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
