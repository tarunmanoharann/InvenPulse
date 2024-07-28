import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

const UserDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth)

  return (
    <div className="min-h-screen bg-gray-100">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-900">User Dashboard</h2>
          <p className="mt-4 text-lg text-gray-700">Welcome, {user?.email}</p>
          <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Your Inventory Summary</h3>
            {/* Add inventory summary components here */}
          </div>
        </div>
      </div>
  )
}

export default UserDashboard