import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { Loader2, ShieldAlert } from 'lucide-react'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { currentUser, userRole, loading } = useAuth()

  if (loading) {
    return (
      <div className="fixed inset-0 bg-dark-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-500/20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
          </div>
          <p className="text-lg font-medium text-white">Checking authorization...</p>
          <p className="text-sm text-dark-400 mt-1">Please wait a moment</p>
        </motion.div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/signin" replace />
  }

  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="fixed inset-0 bg-dark-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 max-w-md text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/20 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
          <p className="text-dark-400 mb-4">
            You don't have permission to access this page.
          </p>
          <div className="p-4 rounded-xl bg-dark-800/50 border border-white/10 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-dark-500">Required role:</span>
              <span className="text-primary-400 font-medium capitalize">{requiredRole}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-500">Your role:</span>
              <span className="text-dark-300 font-medium capitalize">{userRole || 'None'}</span>
            </div>
          </div>
          <Link to="/home" className="btn-primary inline-flex">
            Go to Home
          </Link>
        </motion.div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
