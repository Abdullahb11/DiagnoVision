import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, History, ScanEye, Users, UserCheck, 
  MessageSquare, X, Activity, Heart, Shield, Bell, Loader2
} from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const { userRole, loading, currentUser } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const patientNavItems = [
    { 
      path: '/patient/dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      description: 'Overview & stats'
    },
    { 
      path: '/patient/scan', 
      label: 'Eye Scan Analysis', 
      icon: ScanEye,
      description: 'Upload & analyze'
    },
    { 
      path: '/patient/history', 
      label: 'Scan History', 
      icon: History,
      description: 'Past results'
    },
    { 
      path: '/patient/doctors/available', 
      label: 'Find Doctors', 
      icon: Users,
      description: 'Browse specialists'
    },
    { 
      path: '/patient/doctors/my-doctors', 
      label: 'My Doctors', 
      icon: UserCheck,
      description: 'Your care team'
    },
    { 
      path: '/patient/messages', 
      label: 'Messages', 
      icon: MessageSquare,
      description: 'Conversations'
    },
    { 
      path: '/patient/notifications', 
      label: 'Notifications', 
      icon: Bell,
      description: 'Alerts & updates'
    },
  ]

  const doctorNavItems = [
    { 
      path: '/doctor/dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      description: 'Overview & stats'
    },
    { 
      path: '/doctor/patients', 
      label: 'My Patients', 
      icon: Users,
      description: 'Patient management'
    },
    { 
      path: '/doctor/messages', 
      label: 'Messages', 
      icon: MessageSquare,
      description: 'Conversations'
    },
    { 
      path: '/doctor/notifications', 
      label: 'Notifications', 
      icon: Bell,
      description: 'Alerts & updates'
    },
  ]

  const navItems = userRole === 'patient' ? patientNavItems : userRole === 'doctor' ? doctorNavItems : []

  // On desktop, sidebar should always be visible
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024
  
  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: isDesktop ? { x: 0, opacity: 1 } : { x: -320, opacity: 0 }
  }

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  }

  const renderContent = () => {
    // Show loader if loading OR if user is logged in but role hasn't been fetched yet
    if (loading || (currentUser && !userRole)) {
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-primary-500/20 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
            </div>
            <p className="text-sm text-dark-400">Loading navigation...</p>
          </div>
        </div>
      )
    }
    
    // Only show "No Role Found" if user is logged in, loading is done, but still no role
    if (currentUser && !userRole && !loading) {
      return (
        <div className="p-4">
          <div className="glass-card p-4 border-yellow-500/30 bg-yellow-500/10">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-yellow-400" />
              <p className="text-yellow-300 font-semibold">No Role Found</p>
            </div>
            <p className="text-yellow-200/70 text-sm">
              Your account role is being set up. Please refresh the page or contact support.
            </p>
          </div>
        </div>
      )
    }

    return (
      <nav className="px-3 space-y-1">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={item.path}
                onClick={() => {
                  // Only close sidebar on mobile when clicking a link
                  if (window.innerWidth < 1024) {
                    onClose()
                  }
                }}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  active
                    ? 'bg-gradient-to-r from-primary-500/20 to-primary-500/5 text-white border-l-2 border-primary-400'
                    : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
                }`}
              >
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  active 
                    ? 'bg-primary-500/20 text-primary-400' 
                    : 'bg-dark-800/50 text-dark-400 group-hover:bg-primary-500/10 group-hover:text-primary-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${active ? 'text-white' : ''}`}>
                    {item.label}
                  </p>
                  <p className={`text-xs truncate ${active ? 'text-primary-300/70' : 'text-dark-500'}`}>
                    {item.description}
                  </p>
                </div>
                {active && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>
    )
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        variants={sidebarVariants}
        initial={isDesktop ? "open" : "closed"}
        animate={isOpen || isDesktop ? "open" : "closed"}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 z-50 w-72 h-screen lg:sticky lg:top-0 lg:h-auto lg:min-h-screen"
      >
        <div className="h-full bg-dark-900/95 backdrop-blur-xl border-r border-white/5 flex flex-col">
          <div className="flex items-center justify-between p-4 pt-20 lg:pt-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500/20 to-medical-500/20 border border-primary-500/20">
                {userRole === 'patient' ? (
                  <Heart className="w-5 h-5 text-primary-400" />
                ) : (
                  <Activity className="w-5 h-5 text-primary-400" />
                )}
              </div>
              <div>
                <p className="font-semibold text-white">
                  {userRole === 'patient' ? 'Patient Portal' : userRole === 'doctor' ? 'Doctor Portal' : 'Portal'}
                </p>
                <p className="text-xs text-dark-400">Navigation</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
            {renderContent()}
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar
