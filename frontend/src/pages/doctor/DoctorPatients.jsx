import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Layout from '../../components/Layout'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Users, Search, Calendar, Filter
} from 'lucide-react'
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'

const DoctorPatients = () => {
  const { currentUser } = useAuth()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPatients = async () => {
      if (!currentUser) return

      try {
        setLoading(true)
        setError('')

        const relQuery = query(
          collection(db, 'patient_doctor'),
          where('doctorId', '==', currentUser.uid),
          where('status', '==', 'active')
        )
        const relSnap = await getDocs(relQuery)
        const patientIds = Array.from(new Set(relSnap.docs.map(d => d.data().patientId).filter(Boolean)))

        // Pull doctor notifications to derive latest scan date + model summaries per patient.
        const notifQuery = query(
          collection(db, 'notifications'),
          where('user_id', '==', currentUser.uid)
        )
        const notifSnap = await getDocs(notifQuery)
        const latestScanByPatient = {}
        notifSnap.docs.forEach((n) => {
          const row = n.data() || {}
          const extra = row.data && typeof row.data === 'object' ? row.data : {}
          if (extra.kind !== 'scan_report') return
          const patientId = extra.patient_id
          if (!patientId) return

          const ts = row.createdAt?.toDate ? row.createdAt.toDate() : null
          const existing = latestScanByPatient[patientId]
          const existingTs = existing?.createdAt?.toDate ? existing.createdAt.toDate() : null
          if (!existingTs || (ts && ts > existingTs)) {
            latestScanByPatient[patientId] = {
              createdAt: row.createdAt || null,
              summaryGlaucoma: extra.summary_glaucoma || '—',
              summaryDr: extra.summary_dr || '—'
            }
          }
        })

        const patientDocs = await Promise.all(
          patientIds.map(async (patientId) => {
            const patientSnap = await getDoc(doc(db, 'patient', patientId))
            if (!patientSnap.exists()) return null
            const data = patientSnap.data()
            const latestScan = latestScanByPatient[patientId] || null
            return {
              id: patientId,
              name: data.name || 'Unknown Patient',
              age: data.age || '—',
              lastScanAt: latestScan?.createdAt || null,
              summaryGlaucoma: latestScan?.summaryGlaucoma || '—',
              summaryDr: latestScan?.summaryDr || '—',
              totalScans: data.totalScans || 0,
            }
          })
        )

        setPatients(patientDocs.filter(Boolean))
      } catch (err) {
        console.error('Error fetching patients:', err)
        setError('Failed to load patients.')
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [currentUser])

  return (
    <Layout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500 to-medical-500">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">My Patients</h1>
                <p className="text-dark-400">Manage and review patient records</p>
              </div>
            </div>
            
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-4"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
            <input
              type="text"
              placeholder="Search patients by name or condition..."
              className="input-field pl-12"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              {error && (
                <div className="p-4 text-sm text-red-300 bg-red-500/10 border-b border-red-500/20">
                  {error}
                </div>
              )}
              {loading && (
                <div className="p-4 text-sm text-dark-400 bg-dark-800/30 border-b border-white/5">
                  Loading patients...
                </div>
              )}
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left p-4 text-sm font-medium text-dark-400">Patient</th>
                    <th className="text-left p-4 text-sm font-medium text-dark-400">Last Scan</th>
                    <th className="text-left p-4 text-sm font-medium text-dark-400">Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && patients.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-6 text-center text-dark-400">
                        No patients connected yet.
                      </td>
                    </tr>
                  ) : (
                    patients.map((patient, index) => (
                    <motion.tr
                      key={patient.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * index }}
                      className="border-b border-white/5 hover:bg-dark-800/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-white">{patient.name}</p>
                            <p className="text-sm text-dark-500">Age: {patient.age}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-dark-300">
                          <Calendar className="w-4 h-4 text-dark-500" />
                          {patient.lastScanAt?.toDate ? patient.lastScanAt.toDate().toLocaleString() : '—'}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-white text-sm">
                          <span className="text-dark-400">Glaucoma:</span> {patient.summaryGlaucoma}
                        </p>
                        <p className="text-white text-sm mt-1">
                          <span className="text-dark-400">DR:</span> {patient.summaryDr}
                        </p>
                      </td>
                    </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}

export default DoctorPatients
