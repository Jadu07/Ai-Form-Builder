import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../lib/api'
import Form from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import { ArrowLeft, Save, Sparkles, Eye, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'

const EditForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refining, setRefining] = useState(false)
  const [instruction, setInstruction] = useState('')
  const [followups, setFollowups] = useState([])

  useEffect(() => {
    fetchForm()
  }, [id])

  const fetchForm = async () => {
    try {
      const response = await api.get(`/forms/${id}`)
      setForm(response.data)
    } catch (error) {
      toast.error('Failed to fetch form')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleRefine = async (e) => {
    e.preventDefault()
    
    if (!instruction.trim()) {
      toast.error('Please enter an instruction')
      return
    }

    setRefining(true)

    try {
      const response = await api.put(`/forms/${id}/refine`, {
        instruction: instruction.trim()
      })

      const { form: updatedForm, followups: aiFollowups } = response.data
      setForm(updatedForm)
      setInstruction('')
      
      if (aiFollowups && aiFollowups.length > 0) {
        setFollowups(aiFollowups)
        toast.info('AI has some clarification questions')
      } else {
        toast.success('Form updated successfully!')
      }
    } catch (error) {
      toast.error('Failed to update form')
    } finally {
      setRefining(false)
    }
  }

  const handleFollowupResponse = async (followupResponse) => {
    setRefining(true)

    try {
      const response = await api.put(`/forms/${id}/refine`, {
        instruction: `${instruction}\n\nFollow-up: ${followupResponse}`
      })

      const { form: updatedForm, followups: newFollowups } = response.data
      setForm(updatedForm)
      setInstruction('')
      
      if (newFollowups && newFollowups.length > 0) {
        setFollowups(newFollowups)
      } else {
        toast.success('Form updated successfully!')
        setFollowups([])
      }
    } catch (error) {
      toast.error('Failed to update form')
    } finally {
      setRefining(false)
    }
  }

  const handleTitleUpdate = async (newTitle) => {
    try {
      await api.put(`/forms/${id}/title`, { title: newTitle })
      setForm({ ...form, title: newTitle })
      toast.success('Title updated successfully!')
    } catch (error) {
      toast.error('Failed to update title')
    }
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

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
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
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                onBlur={(e) => handleTitleUpdate(e.target.value)}
                className="text-3xl font-bold text-gray-900 bg-transparent border-none outline-none focus:bg-white focus:border focus:border-gray-300 focus:px-2 focus:py-1 focus:rounded"
              />
              <p className="mt-2 text-gray-600">
                Version {form.version} • Created {new Date(form.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/form/${id}`)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => navigate(`/responses/${id}`)}
              className="btn-primary flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Responses</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Preview */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Form Preview</h2>
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <Form
                schema={form.schema.schema}
                uiSchema={form.schema.uiSchema || {}}
                validator={validator}
                onSubmit={() => toast.info('This is a preview. Use the public link to collect responses.')}
                disabled={true}
              >
                <button type="submit" className="btn-primary" disabled>
                  Submit (Preview Mode)
                </button>
              </Form>
            </div>
          </div>

          {/* Refinement Panel */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Refine Form</h2>
            </div>

            {followups.length > 0 ? (
              /* Follow-up Questions */
              <div>
                <p className="text-gray-600 mb-4">
                  The AI needs clarification to make the changes:
                </p>
                <div className="space-y-3 mb-4">
                  {Array.isArray(followups) && followups.map((followup, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{followup}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Please provide more details:
                  </label>
                  <textarea
                    rows={3}
                    className="input-field"
                    placeholder="Add more specific requirements..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        handleFollowupResponse(e.target.value)
                      }
                    }}
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={(e) => {
                        const textarea = e.target.parentElement.previousElementSibling
                        handleFollowupResponse(textarea.value)
                      }}
                      className="btn-primary"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Refinement Form */
              <form onSubmit={handleRefine} className="space-y-4">
                <div>
                  <label htmlFor="instruction" className="block text-sm font-medium text-gray-700 mb-2">
                    Describe Changes
                  </label>
                  <textarea
                    id="instruction"
                    rows={4}
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    className="input-field"
                    placeholder="e.g., Add a phone number field, Remove the email field, Change t-shirt size to include XL option..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={refining || !instruction.trim()}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {refining ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Refining Form...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Apply Changes</span>
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">💡 Refinement Examples:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• "Add a phone number field"</li>
                <li>• "Remove the email field"</li>
                <li>• "Change dropdown options to include XL"</li>
                <li>• "Make the name field required"</li>
                <li>• "Add a comments textarea"</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Version History */}
        {form.versions && form.versions.length > 1 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Version History</h2>
            <div className="space-y-3">
              {Array.isArray(form.versions) && form.versions.map((version, index) => (
                <div key={version.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Version {form.versions.length - index}
                    </p>
                    <p className="text-xs text-gray-600">
                      {version.changePrompt}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(version.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {index === 0 && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Current
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default EditForm
