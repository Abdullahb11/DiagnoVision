import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from '../../components/Layout'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Users, Clock, MessageSquare, ScanEye,
  TrendingUp, AlertCircle, ArrowRight, Activity,
  CheckCircle, Eye, Calendar, FileText
} from 'lucide-react'

const DoctorDashboard = () => {
  const { currentUser } = useAuth()
  
  const stats = [
    { 
      label: 'Total Patients', 
      value: '24', 
      icon: Users,
      change: '+3 this week',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-500/10',
      textColor: 'text-primary-400'
    },
    { 
      label: 'Pending Reviews', 
      value: '8', 
      icon: Clock,
      change: '3 urgent',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-400'
    },
    { 
      label: 'Unread Messages', 
      value: '12', 
      icon: MessageSquare,
      change: '5 new today',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400'
    },
    { 
      label: 'Scans This Month', 
      value: '47', 
      icon: ScanEye,
      change: '+12% vs last',
      color: 'from-accent-500 to-accent-600',
      bgColor: 'bg-accent-500/10',
      textColor: 'text-accent-400'
    },
  ]

  const pendingReviews = [
    { 
      patient: 'John Smith', 
      eye: 'Left Eye',
      time: '2 hours ago', 
      risk: 'High Risk',
      riskColor: 'badge-danger'
    },
    { 
      patient: 'Sarah Johnson', 
      eye: 'Both Eyes',
      time: '5 hours ago', 
      risk: 'Medium Risk',
      riskColor: 'badge-warning'
    },
    { 
      patient: 'Mike Williams', 
      eye: 'Right Eye',
      time: '1 day ago', 
      risk: 'Low Risk',
      riskColor: 'badge-success'
    },
  ]

  const quickActions = [
    { 
      label: 'View Patients', 
      description: 'Manage patient list',
      path: '/doctor/patients', 
      icon: Users,
      color: 'from-primary-500 to-medical-500'
    },
    { 
      label: 'Messages', 
      description: 'Patient communications',
      path: '/doctor/messages', 
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600'
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
                Welcome, Dr. {currentUser?.displayName?.split(' ').pop() || 'Doctor'}
              </h1>
              <p className="text-dark-400">
                Here's your practice overview for today
              </p>
            </div>
            <Link to="/doctor/patients" className="btn-primary flex items-center gap-2 w-fit">
              <Users className="w-5 h-5" />
              View Patients
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
                <p className="text-sm text-dark-400 mb-1">{stat.label}</p>
                <p className="text-xs text-dark-500">{stat.change}</p>
              </motion.div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-yellow-500/10">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Pending Reviews</h3>
              </div>
              <Link to="/doctor/patients" className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1">
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {pendingReviews.map((review, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50 border border-white/5 hover:border-white/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {review.patient.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{review.patient}</p>
                      <p className="text-sm text-dark-400 flex items-center gap-2">
                        <Eye className="w-3 h-3" />
                        {review.eye}
                        <span className="text-dark-600">|</span>
                        {review.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={review.riskColor}>{review.risk}</span>
                    <button className="p-2 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 transition-colors">
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
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

            <div className="space-y-4">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.path}
                    to={action.path}
                    className="group flex items-center gap-4 p-4 rounded-xl bg-dark-800/50 border border-white/5 hover:border-primary-500/30 hover:bg-dark-800 transition-all duration-300"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{action.label}</p>
                      <p className="text-sm text-dark-500">{action.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-dark-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                  </Link>
                )
              })}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary-500/10 to-medical-500/10 border border-primary-500/20">
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-5 h-5 text-primary-400" />
                <p className="font-medium text-white">Today's Overview</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-white">5</p>
                  <p className="text-xs text-dark-400">Scans reviewed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">8</p>
                  <p className="text-xs text-dark-400">Messages sent</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-card p-6 bg-gradient-to-br from-yellow-500/5 to-orange-500/5"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
              <AlertCircle className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                High Priority Reviews Pending
              </h3>
              <p className="text-dark-400">
                You have 3 patient scans flagged as high risk that require immediate attention.
              </p>
            </div>
            <Link to="/doctor/patients" className="btn-primary flex items-center gap-2 whitespace-nowrap">
              Review Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}

export default DoctorDashboard
