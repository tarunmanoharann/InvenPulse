// user/InventoryList.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const InventoryList: React.FC = () => {
  const inventoryItems = [
    { id: 1, name: 'Product A', sku: 'SKU001', quantity: 100, price: 19.99 },
    { id: 2, name: 'Product B', sku: 'SKU002', quantity: 75, price: 24.99 },
    { id: 3, name: 'Product C', sku: 'SKU003', quantity: 50, price: 14.99 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Inventory List</h1>
      <div className="flex justify-between mb-4">
        <Input className="w-64" placeholder="Search inventory..." />
        <Button>Add New Product</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventoryItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.sku}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>${item.price.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryList;