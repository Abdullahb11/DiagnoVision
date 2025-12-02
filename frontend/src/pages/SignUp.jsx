import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, Stethoscope, Heart } from 'lucide-react'

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [role, setRole] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!role) {
      setError('Please select a role')
      return
    }

    setLoading(true)
    const result = await signup(email, password, displayName, role)
    
    if (result.success) {
      navigate('/signin')
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900" />
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-medical-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="flex items-center gap-3 mb-12">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center shadow-glow">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text-premium">DiagnoVision</span>
            </Link>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Join the Future of<br />
              <span className="gradient-text">Eye Healthcare</span>
            </h2>
            
            <p className="text-lg text-dark-400 mb-8 max-w-md">
              Whether you're a patient seeking early detection or a doctor providing care, 
              DiagnoVision empowers better outcomes.
            </p>

            <div className="space-y-4">
              {[
                'Free AI-powered screening',
                'Secure medical records',
                'Connect with specialists'
              ].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-accent-400" />
                  </div>
                  <span className="text-dark-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-dark-950">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text-premium">DiagnoVision</span>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-dark-400 mb-8">Get started with DiagnoVision for free</p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-12"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="input-field pl-12"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('patient')}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      role === 'patient'
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-white/10 bg-dark-800/50 hover:border-white/20'
                    }`}
                  >
                    <Heart className={`w-6 h-6 mx-auto mb-2 ${role === 'patient' ? 'text-primary-400' : 'text-dark-400'}`} />
                    <p className={`font-medium ${role === 'patient' ? 'text-white' : 'text-dark-300'}`}>Patient</p>
                    <p className="text-xs text-dark-500 mt-1">Get eye scans analyzed</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setRole('doctor')}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      role === 'doctor'
                        ? 'border-medical-500 bg-medical-500/10'
                        : 'border-white/10 bg-dark-800/50 hover:border-white/20'
                    }`}
                  >
                    <Stethoscope className={`w-6 h-6 mx-auto mb-2 ${role === 'doctor' ? 'text-medical-400' : 'text-dark-400'}`} />
                    <p className={`font-medium ${role === 'doctor' ? 'text-white' : 'text-dark-300'}`}>Doctor</p>
                    <p className="text-xs text-dark-500 mt-1">Review patient scans</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-12 pr-12"
                    placeholder="Create a strong password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner w-5 h-5" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-dark-400">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
