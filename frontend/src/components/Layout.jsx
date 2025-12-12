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
      // On desktop (lg and above), always keep sidebar open
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        // On mobile, keep it closed by default
        setSidebarOpen(false)
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Always show sidebar on desktop when user is logged in (above 1010px)
    if (currentUser && window.innerWidth >= 1010) {
      setSidebarOpen(true)
    }
  }, [currentUser])

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="fixed inset-0 bg-hero-pattern opacity-50 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-medical-500/5 pointer-events-none" />
      
      <div className="relative flex min-h-screen">
        {currentUser ? (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        ) : (
          <div className="fixed top-0 left-0 z-50 w-72 h-screen lg:sticky lg:top-0 lg:h-auto lg:min-h-screen bg-dark-900/95 backdrop-blur-xl border-r border-white/5 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-primary-500/20 flex items-center justify-center">
                <div className="loading-spinner w-8 h-8" />
              </div>
              <p className="text-sm text-dark-400">Loading sidebar...</p>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0 lg:ml-72">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

          <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 relative"
          >
            <div className="w-full max-w-[calc(100%-2rem)] lg:max-w-[calc(100%-4rem)] xl:max-w-[calc(100%-6rem)] 2xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
              {children}
            </div>
          </motion.main>

          <footer className="relative border-t border-white/5 bg-dark-900/50 backdrop-blur-xl">
            <div className="w-full max-w-[calc(100%-2rem)] lg:max-w-[calc(100%-4rem)] xl:max-w-[calc(100%-6rem)] 2xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
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
