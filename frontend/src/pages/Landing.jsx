import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Eye, Brain, Shield, Zap, Users, Clock, 
  CheckCircle, ArrowRight, Sparkles, Activity,
  FileSearch, MessageSquare, Calendar, TrendingUp
} from 'lucide-react'

const Landing = () => {
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
    <div className="min-h-screen bg-dark-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-hero-pattern opacity-50 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-medical-500/5 pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-dark-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">DiagnoVision</span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                to="/signin" 
                className="text-dark-400 hover:text-white transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="btn-primary flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-medical-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
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
            <Link to="/signup" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/signin" className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
              Sign In
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <Link to="/signup" className="btn-primary flex items-center gap-2 px-8 py-4">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/signin" className="btn-secondary px-8 py-4">
                  Already have an account?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 bg-dark-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
  )
}

export default Landing

