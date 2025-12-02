import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from '../../components/Layout'
import { useAuth } from '../../contexts/AuthContext'
import { 
  ScanEye, History, Users, MessageSquare, 
  TrendingUp, Shield, AlertCircle, ArrowRight,
  Activity, Eye, CheckCircle, Clock
} from 'lucide-react'

const PatientDashboard = () => {
  const { currentUser } = useAuth()
  
  const stats = [
    { 
      label: 'Total Scans', 
      value: '12', 
      icon: ScanEye,
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-500/10',
      textColor: 'text-primary-400'
    },
    { 
      label: 'Risk Level', 
      value: 'Low', 
      icon: Shield,
      color: 'from-accent-500 to-accent-600',
      bgColor: 'bg-accent-500/10',
      textColor: 'text-accent-400'
    },
    { 
      label: 'My Doctors', 
      value: '3', 
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400'
    },
    { 
      label: 'Messages', 
      value: '5', 
      icon: MessageSquare,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10',
      textColor: 'text-orange-400'
    },
  ]

  const recentScans = [
    { 
      eye: 'Left Eye', 
      date: '2 days ago', 
      status: 'Normal',
      statusColor: 'badge-success'
    },
    { 
      eye: 'Right Eye', 
      date: '1 week ago', 
      status: 'Minor Risk',
      statusColor: 'badge-warning'
    },
    { 
      eye: 'Left Eye', 
      date: '2 weeks ago', 
      status: 'Normal',
      statusColor: 'badge-success'
    },
  ]

  const quickActions = [
    { 
      label: 'Upload New Scan', 
      description: 'Analyze retinal images',
      path: '/patient/scan', 
      icon: ScanEye,
      color: 'from-primary-500 to-medical-500'
    },
    { 
      label: 'View History', 
      description: 'Check past results',
      path: '/patient/history', 
      icon: History,
      color: 'from-purple-500 to-purple-600'
    },
    { 
      label: 'Find Doctors', 
      description: 'Browse specialists',
      path: '/patient/doctors/available', 
      icon: Users,
      color: 'from-accent-500 to-accent-600'
    },
    { 
      label: 'Messages', 
      description: 'Chat with doctors',
      path: '/patient/messages', 
      icon: MessageSquare,
      color: 'from-orange-500 to-orange-600'
    },
  ]

  return (
    <Layout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome back, {currentUser?.displayName?.split(' ')[0] || 'Patient'}
              </h1>
              <p className="text-dark-400">
                Here's an overview of your eye health status
              </p>
            </div>
            <Link to="/patient/scan" className="btn-primary flex items-center gap-2 w-fit">
              <ScanEye className="w-5 h-5" />
              New Scan
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="stat-card group hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-accent-400" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-dark-400">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary-500/10">
                  <Activity className="w-5 h-5 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Recent Scans</h3>
              </div>
              <Link to="/patient/history" className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1">
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentScans.map((scan, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50 border border-white/5 hover:border-white/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary-500/10">
                      <Eye className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{scan.eye}</p>
                      <p className="text-sm text-dark-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {scan.date}
                      </p>
                    </div>
                  </div>
                  <span className={scan.statusColor}>{scan.status}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-accent-500/10">
                <CheckCircle className="w-5 h-5 text-accent-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.path}
                    to={action.path}
                    className="group p-4 rounded-xl bg-dark-800/50 border border-white/5 hover:border-primary-500/30 hover:bg-dark-800 transition-all duration-300"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-medium text-white mb-1">{action.label}</p>
                    <p className="text-xs text-dark-500">{action.description}</p>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-card p-6 bg-gradient-to-br from-primary-500/5 to-medical-500/5"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="p-4 rounded-2xl bg-primary-500/10 border border-primary-500/20">
              <AlertCircle className="w-8 h-8 text-primary-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Stay Proactive About Your Eye Health
              </h3>
              <p className="text-dark-400">
                Regular eye screenings can help detect conditions early. Consider scheduling your next scan soon to track any changes.
              </p>
            </div>
            <Link to="/patient/scan" className="btn-primary flex items-center gap-2 whitespace-nowrap">
              Schedule Scan
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}

export default PatientDashboard
