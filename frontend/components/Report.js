// 'use client'

// import { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { 
//   ArrowLeft,
//   Download,
//   Share2,
//   RefreshCw,
//   AlertCircle,
//   CheckCircle,
//   Globe,
//   Clock,
//   Target,
//   TrendingUp,
//   TrendingDown,
//   Zap,
//   Shield,
//   Eye,
//   Users,
//   FileText,
//   ExternalLink,
//   Calendar,
//   Activity,
//   BarChart3,
//   Brain,
//   ScanLine,
//   Gauge,
//   AlertTriangle,
//   Info,
//   ChevronRight,
//   Star
// } from 'lucide-react'
// import Link from 'next/link'
// import { 
//   BarChart, 
//   Bar, 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
//   AreaChart,
//   Area
// } from 'recharts'

// const fadeInUp = {
//   hidden: { opacity: 0, y: 30 },
//   visible: { 
//     opacity: 1, 
//     y: 0,
//     transition: { 
//       duration: 0.6, 
//       ease: [0.25, 0.25, 0, 1]
//     }
//   }
// }

// const staggerContainer = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//       delayChildren: 0.2
//     }
//   }
// }

// const scaleIn = {
//   hidden: { opacity: 0, scale: 0.9 },
//   visible: { 
//     opacity: 1, 
//     scale: 1,
//     transition: { 
//       duration: 0.5,
//       ease: [0.25, 0.25, 0, 1]
//     }
//   }
// }

// // Custom Tooltip Component
// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-neutral-800/95 backdrop-blur-xl border border-neutral-700/50 rounded-lg p-3 shadow-2xl">
//         <p className="text-white font-medium">{label}</p>
//         {payload.map((entry, index) => (
//           <p key={index} className="text-[#00bf63] text-sm">
//             {entry.name}: {entry.value}
//           </p>
//         ))}
//       </div>
//     )
//   }
//   return null
// }

// export default function Report({ submissionId }) {
//   const [report, setReport] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     fetchReport()
//   }, [submissionId])

