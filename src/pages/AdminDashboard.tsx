import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

const AdminDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth)

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome, Admin {user?.email}</p>
    </div>
  )
}

export default AdminDashboard