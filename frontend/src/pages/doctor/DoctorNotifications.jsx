import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Layout from '../../components/Layout'
import { Bell, CheckCircle, AlertCircle, Info, Clock, Users, ExternalLink, Download } from 'lucide-react'
import { collection, getDocs, query, where, doc, getDoc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useAuth } from '../../contexts/AuthContext'

const DoctorNotifications = () => {
  const { currentUser } = useAuth()
  const [requests, setRequests] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return

      try {
        setLoading(true)
        setError('')

        // Pending connection requests
        const reqQuery = query(
          collection(db, 'patient_doctor'),
          where('doctorId', '==', currentUser.uid),
          where('status', '==', 'requested')
        )
        const reqSnap = await getDocs(reqQuery)
        const reqRows = await Promise.all(
          reqSnap.docs.map(async (d) => {
            const data = d.data()
            const patientId = data.patientId
            let patientName = 'Unknown Patient'
            if (patientId) {
              const patientSnap = await getDoc(doc(db, 'patient', patientId))
              if (patientSnap.exists()) patientName = patientSnap.data().name || patientName
            }
            return {
              id: d.id,
              patientId,
              patientName,
              doctorId: data.doctorId,
            }
          })
        )
        setRequests(reqRows)

        // Generic notifications (optional, but we already write them)
        const notifQuery = query(
          collection(db, 'notifications'),
          where('user_id', '==', currentUser.uid)
        )
        const notifSnap = await getDocs(notifQuery)
        const notifRows = notifSnap.docs.map((d) => {
          const data = d.data()
          const extra = data.data && typeof data.data === 'object' ? data.data : {}
          return {
            id: d.id,
            type: data.type || 'info',
            title: data.title || 'Notification',
            message: data.message || '',
            read: !!data.read,
            createdAt: data.createdAt || null,
            pdfUrl: extra.pdf_url || data.pdf_url || null,
            data: extra,
          }
        })
        notifRows.sort((a, b) => {
          const ta = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0
          const tb = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0
          return tb - ta
        })
        setNotifications(notifRows)
      } catch (err) {
        console.error('Error fetching doctor notifications:', err)
        setError('Failed to load notifications.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentUser])

  const acceptRequest = async (relationshipId, patientId) => {
    if (!currentUser) return
    try {
      await updateDoc(doc(db, 'patient_doctor', relationshipId), {
        status: 'active',
        updatedAt: serverTimestamp()
      })

      // Set primary doctor if empty
      const patientRef = doc(db, 'patient', patientId)
      const patientSnap = await getDoc(patientRef)
      if (patientSnap.exists()) {
        const patientData = patientSnap.data()
        if (!patientData.doctorId) {
          await updateDoc(patientRef, { doctorId: currentUser.uid })
        }
      }

      // Notify patient
      await addDoc(collection(db, 'notifications'), {
        user_id: patientId,
        type: 'success',
        title: 'Doctor accepted your request',
        message: `${currentUser.displayName || 'Doctor'} accepted your connection request.`,
        read: false,
        createdAt: serverTimestamp(),
        data: { doctorId: currentUser.uid, patientId, relationshipId }
      })

      setRequests((prev) => prev.filter((r) => r.id !== relationshipId))
    } catch (err) {
      console.error('Accept request error:', err)
      setError('Failed to accept request.')
    }
  }

  const declineRequest = async (relationshipId, patientId) => {
    if (!currentUser) return
    try {
      await updateDoc(doc(db, 'patient_doctor', relationshipId), {
        status: 'declined',
        updatedAt: serverTimestamp()
      })

      // Notify patient
      await addDoc(collection(db, 'notifications'), {
        user_id: patientId,
        type: 'warning',
        title: 'Doctor declined your request',
        message: `${currentUser.displayName || 'Doctor'} declined your connection request.`,
        read: false,
        createdAt: serverTimestamp(),
        data: { doctorId: currentUser.uid, patientId, relationshipId }
      })

      setRequests((prev) => prev.filter((r) => r.id !== relationshipId))
    } catch (err) {
      console.error('Decline request error:', err)
      setError('Failed to decline request.')
    }
  }

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

        {error && (
          <div className="glass-card p-4 border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="glass-card p-6 text-center text-dark-400">Loading...</div>
        ) : (
          <>
            {requests.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Connection requests</h2>
                <div className="space-y-3">
                  {requests.map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50 border border-white/5">
                      <div>
                        <p className="font-medium text-white">{r.patientName}</p>
                        <p className="text-sm text-dark-400">Requested to connect</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn-secondary py-2 px-4" onClick={() => declineRequest(r.id, r.patientId)}>
                          Decline
                        </button>
                        <button className="btn-primary py-2 px-4" onClick={() => acceptRequest(r.id, r.patientId)}>
                          Accept
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                      {notification.createdAt?.toDate ? notification.createdAt.toDate().toLocaleString() : '—'}
                    </div>
                    {notification.pdfUrl && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        <a
                          href={notification.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary inline-flex items-center gap-2 text-sm py-2 px-4"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View PDF
                        </a>
                        <a
                          href={notification.pdfUrl}
                          download={`scan-report-${notification.data?.image_id || notification.id}.pdf`}
                          className="btn-primary inline-flex items-center gap-2 text-sm py-2 px-4"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
              })}
            </div>
          </>
        )}

        {!loading && notifications.length === 0 && requests.length === 0 && (
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

