import React, { useContext, useEffect } from 'react'
import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import Login from './pages/Login';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';

const App = () => {
  const { dToken, setDToken } = useContext(DoctorContext)
  const { aToken, setAToken } = useContext(AdminContext)

  // Clear any existing tokens on startup
  useEffect(() => {
    localStorage.removeItem('dToken')
    localStorage.removeItem('aToken')
    setDToken('')
    setAToken('')
  }, [])

  // If no token exists, show login page
  if (!dToken && !aToken) {
    return (
      <>
        <ToastContainer />
        <Login />
      </>
    )
  }

  // If admin token exists, show admin routes
  if (aToken) {
    return (
      <div className='bg-[#F8F9FD]'>
        <ToastContainer />
        <Navbar />
        <div className='flex items-start'>
          <Sidebar />
          <Routes>
            <Route path='/' element={<Navigate to="/admin-dashboard" replace />} />
            <Route path='/admin-dashboard' element={<Dashboard />} />
            <Route path='/all-appointments' element={<AllAppointments />} />
            <Route path='/add-doctor' element={<AddDoctor />} />
            <Route path='/doctor-list' element={<DoctorsList />} />
            <Route path='*' element={<Navigate to="/admin-dashboard" replace />} />
          </Routes>
        </div>
      </div>
    )
  }

  // If doctor token exists, show doctor routes
  if (dToken) {
    return (
      <div className='bg-[#F8F9FD]'>
        <ToastContainer />
        <Navbar />
        <div className='flex items-start'>
          <Sidebar />
          <Routes>
            <Route path='/' element={<Navigate to="/doctor-dashboard" replace />} />
            <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
            <Route path='/doctor-appointments' element={<DoctorAppointments />} />
            <Route path='/doctor-profile' element={<DoctorProfile />} />
            <Route path='*' element={<Navigate to="/doctor-dashboard" replace />} />
          </Routes>
        </div>
      </div>
    )
  }
}

export default App