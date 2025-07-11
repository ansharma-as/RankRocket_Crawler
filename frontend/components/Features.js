'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  Globe, 
  Target, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Sparkles,
  Brain,
  Rocket,
  Award,
  Users,
  RefreshCw
} from 'lucide-react'

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const timer = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const mainFeatures = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze your website's SEO performance with precision and speed.",
      details: [
        "Deep content analysis",
        "Smart keyword optimization",
        "Automated technical audits",
        "Intelligent recommendations"
      ],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Real-time Monitoring",
      description: "Track your SEO performance 24/7 with live updates and instant notifications on ranking changes.",
      details: [
        "Live ranking tracking",
        "Performance alerts",
        "Competitor monitoring",
        "Traffic analysis"
      ],
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Smart Recommendations",
      description: "Get actionable insights and step-by-step guidance to improve your search engine rankings.",
      details: [
        "Prioritized action items",
        "Implementation guides",
        "Impact predictions",
        "Progress tracking"
      ],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "Your data is protected with bank-grade security and encryption protocols.",
      details: [
        "256-bit SSL encryption",
        "GDPR compliant",
        "SOC 2 certified",
        "Private data centers"
      ],
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Get comprehensive SEO analysis in seconds with our optimized crawling infrastructure.",
      details: [
        "Sub-second analysis",
        "Global CDN network",
        "Parallel processing",
        "Real-time results"
      ],
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Coverage",
      description: "Monitor your rankings across 190+ countries and multiple search engines worldwide.",
      details: [
        "Multi-language support",
        "Local SEO tracking",
        "Regional insights",
        "Global benchmarking"
      ],
      color: "from-violet-500 to-purple-500"
    }
  ]

  const stats = [
    { number: "50K+", label: "Websites Analyzed", icon: <Globe className="h-6 w-6" /> },
    { number: "2.5M+", label: "SEO Issues Fixed", icon: <CheckCircle className="h-6 w-6" /> },
    { number: "99.9%", label: "Uptime SLA", icon: <Shield className="h-6 w-6" /> },
    { number: "24/7", label: "Support Available", icon: <Users className="h-6 w-6" /> }
  ]

  const benefits = [
    {
      icon: <Award className="h-6 w-6 text-yellow-400" />,
      title: "Increase Rankings",
      description: "Boost your search engine rankings with data-driven optimizations"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-green-400" />,
      title: "Drive More Traffic",
      description: "Attract qualified visitors with improved search visibility"
    },
    {
      icon: <Target className="h-6 w-6 text-purple-400" />,
      title: "Convert Better",
      description: "Optimize user experience to increase conversion rates"
    },
    {
      icon: <Clock className="h-6 w-6 text-violet-400" />,
      title: "Save Time",
      description: "Automate SEO tasks and focus on growing your business"
    }
  ]

  return (
    <section id="features" className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="h-4 w-4 text-purple-400 mr-2" />
            <span className="text-sm font-medium text-gray-300">Powerful Features</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Everything You Need to
            <span className="block gradient-text">Dominate Search Results</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Comprehensive SEO tools powered by AI to help you outrank competitors 
            and drive more organic traffic to your website.
          </p>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {stats.map((stat, index) => (
            <div key={index} className="card text-center hover-lift group">
              <div className="flex justify-center mb-3">
                <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-20">
          {mainFeatures.map((feature, index) => (
            <div 
              key={index}
              className={`card hover-lift group cursor-pointer transition-all duration-500 ${
                activeFeature === index ? 'border-purple-500/50 bg-purple-500/5' : ''
              } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{transitionDelay: `${400 + index * 100}ms`}}
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div className="relative">
                {/* Icon */}
                <div className={`p-4 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-6 w-fit group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>

                {/* Details */}
                <ul className="space-y-2 mb-6">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>

                {/* Learn More */}
                <div className="flex items-center text-purple-400 text-sm font-medium group-hover:text-purple-300 transition-colors">
                  <span>Learn More</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Active Indicator */}
                {activeFeature === index && (
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className={`text-center mb-16 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h3 className="text-3xl font-bold text-white mb-12">
            Why Choose <span className="gradient-text">RankRocket</span>?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="group">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                    {benefit.icon}
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {benefit.title}
                </h4>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className={`text-center transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="card max-w-4xl mx-auto bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 text-white pulse-glow">
                <Rocket className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Boost Your Rankings?
            </h3>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of websites using RankRocket to improve their SEO performance and drive more organic traffic.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary group px-8 py-4 text-lg font-semibold rounded-xl hover-lift">
                <Rocket className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                Start Free Trial
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="glass px-8 py-4 text-lg font-semibold rounded-xl text-white hover:bg-white/10 transition-all hover-lift">
                <BarChart3 className="h-5 w-5 mr-2" />
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}