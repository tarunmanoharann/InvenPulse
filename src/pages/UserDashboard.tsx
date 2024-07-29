import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { logout } from '../store/authSlice'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronRightIcon, ChevronLeftIcon, LayoutDashboardIcon, ActivityIcon, CalendarIcon, SettingsIcon, LogOutIcon } from "lucide-react"

const UserDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
  }

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded)
  }

  return (
    <div className="flex bg-background text-foreground">
      <aside className={`bg-card text-card-foreground shadow-lg transition-all duration-300 ${sidebarExpanded ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="flex items-center justify-between p-4">
          <h2 className={`text-2xl font-bold ${sidebarExpanded ? 'block' : 'hidden'}`}>Wise</h2>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {sidebarExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </Button>
        </div>
        <nav className="mt-6 flex flex-col items-center flex-grow">
          <Button variant="ghost" className="w-full justify-center">
            <LayoutDashboardIcon />
            <span className={`ml-4 ${sidebarExpanded ? 'inline-block' : 'hidden'}`}>Dashboard</span>
          </Button>
          <Button variant="ghost" className="w-full justify-center">
            <ActivityIcon />
            <span className={`ml-4 ${sidebarExpanded ? 'inline-block' : 'hidden'}`}>Activity</span>
          </Button>
          <Button variant="ghost" className="w-full justify-center">
            <CalendarIcon />
            <span className={`ml-4 ${sidebarExpanded ? 'inline-block' : 'hidden'}`}>Schedule</span>
          </Button>
          <Button variant="ghost" className="w-full justify-center">
            <SettingsIcon />
            <span className={`ml-4 ${sidebarExpanded ? 'inline-block' : 'hidden'}`}>Settings</span>
          </Button>
        </nav>
        <div className="p-4">
          <Button variant="destructive" className="w-full flex items-center justify-center" onClick={handleLogout}>
            <LogOutIcon className="mr-1" />
            <span className={sidebarExpanded ? 'inline-block' : 'hidden'}>Logout</span>
          </Button>
        </div>
      </aside>
      <main className={`flex-1 p-8 transition-all duration-300 ${sidebarExpanded ? 'ml-64' : 'ml-20'}`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Statistics</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline">Upgrade</Button>
            <Avatar>
              <AvatarImage src="/path-to-avatar.jpg" alt={user?.email} />
              <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Website Traffic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">12k</div>
              <div className="mt-2">
                <div>Social Media: 78%</div>
                <div>Organic Search: 22%</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Bounce Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">23%</div>
              <div className="text-sm text-muted-foreground">-10% Since last day</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">283%</div>
              <div className="text-sm text-muted-foreground">Return On Investment</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Customer Churn Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-muted">Chart placeholder</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default UserDashboard