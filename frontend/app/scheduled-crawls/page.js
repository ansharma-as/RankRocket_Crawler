'use client'

import ScheduledCrawls from '@/components/ScheduledCrawls'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function ScheduledCrawlsPage() {
  return (
    <ProtectedRoute>
      <ScheduledCrawls />
    </ProtectedRoute>
  )
}