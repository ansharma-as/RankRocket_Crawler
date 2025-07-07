import { 
  Zap, 
  Target, 
  BarChart3, 
  Bot, 
  Gauge, 
  Link, 
  Shield,
  Clock,
  TrendingUp 
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Fast Analysis',
    description: 'Get detailed SEO insights in seconds with our powerful crawling engine',
    color: 'text-yellow-600 bg-yellow-100'
  },
  {
    icon: Target,
    title: 'Actionable Insights',
    description: 'Receive specific recommendations to improve your search rankings',
    color: 'text-red-600 bg-red-100'
  },
  {
    icon: BarChart3,
    title: 'Detailed Reports',
    description: 'Visual reports showing your website\'s SEO performance and opportunities',
    color: 'text-blue-600 bg-blue-100'
  },
  {
    icon: Bot,
    title: 'AI-Powered',
    description: 'Machine learning algorithms analyze your content structure and provide intelligent recommendations',
    color: 'text-purple-600 bg-purple-100'
  },
  {
    icon: Gauge,
    title: 'Performance Monitoring',
    description: 'Track page load times, size optimization, and technical SEO factors',
    color: 'text-green-600 bg-green-100'
  },
  {
    icon: Link,
    title: 'Link Analysis',
    description: 'Analyze internal and external link structures to improve site authority',
    color: 'text-indigo-600 bg-indigo-100'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is protected with enterprise-grade security and privacy measures',
    color: 'text-gray-600 bg-gray-100'
  },
  {
    icon: Clock,
    title: 'Real-time Updates',
    description: 'Monitor your SEO progress with real-time analysis and reporting',
    color: 'text-orange-600 bg-orange-100'
  },
  {
    icon: TrendingUp,
    title: 'Growth Tracking',
    description: 'Track your SEO improvements over time and measure ranking progress',
    color: 'text-teal-600 bg-teal-100'
  }
]

export default function Features() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Powerful SEO Analysis Features
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Everything you need to optimize your website's search engine performance 
          and drive more organic traffic to your business.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className={`inline-flex p-3 rounded-lg ${feature.color} mb-4`}>
                <Icon className="h-6 w-6" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">
            Ready to boost your SEO rankings?
          </h3>
          <p className="text-blue-100 mb-6 text-lg">
            Join thousands of website owners who have improved their search engine visibility with RankRocket.
          </p>
          <button 
            // onClick={() => document.querySelector('#url')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Your Free Analysis
          </button>
        </div>
      </div>
    </div>
  )
}