//   const fetchReport = async () => {
//     try {
//       setIsLoading(true)
//       // Replace with your actual API call
//       const response = await fetch(`/api/v1/report/${submissionId}`)
//       if (!response.ok) throw new Error('Failed to fetch report')
//       const data = await response.json()
//       setReport(data)
//       setError(null)
//     } catch (err) {
//       setError(err.message || 'Failed to load report')
//       // Mock data for demonstration
//       setReport({
//         url: 'https://example.com',
//         crawled_at: new Date().toISOString(),
//         seo_score: 87,
//         performance_score: 92,
//         accessibility_score: 78,
//         best_practices_score: 85,
//         load_time: 1.2,
//         page_size: 2048,
//         requests: 45,
//         issues: [
//           { type: 'Critical', title: 'Missing meta description', description: 'Add meta descriptions for better SEO', priority: 'high' },
//           { type: 'Warning', title: 'Image alt tags missing', description: '12 images are missing alt text', priority: 'medium' },
//           { type: 'Info', title: 'Consider lazy loading', description: 'Implement lazy loading for images', priority: 'low' }
//         ],
//         recommendations: [
//           { title: 'Optimize Images', impact: 'High', effort: 'Medium', description: 'Compress and optimize images to reduce page load time' },
//           { title: 'Minify CSS/JS', impact: 'Medium', effort: 'Low', description: 'Remove unnecessary whitespace and comments' },
//           { title: 'Enable Gzip', impact: 'High', effort: 'Low', description: 'Enable server-side compression' }
//         ],
//         technical_metrics: {
//           mobile_friendly: true,
//           ssl_enabled: true,
//           responsive: true,
//           structured_data: false
//         },
//         content_analysis: {
//           word_count: 1250,
//           heading_structure: { h1: 1, h2: 4, h3: 8 },
//           internal_links: 23,
//           external_links: 7
//         }
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const getScoreColor = (score) => {
//     if (score >= 90) return 'text-[#00bf63]'
//     if (score >= 70) return 'text-yellow-400'
//     if (score >= 50) return 'text-orange-400'
//     return 'text-red-400'
//   }

//   const getScoreGradient = (score) => {
//     if (score >= 90) return 'from-[#00bf63] to-emerald-400'
//     if (score >= 70) return 'from-yellow-400 to-amber-400'
//     if (score >= 50) return 'from-orange-400 to-red-400'
//     return 'from-red-400 to-rose-400'
//   }

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30'
//       case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
//       case 'low': return 'bg-[#00bf63]/20 text-[#00bf63] border-[#00bf63]/30'
//       default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
//     }
//   }

//   const getImpactColor = (impact) => {
//     switch (impact.toLowerCase()) {
//       case 'high': return 'text-[#00bf63]'
//       case 'medium': return 'text-yellow-400'
//       case 'low': return 'text-orange-400'
//       default: return 'text-gray-400'
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen relative overflow-hidden">
//         {/* Video Background */}
//         <div className="fixed inset-0 -z-20">
//           <video
//             autoPlay
//             muted
//             loop
//             playsInline
//             className="absolute inset-0 w-full h-full object-cover"
//           >
//             <source src="" type="video/mp4" />
//           </video>
//           <div className="absolute inset-0 bg-neutral-900/90"></div>
//         </div>

//         <div className="pt-20 px-4 sm:px-6 lg:px-8">
//           <div className="max-w-7xl mx-auto">
//             <motion.div 
//               className="flex items-center justify-center min-h-96"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.6 }}
//             >
//               <div className="text-center p-8 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50">
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                   className="h-12 w-12 rounded-full border-4 border-[#00bf63]/20 border-t-[#00bf63] mx-auto mb-4"
//                 />
//                 <h2 className="text-xl font-semibold text-white mb-2">Loading Report...</h2>
//                 <p className="text-gray-400">Analyzing your website data</p>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (error && !report) {
//     return (
//       <div className="min-h-screen relative overflow-hidden">
//         {/* Video Background */}
//         <div className="fixed inset-0 -z-20">
//           <video
//             autoPlay
//             muted
//             loop
//             playsInline
//             className="absolute inset-0 w-full h-full object-cover"
//           >
//             <source src="" type="video/mp4" />
//           </video>
//           <div className="absolute inset-0 bg-neutral-900/90"></div>
//         </div>

//         <div className="pt-20 px-4 sm:px-6 lg:px-8">
//           <div className="max-w-7xl mx-auto">
//             <motion.div 
//               className="flex items-center justify-center min-h-96"
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.6 }}
//             >
//               <div className="text-center p-8 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-red-500/20 max-w-md">
//                 <div className="p-4 rounded-full bg-red-500/20 border border-red-500/30 w-fit mx-auto mb-6">
//                   <AlertCircle className="h-8 w-8 text-red-400" />
//                 </div>
//                 <h2 className="text-xl font-semibold text-white mb-2">Report Not Found</h2>
//                 <p className="text-gray-400 mb-6">{error}</p>
//                 <motion.button
//                   onClick={fetchReport}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="px-6 py-3 bg-gradient-to-r from-[#00bf63] to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00bf63]/25 transition-all duration-300 flex items-center mx-auto"
//                 >
//                   <RefreshCw className="h-4 w-4 mr-2" />
//                   Try Again
//                 </motion.button>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       {/* Video Background */}
//       <div className="fixed inset-0 -z-20">
//         <video
//           autoPlay
//           muted
//           loop
//           playsInline
//           className="absolute inset-0 w-full h-full object-cover"
//         >
//           <source src="" type="video/mp4" />
//         </video>
//         <div className="absolute inset-0 bg-neutral-900/90"></div>
//       </div>

//       {/* Animated Background Elements */}
//       <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
//         <motion.div
//           animate={{ 
//             x: [0, 100, 0],
//             y: [0, -50, 0],
//             scale: [1, 1.1, 1]
//           }}
//           transition={{
//             duration: 20,
//             repeat: Infinity,
//             repeatType: "reverse"
//           }}
//           className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#00bf63]/10 rounded-full blur-3xl"
//         />
//         <motion.div
//           animate={{ 
//             x: [0, -80, 0],
//             y: [0, 30, 0],
//             scale: [1, 0.9, 1]
//           }}
//           transition={{
//             duration: 25,
//             repeat: Infinity,
//             repeatType: "reverse"
//           }}
//           className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#00bf63]/10 rounded-full blur-3xl"
//         />
//       </div>

