import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Orders: React.FC = () => {
  const orders = [
    { id: 1, customer: 'John Doe', date: '2023-07-30', status: 'Shipped', total: 59.99 },
    { id: 2, customer: 'Jane Smith', date: '2023-07-29', status: 'Processing', total: 89.99 },
    { id: 3, customer: 'Bob Johnson', date: '2023-07-28', status: 'Delivered', total: 129.99 },
  ];

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'default'; // or any other variant you prefer
      case 'Shipped':
        return 'secondary';
      case 'Processing':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell>{order.date}</TableCell>
            <TableCell>
              <Badge variant={getBadgeVariant(order.status)}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>${order.total.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Orders;
