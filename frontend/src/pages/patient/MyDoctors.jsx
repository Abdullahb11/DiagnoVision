import { motion } from 'framer-motion'
import Layout from '../../components/Layout'
import { 
  UserCheck, MessageSquare, Calendar, Star, 
  Phone, Video, ChevronRight, Clock
} from 'lucide-react'

const MyDoctors = () => {
  const myDoctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Ophthalmologist',
      lastVisit: 'Nov 28, 2025',
      nextAppointment: 'Dec 15, 2025',
      rating: 4.9,
      status: 'active'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Retina Specialist',
      lastVisit: 'Oct 15, 2025',
      nextAppointment: null,
      rating: 4.8,
      status: 'active'
    },
    {
      id: 3,
      name: 'Dr. Emily Williams',
      specialty: 'Glaucoma Specialist',
      lastVisit: 'Sep 20, 2025',
      nextAppointment: 'Jan 10, 2026',
      rating: 4.7,
      status: 'active'
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
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-medical-500 to-medical-600">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">My Doctors</h1>
              <p className="text-dark-400">Your connected healthcare providers</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {myDoctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="glass-card p-6 hover:border-primary-500/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">
                    {doctor.name.split(' ').slice(1).map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{doctor.name}</h3>
                      <p className="text-primary-400 text-sm">{doctor.specialty}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-medium">{doctor.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 rounded-xl bg-dark-800/50">
                  <p className="text-xs text-dark-500 mb-1">Last Visit</p>
                  <p className="text-sm font-medium text-white">{doctor.lastVisit}</p>
                </div>
                <div className="p-3 rounded-xl bg-dark-800/50">
                  <p className="text-xs text-dark-500 mb-1">Next Appointment</p>
                  <p className={`text-sm font-medium ${doctor.nextAppointment ? 'text-accent-400' : 'text-dark-400'}`}>
                    {doctor.nextAppointment || 'Not scheduled'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 btn-secondary flex items-center justify-center gap-2 py-2">
                  <MessageSquare className="w-4 h-4" />
                  Message
                </button>
                <button className="flex-1 btn-secondary flex items-center justify-center gap-2 py-2">
                  <Video className="w-4 h-4" />
                  Video Call
                </button>
                <button className="p-2 btn-primary">
                  <Calendar className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {myDoctors.length === 0 && (
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-dark-800/50 flex items-center justify-center">
              <UserCheck className="w-8 h-8 text-dark-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Connected Doctors</h3>
            <p className="text-dark-400 mb-4">Connect with specialists to manage your eye health</p>
            <a href="/patient/doctors/available" className="btn-primary inline-flex items-center gap-2">
              Find Doctors
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default MyDoctors
