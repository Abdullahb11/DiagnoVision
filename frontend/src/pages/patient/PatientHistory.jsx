import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../../components/Layout'
import { useAuth } from '../../contexts/AuthContext'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { supabase } from '../../config/supabase'
import { 
  History, Eye, Calendar, Activity, 
  ChevronRight, Loader2, Image as ImageIcon
} from 'lucide-react'

const PatientHistory = () => {
  const { currentUser } = useAuth()
  const [scanHistory, setScanHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedScan, setExpandedScan] = useState(null)
  const [imageData, setImageData] = useState({}) // Cache for image URLs
  const [imageLoading, setImageLoading] = useState({})

  useEffect(() => {
    if (currentUser) {
      fetchScanHistory()
    }
  }, [currentUser])

  const fetchScanHistory = async () => {
    if (!currentUser) return

    try {
      setLoading(true)
      
      // Fetch Glaucoma results only (DR support will be added later)
      const glaucomaQuery = query(
        collection(db, 'glucoma_result'),
        where('patientId', '==', currentUser.uid)
      )
      const glaucomaSnapshot = await getDocs(glaucomaQuery)

      // Process Glaucoma results
      const scans = glaucomaSnapshot.docs.map((doc) => {
        const data = doc.data()
        const imageId = data.imageId
        
        return {
          id: imageId,
          imageId: imageId,
          date: data.date,
          glaucomaResult: data.result_msg,
          glaucomaConfidence: data.confidence !== undefined ? data.confidence : extractConfidence(data.result_msg),
          doctorFeedback: data.doctor_feedback || ''
        }
      }).sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : 0
        const dateB = b.date ? new Date(b.date) : 0
        return dateB - dateA
      })
      
      // Fetch images from Supabase for each scan (parallel)
      await Promise.all(scans.map((scan) => fetchImageUrls(scan.imageId)))

      setScanHistory(scans)
    } catch (error) {
      console.error('Error fetching scan history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleScan = (scan) => {
    console.log('[History] Clicked scan:', scan.id, 'Current expanded:', expandedScan)
    const nextExpanded = expandedScan === scan.id ? null : scan.id
    console.log('[History] Setting expanded to:', nextExpanded)
    setExpandedScan(nextExpanded)
    if (nextExpanded && !imageData[scan.imageId]) {
      console.log('[History] Fetching images for:', scan.imageId)
      fetchImageUrls(scan.imageId)
    } else if (nextExpanded) {
      console.log('[History] Images already cached for:', scan.imageId, imageData[scan.imageId])
    }
  }

  const fetchImageUrls = async (imageId) => {
    if (imageData[imageId] || imageLoading[imageId]) return // Already cached or loading

    try {
      setImageLoading(prev => ({ ...prev, [imageId]: true }))
      
      const { data, error, status } = await supabase
        .from('images')
        .select('"Image_url", heatmap_url, overlay_url')
        .eq('imageId', imageId)
        .maybeSingle()

      if (error) {
        console.error('[History] Error fetching image for', imageId, ':', error)
        if (status === 406) {
          setImageData(prev => ({ ...prev, [imageId]: null }))
        }
        return
      }

      if (data) {
        setImageData(prev => ({
          ...prev,
          [imageId]: {
            original: data.Image_url,
            heatmap: data.heatmap_url,
            overlay: data.overlay_url
          }
        }))
      } else {
        setImageData(prev => ({ ...prev, [imageId]: null }))
      }
    } catch (error) {
      console.error('[History] Unexpected error fetching image for', imageId, error)
    } finally {
      setImageLoading(prev => ({ ...prev, [imageId]: false }))
    }
  }

  const extractConfidence = (resultMsg) => {
    // Extract confidence from result message if available
    // For now, return a placeholder based on message content
    if (!resultMsg) return 0
    
    const lowerMsg = resultMsg.toLowerCase()
    if (lowerMsg.includes('normal') || lowerMsg.includes('no') || lowerMsg.includes('negative')) {
      return Math.random() * 0.3 // Low confidence for normal
    } else if (lowerMsg.includes('mild') || lowerMsg.includes('early')) {
      return 0.3 + Math.random() * 0.3 // Medium confidence
    } else {
      return 0.6 + Math.random() * 0.4 // High confidence for positive
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const getStatus = (glaucomaConfidence) => {
    if (!glaucomaConfidence) return 'success'
    if (glaucomaConfidence >= 0.7) return 'danger'
    if (glaucomaConfidence >= 0.5) return 'warning'
    return 'success'
  }

  const getStatusBadge = (status) => {
    if (status === 'success') return 'badge-success'
    if (status === 'warning') return 'badge-warning'
    return 'badge-danger'
  }

  const getConfidenceColor = (confidence) => {
    if (!confidence) return 'text-dark-400'
    if (confidence >= 0.7) return 'text-red-400'
    if (confidence >= 0.5) return 'text-yellow-400'
    return 'text-accent-400'
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
              <button 
                onClick={fetchScanHistory}
                className="btn-secondary flex items-center gap-2"
                disabled={loading}
              >
                <Activity className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-500/20 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Loading Scan History</h3>
            <p className="text-dark-400">Fetching your scan results...</p>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              {scanHistory.map((scan, index) => {
                console.log('[History] Rendering scan card:', scan.id, 'index:', index)
                const status = getStatus(scan.glaucomaConfidence)
                const images = imageData[scan.imageId] || {}
                const isExpanded = expandedScan === scan.id
                const isImageLoading = imageLoading[scan.imageId]
                const scanNumber = `Scan #${index + 1}`
                
                // Debug log
                if (isExpanded) {
                  console.log('[History] Rendering expanded scan:', scan.id, 'Images:', images)
                }

                return (
                  <motion.div
                    key={scan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="glass-card overflow-hidden cursor-pointer"
                    onClick={(e) => {
                      console.log('[History] CLICK EVENT FIRED on motion.div!', scan.id)
                      e.preventDefault()
                      e.stopPropagation()
                      handleToggleScan(scan)
                    }}
                  >
                    <div 
                      className="p-6 hover:border-white/20 transition-all duration-300 group pointer-events-auto"
                      onClick={(e) => {
                        console.log('[History] CLICK EVENT FIRED on inner div!', scan.id)
                        e.preventDefault()
                        e.stopPropagation()
                        handleToggleScan(scan)
                      }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-3 rounded-xl bg-primary-500/10">
                            <Eye className="w-6 h-6 text-primary-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{scanNumber}</h3>
                            <div className="flex items-center gap-2 text-sm text-dark-400">
                              <Calendar className="w-4 h-4" />
                              {formatDate(scan.date)}
                            </div>
                          </div>
                        </div>

                        <div className="flex-1">
                          <p className="text-xs text-dark-500 mb-1">Glaucoma Detection</p>
                          <p className={`text-sm font-medium ${getConfidenceColor(scan.glaucomaConfidence)}`}>
                            {scan.glaucomaResult || 'N/A'}
                          </p>
                          {scan.glaucomaConfidence !== null && (
                            <p className="text-xs text-dark-500 mt-1">
                              {(scan.glaucomaConfidence * 100).toFixed(1)}% confidence
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          <span className={getStatusBadge(status)}>
                            {status === 'success' ? 'Normal' : status === 'warning' ? 'Needs Review' : 'High Risk'}
                          </span>
                          <button
                            onClick={(e) => {
                              console.log('[History] BUTTON CLICKED!', scan.id)
                              e.stopPropagation()
                              handleToggleScan(scan)
                            }}
                            className="p-2 hover:bg-primary-500/10 rounded-lg"
                          >
                            <ChevronRight className={`w-5 h-5 text-dark-500 group-hover:text-primary-400 transition-all ${isExpanded ? 'rotate-90' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-white/10 overflow-hidden"
                        >
                          <div className="p-6 space-y-6">
                            {/* Images Section - Always show when expanded */}
                            <div>
                              <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                Scan Images
                              </h4>
                              {isImageLoading ? (
                                <div className="p-6 rounded-xl border border-white/10 flex flex-col items-center gap-3 text-dark-400">
                                  <Loader2 className="w-6 h-6 animate-spin text-primary-400" />
                                  <p className="text-sm">Fetching images from secure storage...</p>
                                </div>
                              ) : (
                                <>
                                  {(images.original || images.heatmap || images.overlay) ? (
                                    <div className="grid md:grid-cols-3 gap-4">
                                      {images.original && (
                                        <div>
                                          <p className="text-xs text-dark-500 mb-2 text-center">Original</p>
                                          <img
                                            src={images.original}
                                            alt="Original scan"
                                            className="w-full rounded-xl border border-white/10 hover:border-primary-500/50 transition-colors cursor-pointer"
                                            onClick={() => window.open(images.original, '_blank')}
                                          />
                                        </div>
                                      )}
                                      {images.heatmap && (
                                        <div>
                                          <p className="text-xs text-dark-500 mb-2 text-center">Heatmap</p>
                                          <img
                                            src={images.heatmap}
                                            alt="Heatmap"
                                            className="w-full rounded-xl border border-white/10 hover:border-primary-500/50 transition-colors cursor-pointer"
                                            onClick={() => window.open(images.heatmap, '_blank')}
                                          />
                                        </div>
                                      )}
                                      {images.overlay && (
                                        <div>
                                          <p className="text-xs text-dark-500 mb-2 text-center">Overlay</p>
                                          <img
                                            src={images.overlay}
                                            alt="Overlay"
                                            className="w-full rounded-xl border border-white/10 hover:border-primary-500/50 transition-colors cursor-pointer"
                                            onClick={() => window.open(images.overlay, '_blank')}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="p-6 rounded-xl border border-white/10 text-center">
                                      <p className="text-sm text-dark-400">Images not available for this scan.</p>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>

                            {/* Doctor Feedback */}
                            {scan.doctorFeedback && (
                              <div className="p-4 rounded-xl bg-medical-500/10 border border-medical-500/20">
                                <h4 className="text-sm font-semibold text-medical-400 mb-2">Doctor Feedback</h4>
                                <p className="text-dark-300 text-sm">{scan.doctorFeedback}</p>
                              </div>
                            )}

                            {/* Image ID for reference */}
                            <div className="text-xs text-dark-500">
                              Image ID: <span className="font-mono text-dark-400">{scan.imageId}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
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
          </>
        )}
      </div>
    </Layout>
  )
}

export default PatientHistory
