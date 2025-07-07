'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  Clock, 
  HardDrive,
  Image as ImageIcon,
  Link as LinkIcon,
  FileText,
  AlertTriangle,
  CheckCircle,
  Info,
  Loader2,
  AlertCircle,
  TrendingUp,
  Hash
} from 'lucide-react'

export default function Report({ submissionId }) {
  const [report, setReport] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchReport()
  }, [submissionId])

  const fetchReport = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/reports/${submissionId}`)
      const data = await response.json()

      if (response.ok) {
        setReport(data)
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch report')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'border-red-500 bg-red-50'
      case 'medium': return 'border-yellow-500 bg-yellow-50'
      case 'low': return 'border-green-500 bg-green-50'
      default: return 'border-gray-500 bg-gray-50'
    }
  }

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'medium': return <Info className="h-5 w-5 text-yellow-600" />
      case 'low': return <CheckCircle className="h-5 w-5 text-green-600" />
      default: return <Info className="h-5 w-5 text-gray-600" />
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href="/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading your SEO report...</h2>
            <p className="text-gray-600">Please wait while we retrieve your analysis results.</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href="/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Report</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchReport}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          href="/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Report Not Available</h2>
          <p className="text-gray-600">This report is not available at the moment.</p>
        </div>
      </div>
    )
  }

  const { seo_metrics, recommendations } = report

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link 
        href="/dashboard"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Link>

      {/* Report Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
          <h1 className="text-3xl font-bold mb-2">SEO Analysis Report</h1>
          <div className="flex items-center space-x-4 text-blue-100">
            <span className="truncate">{report.url}</span>
            <a
              href={report.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center hover:text-white transition-colors"
            >
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>
          <div className="flex items-center mt-4 text-blue-100">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Analyzed on {formatDate(report.crawled_at)}</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-2">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">Page Title</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {seo_metrics.title || 'Not Found'}
            </p>
            {seo_metrics.title && (
              <p className="text-sm text-gray-500 mt-1">
                {seo_metrics.title.length} characters
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-2">
              <FileText className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">Meta Description</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {seo_metrics.meta_description ? 
                `${seo_metrics.meta_description.length} characters` : 
                'Not Found'
              }
            </p>
            {seo_metrics.meta_description && (
              <p className="text-sm text-gray-500 mt-1 truncate">
                {seo_metrics.meta_description}
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-2">
              <HardDrive className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">Page Size</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {formatBytes(seo_metrics.page_size || 0)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">Load Time</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {(seo_metrics.load_time || 0).toFixed(2)}s
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">Status Code</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {seo_metrics.status_code || 'Unknown'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-2">
              <ImageIcon className="h-5 w-5 text-pink-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">Images</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {seo_metrics.images?.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Content Structure */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Content Structure</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-2">
              <Hash className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">H1 Tags</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {seo_metrics.h1_tags?.length || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-2">
              <Hash className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">H2 Tags</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {seo_metrics.h2_tags?.length || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-2">
              <Hash className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">H3 Tags</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {seo_metrics.h3_tags?.length || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-2">
              <LinkIcon className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">Internal Links</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {seo_metrics.internal_links?.length || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-2">
              <ExternalLink className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-sm font-medium text-gray-600">External Links</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {seo_metrics.external_links?.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recommendations ({recommendations.length})
          </h2>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`border-l-4 rounded-lg p-6 bg-white shadow-sm ${getPriorityColor(rec.priority)}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    {getPriorityIcon(rec.priority)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {rec.title}
                    </h3>
                    <p className="text-gray-700 mb-4">
                      {rec.description}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">
                          Priority: <span className="capitalize">{rec.priority}</span>
                        </span>
                        {rec.impact_score && (
                          <span>
                            Impact Score: {(rec.impact_score * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                      {(rec.current_value || rec.suggested_value) && (
                        <div className="mt-2 sm:mt-0">
                          {rec.current_value && (
                            <span className="text-red-600">
                              Current: {rec.current_value}
                            </span>
                          )}
                          {rec.current_value && rec.suggested_value && (
                            <span className="mx-2">→</span>
                          )}
                          {rec.suggested_value && (
                            <span className="text-green-600">
                              Suggested: {rec.suggested_value}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to improve your SEO?</h3>
        <p className="text-blue-100 mb-6">
          Use these recommendations to boost your search engine rankings and drive more traffic to your website.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
        >
          Analyze Another Website
        </Link>
      </div>
    </div>
  )
}