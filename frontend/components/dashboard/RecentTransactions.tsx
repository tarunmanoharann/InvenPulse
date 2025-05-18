'use client';

const mockTransactions = [
  {
    id: 'TX12345',
    type: 'Incoming',
    product: 'Wireless Headphones',
    quantity: 50,
    date: '2023-07-15',
    status: 'completed',
  },
  {
    id: 'TX12346',
    type: 'Outgoing',
    product: 'Smart Watch',
    quantity: 25,
    date: '2023-07-14',
    status: 'completed',
  },
  {
    id: 'TX12347',
    type: 'Incoming',
    product: 'Bluetooth Speaker',
    quantity: 30,
    date: '2023-07-13',
    status: 'pending',
  },
  {
    id: 'TX12348',
    type: 'Outgoing',
    product: 'USB-C Cable',
    quantity: 100,
    date: '2023-07-12',
    status: 'completed',
  },
  {
    id: 'TX12349',
    type: 'Outgoing',
    product: 'Power Bank',
    quantity: 40,
    date: '2023-07-11',
    status: 'cancelled',
  },
];

export default function RecentTransactions() {
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeClasses = (type: string) => {
    return type === 'Incoming'
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="mt-4 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Qty
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {mockTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {transaction.id}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {transaction.product}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <span className={getTypeClasses(transaction.type)}>
                    {transaction.type}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {transaction.quantity}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {transaction.date}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusClasses(
                      transaction.status
                    )}`}
                  >
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 