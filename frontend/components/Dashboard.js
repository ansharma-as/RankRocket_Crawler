'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  BarChart3, 
  ExternalLink, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  Loader2,
  FileText,
  Plus,
  Eye
} from 'lucide-react'

export default function Dashboard() {
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const limit = 10

  useEffect(() => {
    fetchReports()
  }, [page])

  const fetchReports = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/reports?skip=${page * limit}&limit=${limit}`)
      const data = await response.json()

      if (response.ok) {
        setReports(data.reports || [])
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch reports')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading your reports...</h2>
            <p className="text-gray-600">Please wait while we retrieve your analysis results.</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Reports</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchReports}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (reports.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your SEO Reports</h1>
            <p className="text-gray-600">Monitor and track your website's SEO performance</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-12 max-w-md mx-auto">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-4">No reports yet</h3>
            <p className="text-gray-600 mb-6">
              Start analyzing your websites to see detailed SEO reports and recommendations here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <Plus className="h-5 w-5 mr-2" />
              Analyze Your First Website
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your SEO Reports</h1>
            <p className="text-gray-600">
              {reports.length} report{reports.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <Link
            href="/"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Analysis
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Avg Recommendations</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.length > 0 
                  ? Math.round(reports.reduce((sum, r) => sum + (r.recommendations_count || 0), 0) / reports.length)
                  : 0
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Latest Analysis</p>
              <p className="text-sm font-semibold text-gray-900">
                {reports.length > 0 ? formatDate(reports[0].crawled_at) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div
            key={report.submission_id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                    {report.url}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Analyzed: {formatDate(report.crawled_at)}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Complete
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{report.recommendations_count}</p>
                  <p className="text-sm text-gray-600">Recommendations</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{report.seo_score || 'N/A'}</p>
                  <p className="text-sm text-gray-600">SEO Score</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href={`/report/${report.submission_id}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Report
                </Link>
                
                <a
                  href={report.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 text-gray-600 text-sm hover:text-gray-900 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Visit Site
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination placeholder - can be implemented later */}
      {reports.length >= limit && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Load More Reports
          </button>
        </div>
      )}
    </div>
  )
}