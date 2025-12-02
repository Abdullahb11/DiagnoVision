import { motion } from 'framer-motion'
import Layout from '../../components/Layout'
import { 
  History, Eye, Calendar, Activity, 
  ChevronRight, Filter, Download, Search
} from 'lucide-react'

const PatientHistory = () => {
  const scanHistory = [
    {
      id: 1,
      eye: 'Left Eye',
      date: 'Dec 1, 2025',
      time: '10:30 AM',
      glaucomaResult: 'Normal',
      drResult: 'No DR Detected',
      glaucomaConfidence: 0.15,
      drConfidence: 0.12,
      status: 'success'
    },
    {
      id: 2,
      eye: 'Right Eye',
      date: 'Nov 25, 2025',
      time: '2:15 PM',
      glaucomaResult: 'Mild Signs',
      drResult: 'Mild NPDR',
      glaucomaConfidence: 0.45,
      drConfidence: 0.52,
      status: 'warning'
    },
    {
      id: 3,
      eye: 'Both Eyes',
      date: 'Nov 18, 2025',
      time: '9:00 AM',
      glaucomaResult: 'Normal',
      drResult: 'No DR Detected',
      glaucomaConfidence: 0.08,
      drConfidence: 0.05,
      status: 'success'
    },
  ]

  const getStatusBadge = (status) => {
    if (status === 'success') return 'badge-success'
    if (status === 'warning') return 'badge-warning'
    return 'badge-danger'
  }

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
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600">
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Scan History</h1>
                <p className="text-dark-400">View all your past eye scan results</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="btn-secondary flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="btn-secondary flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
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
              placeholder="Search by date, eye, or result..."
              className="input-field pl-12"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {scanHistory.map((scan, index) => (
            <motion.div
              key={scan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="glass-card p-6 hover:border-white/20 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-3 rounded-xl bg-primary-500/10">
                    <Eye className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{scan.eye}</h3>
                    <div className="flex items-center gap-2 text-sm text-dark-400">
                      <Calendar className="w-4 h-4" />
                      {scan.date} at {scan.time}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-8">
                  <div>
                    <p className="text-xs text-dark-500 mb-1">Glaucoma</p>
                    <p className={`text-sm font-medium ${scan.glaucomaConfidence >= 0.5 ? 'text-yellow-400' : 'text-accent-400'}`}>
                      {scan.glaucomaResult}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-dark-500 mb-1">Diabetic Retinopathy</p>
                    <p className={`text-sm font-medium ${scan.drConfidence >= 0.5 ? 'text-yellow-400' : 'text-accent-400'}`}>
                      {scan.drResult}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={getStatusBadge(scan.status)}>
                    {scan.status === 'success' ? 'Normal' : scan.status === 'warning' ? 'Needs Review' : 'High Risk'}
                  </span>
                  <ChevronRight className="w-5 h-5 text-dark-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {scanHistory.length === 0 && (
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-dark-800/50 flex items-center justify-center">
              <Activity className="w-8 h-8 text-dark-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Scan History</h3>
            <p className="text-dark-400">Your scan results will appear here after your first analysis</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default PatientHistory
