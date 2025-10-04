import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../lib/api'
import { ArrowLeft, Download, BarChart3, Users, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'

const Responses = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [responses, setResponses] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('responses')

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const [formResponse, responsesResponse, statsResponse] = await Promise.all([
        api.get(`/forms/${id}`),
        api.get(`/responses/${id}`),
        api.get(`/responses/${id}/stats`)
      ])
      
      setForm(formResponse.data)
      setResponses(responsesResponse.data)
      setStats(statsResponse.data)
    } catch (error) {
      toast.error('Failed to fetch data')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (!responses.length || !form) return

    const headers = Object.keys(form.schema.schema.properties || {})
    const csvRows = [
      ['Response ID', 'Submitted At', ...headers].join(',')
    ]
    
    if (Array.isArray(responses)) {
      responses.forEach(response => {
        const row = [
          response.id,
          new Date(response.createdAt).toLocaleString(),
          ...headers.map(header => {
            const value = response.data[header] || ''
            return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
          })
        ]
        csvRows.push(row.join(','))
      })
    }
    
    const csvContent = csvRows.join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${form.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_responses.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    toast.success('CSV exported successfully!')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner size="lg" className="py-20" />
      </Layout>
    )
  }

  if (!form) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form not found</h2>
          <p className="text-gray-600">The form you're looking for doesn't exist.</p>
        </div>
      </Layout>
    )
  }

  const fields = Object.keys(form.schema.schema.properties || {})

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
              <p className="mt-2 text-gray-600">
                View and analyze form responses
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={exportToCSV}
              disabled={!responses.length}
              className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Responses</p>
                <p className="text-2xl font-bold text-gray-900">{responses.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Created</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(form.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Version</p>
                <p className="text-lg font-semibold text-gray-900">v{form.version}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('responses')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'responses'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Responses ({responses.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'responses' ? (
          <div className="card">
            {responses.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No responses yet</h3>
                <p className="text-gray-600 mb-6">
                  Share your form to start collecting responses
                </p>
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/form/${id}`)}
                  className="btn-primary"
                >
                  Copy Form Link
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Response ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      {Array.isArray(fields) && fields.map(field => (
                        <th key={field} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {form.schema.schema.properties[field].title || field}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.isArray(responses) && responses.map((response) => (
                      <tr key={response.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                          {response.id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(response.createdAt)}
                        </td>
                        {Array.isArray(fields) && fields.map(field => (
                          <td key={field} className="px-6 py-4 text-sm text-gray-900">
                            {response.data[field] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Field Completion Rates */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Field Completion Rates</h3>
              {stats && stats.fieldStats ? (
                <div className="space-y-4">
                  {stats.fieldStats && Object.entries(stats.fieldStats).map(([field, stat]) => (
                    <div key={field}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {form.schema.schema.properties[field]?.title || field}
                        </span>
                        <span className="text-sm text-gray-500">
                          {stat.completed}/{stat.total} ({Math.round(stat.completionRate)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${stat.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No data available</p>
              )}
            </div>

            {/* Response Timeline */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Timeline</h3>
              <div className="space-y-3">
                {Array.isArray(responses) && responses.slice(0, 10).map((response, index) => (
                  <div key={response.id} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        Response #{responses.length - index}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(response.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                {responses.length > 10 && (
                  <p className="text-sm text-gray-500 text-center">
                    ... and {responses.length - 10} more responses
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Responses
