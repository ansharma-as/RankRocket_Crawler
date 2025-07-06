import { TrendingUp, Zap, Target } from 'lucide-react'

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Boost Your Website's{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              SEO Rankings
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Get comprehensive SEO analysis and actionable recommendations to improve 
            your search engine rankings with our AI-powered tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="flex items-center space-x-2 text-white">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span>Increase Rankings</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <Zap className="h-5 w-5 text-yellow-400" />
              <span>Fast Analysis</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <Target className="h-5 w-5 text-red-400" />
              <span>Actionable Insights</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-5 rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-5 rounded-full"></div>
      </div>
    </div>
  )
}