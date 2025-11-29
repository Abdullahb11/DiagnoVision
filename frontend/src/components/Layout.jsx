import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Header from './Header'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { userRole, currentUser } = useAuth()

  useEffect(() => {
    // Auto-show sidebar for authenticated users (even if no role, to show error message)
    if (currentUser) {
      // Always start with sidebar open for better UX
      setSidebarOpen(true)
    }
  }, [currentUser, userRole])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-grow relative">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={`flex-grow transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-0'}`}>
          {children}
        </main>
      </div>
      <footer className="border-t border-white/10 py-6 text-center text-lg text-slate-500">
        &copy; 2025 DiagnoVision. All rights reserved.
      </footer>
    </div>
  )
}

export default Layout

