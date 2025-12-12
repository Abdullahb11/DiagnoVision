import { motion } from 'framer-motion'
import Layout from '../../components/Layout'
import { 
  Users, Search, Star, MapPin, Clock, 
  MessageSquare, UserPlus, Filter, Award
} from 'lucide-react'

const AvailableDoctors = () => {
  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Ophthalmologist',
      experience: '15 years',
      rating: 4.9,
      reviews: 128,
      location: 'New York, NY',
      availability: 'Available Today',
      image: null
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Retina Specialist',
      experience: '12 years',
      rating: 4.8,
      reviews: 96,
      location: 'Los Angeles, CA',
      availability: 'Available Tomorrow',
      image: null
    },
    {
      id: 3,
      name: 'Dr. Emily Williams',
      specialty: 'Glaucoma Specialist',
      experience: '10 years',
      rating: 4.7,
      reviews: 84,
      location: 'Chicago, IL',
      availability: 'Available Today',
      image: null
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
                <button className="flex-1 btn-primary flex items-center justify-center gap-2 py-2">
                  <UserPlus className="w-4 h-4" />
                  Connect
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default AvailableDoctors
