import OverviewCard from '@/components/dashboard/OverviewCard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import ActivityLog from '@/components/dashboard/ActivityLog';
import StockChart from '@/components/dashboard/StockChart';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <OverviewCard 
          title="Total Products" 
          value="145" 
          icon="package" 
          trend="+5%" 
          trendDirection="up" 
        />
        <OverviewCard 
          title="Low Stock" 
          value="12" 
          icon="alert-triangle" 
          trend="+2" 
          trendDirection="down"
          variant="warning"
        />
      </div>
      
      {/* Charts and Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Stock Movement Chart */}
        <div className="rounded-lg border bg-card text-card-foreground shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium">Stock Movement</h3>
            <StockChart />
          </div>
        </div>
        
        {/* Recent Transactions */}
        <div className="rounded-lg border bg-card text-card-foreground shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium">Recent Transactions</h3>
            <RecentTransactions />
          </div>
        </div>
      </div>
      
      {/* Activity Log */}
      <div className="rounded-lg border bg-card text-card-foreground shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium">Activity Log</h3>
          <ActivityLog />
        </div>
      </div>
    </div>
  );
} 