'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
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
  ChevronRight,
  Activity,
  Globe,
  ScanLine,
  Brain,
  RefreshCw,
  X
} from 'lucide-react'
import { reportsApi, utils } from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner'
import URLSubmissionForm from '@/components/URLSubmissionForm'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.25, 0.25, 0, 1]
    }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5,
      ease: [0.25, 0.25, 0, 1]
    }
  }
}

export default function Dashboard() {
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
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
    if (score >= 90) return 'text-[#00bf63]'
    if (score >= 70) return 'text-yellow-400'
    if (score >= 50) return 'text-orange-400'
    return 'text-red-400'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Video Background */}
        <div className="fixed inset-0 -z-20">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-neutral-900/90"></div>
        </div>

        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="flex items-center justify-center min-h-96"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <LoadingSpinner 
                color="#00bf63"
                size={40}
                text="Loading Dashboard..."
                showText={true}
                className="p-8 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50"
              />
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Video Background */}
        <div className="fixed inset-0 -z-20">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-neutral-900/90"></div>
        </div>

        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="flex items-center justify-center min-h-96"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center p-8 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-red-500/20 max-w-md">
                <div className="p-4 rounded-full bg-red-500/20 border border-red-500/30 w-fit mx-auto mb-6">
                  <AlertCircle className="h-8 w-8 text-red-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Dashboard Error</h2>
                <p className="text-gray-400 mb-6">{error}</p>
                <motion.button
                  onClick={fetchReports}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-[#00bf63] to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00bf63]/25 transition-all duration-300 flex items-center mx-auto"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  if (reports.length === 0) {
    return (
      <div className="min-h-screen relative overflow-hidden py-20">
        {/* Video Background */}
        <div className="fixed inset-0 -z-20">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-neutral-900/90"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#00bf63]/10 rounded-full blur-3xl"
          />
        </div>

        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {/* Header */}
              <motion.div variants={fadeInUp} className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00bf63] to-emerald-400">RankRocket AI</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Start your AI-powered website analysis journey with comprehensive insights and optimization recommendations
                </p>
              </motion.div>

              {/* Empty State */}
              <motion.div variants={fadeInUp} className="text-center">
                <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50 shadow-2xl">
                  <div className="flex justify-center mb-6">
                    <motion.div 
                      className="p-6 rounded-2xl bg-gradient-to-br from-[#00bf63]/20 to-emerald-500/20 border border-[#00bf63]/30"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Brain className="h-16 w-16 text-[#00bf63]" />
                    </motion.div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Ready to Analyze Your Website?</h3>
                  <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                    Start by submitting your first website URL to unlock powerful AI-driven insights, 
                    comprehensive performance analysis, and actionable optimization strategies.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      console.log('Start Your First Analysis clicked!')
                      setShowSubmissionForm(true)
                    }}
                    className="group px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-[#00bf63] to-emerald-500 text-white hover:shadow-lg hover:shadow-[#00bf63]/25 transition-all duration-300 inline-flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                    Start Your First Analysis
                    <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>

                {/* Features Preview */}
                <motion.div 
                  variants={staggerContainer}
                  className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                  {[
                    {
                      icon: <ScanLine className="h-8 w-8 text-[#00bf63]" />,
                      title: "Deep Website Crawling",
                      description: "Comprehensive analysis of every page, asset, and element on your website"
                    },
                    {
                      icon: <Brain className="h-8 w-8 text-blue-400" />,
                      title: "AI-Powered Insights",
                      description: "Machine learning algorithms provide intelligent recommendations and analysis"
                    },
                    {
                      icon: <TrendingUp className="h-8 w-8 text-emerald-400" />,
                      title: "Performance Tracking",
                      description: "Monitor your optimization progress with detailed metrics and reports"
                    }
                  ].map((feature, index) => (
                    <motion.div 
                      key={index}
                      variants={scaleIn}
                      whileHover={{ y: -10, scale: 1.02 }}
                      className="p-6 rounded-2xl bg-neutral-800/30 backdrop-blur-md border border-neutral-700/50 hover:border-[#00bf63]/30 transition-all duration-300 group"
                    >
                      <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                          {feature.icon}
                        </div>
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                      <p className="text-gray-400">{feature.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
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
    <div className="min-h-screen relative overflow-hidden py-20">
      {/* Video Background */}
      <div className="fixed inset-0 -z-20">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-neutral-900/90"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#00bf63]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 30, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#00bf63]/10 rounded-full blur-3xl"
        />
      </div>

      <div className="pt-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Header */}
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Analysis Dashboard
                  </h1>
                  <p className="text-xl text-gray-300">
                    Monitor and optimize your website performance with AI insights
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    console.log('New Analysis clicked!')
                    setShowSubmissionForm(true)
                  }}
                  className="group px-6 py-3 rounded-lg bg-gradient-to-r from-[#00bf63] to-emerald-500 text-white font-semibold hover:shadow-lg hover:shadow-[#00bf63]/25 transition-all duration-300 inline-flex items-center w-fit"
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                  New Analysis
                </motion.button>
              </div>
            </motion.div>

            {/* Stats Overview */}
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {[
                {
                  icon: <FileText className="h-6 w-6" />,
                  title: "Total Reports",
                  value: reports.length,
                  change: "+12%",
                  color: "from-[#00bf63]/20 to-emerald-500/20",
                  textColor: "text-[#00bf63]",
                  borderColor: "border-[#00bf63]/30"
                },
                {
                  icon: <Target className="h-6 w-6" />,
                  title: "Avg Performance Score",
                  value: avgSeoScore,
                  change: "+8%",
                  color: "from-blue-500/20 to-cyan-500/20",
                  textColor: getSeoScoreColor(avgSeoScore),
                  borderColor: "border-blue-500/30"
                },
                {
                  icon: <TrendingUp className="h-6 w-6" />,
                  title: "Total Issues Found",
                  value: totalRecommendations,
                  change: "+15%",
                  color: "from-orange-500/20 to-red-500/20",
                  textColor: "text-orange-400",
                  borderColor: "border-orange-500/30"
                },
                {
                  icon: <Clock className="h-6 w-6" />,
                  title: "Latest Analysis",
                  value: reports.length > 0 ? formatDate(reports[0].crawled_at).split(',')[0] : 'N/A',
                  change: "+5%",
                  color: "from-purple-500/20 to-pink-500/20",
                  textColor: "text-purple-400",
                  borderColor: "border-purple-500/30"
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`p-6 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border ${stat.borderColor} hover:border-[#00bf63]/50 transition-all duration-300 group shadow-xl`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} ${stat.textColor} group-hover:scale-110 transition-transform border ${stat.borderColor}`}>
                      {stat.icon}
                    </div>
                    <div className="flex items-center text-[#00bf63] text-sm font-medium">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <div className={`text-3xl font-bold mb-1 ${stat.textColor}`}>
                    {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.title}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Reports Grid */}
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Recent Analyses</h2>
                <div className="text-sm text-gray-400">
                  {reports.length} report{reports.length !== 1 ? 's' : ''} found
                </div>
              </div>

              <motion.div 
                variants={staggerContainer}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {reports.map((report, index) => (
                  <motion.div
                    key={report.submission_id}
                    variants={scaleIn}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="p-6 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50 hover:border-[#00bf63]/50 transition-all duration-300 group shadow-xl"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white truncate mb-1 group-hover:text-[#00bf63] transition-colors">
                          {report.url}
                        </h3>
                        <div className="flex items-center text-sm text-gray-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(report.crawled_at)}</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#00bf63]/20 text-[#00bf63] border border-[#00bf63]/30">
                          <div className="w-2 h-2 bg-[#00bf63] rounded-full mr-2 animate-pulse"></div>
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
                              <stop offset="0%" stopColor="#00bf63" />
                              <stop offset="100%" stopColor="#10b981" />
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
                      <div className="text-center p-3 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors border border-white/10">
                        <div className="text-2xl font-bold text-white">{report.recommendations_count || 0}</div>
                        <div className="text-sm text-gray-400">Issues Found</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors border border-white/10">
                        <div className="flex items-center justify-center mb-1">
                          <Activity className="h-4 w-4 text-[#00bf63] mr-1" />
                          <span className="text-2xl font-bold text-white">4.2</span>
                        </div>
                        <div className="text-sm text-gray-400">Performance</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          href={`/report/${report.submission_id}`}
                          className="flex items-center px-4 py-2 bg-[#00bf63]/20 text-[#00bf63] text-sm font-medium rounded-lg hover:bg-[#00bf63]/30 transition-all border border-[#00bf63]/30 group/button"
                        >
                          <Eye className="h-4 w-4 mr-2 group-hover/button:scale-110 transition-transform" />
                          View Report
                        </Link>
                      </motion.div>
                      
                      <motion.a
                        href={report.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center px-3 py-2 text-gray-400 text-sm hover:text-white transition-colors group/link"
                      >
                        <ExternalLink className="h-4 w-4 mr-1 group-hover/link:scale-110 transition-transform" />
                        Visit Site
                      </motion.a>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Load More */}
            {reports.length >= limit && (
              <motion.div 
                variants={fadeInUp}
                className="text-center"
              >
                <motion.button
                  onClick={() => setPage(p => p + 1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 text-white rounded-lg bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50 hover:border-[#00bf63]/50 hover:bg-neutral-700/40 transition-all"
                >
                  Load More Reports
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Debug Test Button */}
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={() => {
            console.log('Test button clicked, current state:', showSubmissionForm)
            setShowSubmissionForm(!showSubmissionForm)
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Toggle Modal (Debug)
        </button>
      </div>

      {/* URL Submission Form Modal */}
      {console.log('showSubmissionForm state:', showSubmissionForm)}
      <AnimatePresence>
      {showSubmissionForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowSubmissionForm(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Start Your SEO Analysis</h2>
              <button
                onClick={() => setShowSubmissionForm(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-neutral-800/50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <URLSubmissionForm 
              onSuccess={() => {
                setShowSubmissionForm(false)
                fetchReports() // Refresh reports after submission
              }}
            />
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  )
}