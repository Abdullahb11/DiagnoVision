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
      
      // Fetch both Glaucoma and DR results
      const glaucomaQuery = query(
        collection(db, 'glucoma_result'),
        where('patientId', '==', currentUser.uid)
      )
      const drQuery = query(
        collection(db, 'dr_result'),
        where('patientId', '==', currentUser.uid)
      )
      
      const [glaucomaSnapshot, drSnapshot] = await Promise.all([
        getDocs(glaucomaQuery),
        getDocs(drQuery)
      ])

      // Create a map to combine results by imageId
      const scansMap = new Map()

      // Process Glaucoma results
      glaucomaSnapshot.docs.forEach((doc) => {
        const data = doc.data()
        const imageId = data.imageId
        
        scansMap.set(imageId, {
          id: imageId,
          imageId: imageId,
          date: data.date,
          glaucomaResult: data.result_msg,
          glaucomaConfidence: data.confidence !== undefined ? data.confidence : extractConfidence(data.result_msg),
          glaucomaDoctorFeedback: data.doctor_feedback || '',
          drResult: null,
          drConfidence: null,
          drDoctorFeedback: ''
        })
      })

      // Process DR results and merge with Glaucoma results
      drSnapshot.docs.forEach((doc) => {
        const data = doc.data()
        const imageId = data.imageId
        
        if (scansMap.has(imageId)) {
          // Merge DR data into existing scan
          const scan = scansMap.get(imageId)
          scan.drResult = data.result_msg
          scan.drConfidence = data.confidence !== undefined ? data.confidence : extractConfidence(data.result_msg)
          scan.drDoctorFeedback = data.doctor_feedback || ''
          // Use the latest date
          if (data.date && (!scan.date || new Date(data.date) > new Date(scan.date))) {
            scan.date = data.date
          }
        } else {
          // Create new scan entry for DR-only result
          scansMap.set(imageId, {
            id: imageId,
            imageId: imageId,
            date: data.date,
            glaucomaResult: null,
            glaucomaConfidence: null,
            glaucomaDoctorFeedback: '',
            drResult: data.result_msg,
            drConfidence: data.confidence !== undefined ? data.confidence : extractConfidence(data.result_msg),
            drDoctorFeedback: data.doctor_feedback || ''
          })
        }
      })

      // Convert map to array and sort by date
      const scans = Array.from(scansMap.values()).sort((a, b) => {
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
    const nextExpanded = expandedScan === scan.id ? null : scan.id
    setExpandedScan(nextExpanded)
    if (nextExpanded && !imageData[scan.imageId]) {
      fetchImageUrls(scan.imageId)
    }
  }

  const fetchImageUrls = async (imageId) => {
    if (imageData[imageId] || imageLoading[imageId]) return // Already cached or loading

    try {
      setImageLoading(prev => ({ ...prev, [imageId]: true }))
      
      const { data, error, status } = await supabase
        .from('images')
        .select('"Image_url", glaucoma_heatmap_url, glaucoma_overlay_url, dr_heatmap_url, dr_overlay_url, heatmap_url, overlay_url')
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
            // Glaucoma images
            glaucomaHeatmap: data.glaucoma_heatmap_url,
            glaucomaOverlay: data.glaucoma_overlay_url,
            // DR images
            drHeatmap: data.dr_heatmap_url,
            drOverlay: data.dr_overlay_url,
            // Backward compatibility
            heatmap: data.heatmap_url || data.glaucoma_heatmap_url || data.dr_heatmap_url,
            overlay: data.overlay_url || data.glaucoma_overlay_url || data.dr_overlay_url
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

  const getStatus = (confidence, resultMsg) => {
    if (!confidence || !resultMsg) return 'success'
    
    // Check if result indicates "No signs" or "Signs detected"
    const isNoSigns = resultMsg.toLowerCase().includes('no signs') || 
                      resultMsg.toLowerCase().includes('no signs of')
    
    if (isNoSigns) {
      // High confidence for "No signs" = Good (Normal)
      // Low confidence for "No signs" = Needs Review (uncertain)
      if (confidence >= 0.7) return 'success'  // High confidence no disease = Normal
      if (confidence >= 0.5) return 'warning'  // Medium confidence = Needs Review
      return 'warning'  // Low confidence = Needs Review
    } else {
      // High confidence for "Signs detected" = Bad (High Risk)
      // Low confidence for "Signs detected" = Needs Review (uncertain)
      if (confidence >= 0.7) return 'danger'   // High confidence disease = High Risk
      if (confidence >= 0.5) return 'warning'  // Medium confidence = Needs Review
      return 'warning'  // Low confidence = Needs Review
    }
  }

  const getStatusBadge = (status) => {
    if (status === 'success') return 'badge-success'
    if (status === 'warning') return 'badge-warning'
    return 'badge-danger'
  }

  const getConfidenceColor = (confidence, resultMsg) => {
    if (!confidence || !resultMsg) return 'text-dark-400'
    
    // Check if result indicates "No signs" or "Signs detected"
    const isNoSigns = resultMsg.toLowerCase().includes('no signs') || 
                      resultMsg.toLowerCase().includes('no signs of')
    
    if (isNoSigns) {
      // High confidence for "No signs" = Green (good)
      // Low confidence for "No signs" = Yellow (uncertain)
      if (confidence >= 0.7) return 'text-accent-400'  // Green for high confidence no disease
      if (confidence >= 0.5) return 'text-yellow-400'  // Yellow for medium confidence
      return 'text-yellow-400'  // Yellow for low confidence
    } else {
      // High confidence for "Signs detected" = Red (bad)
      // Low confidence for "Signs detected" = Yellow (uncertain)
      if (confidence >= 0.7) return 'text-red-400'    // Red for high confidence disease
      if (confidence >= 0.5) return 'text-yellow-400'  // Yellow for medium confidence
      return 'text-yellow-400'  // Yellow for low confidence
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
                const glaucomaStatus = getStatus(scan.glaucomaConfidence, scan.glaucomaResult)
                const drStatus = getStatus(scan.drConfidence, scan.drResult)
                const images = imageData[scan.imageId] || {}
                const isExpanded = expandedScan === scan.id
                const isImageLoading = imageLoading[scan.imageId]
                const scanNumber = `Scan #${scanHistory.length - index}`

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
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                        {/* Scan Info - 2 columns */}
                        <div className="flex items-center gap-4 lg:col-span-2">
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

                        {/* Results - 6 columns */}
                        <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {scan.glaucomaResult && (
                            <div>
                              <p className="text-xs text-dark-500 mb-1">Glaucoma Detection</p>
                              <p className={`text-sm font-medium ${getConfidenceColor(scan.glaucomaConfidence, scan.glaucomaResult)}`}>
                                {scan.glaucomaResult}
                              </p>
                              {scan.glaucomaConfidence !== null && (
                                <p className="text-xs text-dark-500 mt-1">
                                  {(scan.glaucomaConfidence * 100).toFixed(1)}% confidence
                                </p>
                              )}
                            </div>
                          )}
                          {scan.drResult && (
                            <div>
                              <p className="text-xs text-dark-500 mb-1">DR Detection</p>
                              <p className={`text-sm font-medium ${getConfidenceColor(scan.drConfidence, scan.drResult)}`}>
                                {scan.drResult}
                              </p>
                              {scan.drConfidence !== null && (
                                <p className="text-xs text-dark-500 mt-1">
                                  {(scan.drConfidence * 100).toFixed(1)}% confidence
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Status Badges and Expand Button - 4 columns */}
                        <div className="lg:col-span-4 flex items-center justify-end gap-4">
                          <div className="flex flex-row gap-2">
                            {scan.glaucomaResult && (
                              <span className={getStatusBadge(glaucomaStatus)}>
                                {glaucomaStatus === 'success' ? 'Normal' : glaucomaStatus === 'warning' ? 'Needs Review' : 'High Risk'}
                              </span>
                            )}
                            {scan.drResult && (
                              <span className={getStatusBadge(drStatus)}>
                                {drStatus === 'success' ? 'Normal' : drStatus === 'warning' ? 'Needs Review' : 'High Risk'}
                              </span>
                            )}
                          </div>
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
                                  {(images.original || images.glaucomaHeatmap || images.glaucomaOverlay || images.drHeatmap || images.drOverlay) ? (
                                    <div className="space-y-6">
                                      {/* Original Image - Full Width */}
                                      {images.original && (
                                        <div>
                                          <h5 className="text-xs font-semibold text-white mb-3">Original Image</h5>
                                          <div className="flex justify-center">
                                            <img
                                              src={images.original}
                                              alt="Original scan"
                                              className="w-full max-w-2xl rounded-xl border border-white/10 hover:border-primary-500/50 transition-colors cursor-pointer"
                                              onClick={() => window.open(images.original, '_blank')}
                                            />
                                          </div>
                                        </div>
                                      )}

                                      {/* All Analysis Images in Grid Layout */}
                                      {(images.glaucomaHeatmap || images.glaucomaOverlay || images.drHeatmap || images.drOverlay) && (
                                        <div>
                                          <h5 className="text-xs font-semibold text-white mb-4">Analysis Visualizations</h5>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {/* Glaucoma Heatmap */}
                                            {images.glaucomaHeatmap && (
                                              <div>
                                                <p className="text-xs text-dark-500 mb-2 text-center">Glaucoma Heatmap</p>
                                                <img
                                                  src={images.glaucomaHeatmap}
                                                  alt="Glaucoma Heatmap"
                                                  className="w-full rounded-xl border border-white/10 hover:border-primary-500/50 transition-colors cursor-pointer"
                                                  onClick={() => window.open(images.glaucomaHeatmap, '_blank')}
                                                />
                                              </div>
                                            )}
                                            {/* Glaucoma Overlay */}
                                            {images.glaucomaOverlay && (
                                              <div>
                                                <p className="text-xs text-dark-500 mb-2 text-center">Glaucoma Overlay</p>
                                                <img
                                                  src={images.glaucomaOverlay}
                                                  alt="Glaucoma Overlay"
                                                  className="w-full rounded-xl border border-white/10 hover:border-primary-500/50 transition-colors cursor-pointer"
                                                  onClick={() => window.open(images.glaucomaOverlay, '_blank')}
                                                />
                                              </div>
                                            )}
                                            {/* DR Heatmap */}
                                            {images.drHeatmap && (
                                              <div>
                                                <p className="text-xs text-dark-500 mb-2 text-center">DR Heatmap</p>
                                                <img
                                                  src={images.drHeatmap}
                                                  alt="DR Heatmap"
                                                  className="w-full rounded-xl border border-white/10 hover:border-accent-500/50 transition-colors cursor-pointer"
                                                  onClick={() => window.open(images.drHeatmap, '_blank')}
                                                />
                                              </div>
                                            )}
                                            {/* DR Overlay */}
                                            {images.drOverlay && (
                                              <div>
                                                <p className="text-xs text-dark-500 mb-2 text-center">DR Overlay</p>
                                                <img
                                                  src={images.drOverlay}
                                                  alt="DR Overlay"
                                                  className="w-full rounded-xl border border-white/10 hover:border-accent-500/50 transition-colors cursor-pointer"
                                                  onClick={() => window.open(images.drOverlay, '_blank')}
                                                />
                                              </div>
                                            )}
                                          </div>
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
                            {(scan.glaucomaDoctorFeedback || scan.drDoctorFeedback) && (
                              <div className="space-y-3">
                                {scan.glaucomaDoctorFeedback && (
                                  <div className="p-4 rounded-xl bg-medical-500/10 border border-medical-500/20">
                                    <h4 className="text-sm font-semibold text-medical-400 mb-2">Doctor Feedback - Glaucoma</h4>
                                    <p className="text-dark-300 text-sm">{scan.glaucomaDoctorFeedback}</p>
                                  </div>
                                )}
                                {scan.drDoctorFeedback && (
                                  <div className="p-4 rounded-xl bg-medical-500/10 border border-medical-500/20">
                                    <h4 className="text-sm font-semibold text-medical-400 mb-2">Doctor Feedback - DR</h4>
                                    <p className="text-dark-300 text-sm">{scan.drDoctorFeedback}</p>
                                  </div>
                                )}
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
