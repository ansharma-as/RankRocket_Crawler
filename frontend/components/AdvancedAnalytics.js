'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  Target,
  Clock,
  Loader2,
  AlertCircle,
  RefreshCw,
  Activity,
  Globe,
  Zap,
  Shield,
  ArrowUp,
  ArrowDown,
  Minus,
  ScanLine,
  Brain,
  FileText
} from 'lucide-react'
import { analyticsApi, utils } from '@/services/api'

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

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-800/95 backdrop-blur-xl border border-neutral-700/50 rounded-lg p-3 shadow-2xl">
        <p className="text-white font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-[#00bf63] text-sm">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

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

  // Safe value helper to handle null/undefined values
  const safeValue = (value, defaultValue = 0) => {
    return value !== null && value !== undefined ? value : defaultValue
  }

  // Safe percentage calculation
  const safePercentage = (value, total) => {
    const safeVal = safeValue(value)
    const safeTotal = safeValue(total)
    return safeTotal > 0 ? Math.round((safeVal / safeTotal) * 100) : 0
  }

  // Get trend indicator
  const getTrendIndicator = (current, previous) => {
    const curr = safeValue(current)
    const prev = safeValue(previous)
    
    if (prev === 0) return { icon: Minus, color: 'text-gray-400', value: '0%' }
    
    const change = ((curr - prev) / prev) * 100
    
    if (change > 0) {
      return { icon: ArrowUp, color: 'text-[#00bf63]', value: `+${change.toFixed(1)}%` }
    } else if (change < 0) {
      return { icon: ArrowDown, color: 'text-red-400', value: `${change.toFixed(1)}%` }
    }
    return { icon: Minus, color: 'text-gray-400', value: '0%' }
  }

  const COLORS = ['#00bf63', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0']

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
              <div className="text-center p-8 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="h-12 w-12 rounded-full border-4 border-[#00bf63]/20 border-t-[#00bf63] mx-auto mb-4"
                />
                <h2 className="text-xl font-semibold text-white mb-2">Loading Analytics...</h2>
                <p className="text-gray-400">Processing your data and generating insights</p>
              </div>
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
                <h2 className="text-xl font-semibold text-white mb-2">Analytics Error</h2>
                <p className="text-gray-400 mb-6">{error}</p>
                <motion.button
                  onClick={fetchData}
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
                  <p className="text-xl text-gray-300">Advanced insights and performance metrics</p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
                    className="px-4 py-2 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent backdrop-blur-md"
                  >
                    <option value={7}>Last 7 days</option>
                    <option value={30}>Last 30 days</option>
                    <option value={90}>Last 90 days</option>
                  </select>
                  <motion.button
                    onClick={fetchData}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-[#00bf63]/20 border border-[#00bf63]/30 text-[#00bf63] rounded-lg hover:bg-[#00bf63]/30 transition-colors backdrop-blur-md"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Overview Stats */}
            {dashboard && (
              <motion.div 
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              >
                {[
                  {
                    icon: <ScanLine className="h-6 w-6" />,
                    title: "Total Crawls",
                    value: safeValue(dashboard.overview?.total_crawls),
                    trend: getTrendIndicator(dashboard.overview?.total_crawls, 1200),
                    color: "from-[#00bf63]/20 to-emerald-500/20",
                    textColor: "text-[#00bf63]",
                    borderColor: "border-[#00bf63]/30"
                  },
                  {
                    icon: <Globe className="h-6 w-6" />,
                    title: "Unique URLs",
                    value: safeValue(dashboard.overview?.unique_urls),
                    trend: getTrendIndicator(dashboard.overview?.unique_urls, 800),
                    color: "from-blue-500/20 to-cyan-500/20",
                    textColor: "text-blue-400",
                    borderColor: "border-blue-500/30"
                  },
                  {
                    icon: <Target className="h-6 w-6" />,
                    title: "Avg Performance Score",
                    value: safeValue(dashboard.overview?.avg_seo_score),
                    trend: getTrendIndicator(dashboard.overview?.avg_seo_score, 75),
                    color: "from-emerald-500/20 to-green-500/20",
                    textColor: "text-emerald-400",
                    borderColor: "border-emerald-500/30"
                  },
                  {
                    icon: <Clock className="h-6 w-6" />,
                    title: "Avg Load Time",
                    value: `${safeValue(dashboard.performance_metrics?.avg_load_time).toFixed(1)}s`,
                    trend: getTrendIndicator(dashboard.performance_metrics?.avg_load_time, 2.5),
                    color: "from-orange-500/20 to-red-500/20",
                    textColor: "text-orange-400",
                    borderColor: "border-orange-500/30"
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
                      <div className={`flex items-center text-sm font-medium ${stat.trend.color}`}>
                        <stat.trend.icon className="h-4 w-4 mr-1" />
                        <span>{stat.trend.value}</span>
                      </div>
                    </div>
                    <div className={`text-3xl font-bold mb-1 ${stat.textColor}`}>
                      {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.title}</div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Charts */}
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
            >
              {/* SEO Score Trend */}
              {trends && trends.trends && (
                <motion.div 
                  variants={scaleIn}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50 hover:border-[#00bf63]/50 transition-all duration-300 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <TrendingUp className="h-5 w-5 text-[#00bf63] mr-2" />
                      Performance Score Trend
                    </h3>
                    <span className="text-sm text-gray-400">{selectedPeriod} days</span>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={trends.trends.dates.map((date, index) => ({
                      date: new Date(date).toLocaleDateString(),
                      score: safeValue(trends.trends.seo_scores[index])
                    }))}>
                      <defs>
                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00bf63" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00bf63" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#00bf63" 
                        strokeWidth={2}
                        fill="url(#scoreGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              )}

              {/* Load Time Trend */}
              {trends && trends.trends && (
                <motion.div 
                  variants={scaleIn}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50 hover:border-[#00bf63]/50 transition-all duration-300 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <Clock className="h-5 w-5 text-orange-400 mr-2" />
                      Load Time Trend
                    </h3>
                    <span className="text-sm text-gray-400">{selectedPeriod} days</span>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={trends.trends.dates.map((date, index) => ({
                      date: new Date(date).toLocaleDateString(),
                      loadTime: safeValue(trends.trends.load_times[index])
                    }))}>
                      <defs>
                        <linearGradient id="loadTimeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="loadTime" 
                        stroke="#f59e0b" 
                        strokeWidth={2}
                        fill="url(#loadTimeGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              )}
            </motion.div>

            {/* Issues Breakdown */}
            {dashboard && (
              <motion.div 
                variants={staggerContainer}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
              >
                <motion.div 
                  variants={scaleIn}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50 hover:border-[#00bf63]/50 transition-all duration-300 shadow-xl"
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                    Issues by Priority
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'High', value: safeValue(dashboard.issues_breakdown?.high), color: '#ef4444' },
                          { name: 'Medium', value: safeValue(dashboard.issues_breakdown?.medium), color: '#f59e0b' },
                          { name: 'Low', value: safeValue(dashboard.issues_breakdown?.low), color: '#00bf63' }
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
                          { name: 'High', value: safeValue(dashboard.issues_breakdown?.high), color: '#ef4444' },
                          { name: 'Medium', value: safeValue(dashboard.issues_breakdown?.medium), color: '#f59e0b' },
                          { name: 'Low', value: safeValue(dashboard.issues_breakdown?.low), color: '#00bf63' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div 
                  variants={scaleIn}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50 hover:border-[#00bf63]/50 transition-all duration-300 shadow-xl"
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <FileText className="h-5 w-5 text-[#00bf63] mr-2" />
                    Top Issues
                  </h3>
                  <div className="space-y-4">
                    {dashboard.top_issues && dashboard.top_issues.length > 0 ? (
                      dashboard.top_issues.map((issue, index) => (
                        <motion.div 
                          key={index} 
                          className="flex items-center justify-between p-4 bg-neutral-700/30 rounded-lg border border-neutral-600/30 hover:border-[#00bf63]/30 transition-all"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div>
                            <h4 className="font-medium text-white">{issue.issue || 'Unknown Issue'}</h4>
                            <p className="text-sm text-gray-400">Priority: {issue.priority || 'Unknown'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-[#00bf63]">{safeValue(issue.count)}</p>
                            <p className="text-sm text-gray-400">occurrences</p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No issues data available</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Performance Metrics */}
            {dashboard && (
              <motion.div 
                variants={scaleIn}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50 hover:border-[#00bf63]/50 transition-all duration-300 shadow-xl"
              >
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                  <Activity className="h-5 w-5 text-[#00bf63] mr-2" />
                  Performance Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      value: `${safeValue(dashboard.performance_metrics?.avg_load_time).toFixed(1)}s`,
                      label: "Average Load Time",
                      icon: <Clock className="h-5 w-5" />,
                      color: "text-orange-400"
                    },
                    {
                      value: `${safeValue(dashboard.performance_metrics?.avg_page_size)}KB`,
                      label: "Average Page Size",
                      icon: <FileText className="h-5 w-5" />,
                      color: "text-blue-400"
                    },
                    {
                      value: `${safeValue(dashboard.performance_metrics?.mobile_friendly_percentage)}%`,
                      label: "Mobile Friendly",
                      icon: <Target className="h-5 w-5" />,
                      color: "text-[#00bf63]"
                    },
                    {
                      value: `${safeValue(dashboard.performance_metrics?.ssl_percentage)}%`,
                      label: "SSL Enabled",
                      icon: <Shield className="h-5 w-5" />,
                      color: "text-emerald-400"
                    }
                  ].map((metric, index) => (
                    <motion.div 
                      key={index}
                      className="text-center p-4 rounded-xl bg-neutral-700/30 border border-neutral-600/30 hover:border-[#00bf63]/30 transition-all"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 ${metric.color} mb-3`}>
                        {metric.icon}
                      </div>
                      <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
                      <p className="text-sm text-gray-400 mt-1">{metric.label}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}