import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const Header = ({ onMenuClick }) => {
  const { signout } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    const result = await signout()
    if (result.success) {
      navigate('/signin')
    } else {
      alert('Sign-out failed: ' + result.error)
    }
  }

  return (
    <header className="py-5 px-6 flex justify-between items-center border-b border-white/10 backdrop-blur">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
          <span className="text-emerald-300 text-xl font-semibold">DV</span>
        </div>
        <p className="text-2xl font-bold">DiagnoVision</p>
      </div>

      <nav className="flex items-center gap-4 text-lg">
        <Link
          to="/home"
          className="text-emerald-300 hover:underline bg-emerald-500/20 px-4 py-2 rounded-md hover:bg-emerald-500/30 transition"
        >
          Home
        </Link>

        <button
          onClick={onMenuClick}
          className="text-emerald-300 hover:underline bg-emerald-500/20 px-4 py-2 rounded-md hover:bg-emerald-500/30 transition"
        >
          Menu
        </button>

        <button
          onClick={handleSignOut}
          className="text-red-300 hover:underline bg-red-500/20 px-4 py-2 rounded-md hover:bg-red-500/30 transition"
        >
          Sign out
        </button>
      </nav>
    </header>
  )
}

export default Header

