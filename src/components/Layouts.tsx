import { Outlet, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

const Layout = () => {
  const { user } = useSelector((state: RootState) => state.auth)

  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          {!user && (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
          {user && user.role === 'user' && (
            <li><Link to="/user-dashboard">Dashboard</Link></li>
          )}
          {user && user.role === 'admin' && (
            <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>
          )}
        </ul>
      </nav>
      <Outlet />
    </div>
  )
}

export default Layout