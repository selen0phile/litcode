import React, { useContext, useState, useEffect } from "react"
import { auth } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  // const [correctMcq, setCorrectMcq] = useState(0)

  // function addCorrectMcq(x) {
  //   setCorrectMcq(correctMcq + x)
  // }
  // function signup(email, password) {
  //   return auth.createUserWithEmailAndPassword(email, password)
  // }

  // function login(email, password) {
  //   return auth.signInWithEmailAndPassword(email, password)
  // }

  function logout() {
    return signOut(auth);
  }

  // function resetPassword(email) {
  //   return auth.sendPasswordResetEmail(email)
  // }

  // function updateEmail(email) {
  //   return currentUser.updateEmail(email)
  // }

  // function updatePassword(password) {
  //   return currentUser.updatePassword(password)
  // }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        // User is signed out
        // ...
      }
      setLoading(false);
    });
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    // login,
    // signup,
    logout,
    // resetPassword,
    // updateEmail,
    // updatePassword,
    // addCorrectMcq
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