//       <div className="pt-20 px-4 sm:px-6 lg:px-8 relative z-10">
//         <div className="max-w-7xl mx-auto">
//           <motion.div
//             initial="hidden"
//             animate="visible"
//             variants={staggerContainer}
//           >
//             {/* Header */}
//             <motion.div variants={fadeInUp} className="mb-8">
//               <div className="flex items-center justify-between mb-6">
//                 <Link 
//                   href="/dashboard"
//                   className="inline-flex items-center text-gray-400 hover:text-[#00bf63] transition-colors group"
//                 >
//                   <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
//                   Back to Dashboard
//                 </Link>
                
//                 <div className="flex items-center space-x-3">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="px-4 py-2 bg-neutral-800/50 border border-neutral-700/50 text-gray-300 rounded-lg hover:bg-neutral-700/50 hover:text-white transition-all backdrop-blur-md flex items-center"
//                   >
//                     <Share2 className="h-4 w-4 mr-2" />
//                     Share
//                   </motion.button>
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="px-4 py-2 bg-gradient-to-r from-[#00bf63] to-emerald-500 text-white rounded-lg hover:shadow-lg hover:shadow-[#00bf63]/25 transition-all flex items-center"
//                   >
//                     <Download className="h-4 w-4 mr-2" />
//                     Export PDF
//                   </motion.button>
//                 </div>
//               </div>

//               <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
//                 <div>
//                   <h1 className="text-4xl font-bold text-white mb-2">Analysis Report</h1>
//                   <div className="flex items-center space-x-4 text-gray-300">
//                     <span className="flex items-center">
//                       <Globe className="h-4 w-4 mr-2" />
//                       {report.url}
//                     </span>
//                     <span className="flex items-center">
//                       <Calendar className="h-4 w-4 mr-2" />
//                       {new Date(report.crawled_at).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Overall Score */}
//                 <div className="flex items-center justify-center">
//                   <div className="relative w-32 h-32">
//                     <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
//                       <circle
//                         cx="50"
//                         cy="50"
//                         r="40"
//                         stroke="rgba(255,255,255,0.1)"
//                         strokeWidth="8"
//                         fill="transparent"
//                       />
//                       <circle
//                         cx="50"
//                         cy="50"
//                         r="40"
//                         stroke="url(#gradient)"
//                         strokeWidth="8"
//                         fill="transparent"
//                         strokeDasharray={`${report.seo_score * 2.51} 251.2`}
//                         strokeLinecap="round"
//                         className="transition-all duration-1000 ease-out"
//                       />
//                       <defs>
//                         <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                           <stop offset="0%" stopColor="#00bf63" />
//                           <stop offset="100%" stopColor="#10b981" />
//                         </linearGradient>
//                       </defs>
//                     </svg>
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="text-center">
//                         <div className={`text-3xl font-bold ${getScoreColor(report.seo_score)}`}>
//                           {report.seo_score}
//                         </div>
//                         <div className="text-xs text-gray-400">Overall Score</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Score Cards */}
//             <motion.div 
//               variants={staggerContainer}
//               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
//             >
//               {[
//                 { title: 'Performance', score: report.performance_score, icon: <Zap className="h-6 w-6" /> },
//                 { title: 'SEO', score: report.seo_score, icon: <Target className="h-6 w-6" /> },
//                 { title: 'Accessibility', score: report.accessibility_score, icon: <Eye className="h-6 w-6" /> },
//                 { title: 'Best Practices', score: report.best_practices_score, icon: <Shield className="h-6 w-6" /> }
//               ].map((metric, index) => (
//                 <motion.div
//                   key={index}
//                   variants={scaleIn}
//                   whileHover={{ y: -10, scale: 1.02 }}
//                   className="p-6 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50 hover:border-[#00bf63]/50 transition-all duration-300 group shadow-xl"
//                 >
//                   <div className="flex items-center justify-between mb-4">
//                     <div className={`p-3 rounded-xl bg-gradient-to-r ${getScoreGradient(metric.score)}/20 text-${getScoreColor(metric.score).replace('text-', '')} group-hover:scale-110 transition-transform border border-${getScoreColor(metric.score).replace('text-', '')}/30`}>
//                       {metric.icon}
//                     </div>
//                     <div className={`text-3xl font-bold ${getScoreColor(metric.score)}`}>
//                       {metric.score}
//                     </div>
//                   </div>
//                   <h3 className="text-white font-semibold">{metric.title}</h3>
//                   <div className="w-full bg-neutral-700 rounded-full h-2 mt-3">
//                     <motion.div 
//                       className={`bg-gradient-to-r ${getScoreGradient(metric.score)} h-2 rounded-full`}
//                       initial={{ width: 0 }}
//                       animate={{ width: `${metric.score}%` }}
//                       transition={{ duration: 1, delay: index * 0.2 }}
//                     />
//                   </div>
//                 </motion.div>
//               ))}
//             </motion.div>

