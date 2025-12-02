import { motion } from 'framer-motion'
import Layout from '../../components/Layout'
import { Bell, CheckCircle, AlertCircle, Info, Clock, Users } from 'lucide-react'

const DoctorNotifications = () => {
  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'High Priority Scan Review',
      message: 'Patient John Smith has uploaded a scan flagged as high risk. Requires immediate attention.',
      time: '30 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'New Patient Message',
      message: 'Sarah Johnson sent you a new message regarding her recent scan results.',
      time: '2 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'success',
      title: 'Review Completed',
      message: 'You have successfully reviewed 5 patient scans today.',
      time: '1 day ago',
      read: true
    },
    {
      id: 4,
      type: 'info',
      title: 'New Patient Added',
      message: 'Mike Williams has been added to your patient list.',
      time: '2 days ago',
      read: true
    },
  ]

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return CheckCircle
      case 'warning':
        return AlertCircle
      default:
        return Info
    }
  }

  const getColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-accent-400 bg-accent-500/10 border-accent-500/20'
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      default:
        return 'text-primary-400 bg-primary-500/10 border-primary-500/20'
    }
  }

  return (
    <Layout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500 to-medical-500">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Notifications</h1>
              <p className="text-dark-400">Stay updated with practice alerts and updates</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          {notifications.map((notification, index) => {
            const Icon = getIcon(notification.type)
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className={`glass-card p-6 transition-all duration-300 ${
                  !notification.read 
                    ? 'border-primary-500/30 bg-primary-500/5' 
                    : 'border-white/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl border ${getColor(notification.type)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white mb-1">{notification.title}</h3>
                        <p className="text-dark-400 text-sm">{notification.message}</p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-primary-400 ml-4 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-dark-500">
                      <Clock className="w-3 h-3" />
                      {notification.time}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {notifications.length === 0 && (
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-dark-800/50 flex items-center justify-center">
              <Bell className="w-8 h-8 text-dark-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Notifications</h3>
            <p className="text-dark-400">You're all caught up! No new notifications.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default DoctorNotifications

