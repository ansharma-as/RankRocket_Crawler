'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Rocket } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function ProtectedRoute({ children, fallback = null }) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth')
    }
  }, [isAuthenticated, loading, router])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center justify-center p-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white mb-4"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Rocket className="h-8 w-8" />
          </motion.div>
          <motion.div
            className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          />
          <motion.p 
            className="text-gray-300 text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Loading RankRocket...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  // Show fallback while redirecting to signin
  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center justify-center p-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white mb-4"
            animate={{ 
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 1,
              ease: "easeInOut"
            }}
          >
            <Rocket className="h-8 w-8" />
          </motion.div>
          <motion.p 
            className="text-gray-300 text-lg mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Redirecting to sign in...
          </motion.p>
          <motion.div
            className="w-6 h-6 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          />
        </motion.div>
      </div>
    )
  }

  // Render protected content
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

// Higher-order component version
export function withProtection(Component, options = {}) {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute fallback={options.fallback}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}