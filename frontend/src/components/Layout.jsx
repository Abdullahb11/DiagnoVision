import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Header from './Header'
import Sidebar from './Sidebar'
import { motion } from 'framer-motion'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { userRole, currentUser } = useAuth()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (currentUser && window.innerWidth >= 1024) {
      setSidebarOpen(true)
    }
  }, [currentUser])

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="fixed inset-0 bg-hero-pattern opacity-50 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-medical-500/5 pointer-events-none" />
      
      <div className="relative flex min-h-screen">
        {currentUser && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

          <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 relative"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
              {children}
            </div>
          </motion.main>

          <footer className="relative border-t border-white/5 bg-dark-900/50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">DV</span>
                  </div>
                  <span className="text-dark-400 text-sm">
                    &copy; 2025 DiagnoVision. All rights reserved.
                  </span>
                </div>
                
                <div className="flex items-center gap-6">
                  <a href="#" className="text-dark-400 hover:text-white text-sm transition-colors">Privacy</a>
                  <a href="#" className="text-dark-400 hover:text-white text-sm transition-colors">Terms</a>
                  <a href="#" className="text-dark-400 hover:text-white text-sm transition-colors">Support</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default Layout
