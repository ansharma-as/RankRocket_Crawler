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
  Eye,
  Zap,
  Target,
  Shield,
  Clock,
  ArrowUp,
  Star,
  ChevronRight
} from 'lucide-react'
import { reportsApi, utils } from '@/services/api'

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
      const data = await reportsApi.getAllReports(page * limit, limit)
      setReports(data.reports || [])
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to fetch reports')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return utils.formatDate(dateString)
  }

  const getSeoScoreColor = (score) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 70) return 'text-yellow-400'
    if (score >= 50) return 'text-orange-400'
    return 'text-red-400'
  }

  const getSeoScoreGradient = (score) => {
    if (score >= 90) return 'from-green-500 to-emerald-500'
    if (score >= 70) return 'from-yellow-500 to-amber-500'
    if (score >= 50) return 'from-orange-500 to-red-500'
    return 'from-red-500 to-rose-500'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="loading-spinner h-12 w-12 rounded-full border-4 border-purple-500/20 border-t-purple-500 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-white mb-2">Loading your dashboard...</h2>
              <p className="text-gray-400">Please wait while we retrieve your analytics.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Error Loading Dashboard</h2>
              <p className="text-gray-400 mb-4">{error}</p>
              <button
                onClick={fetchReports}
                className="btn-primary px-6 py-3 rounded-lg hover-lift"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (reports.length === 0) {
    return (
      <div className="min-h-screen pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to <span className="gradient-text">RankRocket</span>
            </h1>
            <p className="text-xl text-gray-400">Start your SEO journey with powerful analytics and insights</p>
          </div>

          {/* Empty State */}
          <div className="text-center">
            <div className="card max-w-2xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="p-6 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/20">
                  <Zap className="h-16 w-16 text-purple-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Rocket Your SEO?</h3>
              <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                Start by analyzing your first website to unlock powerful insights, 
                track performance, and get actionable recommendations to boost your rankings.
              </p>
              <Link
                href="/"
                className="btn-primary group px-8 py-4 text-lg font-semibold rounded-xl hover-lift inline-flex items-center"
              >
                <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                Analyze Your First Website
                <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Features Preview */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <BarChart3 className="h-8 w-8 text-purple-400" />,
                  title: "Advanced Analytics",
                  description: "Get detailed insights into your website's SEO performance"
                },
                {
                  icon: <Target className="h-8 w-8 text-green-400" />,
                  title: "Smart Recommendations",
                  description: "Receive AI-powered suggestions to improve your rankings"
                },
                {
                  icon: <TrendingUp className="h-8 w-8 text-purple-400" />,
                  title: "Real-time Monitoring",
                  description: "Track your progress with live performance updates"
                }
              ].map((feature, index) => (
                <div key={index} className="card hover-lift group">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                      {feature.icon}
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const avgSeoScore = reports.length > 0 
    ? Math.round(reports.reduce((sum, r) => sum + (r.seo_score || 0), 0) / reports.length)
    : 0

  const totalRecommendations = reports.reduce((sum, r) => sum + (r.recommendations_count || 0), 0)

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold text-white mb-2">
                SEO Dashboard
              </h1>
              <p className="text-xl text-gray-400">
                Monitor and optimize your website performance
              </p>
            </div>
            <Link
              href="/"
              className="btn-primary group px-6 py-3 rounded-lg hover-lift inline-flex items-center w-fit"
            >
              <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
              New Analysis
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card hover-lift group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex items-center text-green-400 text-sm">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>+12%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{reports.length}</div>
            <div className="text-gray-400 text-sm">Total Reports</div>
          </div>

          <div className="card hover-lift group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500/20 text-green-400 group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6" />
              </div>
              <div className="flex items-center text-green-400 text-sm">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>+8%</span>
              </div>
            </div>
            <div className={`text-3xl font-bold mb-1 ${getSeoScoreColor(avgSeoScore)}`}>
              {avgSeoScore}
            </div>
            <div className="text-gray-400 text-sm">Avg SEO Score</div>
          </div>

          <div className="card hover-lift group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="flex items-center text-green-400 text-sm">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>+15%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalRecommendations}</div>
            <div className="text-gray-400 text-sm">Total Recommendations</div>
          </div>

          <div className="card hover-lift group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-orange-500/20 text-orange-400 group-hover:scale-110 transition-transform">
                <Clock className="h-6 w-6" />
              </div>
              <div className="flex items-center text-green-400 text-sm">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>+5%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {reports.length > 0 ? formatDate(reports[0].crawled_at).split(',')[0] : 'N/A'}
            </div>
            <div className="text-gray-400 text-sm">Latest Analysis</div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Reports</h2>
            <div className="text-sm text-gray-400">
              {reports.length} report{reports.length !== 1 ? 's' : ''} found
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reports.map((report, index) => (
              <div
                key={report.submission_id}
                className="card hover-lift group transition-all duration-300"
                style={{
                  animationDelay: `${index * 100}ms`,
                  transform: 'translateY(20px)',
                  opacity: 0,
                  animation: 'slideUp 0.6s ease forwards'
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white truncate mb-1 group-hover:text-purple-300 transition-colors">
                      {report.url}
                    </h3>
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(report.crawled_at)}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      Completed
                    </span>
                  </div>
                </div>

                {/* Score Circle */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${(report.seo_score || 0) * 2.51} 251.2`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" className={`stop-color-purple-400`} />
                          <stop offset="100%" className={`stop-color-purple-600`} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getSeoScoreColor(report.seo_score || 0)}`}>
                          {report.seo_score || 0}
                        </div>
                        <div className="text-xs text-gray-400">Score</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                    <div className="text-2xl font-bold text-white">{report.recommendations_count || 0}</div>
                    <div className="text-sm text-gray-400">Issues Found</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-2xl font-bold text-white">4.2</span>
                    </div>
                    <div className="text-sm text-gray-400">Performance</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <Link
                    href={`/report/${report.submission_id}`}
                    className="flex items-center px-4 py-2 bg-purple-500/20 text-purple-400 text-sm font-medium rounded-lg hover:bg-purple-500/30 transition-all group/button"
                  >
                    <Eye className="h-4 w-4 mr-2 group-hover/button:scale-110 transition-transform" />
                    View Report
                  </Link>
                  
                  <a
                    href={report.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-3 py-2 text-gray-400 text-sm hover:text-white transition-colors group/link"
                  >
                    <ExternalLink className="h-4 w-4 mr-1 group-hover/link:scale-110 transition-transform" />
                    Visit Site
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Load More */}
        {reports.length >= limit && (
          <div className="text-center">
            <button
              onClick={() => setPage(p => p + 1)}
              className="glass px-6 py-3 text-white rounded-lg hover:bg-white/10 transition-all hover-lift"
            >
              Load More Reports
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* Add this to your globals.css */
const additionalStyles = `
@keyframes slideUp {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
`