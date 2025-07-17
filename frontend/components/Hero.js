'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useAnimation, useScroll, useTransform, useInView } from 'framer-motion'
import { 
  Search, 
  TrendingUp, 
  Shield, 
  Zap, 
  Target,
  ChevronRight,
  Star,
  Users,
  BarChart3,
  Globe,
  ArrowRight,
  CheckCircle,
  Sparkles,
  ArrowDown,
  Brain,
  Award,
  Bot,
  FileText,
  ScanLine,
  Activity,
  Cpu,
  Eye,
  Layers,
  Code,
  MessageSquare,
  Play,
  PlayCircle
} from 'lucide-react'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.25, 0.25, 0, 1]
    }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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
      duration: 0.7,
      ease: [0.25, 0.25, 0, 1]
    }
  }
}

const slideInLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.8,
      ease: [0.25, 0.25, 0, 1]
    }
  }
}

const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.8,
      ease: [0.25, 0.25, 0, 1]
    }
  }
}

// Component for animated sections
const AnimatedSection = ({ children, className, variants = fadeInUp }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, {
    threshold: 0.1,
    once: true
  })

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function Hero() {
  const [activeFeature, setActiveFeature] = useState(0)
  const router = useRouter()
  const { scrollYProgress } = useScroll()

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Intelligence",
      description: "Advanced machine learning algorithms analyze your website's structure, content, and performance patterns",
      stats: "99.9% accuracy",
      color: "from-blue-400 to-cyan-400"
    },
    {
      icon: <ScanLine className="h-8 w-8" />,
      title: "Deep Site Crawling",
      description: "Comprehensive exploration of every page, asset, and hidden element across your entire website",
      stats: "10M+ pages daily",
      color: "from-[#00bf63] to-emerald-400"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Intelligent Reports",
      description: "Actionable insights with prioritized recommendations and implementation guides",
      stats: "500+ metrics",
      color: "from-purple-400 to-pink-400"
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: "Real-time Monitoring",
      description: "Continuous tracking with instant alerts for performance changes and new issues",
      stats: "24/7 monitoring",
      color: "from-orange-400 to-red-400"
    }
  ]

  const stats = [
    { number: "2.5M+", label: "Websites Analyzed", icon: <Globe className="h-6 w-6" /> },
    { number: "50B+", label: "Pages Crawled", icon: <ScanLine className="h-6 w-6" /> },
    { number: "99.9%", label: "Accuracy Rate", icon: <Target className="h-6 w-6" /> },
    { number: "24/7", label: "AI Processing", icon: <Bot className="h-6 w-6" /> }
  ]

  const testimonials = [
    {
      quote: "The AI insights discovered critical performance issues we missed for months. Site speed improved 400%.",
      author: "Elena Rodriguez",
      role: "Lead Developer @ TechCorp",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      company: "TechCorp"
    },
    {
      quote: "Most comprehensive crawling tool I've used. The reports are incredibly detailed and actionable.",
      author: "Marcus Chen",
      role: "CTO @ StartupX",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      company: "StartupX"
    },
    {
      quote: "Transformed our development workflow. We catch issues before they affect users.",
      author: "Sarah Kim",
      role: "Engineering Manager",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      company: "InnovateLab"
    }
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Full-Page Video Background */}
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
        {/* <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/90 via-neutral-800/85 to-neutral-900/90"></div> */}
      </div>

      {/* Hero Section */}
      <motion.section 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-5xl mx-auto"
          >
            {/* <motion.div
              variants={fadeInUp}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#00bf63]/20 to-emerald-500/20 border border-[#00bf63]/30 mb-8"
            >
              <Sparkles className="h-4 w-4 text-[#00bf63] mr-2" />
              <span className="text-sm font-medium text-[#00bf63]">Next-Gen AI Website Analysis</span>
            </motion.div> */}
            
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8"
            >
              <span className="text-white">Crawl</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00bf63] to-emerald-400">
                Analyze
              </span>{" "}
              <span className="text-white">Optimize</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Revolutionary AI-powered crawler that analyzes every aspect of your website, 
              delivering actionable insights and optimization strategies in real-time.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0, 191, 99, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard')}
                className="group px-8 py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r from-[#00bf63] to-emerald-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 rounded-2xl font-semibold text-lg bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Explore Features
              </motion.button>
            </motion.div>

            {/* Floating Stats */}
            {/* <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ y: -10 }}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#00bf63]/50 transition-all duration-300"
                >
                  <div className="text-[#00bf63] mb-2">{stat.icon}</div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div> */}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-gray-400"
          >
            <span className="text-sm mb-2">Discover More</span>
            <ArrowDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Interactive Features Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-900/50 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection className="text-center mb-20">
            <span className="inline-block px-4 py-2 rounded-full bg-[#00bf63]/20 text-[#00bf63] border border-[#00bf63]/30 text-sm font-medium mb-6">
              Advanced Capabilities
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Intelligence Meets <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00bf63] to-emerald-400">
                Precision
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of website analysis with our AI-driven platform that understands your digital presence like never before.
            </p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection variants={slideInLeft}>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={false}
                    animate={{
                      scale: activeFeature === index ? 1.02 : 1,
                      opacity: activeFeature === index ? 1 : 0.7
                    }}
                    onClick={() => setActiveFeature(index)}
                    className={`p-6 rounded-2xl cursor-pointer transition-all duration-500 ${
                      activeFeature === index 
                        ? 'bg-white/10 backdrop-blur-lg border border-[#00bf63]/50 shadow-2xl' 
                        : 'bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color}`}>
                        <div className="text-white">{feature.icon}</div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-gray-300 mb-3">{feature.description}</p>
                        <div className="flex items-center">
                          <div className="px-3 py-1 rounded-full bg-[#00bf63]/20 text-[#00bf63] text-sm font-medium">
                            {feature.stats}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection variants={slideInRight}>
              <div className="relative">
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-sm text-gray-400">AI Analysis Dashboard</div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Analysis Progress</span>
                      <span className="text-[#00bf63] font-bold">98%</span>
                    </div>
                    
                    <div className="relative">
                      <div className="w-full bg-neutral-700 rounded-full h-3">
                        <motion.div 
                          className="bg-gradient-to-r from-[#00bf63] to-emerald-400 h-3 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "98%" }}
                          transition={{ duration: 2, delay: 0.5 }}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-xl bg-white/5">
                        <div className="text-2xl font-bold text-[#00bf63]">2,847</div>
                        <div className="text-xs text-gray-400">Pages Scanned</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-white/5">
                        <div className="text-2xl font-bold text-blue-400">12</div>
                        <div className="text-xs text-gray-400">Issues Found</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-white/5">
                        <div className="text-2xl font-bold text-purple-400">94</div>
                        <div className="text-xs text-gray-400">SEO Score</div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-gradient-to-r from-[#00bf63]/20 to-emerald-500/20 border border-[#00bf63]/30">
                      <div className="flex items-start space-x-3">
                        <Brain className="h-5 w-5 text-[#00bf63] mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-white mb-1">AI Insight</div>
                          <div className="text-xs text-gray-300">Optimize critical rendering path for 40% faster load times</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Floating elements */}
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 5, 0] 
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="absolute -top-6 -right-6 w-20 h-20 rounded-2xl bg-gradient-to-r from-[#00bf63]/30 to-emerald-400/30 blur-xl"
                />
                <motion.div
                  animate={{ 
                    y: [0, 15, 0],
                    rotate: [0, -5, 0] 
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 1
                  }}
                  className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-lg"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* URL Analysis Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 via-transparent to-neutral-900/80"></div>
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Ready to unlock your website's potential?
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Get a comprehensive AI analysis of your website in under 60 seconds
            </p>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl"
            >
              <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                <div className="flex-1">
                  <input
                    type="url"
                    placeholder="Enter your website URL (e.g., https://example.com)"
                    className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#00bf63]/50 focus:bg-white/20 transition-all duration-300"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00bf63] to-emerald-500 text-white font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Analyze Now
                </motion.button>
              </div>
              
              <div className="flex items-center justify-center mt-6 space-x-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-[#00bf63] mr-2" />
                  Free analysis
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-[#00bf63] mr-2" />
                  No signup required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-[#00bf63] mr-2" />
                  Instant results
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/60 via-neutral-800/40 to-neutral-900/60"></div>
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection className="text-center mb-20">
            <span className="inline-block px-4 py-2 rounded-full bg-[#00bf63]/20 text-[#00bf63] border border-[#00bf63]/30 text-sm font-medium mb-6">
              Trusted by Developers
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Real Results from Real Teams
            </h2>
          </AnimatedSection>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                variants={scaleIn}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                <div className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-[#00bf63]/50 transition-all duration-500 shadow-2xl h-full">
                  <div className="flex items-center mb-6">
                    <img 
                      className="h-12 w-12 rounded-full border-2 border-[#00bf63]"
                      src={testimonial.avatar} 
                      alt={testimonial.author} 
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-white">{testimonial.author}</p>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                      <p className="text-xs text-[#00bf63]">{testimonial.company}</p>
                    </div>
                  </div>
                  
                  <blockquote className="text-gray-300 text-lg leading-relaxed italic">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="flex mt-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-[#00bf63] fill-current" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-800/50 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection className="text-center max-w-4xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[#00bf63]/20 to-emerald-500/20 border border-[#00bf63]/30 mb-8"
            >
              <Sparkles className="h-5 w-5 text-[#00bf63] mr-2" />
              <span className="text-[#00bf63] font-medium">Start Your Journey Today</span>
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Transform Your Website with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00bf63] to-emerald-400">
                AI Intelligence
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Join thousands of developers who trust our platform to optimize their websites and deliver exceptional user experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 25px 50px rgba(0, 191, 99, 0.4)" 
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard')}
                className="group px-10 py-5 rounded-2xl font-bold text-xl bg-gradient-to-r from-[#00bf63] to-emerald-500 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center"
              >
                Get Started
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </motion.button>
              
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 rounded-2xl font-bold text-xl bg-white/10 backdrop-blur-md text-white border-2 border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center"
              >
                <MessageSquare className="mr-3 h-6 w-6" />
                Talk to Expert
              </motion.button> */}
            </div>
            
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-[#00bf63] mr-2" />
                Enterprise Security
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-[#00bf63] mr-2" />
                24/7 Support
              </div>
              <div className="flex items-center">
                <Zap className="h-4 w-4 text-[#00bf63] mr-2" />
                Instant Setup
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}