'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Hero from '@/components/Hero'
import URLSubmissionForm from '@/components/URLSubmissionForm'
import Features from '@/components/Features'

export default function Home() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  return (
    <div className="space-y-16">
      <Hero />
      <URLSubmissionForm />
      <Features />
    </div>
  )
}