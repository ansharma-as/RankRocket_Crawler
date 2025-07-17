'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  Target, 
  AlertCircle,
  CheckCircle,
  Loader2,
  Plus,
  Trash2,
  Edit,
  Play,
  Pause,
  X,
  RefreshCw,
  Activity,
  Globe,
  Zap,
  ArrowUp
} from 'lucide-react'
import { advancedApi, utils } from '@/services/api'

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

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.3,
      ease: [0.25, 0.25, 0, 1]
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: { 
      duration: 0.2 
    }
  }
}

export default function ScheduledCrawls() {
  const [scheduledCrawls, setScheduledCrawls] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [newCrawl, setNewCrawl] = useState({
    url: '',
    priority: 'medium',
    frequency: 'daily'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [crawls, stats] = await Promise.all([
        advancedApi.getScheduledCrawls(),
        advancedApi.getCrawlStatistics()
      ])
      setScheduledCrawls(crawls.scheduled_crawls || [])
      setStatistics(stats)
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to fetch scheduled crawls')
    } finally {
      setIsLoading(false)
    }
  }

  const handleScheduleCrawl = async (e) => {
    e.preventDefault()
    try {
      await advancedApi.scheduleCrawl(newCrawl.url, newCrawl.priority, newCrawl.frequency)
      setNewCrawl({ url: '', priority: 'medium', frequency: 'daily' })
      setShowScheduleForm(false)
      fetchData()
    } catch (err) {
      setError(err.message || 'Failed to schedule crawl')
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-[#00bf63]/20 text-[#00bf63] border-[#00bf63]/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'completed': return 'bg-[#00bf63]/20 text-[#00bf63] border-[#00bf63]/30'
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'processing': return <Loader2 className="h-4 w-4 animate-spin" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'failed': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
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
              <div className="text-center p-8 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="h-12 w-12 rounded-full border-4 border-[#00bf63]/20 border-t-[#00bf63] mx-auto mb-4"
                />
                <h2 className="text-xl font-semibold text-white mb-2">Loading Scheduled Crawls...</h2>
                <p className="text-gray-400">Retrieving your automation settings</p>
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
                <h2 className="text-xl font-semibold text-white mb-2">Error Loading Data</h2>
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
                  <h1 className="text-4xl font-bold text-white mb-2">Scheduled Crawls</h1>
                  <p className="text-xl text-gray-300">Automate your website analysis and monitoring</p>
                </div>
                <motion.button
                  onClick={() => setShowScheduleForm(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 sm:mt-0 group px-6 py-3 bg-gradient-to-r from-[#00bf63] to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00bf63]/25 transition-all duration-300 inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                  Schedule New Crawl
                </motion.button>
              </div>
            </motion.div>

            {/* Statistics */}
            {statistics && (
              <motion.div 
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
              >
                {[
                  {
                    icon: <Clock className="h-6 w-6" />,
                    title: "Scheduled",
                    value: statistics.scheduled || 0,
                    color: "from-yellow-500/20 to-amber-500/20",
                    textColor: "text-yellow-400",
                    borderColor: "border-yellow-500/30"
                  },
                  {
                    icon: <Activity className="h-6 w-6" />,
                    title: "Processing",
                    value: statistics.processing || 0,
                    color: "from-blue-500/20 to-cyan-500/20",
                    textColor: "text-blue-400",
                    borderColor: "border-blue-500/30"
                  },
                  {
                    icon: <CheckCircle className="h-6 w-6" />,
                    title: "Completed",
                    value: statistics.completed || 0,
                    color: "from-[#00bf63]/20 to-emerald-500/20",
                    textColor: "text-[#00bf63]",
                    borderColor: "border-[#00bf63]/30"
                  },
                  {
                    icon: <AlertCircle className="h-6 w-6" />,
                    title: "Failed",
                    value: statistics.failed || 0,
                    color: "from-red-500/20 to-rose-500/20",
                    textColor: "text-red-400",
                    borderColor: "border-red-500/30"
                  },
                  {
                    icon: <Target className="h-6 w-6" />,
                    title: "Queue Size",
                    value: statistics.queue_size || 0,
                    color: "from-purple-500/20 to-violet-500/20",
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
                        <span>+5%</span>
                      </div>
                    </div>
                    <div className={`text-3xl font-bold mb-1 ${stat.textColor}`}>
                      {stat.value.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.title}</div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Schedule Form Modal */}
            <AnimatePresence>
              {showScheduleForm && (
                <motion.div 
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowScheduleForm(false)}
                >
                  <motion.div 
                    className="bg-neutral-800/95 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">Schedule New Crawl</h3>
                      <motion.button
                        onClick={() => setShowScheduleForm(false)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-neutral-700/50 text-gray-400 hover:text-white hover:bg-neutral-600/50 transition-all"
                      >
                        <X className="h-4 w-4" />
                      </motion.button>
                    </div>
                    
                    <div onSubmit={handleScheduleCrawl} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Website URL</label>
                        <input
                          type="url"
                          value={newCrawl.url}
                          onChange={(e) => setNewCrawl({ ...newCrawl, url: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent transition-all"
                          placeholder="https://example.com"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Priority Level</label>
                        <select
                          value={newCrawl.priority}
                          onChange={(e) => setNewCrawl({ ...newCrawl, priority: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent transition-all"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Crawl Frequency</label>
                        <select
                          value={newCrawl.frequency}
                          onChange={(e) => setNewCrawl({ ...newCrawl, frequency: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-700/50 border border-neutral-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#00bf63] focus:border-transparent transition-all"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      
                      <div className="flex justify-end space-x-3 pt-4">
                        <motion.button
                          type="button"
                          onClick={() => setShowScheduleForm(false)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-3 text-gray-300 bg-neutral-700/50 border border-neutral-600/50 rounded-lg hover:bg-neutral-600/50 hover:text-white transition-all"
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          onClick={handleScheduleCrawl}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-3 bg-gradient-to-r from-[#00bf63] to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00bf63]/25 transition-all"
                        >
                          Schedule Crawl
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scheduled Crawls List */}
            <motion.div 
              variants={fadeInUp}
              className="rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50 shadow-xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-neutral-700/50">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Calendar className="h-5 w-5 text-[#00bf63] mr-2" />
                  Scheduled Crawls
                </h3>
              </div>
              
              {scheduledCrawls.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="p-6 rounded-2xl bg-neutral-700/30 border border-neutral-600/30 w-fit mx-auto mb-6">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Scheduled Crawls</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Set up automated website analysis to monitor your site's performance continuously
                  </p>
                  <motion.button
                    onClick={() => setShowScheduleForm(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group px-6 py-3 bg-gradient-to-r from-[#00bf63] to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00bf63]/25 transition-all duration-300 inline-flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                    Schedule First Crawl
                  </motion.button>
                </div>
              ) : (
                <div className="divide-y divide-neutral-700/50">
                  {scheduledCrawls.map((crawl, index) => (
                    <motion.div 
                      key={crawl._id}
                      className="p-6 hover:bg-neutral-700/20 transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-semibold text-white truncate mb-2 group-hover:text-[#00bf63] transition-colors">
                            {crawl.url}
                          </h4>
                          <div className="flex items-center space-x-6 text-sm text-gray-400">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              Next: {utils.formatDate(crawl.next_crawl)}
                            </span>
                            <span className="flex items-center capitalize">
                              <Clock className="h-4 w-4 mr-2" />
                              Frequency: {crawl.frequency}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 ml-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(crawl.priority)}`}>
                            {crawl.priority}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(crawl.status)}`}>
                            {getStatusIcon(crawl.status)}
                            <span className="ml-2 capitalize">{crawl.status}</span>
                          </span>
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg bg-neutral-700/50 text-gray-400 hover:text-[#00bf63] hover:bg-neutral-600/50 transition-all"
                            >
                              <Edit className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg bg-neutral-700/50 text-gray-400 hover:text-red-400 hover:bg-neutral-600/50 transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}