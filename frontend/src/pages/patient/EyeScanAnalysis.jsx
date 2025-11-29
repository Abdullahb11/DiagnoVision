import { useState } from 'react'
import Layout from '../../components/Layout'
import { useAuth } from '../../contexts/AuthContext'
import { API_ENDPOINTS } from '../../config/api'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'

const EyeScanAnalysis = () => {
  const { currentUser } = useAuth()
  const [selectedEye, setSelectedEye] = useState('left')
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [analysisResults, setAnalysisResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
      setAnalysisResults(null)
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
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
      // Create FormData for multipart/form-data
      const formData = new FormData()
      formData.append('image', selectedFile)
      formData.append('patient_id', currentUser.uid)

      // Call backend API
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
        setAnalysisResults(data)

        // Store results in Firebase
        try {
          const currentDate = new Date().toISOString()

          // Store Glaucoma result
          if (data.glaucoma) {
            await addDoc(collection(db, 'glucoma_result'), {
              patientId: currentUser.uid,
              result_msg: data.glaucoma.result_msg,
              imageId: data.image_id,
              doctor_feedback: '',
              date: currentDate
            })
          }

          // Store DR result (if available)
          if (data.dr) {
            await addDoc(collection(db, 'dr_result'), {
              patientId: currentUser.uid,
              result_msg: data.dr.result_msg,
              imageId: data.image_id,
              doctor_feedback: '',
              date: currentDate
            })
          }
        } catch (firebaseError) {
          console.error('Error storing results in Firebase:', firebaseError)
          // Don't fail the whole operation if Firebase storage fails
        }
      } else {
        throw new Error(data.error || 'Analysis failed')
      }
    } catch (err) {
      console.error('Analysis error:', err)
      setError(err.message || 'Failed to analyze image. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.7) return 'text-red-300'
    if (confidence >= 0.5) return 'text-yellow-300'
    return 'text-green-300'
  }

  const getConfidenceBg = (confidence) => {
    if (confidence >= 0.7) return 'bg-red-500/20 border-red-500/50'
    if (confidence >= 0.5) return 'bg-yellow-500/20 border-yellow-500/50'
    return 'bg-green-500/20 border-green-500/50'
  }

  return (
    <Layout>
      <div className="flex-grow p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-emerald-300 mb-8">Eye Scan Analysis</h1>
          
          {/* Upload Section */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
            <h2 className="text-xl font-semibold text-emerald-300 mb-6">Upload Retinal Image</h2>
            
            {/* Eye Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">Select Eye</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="eye-type"
                    value="left"
                    checked={selectedEye === 'left'}
                    onChange={(e) => setSelectedEye(e.target.value)}
                    className="text-emerald-500 focus:ring-emerald-400"
                  />
                  <span className="text-slate-300">Left Eye</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="eye-type"
                    value="right"
                    checked={selectedEye === 'right'}
                    onChange={(e) => setSelectedEye(e.target.value)}
                    className="text-emerald-500 focus:ring-emerald-400"
                  />
                  <span className="text-slate-300">Right Eye</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="eye-type"
                    value="both"
                    checked={selectedEye === 'both'}
                    onChange={(e) => setSelectedEye(e.target.value)}
                    className="text-emerald-500 focus:ring-emerald-400"
                  />
                  <span className="text-slate-300">Both Eyes</span>
                </label>
              </div>
            </div>
            
            <div className="border-2 border-dashed border-emerald-400/30 rounded-lg p-8 text-center hover:border-emerald-400/50 transition">
              <div className="mb-4">
                <svg className="w-16 h-16 text-emerald-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Drop your retinal image here</h3>
              <p className="text-slate-400 mb-4">or click to browse files</p>
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
                className={`inline-block font-medium px-6 py-3 rounded-lg transition cursor-pointer ${
                  loading 
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                    : 'bg-emerald-500 text-slate-900 hover:bg-emerald-400'
                }`}
              >
                Choose File
              </label>
              {selectedFile && (
                <div className="mt-4">
                  <p className="text-sm text-emerald-300">Selected: {selectedFile.name}</p>
                  {previewUrl && (
                    <div className="mt-4 max-w-md mx-auto">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-w-full h-auto rounded-lg border border-white/10"
                      />
                    </div>
                  )}
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className={`mt-4 px-6 py-2 rounded-lg font-medium transition ${
                      loading
                        ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-500'
                    }`}
                  >
                    {loading ? 'Analyzing...' : 'Analyze Image'}
                  </button>
                </div>
              )}
              <p className="text-sm text-slate-500 mt-4">Supported formats: JPG, PNG, TIFF (Max 10MB)</p>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-300">{error}</p>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-300 mx-auto mb-4"></div>
              <p className="text-emerald-300">Analyzing image... This may take a moment.</p>
            </div>
          )}

          {/* Analysis Results */}
          {analysisResults && !loading && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 space-y-6">
              <h2 className="text-xl font-semibold text-emerald-300 mb-6">Analysis Results</h2>
              
              {/* Glaucoma Results */}
              {analysisResults.glaucoma && (
                <div className={`border rounded-lg p-6 ${getConfidenceBg(analysisResults.glaucoma.confidence)}`}>
                  <h3 className="text-lg font-semibold text-emerald-300 mb-4">Glaucoma Detection</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-slate-300 mb-1">Result:</p>
                      <p className={`text-lg font-medium ${getConfidenceColor(analysisResults.glaucoma.confidence)}`}>
                        {analysisResults.glaucoma.result_msg}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-300 mb-1">Confidence:</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-700 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${
                              analysisResults.glaucoma.confidence >= 0.7 ? 'bg-red-500' :
                              analysisResults.glaucoma.confidence >= 0.5 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${analysisResults.glaucoma.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className={`font-semibold ${getConfidenceColor(analysisResults.glaucoma.confidence)}`}>
                          {(analysisResults.glaucoma.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-300 mb-1">Prediction:</p>
                      <p className="text-slate-200">{analysisResults.glaucoma.prediction}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* DR Results */}
              {analysisResults.dr && (
                <div className={`border rounded-lg p-6 ${getConfidenceBg(analysisResults.dr.confidence)}`}>
                  <h3 className="text-lg font-semibold text-emerald-300 mb-4">Diabetic Retinopathy Detection</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-slate-300 mb-1">Result:</p>
                      <p className={`text-lg font-medium ${getConfidenceColor(analysisResults.dr.confidence)}`}>
                        {analysisResults.dr.result_msg}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-300 mb-1">Confidence:</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-slate-700 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${
                              analysisResults.dr.confidence >= 0.7 ? 'bg-red-500' :
                              analysisResults.dr.confidence >= 0.5 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${analysisResults.dr.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className={`font-semibold ${getConfidenceColor(analysisResults.dr.confidence)}`}>
                          {(analysisResults.dr.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-300 mb-1">Prediction:</p>
                      <p className="text-slate-200">{analysisResults.dr.prediction}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Images - Three images like notebook */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-emerald-300 mb-4">Visualizations</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Original Image */}
                  {analysisResults.image_url && (
                    <div>
                      <h4 className="text-emerald-300 font-semibold mb-3 text-center">Original Image</h4>
                      <img 
                        src={analysisResults.image_url} 
                        alt="Original" 
                        className="w-full rounded-lg border border-white/10 shadow-lg"
                      />
                    </div>
                  )}
                  {/* Heatmap Only */}
                  {analysisResults.heatmap_url && (
                    <div>
                      <h4 className="text-emerald-300 font-semibold mb-3 text-center">GradCAM Heatmap</h4>
                      <img 
                        src={analysisResults.heatmap_url} 
                        alt="GradCAM Heatmap" 
                        className="w-full rounded-lg border border-white/10 shadow-lg"
                      />
                    </div>
                  )}
                  {/* Overlay */}
                  {analysisResults.overlay_url && (
                    <div>
                      <h4 className="text-emerald-300 font-semibold mb-3 text-center">Overlay</h4>
                      <img 
                        src={analysisResults.overlay_url} 
                        alt="GradCAM Overlay" 
                        className="w-full rounded-lg border border-white/10 shadow-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Success Message */}
              <div className="mt-6 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
                <p className="text-emerald-300">
                  ✓ Analysis complete! Results have been saved to your history.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default EyeScanAnalysis
