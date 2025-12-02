import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/Layout'
import { 
  Eye, Brain, Shield, Zap, Users, Clock, 
  CheckCircle, ArrowRight, Sparkles, Activity,
  FileSearch, MessageSquare, Calendar
} from 'lucide-react'

const Home = () => {
  const { userRole } = useAuth()
  
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced deep learning models detect Diabetic Retinopathy and Glaucoma with high accuracy.',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: Eye,
      title: 'Visual Explanations',
      description: 'GradCAM heatmaps show exactly where the AI identified concerning regions.',
      color: 'from-medical-500 to-medical-600'
    },
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'Your medical data is encrypted and secured following healthcare standards.',
      color: 'from-accent-500 to-accent-600'
    },
    {
      icon: Users,
      title: 'Doctor Integration',
      description: 'Connect with ophthalmologists for professional review and guidance.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Clock,
      title: 'Instant Results',
      description: 'Get comprehensive analysis results in seconds, not days.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: FileSearch,
      title: 'Complete History',
      description: 'Track all your scans and monitor changes over time.',
      color: 'from-pink-500 to-pink-600'
    }
  ]

  const steps = [
    { 
      number: '01', 
      title: 'Upload', 
      description: 'Securely upload your retinal fundus images',
      icon: Eye
    },
    { 
      number: '02', 
      title: 'Analyze', 
      description: 'AI models assess for DR and Glaucoma markers',
      icon: Brain
    },
    { 
      number: '03', 
      title: 'Visualize', 
      description: 'View heatmaps highlighting areas of concern',
      icon: Activity
    },
    { 
      number: '04', 
      title: 'Connect', 
      description: 'Share results with doctors for expert review',
      icon: MessageSquare
    }
  ]

  const stats = [
    { value: '98%', label: 'Detection Accuracy' },
    { value: '10K+', label: 'Scans Analyzed' },
    { value: '500+', label: 'Doctors Connected' },
    { value: '<3s', label: 'Analysis Time' }
  ]

  return (
    <Layout>
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-medical-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-primary-300">AI-Powered Eye Care Platform</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            <span className="gradient-text">DiagnoVision</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl lg:text-3xl font-semibold text-white mb-4"
          >
            Early Detection of Eye Diseases with AI
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-dark-400 max-w-2xl mx-auto mb-10"
          >
            Advanced AI-powered screening for Diabetic Retinopathy and Glaucoma. 
            Upload retinal images and get instant, accurate analysis with visual explanations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {userRole === 'patient' && (
              <Link to="/patient/scan" className="btn-primary flex items-center gap-2 text-lg">
                Start Analysis
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
            {userRole === 'doctor' && (
              <Link to="/doctor/dashboard" className="btn-primary flex items-center gap-2 text-lg">
                View Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
            {!userRole && (
              <>
                <Link to="/signup" className="btn-primary flex items-center gap-2 text-lg">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/signin" className="btn-secondary flex items-center gap-2 text-lg">
                  Sign In
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="glass-card p-6 text-center"
            >
              <p className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</p>
              <p className="text-sm text-dark-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto">
            Everything you need for comprehensive eye health screening
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="feature-card"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-dark-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="glass-card p-8 md:p-12 bg-gradient-to-br from-primary-500/5 to-medical-500/5">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-dark-400 text-lg">
              Simple, fast, and accurate eye disease screening
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 * index }}
                  className="relative text-center"
                >
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary-500/50 to-transparent" />
                  )}
                  
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-dark-800/50 border border-white/10 mb-4">
                    <Icon className="w-8 h-8 text-primary-400" />
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                      {step.number}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-dark-400 text-sm">{step.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-medical-500/10" />
          
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Protect Your Vision?
            </h2>
            <p className="text-dark-400 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of users who trust DiagnoVision for early detection and prevention.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {userRole === 'patient' ? (
                <Link to="/patient/scan" className="btn-primary flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Upload Your First Scan
                </Link>
              ) : userRole === 'doctor' ? (
                <Link to="/doctor/patients" className="btn-primary flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  View Patients
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="btn-primary flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/signin" className="btn-secondary">
                    Already have an account?
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Home
