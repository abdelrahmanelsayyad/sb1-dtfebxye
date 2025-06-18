'use client';

import React from 'react';
import { ChevronDown, Plus, Calendar, Download, Share, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';

export function ProductSelector() {
  const { selectedProduct, setSelectedProduct, products } = useAppStore();
  const currentProduct = products.find(p => p.id === selectedProduct);

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        {/* Product Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <span className="font-medium">
                {currentProduct?.name || 'Select Product'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {products.map((product) => (
              <DropdownMenuItem
                key={product.id}
                onClick={() => setSelectedProduct(product.id)}
              >
                <div className="flex items-center space-x-2">
                  <span>{product.name}</span>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem>
              <Plus className="w-4 h-4 mr-2" />
              Add New Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date Range */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Last 30 Days</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Last 7 Days</DropdownMenuItem>
            <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
            <DropdownMenuItem>Last 3 Months</DropdownMenuItem>
            <DropdownMenuItem>Last 6 Months</DropdownMenuItem>
            <DropdownMenuItem>Last Year</DropdownMenuItem>
            <DropdownMenuItem>Custom Range</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Live Data
        </Badge>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
        <Button variant="outline" size="sm">
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}