// contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Get initial session
    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setUser(session?.user ?? null)
        setLoading(false)
        if (!initialized) setInitialized(true)
      }
    )

    return () => subscription.unsubscribe()
  }, [])
// Function to get the initial session
  const getInitialSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
       if (error) {
        console.error('Error getting session:', error)//log the error
        throw error
      }
      console.log('Initial session:', session?.user?.email)//logging the initial session user email
      setUser(session?.user ?? null)
    } 
    catch (error) {
      console.error('Error getting initial session:', error)
      setUser(null)
    } 
    finally {
      setLoading(false)
      setInitialized(true)
    }
  }

  // Auth functions
  const authFunctions = {
    signUp: async (email, password) => {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password 
      })
      if (error){
        console.error('Sign up error:', error)
        throw error
      } 
      console.log('Sign up successful:', data.user?.email)
      return data
    },

    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })
      if (error) {
        console.error('Sign in error:', error)
        throw error
      }
      console.log('Sign in successful:', data.user?.email);
      return data;
    },

    signOut: async () => {
      console.log('Signing out...')
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        throw error
      }
      console.log('Sign out successful')
      setUser(null)
    },

    resetPassword: async (email) => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) {
        console.error('Reset password error:', error)
        throw error
      }
      return data
    }
  }

  const value = {
    user,
    loading,
    initialized,
    ...authFunctions
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}