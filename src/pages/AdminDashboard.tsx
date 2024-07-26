import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

const AdminDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth)

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h2>
          <p className="mt-4 text-lg text-gray-700">Welcome, Admin {user?.email}</p>
          <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">System Overview</h3>
            {/* Add admin-specific components here */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard