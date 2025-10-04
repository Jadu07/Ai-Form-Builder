import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/api'
import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import { CheckCircle, Copy, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'

const RenderForm = () => {
  const { id } = useParams()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchForm()
  }, [id])

  const fetchForm = async () => {
    try {
      const response = await api.get(`/forms/${id}`)
      setForm(response.data)
    } catch (error) {
      toast.error('Form not found')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async ({ formData: data }) => {
    setSubmitting(true)

    try {
      await api.post(`/responses/${id}`, { data })
      setSubmitted(true)
      toast.success('Response submitted successfully!')
    } catch (error) {
      toast.error('Failed to submit response')
    } finally {
      setSubmitting(false)
    }
  }

  const copyFormLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast.success('Form link copied to clipboard!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form not found</h2>
          <p className="text-gray-600">The form you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
          <p className="text-gray-600 mb-6">
            Your response has been submitted successfully.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
              <p className="text-gray-600">Version {form.version}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={copyFormLink}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </button>
              <a
                href={`/edit/${id}`}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Edit Form</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <Form
            schema={form.schema.schema}
            uiSchema={form.schema.uiSchema || {}}
            validator={validator}
            formData={formData}
            onChange={({ formData: data }) => setFormData(data)}
            onSubmit={handleSubmit}
          >
            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={() => setFormData({})}
                className="btn-secondary"
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Response</span>
                )}
              </button>
            </div>
          </Form>
        </div>

        {/* Form Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>This form was created with AI Form Generator</p>
        </div>
      </div>
    </div>
  )
}

export default RenderForm



