import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'

const supabaseUrl = 'https://pzgubxisulgipvgkbqvo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6Z3VieGlzdWxnaXB2Z2ticXZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMDQ4NzMsImV4cCI6MjA3NTU4MDg3M30.p-g_cbjPn4zcgBmjKosG_ZEJDBXyTx8UBojUQNUh5m0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})