import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

const UserDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth)

  return (
    <div>
      <h2>User Dashboard</h2>
      <p>Welcome, {user?.email}</p>
    </div>
  )
}

export default UserDashboard