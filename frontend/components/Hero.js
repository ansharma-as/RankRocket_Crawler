'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useAnimation, useScroll, useTransform, useInView } from 'framer-motion'
import { 
  Rocket, 
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
  Award
} from 'lucide-react'
import URLSubmissionForm from './URLSubmissionForm'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6 }
  }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

// Component for animated sections
const AnimatedSection = ({ children, className }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, {
    threshold: 0.2,
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
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function Hero() {
  const [animationStep, setAnimationStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    setIsVisible(true)
    const timer = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50])
  
  const scrollIndicatorY = useTransform(scrollYProgress, [0, 0.05], [0, 50])
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0])

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Analysis",
      description: "Deep technical SEO audits with actionable insights"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Real-time Monitoring",
      description: "Track your SEO performance with live updates"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Bank-grade security for your data"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Get results in seconds, not hours"
    }
  ]

  const stats = [
    { number: "50K+", label: "Websites Analyzed", icon: <Globe className="h-5 w-5" /> },
    { number: "99.9%", label: "Uptime", icon: <Shield className="h-5 w-5" /> },
    { number: "24/7", label: "Support", icon: <Users className="h-5 w-5" /> },
    { number: "500+", label: "Happy Clients", icon: <Star className="h-5 w-5" /> }
  ]

  const testimonials = [
    {
      quote: "RankRocket transformed our SEO strategy. We saw 300% improvement in rankings!",
      author: "Sarah Johnson",
      role: "Marketing Director",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      quote: "The most comprehensive SEO tool I've ever used. Highly recommended!",
      author: "Mike Chen",
      role: "SEO Specialist",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
      quote: "Incredible insights and easy to use. Our traffic doubled in 3 months!",
      author: "Lisa Rodriguez",
      role: "Digital Marketing Manager",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg"
    }
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section with Framer Motion */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative min-h-screen flex items-center pt-5 lg:pt-20"
      >
        {/* Background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-black"></div>
          
          {/* Animated purple blobs */}
          <motion.div 
            animate={{ 
              x: [0, 30, -30, 0], 
              y: [0, -50, 30, 0],
              scale: [1, 1.2, 0.8, 1],
              rotate: [0, 90, 180, 270, 360]
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl"
          />
          <motion.div 
            animate={{ 
              x: [0, -50, 50, 0], 
              y: [0, 30, -30, 0],
              scale: [1, 0.8, 1.2, 1],
              rotate: [0, -90, -180, -270, -360]
            }}
            transition={{ 
              duration: 30, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
            className="absolute top-2/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl"
          />
          <motion.div 
            animate={{ 
              x: [0, 50, -20, 0], 
              y: [0, 20, -40, 0],
              scale: [1, 1.1, 0.9, 1],
              rotate: [0, 45, 90, 135, 180]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
            className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-violet-400/20 rounded-full mix-blend-multiply filter blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.span 
                variants={fadeIn}
                className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-6 bg-purple-500/20 text-purple-300 border border-purple-500/30"
              >
                Unleash your SEO potential
              </motion.span>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white"
              >
                Rocket Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-600">
                  SEO Rankings
                </span>
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-lg md:text-xl mb-8 max-w-xl text-gray-300"
              >
                RankRocket combines powerful SEO tools with an intuitive interface to help you dominate search results. Whether you're a beginner or a pro, boost your rankings in minutes.
              </motion.p>
              
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={() => document.querySelector('#url-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-3 rounded-lg font-medium inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Start Free Analysis
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="#features"
                    className="px-8 py-3 rounded-lg font-medium inline-flex items-center justify-center bg-white/10 text-gray-100 border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    Explore Features
                  </a>
                </motion.div>
              </motion.div>
              
              <motion.div 
                variants={fadeIn}
                className="mt-8 flex items-center"
              >
                <div className="flex -space-x-2 overflow-hidden">
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                      src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i + 5}.jpg`}
                      alt=""
                    />
                  ))}
                </div>
                <span className="ml-3 text-sm font-medium text-gray-400">
                  Join 50,000+ websites already optimizing
                </span>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: 0.2,
              }}
              className="relative hidden lg:block"
            >
              <motion.div
                whileHover={{ rotate: -2, scale: 1.02 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 rounded-xl overflow-hidden shadow-2xl border border-gray-700"
              >
                <div className="flex items-center justify-between p-3 bg-gray-900 border-b border-gray-700">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-gray-400">RankRocket SEO</div>
                  <div className="w-4"></div>
                </div>
                <div className="bg-gray-800 p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">SEO Score</span>
                      <span className="text-green-400 font-bold">92/100</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-green-400 to-purple-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "92%" }}
                        transition={{ duration: 2, delay: 1 }}
                      ></motion.div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">15</div>
                        <div className="text-xs text-gray-400">Issues Found</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">1.2s</div>
                        <div className="text-xs text-gray-400">Load Time</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Decorative elements */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute -bottom-12 -left-12 w-40 h-40 rounded-lg bg-gradient-to-r from-purple-500/20 to-purple-600/20 blur"
              ></motion.div>
              
              <motion.div
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 1
                }}
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-r from-purple-400/20 to-purple-500/20 blur"
              ></motion.div>
            </motion.div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div 
            style={{ y: scrollIndicatorY, opacity: scrollIndicatorOpacity }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          >
            <span className="text-sm mb-2 text-gray-400">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <ArrowDown className="h-6 w-6 text-gray-400" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <AnimatedSection className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600"
                >
                  {stat.number}
                </motion.div>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* URL Submission Form */}
      <section id="url-form" className="py-20 bg-black">
        <AnimatedSection>
          <URLSubmissionForm />
        </AnimatedSection>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Powerful tools for every SEO need</h2>
            <p className="text-lg text-gray-300">
              Our comprehensive set of features empowers you to dominate search results quickly and efficiently.
            </p>
          </AnimatedSection>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
              >
                <div className="p-3 rounded-lg w-fit mb-5 bg-purple-500/20 border border-purple-500/30">
                  <div className="text-purple-400">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">What our users say</h2>
            <p className="text-lg text-gray-300">
              Join thousands of satisfied SEO professionals who have transformed their rankings with RankRocket.
            </p>
          </AnimatedSection>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-8 lg:grid-cols-3"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="p-8 rounded-2xl shadow-lg relative bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300"
              >
                {/* Decorative quote */}
                <svg 
                  className="absolute top-0 left-0 transform -translate-y-6 -translate-x-2 h-16 w-16 text-purple-500 opacity-20" 
                  fill="currentColor" 
                  viewBox="0 0 32 32" 
                  aria-hidden="true"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                
                <div className="relative">
                  <p className="text-lg italic mb-6 text-gray-300">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center">
                    <img 
                      className="h-12 w-12 rounded-full border-2 border-purple-500"
                      src={testimonial.avatar} 
                      alt={testimonial.author} 
                    />
                    <div className="ml-4">
                      <p className="font-medium text-white">{testimonial.author}</p>
                      <p className="text-sm text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        {/* Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/30 to-purple-800/30"></div>
          
          {/* Animated particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * 100 - 50 + "%",
                y: Math.random() * 100 - 50 + "%",
                opacity: Math.random() * 0.5 + 0.3,
                scale: Math.random() * 0.6 + 0.2
              }}
              animate={{
                y: [0, Math.random() * 20 - 10, 0],
                rotate: [0, Math.random() * 360, 0]
              }}
              transition={{
                duration: Math.random() * 5 + 10,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute rounded-full bg-purple-500 opacity-20 w-16 h-16 blur-xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection className="text-center max-w-3xl mx-auto py-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to dominate search results?</h2>
            <p className="text-xl mb-10 text-gray-300">
              Join thousands of websites who trust RankRocket for their SEO success.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <button
                onClick={() => document.querySelector('#url-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-lg text-lg font-medium inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get started for free
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </motion.div>
            
            <p className="mt-6 text-sm opacity-80 text-gray-400">No credit card required. Free forever.</p>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}