//             {/* Key Metrics */}
//             <motion.div 
//               variants={fadeInUp}
//               className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
//             >
//               {/* Performance Metrics */}
//               <div className="p-6 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50 shadow-xl">
//                 <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
//                   <Activity className="h-5 w-5 text-[#00bf63] mr-2" />
//                   Performance Metrics
//                 </h3>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <span className="text-gray-400">Load Time</span>
//                     <span className="text-white font-semibold">{report.load_time}s</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-gray-400">Page Size</span>
//                     <span className="text-white font-semibold">{(report.page_size / 1024).toFixed(1)}MB</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-gray-400">Requests</span>
//                     <span className="text-white font-semibold">{report.requests}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Technical Status */}
//               <div className="p-6 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50 shadow-xl">
//                 <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
//                   <Shield className="h-5 w-5 text-[#00bf63] mr-2" />
//                   Technical Status
//                 </h3>
//                 <div className="space-y-3">
//                   {[
//                     { label: 'Mobile Friendly', status: report.technical_metrics.mobile_friendly },
//                     { label: 'SSL Enabled', status: report.technical_metrics.ssl_enabled },
//                     { label: 'Responsive Design', status: report.technical_metrics.responsive },
//                     { label: 'Structured Data', status: report.technical_metrics.structured_data }
//                   ].map((item, index) => (
//                     <div key={index} className="flex items-center justify-between">
//                       <span className="text-gray-400">{item.label}</span>
//                       <div className="flex items-center">
//                         {item.status ? (
//                           <CheckCircle className="h-4 w-4 text-[#00bf63]" />
//                         ) : (
//                           <AlertCircle className="h-4 w-4 text-red-400" />
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Content Analysis */}
//               <div className="p-6 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50 shadow-xl">
//                 <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
//                   <FileText className="h-5 w-5 text-[#00bf63] mr-2" />
//                   Content Analysis
//                 </h3>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <span className="text-gray-400">Word Count</span>
//                     <span className="text-white font-semibold">{report.content_analysis.word_count.toLocaleString()}</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-gray-400">Internal Links</span>
//                     <span className="text-white font-semibold">{report.content_analysis.internal_links}</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-gray-400">External Links</span>
//                     <span className="text-white font-semibold">{report.content_analysis.external_links}</span>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Issues and Recommendations */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//               {/* Issues */}
//               <motion.div 
//                 variants={fadeInUp}
//                 className="p-6 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50 shadow-xl"
//               >
//                 <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
//                   <AlertTriangle className="h-5 w-5 text-orange-400 mr-2" />
//                   Issues Found ({report.issues.length})
//                 </h3>
//                 <div className="space-y-4">
//                   {report.issues.map((issue, index) => (
//                     <motion.div 
//                       key={index}
//                       className="p-4 rounded-xl bg-neutral-700/30 border border-neutral-600/30 hover:border-[#00bf63]/30 transition-all"
//                       whileHover={{ scale: 1.02 }}
//                     >
//                       <div className="flex items-start justify-between mb-2">
//                         <h4 className="font-semibold text-white">{issue.title}</h4>
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(issue.priority)}`}>
//                           {issue.priority}
//                         </span>
//                       </div>
//                       <p className="text-gray-400 text-sm">{issue.description}</p>
//                     </motion.div>
//                   ))}
//                 </div>
//               </motion.div>

//               {/* Recommendations */}
//               <motion.div 
//                 variants={fadeInUp}
//                 className="p-6 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50 shadow-xl"
//               >
//                 <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
//                   <Brain className="h-5 w-5 text-[#00bf63] mr-2" />
//                   AI Recommendations ({report.recommendations.length})
//                 </h3>
//                 <div className="space-y-4">
//                   {report.recommendations.map((rec, index) => (
//                     <motion.div 
//                       key={index}
//                       className="p-4 rounded-xl bg-neutral-700/30 border border-neutral-600/30 hover:border-[#00bf63]/30 transition-all"
//                       whileHover={{ scale: 1.02 }}
//                     >
//                       <div className="flex items-start justify-between mb-2">
//                         <h4 className="font-semibold text-white">{rec.title}</h4>
//                         <div className="flex items-center space-x-2 text-xs">
//                           <span className={`${getImpactColor(rec.impact)} font-medium`}>
//                             {rec.impact} Impact
//                           </span>
//                           <span className="text-gray-500">•</span>
//                           <span className="text-gray-400">{rec.effort} Effort</span>
//                         </div>
//                       </div>
//                       <p className="text-gray-400 text-sm">{rec.description}</p>
//                     </motion.div>
//                   ))}
//                 </div>
//               </motion.div>
//             </div>

//             {/* Action Items */}
//             <motion.div 
//               variants={fadeInUp}
//               className="p-6 rounded-2xl bg-gradient-to-r from-[#00bf63]/10 to-emerald-500/10 border border-[#00bf63]/30 shadow-xl"
//             >
//               <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
//                 <Star className="h-5 w-5 text-[#00bf63] mr-2" />
//                 Next Steps
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-700/50 text-left group hover:border-[#00bf63]/50 transition-all"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h4 className="font-semibold text-white">Schedule Re-crawl</h4>
//                     <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#00bf63] group-hover:translate-x-1 transition-all" />
//                   </div>
//                   <p className="text-gray-400 text-sm">Set up automated monitoring</p>
//                 </motion.button>

//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-700/50 text-left group hover:border-[#00bf63]/50 transition-all"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h4 className="font-semibold text-white">Compare Reports</h4>
//                     <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#00bf63] group-hover:translate-x-1 transition-all" />
//                   </div>
//                   <p className="text-gray-400 text-sm">Track improvements over time</p>
//                 </motion.button>

//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-700/50 text-left group hover:border-[#00bf63]/50 transition-all"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h4 className="font-semibold text-white">Get Support</h4>
//                     <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#00bf63] group-hover:translate-x-1 transition-all" />
//                   </div>
//                   <p className="text-gray-400 text-sm">Expert optimization help</p>
//                 </motion.button>
//               </div>
//             </motion.div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   )
// }



'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
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
  Hash,
  Download,
  Share2,
  RefreshCw,
  Target,
  Zap,
  Shield,
  Eye,
  Activity,
  Globe,
  Star,
  Brain,
  ChevronRight
} from 'lucide-react'
import { reportsApi } from '@/services/api'

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
      const data = await reportsApi.getReport(submissionId)
      setReport(data)
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to fetch report')
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
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-[#00bf63]/20 text-[#00bf63] border-[#00bf63]/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return <AlertTriangle className="h-5 w-5 text-red-400" />
      case 'medium': return <Info className="h-5 w-5 text-yellow-400" />
      case 'low': return <CheckCircle className="h-5 w-5 text-[#00bf63]" />
      default: return <Info className="h-5 w-5 text-gray-400" />
    }
  }

  const getScoreColor = (score) => {
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
            <Link 
              href="/dashboard"
              className="inline-flex items-center text-gray-400 hover:text-[#00bf63] transition-colors mb-8 group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            
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
                <h2 className="text-xl font-semibold text-white mb-2">Loading Report...</h2>
                <p className="text-gray-400">Retrieving your analysis results</p>
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
            <source src="/video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-neutral-900/90"></div>
        </div>

        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Link 
              href="/dashboard"
              className="inline-flex items-center text-gray-400 hover:text-[#00bf63] transition-colors mb-8 group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            
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
                <h2 className="text-xl font-semibold text-white mb-2">Error Loading Report</h2>
                <p className="text-gray-400 mb-6">{error}</p>
                <motion.button
                  onClick={fetchReport}
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

  if (!report) {
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
            <Link 
              href="/dashboard"
              className="inline-flex items-center text-gray-400 hover:text-[#00bf63] transition-colors mb-8 group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            
            <div className="text-center p-8 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50">
              <h2 className="text-xl font-semibold text-white mb-2">Report Not Available</h2>
              <p className="text-gray-400">This report is not available at the moment.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { seo_metrics, recommendations } = report

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
              <div className="flex items-center justify-between mb-6">
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center text-gray-400 hover:text-[#00bf63] transition-colors group"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to Dashboard
                </Link>
                
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-neutral-800/50 border border-neutral-700/50 text-gray-300 rounded-lg hover:bg-neutral-700/50 hover:text-white transition-all backdrop-blur-md flex items-center"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-[#00bf63] to-emerald-500 text-white rounded-lg hover:shadow-lg hover:shadow-[#00bf63]/25 transition-all flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </motion.button>
                </div>
              </div>

              {/* Report Header */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-neutral-800/60 to-neutral-800/40 backdrop-blur-xl border border-neutral-700/50 shadow-2xl">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="mb-6 lg:mb-0">
                    <h1 className="text-4xl font-bold text-white mb-3">
                      Website Analysis Report
                    </h1>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-300">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-[#00bf63]" />
                        <span className="truncate font-medium">{report.url}</span>
                        <a
                          href={report.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 p-1 rounded hover:bg-white/10 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4 text-gray-400 hover:text-[#00bf63]" />
                        </a>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-[#00bf63]" />
                        <span>Analyzed on {formatDate(report.crawled_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Overall Score */}
                  <div className="flex items-center justify-center">
                    <div className="relative w-28 h-28">
                      <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
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
                          strokeDasharray={`${(report.seo_score || 85) * 2.51} 251.2`}
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
                          <div className={`text-2xl font-bold ${getScoreColor(report.seo_score || 85)}`}>
                            {report.seo_score || 85}
                          </div>
                          <div className="text-xs text-gray-400">Score</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Key Metrics */}
            <motion.div variants={fadeInUp} className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Target className="h-6 w-6 text-[#00bf63] mr-2" />
                Key Metrics
              </h2>
              <motion.div 
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[
                  {
                    icon: <FileText className="h-5 w-5" />,
                    title: "Page Title",
                    value: seo_metrics?.title || 'Not Found',
                    subtitle: seo_metrics?.title ? `${seo_metrics.title.length} characters` : null,
                    color: "text-blue-400"
                  },
                  {
                    icon: <FileText className="h-5 w-5" />,
                    title: "Meta Description", 
                    value: seo_metrics?.meta_description ? `${seo_metrics.meta_description.length} characters` : 'Not Found',
                    subtitle: seo_metrics?.meta_description,
                    color: "text-[#00bf63]"
                  },
                  {
                    icon: <HardDrive className="h-5 w-5" />,
                    title: "Page Size",
                    value: formatBytes(seo_metrics?.page_size || 0),
                    color: "text-purple-400"
                  },
                  {
                    icon: <Clock className="h-5 w-5" />,
                    title: "Load Time",
                    value: `${(seo_metrics?.load_time || 0).toFixed(2)}s`,
                    color: "text-orange-400"
                  },
                  {
                    icon: <TrendingUp className="h-5 w-5" />,
                    title: "Status Code",
                    value: seo_metrics?.status_code || 'Unknown',
                    color: "text-red-400"
                  },
                  {
                    icon: <ImageIcon className="h-5 w-5" />,
                    title: "Images",
                    value: seo_metrics?.images?.length || 0,
                    color: "text-pink-400"
                  }
                ].map((metric, index) => (
                  <motion.div
                    key={index}
                    variants={scaleIn}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="p-6 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50 hover:border-[#00bf63]/50 transition-all duration-300 shadow-xl"
                  >
                    <div className="flex items-center mb-3">
                      <div className={`p-2 rounded-lg bg-white/5 ${metric.color} mr-3`}>
                        {metric.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-400">{metric.title}</span>
                    </div>
                    <p className="text-lg font-semibold text-white mb-1">
                      {metric.value}
                    </p>
                    {metric.subtitle && (
                      <p className="text-sm text-gray-500 truncate">
                        {metric.subtitle}
                      </p>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Content Structure */}
            <motion.div variants={fadeInUp} className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Activity className="h-6 w-6 text-[#00bf63] mr-2" />
                Content Structure
              </h2>
              <motion.div 
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
              >
                {[
                  { icon: <Hash className="h-5 w-5" />, title: "H1 Tags", value: seo_metrics?.h1_tags?.length || 0, color: "text-purple-400" },
                  { icon: <Hash className="h-5 w-5" />, title: "H2 Tags", value: seo_metrics?.h2_tags?.length || 0, color: "text-[#00bf63]" },
                  { icon: <Hash className="h-5 w-5" />, title: "H3 Tags", value: seo_metrics?.h3_tags?.length || 0, color: "text-blue-400" },
                  { icon: <LinkIcon className="h-5 w-5" />, title: "Internal Links", value: seo_metrics?.internal_links?.length || 0, color: "text-orange-400" },
                  { icon: <ExternalLink className="h-5 w-5" />, title: "External Links", value: seo_metrics?.external_links?.length || 0, color: "text-red-400" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={scaleIn}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="p-6 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50 hover:border-[#00bf63]/50 transition-all duration-300 shadow-xl text-center"
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 ${item.color} mb-4`}>
                      {item.icon}
                    </div>
                    <p className="text-2xl font-bold text-white mb-2">
                      {item.value}
                    </p>
                    <p className="text-sm text-gray-400">{item.title}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Recommendations */}
            {recommendations && recommendations.length > 0 && (
              <motion.div variants={fadeInUp} className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Brain className="h-6 w-6 text-[#00bf63] mr-2" />
                  AI Recommendations ({recommendations.length})
                </h2>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-6 rounded-2xl bg-neutral-800/40 backdrop-blur-xl border border-neutral-700/50 hover:border-[#00bf63]/50 transition-all duration-300 shadow-xl"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-4">
                          {getPriorityIcon(rec.priority)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-semibold text-white">
                              {rec.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                              {rec.priority}
                            </span>
                          </div>
                          <p className="text-gray-300 mb-4 leading-relaxed">
                            {rec.description}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm">
                            <div className="flex items-center space-x-4 text-gray-400">
                              <span className="font-medium">
                                Priority: <span className="capitalize text-white">{rec.priority}</span>
                              </span>
                              {rec.impact_score && (
                                <span>
                                  Impact: <span className="text-[#00bf63]">{(rec.impact_score * 100).toFixed(0)}%</span>
                                </span>
                              )}
                            </div>
                            {(rec.current_value || rec.suggested_value) && (
                              <div className="mt-2 sm:mt-0 flex items-center space-x-2">
                                {rec.current_value && (
                                  <span className="text-red-400 font-medium">
                                    Current: {rec.current_value}
                                  </span>
                                )}
                                {rec.current_value && rec.suggested_value && (
                                  <ChevronRight className="h-4 w-4 text-gray-500" />
                                )}
                                {rec.suggested_value && (
                                  <span className="text-[#00bf63] font-medium">
                                    Suggested: {rec.suggested_value}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Call to Action */}
            <motion.div 
              variants={fadeInUp}
              className="p-8 rounded-2xl bg-gradient-to-r from-[#00bf63]/20 to-emerald-500/20 border border-[#00bf63]/30 backdrop-blur-xl shadow-2xl text-center"
            >
              <div className="max-w-2xl mx-auto">
                <div className="p-4 rounded-full bg-[#00bf63]/20 border border-[#00bf63]/30 w-fit mx-auto mb-6">
                  <Star className="h-8 w-8 text-[#00bf63]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Optimize Your Website?</h3>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Use these AI-powered recommendations to boost your search engine rankings, 
                  improve user experience, and drive more qualified traffic to your website.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/"
                      className="px-8 py-3 bg-gradient-to-r from-[#00bf63] to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00bf63]/25 transition-all duration-300 inline-flex items-center"
                    >
                      Analyze Another Website
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-neutral-800/50 border border-neutral-700/50 text-white rounded-lg hover:bg-neutral-700/50 transition-all backdrop-blur-md"
                  >
                    Schedule Monitoring
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}