import { createContext, useContext, useEffect, useState } from 'react'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        // Fetch role from Firestore
        try {
          console.log('Fetching role for user:', user.uid)
          const userDoc = await getDoc(doc(db, 'user', user.uid))
          console.log('User document exists:', userDoc.exists())
          if (userDoc.exists()) {
            const userData = userDoc.data()
            console.log('User data:', userData)
            console.log('User role:', userData.role)
            setUserRole(userData.role || null)
          } else {
            console.warn('User document not found in Firestore for UID:', user.uid)
            setUserRole(null)
          }
        } catch (error) {
          console.error('Error fetching user role:', error)
          console.error('Error details:', error.message, error.code)
          setUserRole(null)
        }
      } else {
        setUserRole(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signup = async (email, password, displayName, role) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update profile with display name
      await updateProfile(user, { displayName })

      // Store user data in Firestore with role
      if (role) {
        await setDoc(doc(db, 'user', user.uid), {
          id: user.uid,
          email: email,
          password: '', // Don't store password in Firestore (handled by Firebase Auth)
          role: role
        })
        
        // Create patient or doctor profile based on role
        if (role === 'patient') {
          await setDoc(doc(db, 'patient', user.uid), {
            user_id: user.uid,
            name: displayName,
            age: '',
            gender: '',
            doctorId: '',
            contactNo: ''
          })
        } else if (role === 'doctor') {
          await setDoc(doc(db, 'doctor', user.uid), {
            user_id: user.uid,
            name: displayName,
            qualification: '',
            licenseNo: ''
          })
        }
        
        setUserRole(role)
      }

      return { success: true, user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user: userCredential.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signout = async () => {
    try {
      await firebaseSignOut(auth)
      setUserRole(null)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const value = {
    currentUser,
    userRole,
    signup,
    signin,
    signout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

