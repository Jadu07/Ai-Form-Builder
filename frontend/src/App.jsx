import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import CreateForm from './pages/CreateForm'
import EditForm from './pages/EditForm'
import RenderForm from './pages/RenderForm'
import Responses from './pages/Responses'
import LoadingSpinner from './components/LoadingSpinner'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return children
}

const AppRoutes = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Routes>
      <Route 
        path="/auth" 
        element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create" 
        element={
          <ProtectedRoute>
            <CreateForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/edit/:id" 
        element={
          <ProtectedRoute>
            <EditForm />
          </ProtectedRoute>
        } 
      />
      <Route path="/form/:id" element={<RenderForm />} />
      <Route 
        path="/responses/:id" 
        element={
          <ProtectedRoute>
            <Responses />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
