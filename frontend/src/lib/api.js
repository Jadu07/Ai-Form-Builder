import axios from 'axios'
import { supabase } from './supabase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

console.log('API_URL:', API_URL)

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    })
    
    if (error.response?.status === 401) {
      supabase.auth.signOut()
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

export default api



