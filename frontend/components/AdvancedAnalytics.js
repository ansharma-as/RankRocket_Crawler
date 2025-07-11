'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  Target,
  Clock,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { analyticsApi, utils } from '@/services/api'

export default function AdvancedAnalytics() {
  const [dashboard, setDashboard] = useState(null)
  const [trends, setTrends] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState(30)

  useEffect(() => {
    fetchData()
  }, [selectedPeriod])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [dashboardData, trendsData] = await Promise.all([
        analyticsApi.getDashboard(),
        analyticsApi.getTrends(null, selectedPeriod)
      ])
      setDashboard(dashboardData)
      setTrends(trendsData)
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics data')
    } finally {
      setIsLoading(false)
    }
  }

  const COLORS = ['#8B5CF6', '#00C49F', '#FFBB28', '#FF8042']

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading analytics...</h2>
            <p className="text-gray-600">Please wait while we retrieve your data.</p>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Analytics</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Monitor your SEO performance and trends</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <button
              onClick={fetchData}
              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Crawls</p>
                <p className="text-2xl font-bold text-gray-900">{dashboard.overview.total_crawls}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Unique URLs</p>
                <p className="text-2xl font-bold text-gray-900">{dashboard.overview.unique_urls}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg SEO Score</p>
                <p className="text-2xl font-bold text-gray-900">{dashboard.overview.avg_seo_score}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg Load Time</p>
                <p className="text-2xl font-bold text-gray-900">{dashboard.performance_metrics.avg_load_time}s</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* SEO Score Trend */}
        {trends && trends.trends && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Score Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trends.trends.dates.map((date, index) => ({
                date: new Date(date).toLocaleDateString(),
                score: trends.trends.seo_scores[index]
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Load Time Trend */}
        {trends && trends.trends && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Load Time Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trends.trends.dates.map((date, index) => ({
                date: new Date(date).toLocaleDateString(),
                loadTime: trends.trends.load_times[index]
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="loadTime" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Issues Breakdown */}
      {dashboard && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues by Priority</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'High', value: dashboard.issues_breakdown.high, color: '#FF8042' },
                    { name: 'Medium', value: dashboard.issues_breakdown.medium, color: '#FFBB28' },
                    { name: 'Low', value: dashboard.issues_breakdown.low, color: '#00C49F' }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'High', value: dashboard.issues_breakdown.high, color: '#FF8042' },
                    { name: 'Medium', value: dashboard.issues_breakdown.medium, color: '#FFBB28' },
                    { name: 'Low', value: dashboard.issues_breakdown.low, color: '#00C49F' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Issues</h3>
            <div className="space-y-4">
              {dashboard.top_issues.map((issue, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{issue.issue}</h4>
                    <p className="text-sm text-gray-600">Priority: {issue.priority}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{issue.count}</p>
                    <p className="text-sm text-gray-600">occurrences</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {dashboard && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{dashboard.performance_metrics.avg_load_time}s</p>
              <p className="text-sm text-gray-600">Average Load Time</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{dashboard.performance_metrics.avg_page_size}KB</p>
              <p className="text-sm text-gray-600">Average Page Size</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{dashboard.performance_metrics.mobile_friendly_percentage}%</p>
              <p className="text-sm text-gray-600">Mobile Friendly</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">{dashboard.performance_metrics.ssl_percentage}%</p>
              <p className="text-sm text-gray-600">SSL Enabled</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}