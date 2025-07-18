'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Rocket } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { FullPageLoader } from '@/components/LoadingSpinner'

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
      <FullPageLoader 
        color="#00bf63"
        size={40}
        text="Loading RankRocket..."
        showText={true}
      />
    )
  }

  // Show fallback while redirecting to signin
  if (!isAuthenticated) {
    return fallback || (
      <FullPageLoader 
        color="#00bf63"
        size={35}
        text="Redirecting to sign in..."
        showText={true}
      />
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