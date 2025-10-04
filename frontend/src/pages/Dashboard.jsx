import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../lib/api'
import { useAuth } from '../contexts/AuthContext.jsx'
import { Plus, Edit, Eye, BarChart3, Trash2, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchForms()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchForms = async () => {
    try {
      const response = await api.get('/forms')
      // Ensure we always have an array
      setForms(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Fetch forms error:', error)
      toast.error('Failed to fetch forms')
      setForms([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteForm = async (formId) => {
    if (!window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      return
    }

    try {
      await api.delete(`/forms/${formId}`)
      setForms(Array.isArray(forms) ? forms.filter(form => form.id !== formId) : [])
      toast.success('Form deleted successfully')
    } catch (error) {
      toast.error('Failed to delete form')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner size="lg" className="py-20" />
      </Layout>
    )
  }

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please sign in</h2>
          <p className="text-gray-600">You need to be signed in to view your forms.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Forms</h1>
            <p className="mt-2 text-gray-600">
              Create and manage your AI-generated forms
            </p>
          </div>
          <Link
            to="/create"
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Form</span>
          </Link>
        </div>

        {/* Forms Grid */}
        {!Array.isArray(forms) || forms.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first AI-powered form
            </p>
            <Link to="/create" className="btn-primary">
              Create Your First Form
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(forms) && forms.map((form) => (
              <div key={form.id} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {form.title}
                  </h3>
                  <button
                    onClick={() => handleDeleteForm(form.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Created {formatDate(form.createdAt)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    <span>{form.responseCount} responses</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    <span>Version {form.version}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/edit/${form.id}`}
                    className="flex-1 btn-secondary flex items-center justify-center space-x-1 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </Link>
                  <Link
                    to={`/form/${form.id}`}
                    className="flex-1 btn-secondary flex items-center justify-center space-x-1 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </Link>
                  <Link
                    to={`/responses/${form.id}`}
                    className="flex-1 btn-primary flex items-center justify-center space-x-1 text-sm"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Responses</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Dashboard
