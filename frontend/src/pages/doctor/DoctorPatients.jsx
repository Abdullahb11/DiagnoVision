import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Layout from '../../components/Layout'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Users, Search, Eye, Calendar, MessageSquare,
  Filter, ChevronRight, Activity, FileText, Clock
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

        const patientDocs = await Promise.all(
          patientIds.map(async (patientId) => {
            const patientSnap = await getDoc(doc(db, 'patient', patientId))
            if (!patientSnap.exists()) return null
            const data = patientSnap.data()
            return {
              id: patientId,
              name: data.name || 'Unknown Patient',
              age: data.age || '—',
              lastScan: data.lastScan || '—',
              condition: data.condition || '—',
              riskLevel: data.riskLevel || '—',
              riskColor: data.riskColor || 'badge-success',
              totalScans: data.totalScans || 0,
              status: data.status || '—'
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
            
            <div className="flex items-center gap-3">
              <button className="btn-secondary flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
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
                    <th className="text-left p-4 text-sm font-medium text-dark-400">Condition</th>
                    <th className="text-left p-4 text-sm font-medium text-dark-400">Risk Level</th>
                    <th className="text-left p-4 text-sm font-medium text-dark-400">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-dark-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && patients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-dark-400">
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
                          {patient.lastScan}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-white">{patient.condition}</p>
                        <p className="text-xs text-dark-500">{patient.totalScans} total scans</p>
                      </td>
                      <td className="p-4">
                        <span className={patient.riskColor}>{patient.riskLevel}</span>
                      </td>
                      <td className="p-4">
                        <span className={`badge ${patient.status === 'Reviewed' ? 'badge-success' : 'badge-warning'}`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 transition-colors" title="View Scans">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition-colors" title="Message">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg bg-accent-500/10 hover:bg-accent-500/20 text-accent-400 transition-colors" title="View Report">
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>
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
