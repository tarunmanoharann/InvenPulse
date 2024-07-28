import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Receipt, 
  PiggyBank, 
  LineChart, 
  CreditCard, 
  Banknote, 
  Settings, 
  LogOut
} from 'lucide-react';


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, isActive }) => (
  <Button 
    className={`w-full justify-start ${isActive ? 'bg-gray-200' : ''}`}
    variant="ghost"
  >
    {icon}
    <span className="ml-2">{label}</span>
  </Button>
);

const Sidebar: React.FC = () => {
  const links: SidebarLinkProps[] = [
    { icon: <Home size={20} />, label: 'Dashboard', isActive: true },
    { icon: <Receipt size={20} />, label: 'Transactions' },
    { icon: <PiggyBank size={20} />, label: 'Accounts' },
    { icon: <LineChart size={20} />, label: 'Investments' },
    { icon: <CreditCard size={20} />, label: 'Credit Cards' },
    { icon: <Banknote size={20} />, label: 'Loans' },
    { icon: <Settings size={20} />, label: 'Services' },
  ];

  return (
    <div className="w-64 bg-white h-screen p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-6">InvenPulse.</h1>
      <nav className="space-y-2 flex-1">
        {links.map((link) => (
          <SidebarLink key={link.label} {...link} />
        ))}
      </nav>
      <Button variant="ghost" className="w-full justify-start">
        <LogOut size={20} />
        <span className="ml-2">Login</span>
      </Button>
    </div>
  );
};

const MyCards: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>My Cards</CardTitle>
    </CardHeader>
    <CardContent className="flex space-x-4">
      <Card className="bg-indigo-600 text-white p-4 flex-1">
        <div className="flex justify-between items-center mb-4">
          <span>Balance</span>
          <span>VISA</span>
        </div>
        <div className="text-2xl font-bold mb-4">$5,756</div>
        <div className="flex justify-between items-center">
          <span>3778 **** **** 1234</span>
          <span>12/22</span>
        </div>
      </Card>
      <Card className="bg-gray-800 text-white p-4 flex-1">
        <div className="flex justify-between items-center mb-4">
          <span>Balance</span>
          <span>MASTERCARD</span>
        </div>
        <div className="text-2xl font-bold mb-4">$3,200</div>
        <div className="flex justify-between items-center">
          <span>1234 **** **** 5678</span>
          <span>01/24</span>
        </div>
      </Card>
    </CardContent>
  </Card>
);

const RecentTransactions: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Transactions</CardTitle>
    </CardHeader>
    <CardContent>
    </CardContent>
  </Card>
);

const WeeklyActivity: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Weekly Activity</CardTitle>
    </CardHeader>
    <CardContent>
    </CardContent>
  </Card>
);

const ExpenseStatistics: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Expense Statistics</CardTitle>
    </CardHeader>
    <CardContent>
    </CardContent>
  </Card>
);

const QuickTransfer: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Quick Transfer</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex space-x-4 mb-4">
        <Avatar>
          <AvatarImage src="/avatar1.jpg" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="/avatar2.jpg" />
          <AvatarFallback>LB</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="/avatar3.jpg" />
          <AvatarFallback>RP</AvatarFallback>
        </Avatar>
      </div>
      <Button className="w-full">Send</Button>
    </CardContent>
  </Card>
);

const BalanceHistory: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Balance History</CardTitle>
    </CardHeader>
    <CardContent>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1 p-8">
      <div className="grid grid-cols-2 gap-6">
        <MyCards />
        <RecentTransactions />
        <WeeklyActivity />
        <ExpenseStatistics />
        <QuickTransfer />
        <BalanceHistory />
      </div>
    </div>
  </div>
);

export default Dashboard;