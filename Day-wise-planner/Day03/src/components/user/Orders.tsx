// user/Orders.tsx
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Orders: React.FC = () => {
  const orders = [
    { id: 1, date: '2024-08-01', total: 59.99, status: 'Completed' },
    { id: 2, date: '2024-07-30', total: 124.50, status: 'Processing' },
    { id: 3, date: '2024-07-28', total: 79.99, status: 'Shipped' },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'default'; // or any other valid variant
      case 'Processing':
        return 'secondary';
      case 'Shipped':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>${order.total.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Orders;
