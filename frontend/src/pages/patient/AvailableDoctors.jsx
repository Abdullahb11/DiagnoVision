import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Layout from '../../components/Layout'
import { 
  Users, Search, Star, MapPin, Clock, 
  MessageSquare, UserPlus, Filter, Award
} from 'lucide-react'
import { addDoc, doc, collection, getDocs, getDoc, setDoc, serverTimestamp, query, where } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useAuth } from '../../contexts/AuthContext'

const AvailableDoctors = () => {
  const { currentUser } = useAuth()
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [connectLoadingId, setConnectLoadingId] = useState('')

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Exclude only doctors with active or requested links.
        // If a prior request was declined/rejected, show doctor again.
        let exclude = new Set()
        if (currentUser) {
          const relQuery = query(
            collection(db, 'patient_doctor'),
            where('patientId', '==', currentUser.uid)
          )
          const relSnap = await getDocs(relQuery)
          exclude = new Set(
            relSnap.docs
              .map((d) => d.data() || {})
              .filter((rel) => ['active', 'requested', 'pending'].includes(String(rel.status || '').toLowerCase()))
              .map((rel) => rel.doctorId)
              .filter(Boolean)
          )
        }

        const querySnapshot = await getDocs(collection(db, 'doctor'))
        const fetched = querySnapshot.docs
          .filter((docSnap) => {
            const doctorId = docSnap.id
            return !exclude.has(doctorId)
          })
          .map((docSnap) => {
          const data = docSnap.data()
          return {
            id: docSnap.id,
            name: data.name || 'Unknown Doctor',
            specialty: data.qualification || 'Eye Specialist',
            licenseNo: data.licenseNo || 'Not provided',
            // Placeholder fields until we implement real values
            rating: data.rating ?? 5.0,
            reviews: data.reviewsCount ?? 0,
            experience: data.experience || '—',
            location: data.location || 'Online',
            availability: data.availability || 'Available',
          }
        })
        setDoctors(fetched)
      } catch (err) {
        console.error('Error fetching doctors:', err)
        setError('Failed to load doctors. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [currentUser])

  const handleConnect = async (doctorId) => {
    if (!currentUser) {
      setError('Please sign in to connect with a doctor.')
      return
    }

    setError('')
    setConnectLoadingId(doctorId)

    try {
      const patientId = currentUser.uid
      const relationshipId = `${patientId}_${doctorId}`

      // Create/Upsert relationship request (pending until doctor accepts)
      await setDoc(doc(db, 'patient_doctor', relationshipId), {
        patientId,
        doctorId,
        status: 'requested',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true })

      // Notify doctor about request
      await addDoc(collection(db, 'notifications'), {
        user_id: doctorId,
        type: 'info',
        title: 'New patient request',
        message: `${currentUser.displayName || 'A patient'} requested to connect.`,
        read: false,
        createdAt: serverTimestamp(),
        data: {
          patientId,
          doctorId,
          relationshipId
        }
      })

      // Immediately hide this doctor from the list
      setDoctors((prev) => prev.filter((d) => d.id !== doctorId))
    } catch (err) {
      console.error('Connect error:', err)
      setError('Failed to send request. Please try again.')
    } finally {
      setConnectLoadingId('')
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Find Doctors</h1>
                <p className="text-dark-400">Browse and connect with eye care specialists</p>
              </div>
            </div>
            
            <button className="btn-secondary flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </button>
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
              placeholder="Search by name, specialty, or location..."
              className="input-field pl-12"
            />
          </div>
        </motion.div>

        {error && (
          <div className="glass-card p-4 border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="glass-card p-6 text-center text-dark-400">
            Loading doctors...
          </div>
        ) : doctors.length === 0 ? (
          <div className="glass-card p-6 text-center text-dark-400">
            No doctors available yet. Doctors will appear here once they sign up.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {doctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="glass-card p-6 hover:border-primary-500/30 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">
                    {doctor.name.split(' ').slice(1).map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate">{doctor.name}</h3>
                  <p className="text-primary-400 text-sm">{doctor.specialty}</p>
                  <p className="text-dark-400 text-xs mt-1">License: {doctor.licenseNo}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-medium">{doctor.rating}</span>
                    <span className="text-dark-500 text-sm">({doctor.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-dark-400">
                  <Award className="w-4 h-4" />
                  <span>{doctor.experience} experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-dark-400">
                  <MapPin className="w-4 h-4" />
                  <span>{doctor.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-accent-400" />
                  <span className="text-accent-400">{doctor.availability}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 btn-secondary flex items-center justify-center gap-2 py-2">
                  <MessageSquare className="w-4 h-4" />
                  Message
                </button>
                <button
                  onClick={() => handleConnect(doctor.id)}
                  disabled={connectLoadingId === doctor.id}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 py-2"
                >
                  <UserPlus className="w-4 h-4" />
                  {connectLoadingId === doctor.id ? 'Connecting...' : 'Connect'}
                </button>
              </div>
            </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default AvailableDoctors
