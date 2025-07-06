import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'
import CrawlReport from '../components/CrawlReportSimple'

const styles = {
  reportContainer: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '500',
    marginBottom: '2rem'
  },
  loadingState: {
    textAlign: 'center',
    padding: '4rem 0',
    color: '#64748b'
  },
  errorState: {
    textAlign: 'center',
    padding: '4rem 0',
    color: '#dc2626'
  },
  errorTitle: {
    margin: '0 0 1rem 0'
  },
  errorDescription: {
    margin: '0 0 2rem 0',
    color: '#64748b'
  },
  retryButton: {
    background: '#2563eb',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.2s'
  }
}

function Report() {
  const { submissionId } = useParams()

  const { data: report, isLoading, error, refetch } = useQuery(
    ['report', submissionId],
    async () => {
      const response = await axios.get(`http://localhost:8000/api/v1/report/${submissionId}`)
      return response.data
    },
    {
      retry: 3,
      retryDelay: 1000,
      staleTime: 60000,
    }
  )

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Loading Report - RankRocket</title>
        </Helmet>
        <div style={styles.reportContainer}>
          <Link style={styles.backButton} to="/dashboard">← Back to Dashboard</Link>
          <div style={styles.loadingState}>
            <h2>Loading your SEO report...</h2>
            <p>Please wait while we retrieve your analysis results.</p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    const isNotFound = error.response?.status === 404

    return (
      <>
        <Helmet>
          <title>Report Error - RankRocket</title>
        </Helmet>
        <div style={styles.reportContainer}>
          <Link style={styles.backButton} to="/dashboard">← Back to Dashboard</Link>
          <div style={styles.errorState}>
            <h2 style={styles.errorTitle}>
              {isNotFound ? 'Report Not Found' : 'Error Loading Report'}
            </h2>
            <p style={styles.errorDescription}>
              {isNotFound
                ? 'The report you requested could not be found. It may still be processing or the link may be invalid.'
                : 'There was an error loading your report. Please try again.'}
            </p>
            {!isNotFound && (
              <button style={styles.retryButton} onClick={() => refetch()}>
                Try Again
              </button>
            )}
          </div>
        </div>
      </>
    )
  }

  if (!report) {
    return (
      <>
        <Helmet>
          <title>Report Not Available - RankRocket</title>
        </Helmet>
        <div style={styles.reportContainer}>
          <Link style={styles.backButton} to="/dashboard">← Back to Dashboard</Link>
          <div style={styles.errorState}>
            <h2 style={styles.errorTitle}>Report Not Available</h2>
            <p style={styles.errorDescription}>
              This report is not available at the moment.
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{`SEO Report for ${report.url} - RankRocket`}</title>
        <meta name="description" content={`SEO analysis report for ${report.url} with recommendations and insights`} />
      </Helmet>
      
      <div style={styles.reportContainer}>
        <Link style={styles.backButton} to="/dashboard">← Back to Dashboard</Link>
        <CrawlReport report={report} />
      </div>
    </>
  )
}

export default Report