import { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'

const styles = {
  dashboardContainer: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  dashboardHeader: {
    marginBottom: '2rem'
  },
  dashboardTitle: {
    margin: '0 0 0.5rem 0',
    color: '#1e293b'
  },
  dashboardSubtitle: {
    margin: '0',
    color: '#64748b'
  },
  reportsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '1.5rem'
  },
  reportCard: {
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '1.5rem',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  reportUrl: {
    margin: '0 0 0.5rem 0',
    color: '#2563eb',
    fontSize: '1.1rem',
    wordBreak: 'break-all'
  },
  reportMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    fontSize: '0.875rem',
    color: '#64748b'
  },
  reportStats: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem'
  },
  statItem: {
    textAlign: 'center'
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b'
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#64748b'
  },
  viewButton: {
    display: 'inline-block',
    background: '#2563eb',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'background 0.2s'
  },
  loadingState: {
    textAlign: 'center',
    padding: '4rem 0',
    color: '#64748b'
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 0',
    color: '#64748b'
  },
  emptyStateTitle: {
    margin: '0 0 1rem 0',
    color: '#374151'
  },
  emptyStateDescription: {
    margin: '0 0 2rem 0'
  },
  emptyStateButton: {
    display: 'inline-block',
    background: '#2563eb',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'background 0.2s'
  }
}

function Dashboard() {
  const [page, setPage] = useState(0)
  const limit = 10

  const { data: reports, isLoading, error } = useQuery(
    ['reports', page, limit],
    async () => {
      const response = await axios.get(`http://localhost:8000/api/v1/reports?skip=${page * limit}&limit=${limit}`)
      return response.data
    },
    {
      keepPreviousData: true,
      staleTime: 30000,
    }
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Dashboard - RankRocket</title>
          <meta name="description" content="View your website SEO analysis reports and recommendations" />
        </Helmet>
        <div style={styles.loadingState}>
          <h2>Loading your reports...</h2>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Dashboard - RankRocket</title>
        </Helmet>
        <div>
          <h2>Error loading reports</h2>
          <p>Please try again later.</p>
        </div>
      </>
    )
  }

  if (!reports?.reports || reports.reports.length === 0) {
    return (
      <>
        <Helmet>
          <title>Dashboard - RankRocket</title>
          <meta name="description" content="View your website SEO analysis reports and recommendations" />
        </Helmet>
        <div style={styles.emptyState}>
          <h3 style={styles.emptyStateTitle}>No reports yet</h3>
          <p style={styles.emptyStateDescription}>
            Start analyzing your websites to see detailed SEO reports and recommendations here.
          </p>
          <Link style={styles.emptyStateButton} to="/">Analyze Your First Website</Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - RankRocket</title>
        <meta name="description" content="View your website SEO analysis reports and recommendations" />
      </Helmet>
      
      <div style={styles.dashboardContainer}>
        <div style={styles.dashboardHeader}>
          <h1 style={styles.dashboardTitle}>Your SEO Reports</h1>
          <p style={styles.dashboardSubtitle}>
            {reports.total} report{reports.total !== 1 ? 's' : ''} available
          </p>
        </div>

        <div style={styles.reportsGrid}>
          {reports.reports.map((report) => (
            <div style={styles.reportCard} key={report.submission_id}>
              <h3 style={styles.reportUrl}>{report.url}</h3>
              
              <div style={styles.reportMeta}>
                <span>Analyzed: {formatDate(report.crawled_at)}</span>
              </div>
              
              <div style={styles.reportStats}>
                <div style={styles.statItem}>
                  <div style={styles.statValue}>{report.recommendations_count}</div>
                  <div style={styles.statLabel}>Recommendations</div>
                </div>
                <div style={styles.statItem}>
                  <div style={styles.statValue}>{report.seo_score || 'N/A'}</div>
                  <div style={styles.statLabel}>SEO Score</div>
                </div>
              </div>
              
              <Link style={styles.viewButton} to={`/report/${report.submission_id}`}>
                View Report
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Dashboard