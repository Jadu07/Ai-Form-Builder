import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../lib/api'
import { Send, Sparkles, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'

const CreateForm = () => {
  const [prompt, setPrompt] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [followups, setFollowups] = useState([])
  const navigate = useNavigate()

  const examplePrompts = [
    "Create a registration form with name, email, college, and t-shirt size (S/M/L)",
    "Make a feedback form with rating, comments, and contact preference",
    "Build a job application form with personal info, experience, and skills",
    "Create a event registration with attendee details and dietary requirements"
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!prompt.trim()) {
      toast.error('Please enter a description for your form')
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/forms/generate', {
        prompt: prompt.trim(),
        title: title.trim() || 'Untitled Form'
      })

      const { form, followups: aiFollowups } = response.data
      
      if (aiFollowups && aiFollowups.length > 0) {
        setFollowups(aiFollowups)
        toast.info('AI has some clarification questions')
      } else {
        toast.success('Form created successfully!')
        navigate(`/edit/${form.id}`)
      }
    } catch (error) {
      console.error('Form creation error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create form';
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  }

  const handleFollowupResponse = async (followupResponse) => {
    setLoading(true)

    try {
      const response = await api.post('/forms/generate', {
        prompt: `${prompt}\n\nFollow-up: ${followupResponse}`,
        title: title.trim() || 'Untitled Form'
      })

      const { form, followups: newFollowups } = response.data
      
      if (newFollowups && newFollowups.length > 0) {
        setFollowups(newFollowups)
      } else {
        toast.success('Form created successfully!')
        navigate(`/edit/${form.id}`)
      }
    } catch (error) {
      console.error('Form creation error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create form';
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Form</h1>
            <p className="mt-2 text-gray-600">
              Describe your form in natural language and let AI generate it for you
            </p>
          </div>
        </div>

        {followups.length > 0 ? (
          /* Follow-up Questions */
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">AI Clarification</h2>
            </div>
            <p className="text-gray-600 mb-4">
              The AI needs some clarification to create the best form for you:
            </p>
            <div className="space-y-3">
              {Array.isArray(followups) && followups.map((followup, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{followup}</p>
                </div>
              ))}
            </div>
            <div className="mt-6">
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
          /* Main Form Creation */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="card">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Form Title (Optional)
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field"
                    placeholder="e.g., Event Registration Form"
                  />
                </div>

                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                    Describe Your Form
                  </label>
                  <textarea
                    id="prompt"
                    rows={6}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="input-field"
                    placeholder="Describe what kind of form you want to create..."
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Be as specific as possible about the fields, validation, and requirements you need.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Generating Form...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Generate Form</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Examples */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Example Prompts</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Here are some examples to get you started:
              </p>
              <div className="space-y-3">
                {Array.isArray(examplePrompts) && examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700"
                  >
                    {example}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">💡 Tips for better results:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Specify field types (text, email, number, dropdown)</li>
                  <li>• Mention validation requirements</li>
                  <li>• Include any specific options for dropdowns</li>
                  <li>• Describe the form's purpose clearly</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default CreateForm
