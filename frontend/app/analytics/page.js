'use client'

import AdvancedAnalytics from '@/components/AdvancedAnalytics'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AdvancedAnalytics />
    </ProtectedRoute>
  )
}