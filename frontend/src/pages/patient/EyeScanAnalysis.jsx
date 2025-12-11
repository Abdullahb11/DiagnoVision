import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../../components/Layout'
import { useAuth } from '../../contexts/AuthContext'
import { API_ENDPOINTS } from '../../config/api'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { 
  Upload, CheckCircle, AlertTriangle, 
  Activity, Image, Loader2, X, ArrowRight,
  Scan, Brain, Shield
} from 'lucide-react'

const EyeScanAnalysis = () => {
  const { currentUser } = useAuth()
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [analysisResults, setAnalysisResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    processFile(file)
  }

  const processFile = (file) => {
    if (file) {
      setSelectedFile(file)
      setError(null)
      setAnalysisResults(null)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile || !currentUser) {
      setError('Please select an image and ensure you are logged in')
      return
    }

    setLoading(true)
    setError(null)
    setAnalysisResults(null)

    try {
      // Check if backend is reachable first
      const healthCheck = await fetch(API_ENDPOINTS.health).catch(() => null)
      if (!healthCheck || !healthCheck.ok) {
        throw new Error(
          `Cannot connect to backend server at ${API_ENDPOINTS.health}. ` +
          `Please make sure the backend is running on port 8000.`
        )
      }

      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('patient_id', currentUser.uid)

      const response = await fetch(API_ENDPOINTS.analyze, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // Use base64 images for immediate display, fallback to URLs if available
        setAnalysisResults({
          ...data,
          // Prioritize base64 for immediate display, URLs will be null initially
          image_url: data.image_base64 || data.image_url,
          // Glaucoma images
          glaucoma_heatmap_url: data.glaucoma_heatmap_base64 || data.glaucoma_heatmap_url,
          glaucoma_overlay_url: data.glaucoma_overlay_base64 || data.glaucoma_overlay_url,
          // DR images
          dr_heatmap_url: data.dr_heatmap_base64 || data.dr_heatmap_url,
          dr_overlay_url: data.dr_overlay_base64 || data.dr_overlay_url,
          // Backward compatibility
          heatmap_url: data.heatmap_base64 || data.heatmap_url,
          overlay_url: data.overlay_base64 || data.overlay_url,
        })

        try {
          const currentDate = new Date().toISOString()

          if (data.glaucoma) {
            await addDoc(collection(db, 'glucoma_result'), {
              patientId: currentUser.uid,
              result_msg: data.glaucoma.result_msg,
              confidence: data.glaucoma.confidence,
              prediction: data.glaucoma.prediction || '',
              imageId: data.image_id,
              doctor_feedback: '',
              date: currentDate
            })
          }

          if (data.dr) {
            await addDoc(collection(db, 'dr_result'), {
              patientId: currentUser.uid,
              result_msg: data.dr.result_msg,
              confidence: data.dr.confidence,
              prediction: data.dr.prediction || '',
              imageId: data.image_id,
              doctor_feedback: '',
              date: currentDate
            })
          }
        } catch (firebaseError) {
          console.error('Error storing results in Firebase:', firebaseError)
        }
      } else {
        throw new Error(data.error || 'Analysis failed')
      }
    } catch (err) {
      console.error('Analysis error:', err)
      let errorMessage = err.message || 'Failed to analyze image. Please try again.'
      
      // Provide helpful error messages
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        errorMessage = `Cannot connect to backend server. Please ensure:
        1. Backend server is running on http://localhost:8000
        2. Check your network connection
        3. Verify CORS settings in backend`
      } else if (err.message.includes('Cannot connect')) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.7) return 'text-red-400'
    if (confidence >= 0.5) return 'text-yellow-400'
    return 'text-accent-400'
  }

  const getConfidenceBg = (confidence) => {
    if (confidence >= 0.7) return 'from-red-500/10 to-red-500/5 border-red-500/20'
    if (confidence >= 0.5) return 'from-yellow-500/10 to-yellow-500/5 border-yellow-500/20'
    return 'from-accent-500/10 to-accent-500/5 border-accent-500/20'
  }

  const clearSelection = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setAnalysisResults(null)
    setError(null)
  }

  return (
    <Layout>
      <div className="w-full max-w-full lg:max-w-5xl xl:max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500 to-medical-500">
              <Scan className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Upload Retinal Image</h1>
              <p className="text-dark-400">AI-powered screening for DR and Glaucoma</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-5 h-5 text-primary-400" />
            <h2 className="text-xl font-semibold text-white">Upload Retinal Image</h2>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
              dragActive
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-white/10 hover:border-white/20'
            } ${loading ? 'pointer-events-none opacity-60' : ''}`}
          >
            {!selectedFile ? (
              <>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-500/10 flex items-center justify-center">
                  <Image className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Drop your retinal image here
                </h3>
                <p className="text-dark-400 mb-4">or click to browse files</p>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={loading}
                />
                <label
                  htmlFor="image-upload"
                  className="btn-primary inline-flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-5 h-5" />
                  Choose File
                </label>
                <p className="text-sm text-dark-500 mt-4">
                  Supported: JPG, PNG, TIFF (Max 10MB)
                </p>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={clearSelection}
                  className="absolute -top-2 -right-2 p-2 rounded-full bg-dark-800 border border-white/10 text-dark-400 hover:text-white hover:bg-dark-700 transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full max-h-64 mx-auto rounded-xl border border-white/10"
                />
                <p className="text-sm text-primary-400 mt-4">{selectedFile.name}</p>
                
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="btn-primary mt-6 flex items-center justify-center gap-2 mx-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      Analyze Image
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Analyzing Your Scan</h3>
              <p className="text-dark-400">Our AI is examining the retinal image...</p>
              <div className="mt-6 flex justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {analysisResults && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="glass-card p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-5 h-5 text-primary-400" />
                  <h2 className="text-xl font-semibold text-white">Analysis Results</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {analysisResults.glaucoma && (
                    <div className={`p-6 rounded-2xl bg-gradient-to-br border ${getConfidenceBg(analysisResults.glaucoma.confidence)}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-dark-800/50">
                          <Shield className="w-5 h-5 text-primary-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Glaucoma Detection</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-dark-400 mb-1">Result</p>
                          <p className={`text-lg font-medium ${getConfidenceColor(analysisResults.glaucoma.confidence)}`}>
                            {analysisResults.glaucoma.result_msg}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-dark-400 mb-2">Confidence</p>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-3 bg-dark-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  analysisResults.glaucoma.confidence >= 0.7 ? 'bg-red-500' :
                                  analysisResults.glaucoma.confidence >= 0.5 ? 'bg-yellow-500' : 'bg-accent-500'
                                }`}
                                style={{ width: `${analysisResults.glaucoma.confidence * 100}%` }}
                              />
                            </div>
                            <span className={`font-semibold ${getConfidenceColor(analysisResults.glaucoma.confidence)}`}>
                              {(analysisResults.glaucoma.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {analysisResults.dr && (
                    <div className={`p-6 rounded-2xl bg-gradient-to-br border ${getConfidenceBg(analysisResults.dr.confidence)}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-dark-800/50">
                          <Activity className="w-5 h-5 text-medical-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Diabetic Retinopathy</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-dark-400 mb-1">Result</p>
                          <p className={`text-lg font-medium ${getConfidenceColor(analysisResults.dr.confidence)}`}>
                            {analysisResults.dr.result_msg}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-dark-400 mb-2">Confidence</p>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-3 bg-dark-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  analysisResults.dr.confidence >= 0.7 ? 'bg-red-500' :
                                  analysisResults.dr.confidence >= 0.5 ? 'bg-yellow-500' : 'bg-accent-500'
                                }`}
                                style={{ width: `${analysisResults.dr.confidence * 100}%` }}
                              />
                            </div>
                            <span className={`font-semibold ${getConfidenceColor(analysisResults.dr.confidence)}`}>
                              {(analysisResults.dr.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {(analysisResults.image_url || analysisResults.image_base64 || 
                analysisResults.glaucoma_heatmap_url || analysisResults.glaucoma_overlay_url ||
                analysisResults.dr_heatmap_url || analysisResults.dr_overlay_url) && (
                <div className="glass-card p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Image className="w-5 h-5 text-primary-400" />
                    <h2 className="text-xl font-semibold text-white">Visual Analysis</h2>
                  </div>

                  {/* Original Image */}
                  {(analysisResults.image_url || analysisResults.image_base64) && (
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-white mb-4">Original Image</h3>
                      <div className="flex justify-center">
                        <img
                          src={analysisResults.image_url || analysisResults.image_base64}
                          alt="Original"
                          className="w-full max-w-md rounded-xl border border-white/10 hover:border-primary-500/50 transition-colors cursor-pointer"
                          onClick={() => window.open(analysisResults.image_url || analysisResults.image_base64, '_blank')}
                        />
                      </div>
                    </div>
                  )}

                  {/* Glaucoma Visualizations */}
                  {(analysisResults.glaucoma_heatmap_url || analysisResults.glaucoma_overlay_url) && (
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary-400" />
                        Glaucoma Analysis
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        {analysisResults.glaucoma_heatmap_url && (
                          <div>
                            <p className="text-xs text-dark-500 mb-2 text-center">Glaucoma Heatmap</p>
                            <img
                              src={analysisResults.glaucoma_heatmap_url}
                              alt="Glaucoma Heatmap"
                              className="w-full rounded-xl border border-white/10 hover:border-primary-500/50 transition-colors cursor-pointer"
                              onClick={() => window.open(analysisResults.glaucoma_heatmap_url, '_blank')}
                            />
                          </div>
                        )}
                        {analysisResults.glaucoma_overlay_url && (
                          <div>
                            <p className="text-xs text-dark-500 mb-2 text-center">Glaucoma Overlay</p>
                            <img
                              src={analysisResults.glaucoma_overlay_url}
                              alt="Glaucoma Overlay"
                              className="w-full rounded-xl border border-white/10 hover:border-primary-500/50 transition-colors cursor-pointer"
                              onClick={() => window.open(analysisResults.glaucoma_overlay_url, '_blank')}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* DR Visualizations */}
                  {(analysisResults.dr_heatmap_url || analysisResults.dr_overlay_url) && (
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Brain className="w-4 h-4 text-accent-400" />
                        Diabetic Retinopathy Analysis
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        {analysisResults.dr_heatmap_url && (
                          <div>
                            <p className="text-xs text-dark-500 mb-2 text-center">DR Heatmap</p>
                            <img
                              src={analysisResults.dr_heatmap_url}
                              alt="DR Heatmap"
                              className="w-full rounded-xl border border-white/10 hover:border-accent-500/50 transition-colors cursor-pointer"
                              onClick={() => window.open(analysisResults.dr_heatmap_url, '_blank')}
                            />
                          </div>
                        )}
                        {analysisResults.dr_overlay_url && (
                          <div>
                            <p className="text-xs text-dark-500 mb-2 text-center">DR Overlay</p>
                            <img
                              src={analysisResults.dr_overlay_url}
                              alt="DR Overlay"
                              className="w-full rounded-xl border border-white/10 hover:border-accent-500/50 transition-colors cursor-pointer"
                              onClick={() => window.open(analysisResults.dr_overlay_url, '_blank')}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="glass-card p-6 bg-gradient-to-br from-accent-500/10 to-accent-500/5 border border-accent-500/20">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-accent-400" />
                  <div>
                    <p className="font-semibold text-white">Analysis Complete</p>
                    <p className="text-sm text-dark-400">Results have been saved to your history</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  )
}

export default EyeScanAnalysis
