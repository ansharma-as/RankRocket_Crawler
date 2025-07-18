'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, AlertCircle, CheckCircle, Loader2, Rocket, Globe, Zap } from 'lucide-react'
import { crawlApi } from '@/services/api'
import { InlineLoader } from '@/components/LoadingSpinner'

export default function URLSubmissionForm({ onSuccess }) {
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
      const data = await crawlApi.submitUrl(url.trim())
      
      setStatus('success')
      setMessage(`Analysis started! Submission ID: ${data.submission_id}`)
      setUrl('')
      
      // Call onSuccess callback if provided (for modal usage)
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 2000)
      } else {
        // Navigate to dashboard after 2 seconds (for standalone usage)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (error) {
      setStatus('error')
      setMessage(error.message || 'Failed to submit URL for analysis')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/5"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full -translate-x-16 -translate-y-16 blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full translate-x-16 translate-y-16 blur-xl"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30">
                <Search className="h-8 w-8 text-purple-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Analyze Your Website
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Enter your website URL to get a comprehensive SEO analysis with 
              <span className="text-purple-400 font-semibold"> AI-powered insights</span> and 
              actionable recommendations.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-3">
                Website URL
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                  disabled={isLoading}
                  className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="w-full btn-primary group px-8 py-4 text-lg font-semibold rounded-xl hover-lift disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none flex items-center justify-center"
            >
              {isLoading ? (
                <InlineLoader 
                  color="#ffffff" 
                  size={20} 
                  text="Analyzing Your Website..." 
                />
              ) : (
                <>
                  <Rocket className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform" />
                  Start SEO Analysis
                  <Zap className="h-5 w-5 ml-3 group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Status Messages */}
          {status && (
            <div className={`mt-6 p-6 rounded-xl border transition-all duration-300 ${
              status === 'success' 
                ? 'bg-green-500/10 border-green-500/30 animate-pulse' 
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-start">
                {status === 'success' ? (
                  <div className="flex-shrink-0 mr-4">
                    <div className="p-2 rounded-full bg-green-500/20">
                      <CheckCircle className="h-6 w-6 text-green-400" />
                    </div>
                  </div>
                ) : (
                  <div className="flex-shrink-0 mr-4">
                    <div className="p-2 rounded-full bg-red-500/20">
                      <AlertCircle className="h-6 w-6 text-red-400" />
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg mb-2 ${
                    status === 'success' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {status === 'success' ? 'Analysis Started!' : 'Analysis Failed'}
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    status === 'success' ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {message}
                  </p>
                  {status === 'success' && (
                    <div className="mt-4 flex items-center text-sm text-green-400">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span>Redirecting to dashboard...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="mt-6 p-6 bg-[#00bf63]/10 border border-[#00bf63]/30 rounded-xl">
              <div className="flex items-center">
                <InlineLoader 
                  color="#00bf63" 
                  size={25} 
                  className="mr-4" 
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-[#00bf63] mb-2">Analyzing your website...</h3>
                  <p className="text-sm text-[#00bf63]/80 leading-relaxed">
                    Our AI is crawling your site and analyzing SEO performance. 
                    This may take a few moments to complete.
                  </p>
                  <div className="mt-3 w-full bg-[#00bf63]/20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#00bf63] to-emerald-400 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {[
              {
                icon: <Zap className="h-5 w-5 text-yellow-400" />,
                text: "Lightning Fast Analysis"
              },
              {
                icon: <Search className="h-5 w-5 text-purple-400" />,
                text: "Deep SEO Insights"
              },
              {
                icon: <CheckCircle className="h-5 w-5 text-green-400" />,
                text: "Actionable Recommendations"
              }
            ].map((feature, index) => (
              <div key={index} className="flex items-center justify-center space-x-2 text-sm text-gray-400 group hover:text-gray-300 transition-colors">
                <div className="group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}