
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Dash from './components/Dashboard'
import Home from './components/Home'
import { Login } from './components/Login'
import { Register } from './components/Register'
import Admin from './components/Tables'
function App() {
  

  return (
    <>
    
      <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/auth/login" element={<Login/>}/>
          <Route path="/auth/register" element={<Register/>}/>
          <Route path="/dashboard" element={<Dash/>}/>
          <Route path="/admin" element={<Admin/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
