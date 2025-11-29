import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Sidebar = ({ isOpen, onClose }) => {
  const { userRole } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const patientNavItems = [
    { path: '/patient/dashboard', label: 'Dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z' },
    { path: '/patient/history', label: 'History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { path: '/patient/scan', label: 'Eye Scan Analysis', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { path: '/patient/doctors/available', label: 'Available Doctors', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { path: '/patient/doctors/my-doctors', label: 'My Doctors', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { path: '/patient/messages', label: 'Messages', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  ]

  const doctorNavItems = [
    { path: '/doctor/dashboard', label: 'Dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z' },
    { path: '/doctor/patients', label: 'My Patients', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
    { path: '/doctor/messages', label: 'Messages', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  ]

  const navItems = userRole === 'patient' ? patientNavItems : userRole === 'doctor' ? doctorNavItems : []

  // Debug logging
  console.log('Sidebar - userRole:', userRole)
  console.log('Sidebar - navItems:', navItems)
  console.log('Sidebar - isOpen:', isOpen)

  // Show sidebar even without role for debugging, but show a message
  if (!userRole) {
    console.log('Sidebar rendering but no userRole - showing debug message')
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
        <aside
          className={`w-72 bg-slate-800/50 border-r border-white/10 min-h-screen p-6 pt-24 text-lg leading-relaxed transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed top-0 left-0 z-50`}
        >
          <h2 className="text-emerald-300 font-semibold text-2xl mb-6">Navigation</h2>
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 text-sm">
            <p className="text-yellow-300 font-semibold mb-2">⚠️ No Role Found</p>
            <p className="text-yellow-200/80">
              User is authenticated but no role found in Firestore. Check console for details.
            </p>
            <p className="text-yellow-200/60 mt-2 text-xs">
              Make sure the user document exists in Firestore 'user' collection with a 'role' field.
            </p>
          </div>
        </aside>
      </>
    )
  }

  // If no nav items but user has role, show a message
  if (navItems.length === 0) {
    return (
      <aside className="w-72 bg-slate-800/50 border-r border-white/10 min-h-screen p-6 text-lg leading-relaxed fixed lg:static z-50">
        <h2 className="text-emerald-300 font-semibold text-2xl mb-6">Navigation</h2>
        <p className="text-slate-400 text-sm">
          No navigation items available. Current role: {userRole || 'None'}
        </p>
      </aside>
    )
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
    <aside
  className={`w-72 bg-slate-800/50 border-r border-white/10 min-h-screen p-6 pt-24 text-lg leading-relaxed transition-transform duration-300 ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  } fixed top-0 left-0 z-50`}
>

        <h2 className="text-emerald-300 font-semibold text-2xl mb-6">Navigation</h2>
        <nav className="space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={`flex gap-3 px-4 py-3 rounded-lg transition ${
                isActive(item.path)
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'hover:bg-emerald-500/20 hover:text-emerald-300 text-slate-300'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar

