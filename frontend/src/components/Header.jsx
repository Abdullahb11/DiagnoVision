import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, X, Home, LogOut, User, Settings, 
  ChevronDown, Sparkles, Eye
} from 'lucide-react'

const Header = ({ onMenuClick }) => {
  const { signout, currentUser, userRole } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleSignOut = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('Sign out button clicked')
    
    // Close the menu first
    setUserMenuOpen(false)
    
    try {
      console.log('Calling signout function...')
      const result = await signout()
      console.log('Signout result:', result)
      
      if (result.success) {
        console.log('Signout successful, navigating to signin...')
        // Use window.location for a hard navigation to ensure clean state
        window.location.href = '/signin'
      } else {
        console.error('Sign out error:', result.error)
        alert('Failed to sign out: ' + result.error)
      }
    } catch (error) {
      console.error('Sign out error:', error)
      alert('Failed to sign out: ' + error.message)
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-xl border-b border-white/5" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-xl bg-dark-800/50 border border-white/10 text-dark-300 hover:text-white hover:bg-dark-700/50 transition-all duration-300"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/home" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-medical-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative h-10 w-10 md:h-12 md:w-12 rounded-xl bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center shadow-lg">
                  <Eye className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl md:text-2xl font-bold gradient-text-premium tracking-tight">
                  DiagnoVision
                </h1>
                <p className="text-xs text-dark-400 font-medium -mt-0.5">AI-Powered Eye Care</p>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/home"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                isActive('/home')
                  ? 'bg-primary-500/15 text-primary-300'
                  : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            
            {userRole === 'patient' && (
              <Link
                to="/patient/dashboard"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  location.pathname.startsWith('/patient')
                    ? 'bg-primary-500/15 text-primary-300'
                    : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Dashboard
              </Link>
            )}
            
            {userRole === 'doctor' && (
              <Link
                to="/doctor/dashboard"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  location.pathname.startsWith('/doctor')
                    ? 'bg-primary-500/15 text-primary-300'
                    : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {/* Sign out button */}
            {currentUser && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleSignOut(e)
                }}
                className="p-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
            
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-xl bg-dark-800/50 border border-white/10 hover:bg-dark-700/50 hover:border-primary-500/30 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <ChevronDown className={`w-4 h-4 text-dark-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 glass-card p-2 z-50"
                    >
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium text-white truncate">
                          {currentUser?.displayName || 'User'}
                        </p>
                        <p className="text-xs text-dark-400 truncate">
                          {currentUser?.email}
                        </p>
                        {userRole && (
                          <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-500/20 text-primary-300 border border-primary-500/30">
                            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
