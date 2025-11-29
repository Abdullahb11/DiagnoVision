import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { currentUser, userRole, loading } = useAuth()

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen bg-black flex items-center justify-center text-white text-2xl z-50">
        Checking authorization...
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/signin" replace />
  }

  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen bg-black flex items-center justify-center text-white text-2xl z-50">
        <div className="text-center p-8 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p>You are not authorized to access this page.</p>
          <p className="text-lg mt-4">Required role: {requiredRole}</p>
          <p className="text-lg">Your role: {userRole || 'None'}</p>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute

