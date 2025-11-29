import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import PatientDashboard from './pages/patient/PatientDashboard'
import PatientHistory from './pages/patient/PatientHistory'
import EyeScanAnalysis from './pages/patient/EyeScanAnalysis'
import AvailableDoctors from './pages/patient/AvailableDoctors'
import MyDoctors from './pages/patient/MyDoctors'
import PatientMessages from './pages/patient/PatientMessages'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorPatients from './pages/doctor/DoctorPatients'
import DoctorMessages from './pages/doctor/DoctorMessages'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          {/* Patient Routes */}
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute requiredRole="patient">
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/history"
            element={
              <ProtectedRoute requiredRole="patient">
                <PatientHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/scan"
            element={
              <ProtectedRoute requiredRole="patient">
                <EyeScanAnalysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/doctors/available"
            element={
              <ProtectedRoute requiredRole="patient">
                <AvailableDoctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/doctors/my-doctors"
            element={
              <ProtectedRoute requiredRole="patient">
                <MyDoctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/messages"
            element={
              <ProtectedRoute requiredRole="patient">
                <PatientMessages />
              </ProtectedRoute>
            }
          />
          {/* Doctor Routes */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/patients"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorPatients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/messages"
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorMessages />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

