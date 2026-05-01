import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Layout from '../../components/Layout'
import { useAuth } from '../../contexts/AuthContext'
import { collection, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { 
  Users, Clock, MessageSquare,
  TrendingUp, ArrowRight,
  CheckCircle, Eye, ExternalLink
} from 'lucide-react'

const DoctorDashboard = () => {
  const { currentUser } = useAuth()
  const [pendingReviews, setPendingReviews] = useState([])
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)
  const [totalPatientsCount, setTotalPatientsCount] = useState(0)
  
  useEffect(() => {
    if (!currentUser) {
      setPendingReviews([])
      return
    }

    // Realtime: pending review = unread scan_report notification with a PDF URL
    const q = query(
      collection(db, 'notifications'),
      where('user_id', '==', currentUser.uid),
      where('read', '==', false)
    )

    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs
        .map((d) => {
          const n = d.data() || {}
          const extra = n.data && typeof n.data === 'object' ? n.data : {}
          const pdfUrl = extra.pdf_url || n.pdf_url || null
          const kind = extra.kind || ''
          if (!pdfUrl || kind !== 'scan_report') return null
          return {
            id: d.id,
            patientName: extra.patient_name || 'Patient',
            imageId: extra.image_id || '',
            summaryDr: extra.summary_dr || '',
            pdfUrl,
            createdAt: n.createdAt || null,
          }
        })
        .filter(Boolean)
        .sort((a, b) => {
          const ta = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0
          const tb = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0
          return tb - ta
        })
      setPendingReviews(rows)
    })

    return () => unsub()
  }, [currentUser])

  useEffect(() => {
    if (!currentUser) {
      setUnreadMessagesCount(0)
      return
    }

    // Realtime count of patient-sent messages for this doctor.
    // Note: current schema has no per-message read flag, so this is the closest live signal.
    const q = query(
      collection(db, 'messages'),
      where('doctorId', '==', currentUser.uid),
      where('sent_by_patient', '==', true)
    )

    const unsub = onSnapshot(q, (snap) => {
      const unread = snap.docs.filter((d) => {
        const x = d.data() || {}
        return x.read_by_doctor !== true
      })
      setUnreadMessagesCount(unread.length)
    })

    return () => unsub()
  }, [currentUser])

  useEffect(() => {
    if (!currentUser) {
      setTotalPatientsCount(0)
      return
    }

    const q = query(
      collection(db, 'patient_doctor'),
      where('doctorId', '==', currentUser.uid),
      where('status', '==', 'active')
    )

    const unsub = onSnapshot(q, (snap) => {
      const uniquePatientIds = new Set(
        snap.docs
          .map((d) => d.data()?.patientId)
          .filter(Boolean)
      )
      setTotalPatientsCount(uniquePatientIds.size)
    })

    return () => unsub()
  }, [currentUser])

  const markReviewRead = async (notificationId) => {
    if (!notificationId) return
    try {
      await updateDoc(doc(db, 'notifications', notificationId), { read: true })
    } catch (e) {
      console.error('Failed to mark scan review as read:', e)
    }
  }

  const stats = [
    { 
      label: 'Total Patients', 
      value: String(totalPatientsCount), 
      icon: Users,
      change: totalPatientsCount > 0 ? 'Active linked patients' : 'No active patients',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-500/10',
      textColor: 'text-primary-400'
    },
    { 
      label: 'Pending Reviews', 
      value: String(pendingReviews.length), 
      icon: Clock,
      change: pendingReviews.length > 0 ? 'Unread scan reports' : 'No pending scan reviews',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-400'
    },
    { 
      label: 'Unread Messages', 
      value: String(unreadMessagesCount), 
      icon: MessageSquare,
      change: unreadMessagesCount > 0 ? 'Realtime from patients' : 'No patient messages',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400'
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

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
              {pendingReviews.length === 0 && (
                <div className="p-4 rounded-xl bg-dark-800/50 border border-white/5 text-sm text-dark-400">
                  No pending scan-report reviews.
                </div>
              )}
              {pendingReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50 border border-white/5 hover:border-white/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {review.patientName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{review.patientName}</p>
                      <p className="text-sm text-dark-400 flex items-center gap-2">
                        <Eye className="w-3 h-3" />
                        Scan report pending review
                        {review.imageId ? <span className="text-dark-600">| {review.imageId.slice(0, 8)}</span> : null}
                      </p>
                      {review.summaryDr ? (
                        <p className="text-xs text-dark-500 mt-1 line-clamp-1">{review.summaryDr}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={review.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 transition-colors"
                      title="Open report PDF"
                      onClick={() => markReviewRead(review.id)}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
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
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default DoctorDashboard
