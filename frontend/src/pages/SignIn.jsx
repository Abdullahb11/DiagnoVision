import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Loader2 } from 'lucide-react'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signin(email, password)
    
    if (result.success) {
      // Wait a moment for auth state to update
      setTimeout(() => {
        navigate('/home', { replace: true })
      }, 300)
    } else {
      setError(result.error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Signing you in</h2>
          <p className="text-dark-400">Loading your dashboard...</p>
          <div className="mt-6 flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900" />
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-medical-500/20 rounded-full blur-3xl" />
        
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
              AI-Powered<br />
              <span className="gradient-text">Eye Care</span>
            </h2>
            
            <p className="text-lg text-dark-400 mb-8 max-w-md">
              Advanced screening for Diabetic Retinopathy and Glaucoma. 
              Early detection saves vision.
            </p>

            <div className="space-y-4">
              {['Instant AI analysis', 'Visual explanations', 'Doctor consultations'].map((item, i) => (
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

            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-dark-400 mb-8">Sign in to continue to your account</p>

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
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-12 pr-12"
                    placeholder="Enter your password"
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
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-dark-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Create account
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
