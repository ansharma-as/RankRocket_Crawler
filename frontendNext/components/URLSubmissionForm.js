'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

export default function URLSubmissionForm() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(null) // null, 'success', 'error'
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!url.trim()) return
    
    setIsLoading(true)
    setStatus(null)
    setMessage('')

    try {
      const response = await fetch('/api/submit-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(`Analysis started! Submission ID: ${data.submission_id}`)
        setUrl('')
        
        // Navigate to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to submit URL for analysis')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Analyze Your Website
            </h2>
            <p className="text-gray-600">
              Enter your website URL to get a comprehensive SEO analysis with actionable recommendations
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                  disabled={isLoading}
                  className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg text-lg placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg text-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Analyze Website
                </>
              )}
            </button>
          </form>

          {/* Status Messages */}
          {status && (
            <div className={`mt-6 p-4 rounded-lg border ${
              status === 'success' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start">
                {status === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                )}
                <div>
                  <h3 className={`font-semibold ${
                    status === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {status === 'success' ? 'Analysis Started!' : 'Analysis Failed'}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    status === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {message}
                  </p>
                  {status === 'success' && (
                    <p className="text-sm text-green-600 mt-2">
                      Redirecting to dashboard...
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin mr-3" />
                <div>
                  <h3 className="font-semibold text-blue-800">Analyzing your website...</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    This may take a few moments while we crawl and analyze your site.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}