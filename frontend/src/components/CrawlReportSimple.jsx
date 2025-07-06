function CrawlReport({ report }) {
  if (!report) return null

  const { seo_metrics, recommendations } = report

  const styles = {
    container: {
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    header: {
      background: '#f8fafc',
      padding: '1.5rem',
      borderBottom: '1px solid #e2e8f0'
    },
    title: {
      margin: '0 0 0.5rem 0',
      color: '#1e293b'
    },
    url: {
      margin: '0',
      color: '#64748b',
      fontSize: '0.875rem'
    },
    body: {
      padding: '1.5rem'
    },
    section: {
      marginBottom: '2rem'
    },
    sectionTitle: {
      margin: '0 0 1rem 0',
      color: '#334155',
      fontSize: '1.25rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    },
    card: {
      background: '#f8fafc',
      padding: '1rem',
      borderRadius: '6px',
      border: '1px solid #e2e8f0'
    },
    label: {
      fontSize: '0.875rem',
      color: '#64748b',
      marginBottom: '0.25rem'
    },
    value: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1e293b'
    },
    recommendationsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    recommendation: {
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      padding: '1rem',
      background: 'white'
    },
    recommendationHigh: {
      borderLeft: '4px solid #dc2626'
    },
    recommendationMedium: {
      borderLeft: '4px solid #d97706'
    },
    recommendationLow: {
      borderLeft: '4px solid #059669'
    },
    recommendationTitle: {
      margin: '0 0 0.5rem 0',
      color: '#1e293b',
      fontSize: '1rem'
    },
    recommendationDescription: {
      margin: '0 0 0.5rem 0',
      color: '#475569',
      fontSize: '0.875rem'
    },
    recommendationDetails: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.75rem',
      color: '#64748b'
    }
  }

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getPriorityStyle = (priority) => {
    switch(priority) {
      case 'high': return styles.recommendationHigh
      case 'medium': return styles.recommendationMedium
      case 'low': return styles.recommendationLow
      default: return {}
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>SEO Analysis Report</h2>
        <p style={styles.url}>{report.url}</p>
      </div>
      
      <div style={styles.body}>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Key Metrics</h3>
          <div style={styles.grid}>
            <div style={styles.card}>
              <div style={styles.label}>Page Title</div>
              <div style={styles.value}>{seo_metrics.title || 'Not Found'}</div>
            </div>
            
            <div style={styles.card}>
              <div style={styles.label}>Meta Description</div>
              <div style={styles.value}>
                {seo_metrics.meta_description ? 
                  `${seo_metrics.meta_description.length} characters` : 
                  'Not Found'
                }
              </div>
            </div>
            
            <div style={styles.card}>
              <div style={styles.label}>Page Size</div>
              <div style={styles.value}>{formatBytes(seo_metrics.page_size || 0)}</div>
            </div>
            
            <div style={styles.card}>
              <div style={styles.label}>Load Time</div>
              <div style={styles.value}>{(seo_metrics.load_time || 0).toFixed(2)}s</div>
            </div>
            
            <div style={styles.card}>
              <div style={styles.label}>Status Code</div>
              <div style={styles.value}>{seo_metrics.status_code || 'Unknown'}</div>
            </div>
            
            <div style={styles.card}>
              <div style={styles.label}>Images</div>
              <div style={styles.value}>{seo_metrics.images?.length || 0}</div>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Content Structure</h3>
          <div style={styles.grid}>
            <div style={styles.card}>
              <div style={styles.label}>H1 Tags</div>
              <div style={styles.value}>{seo_metrics.h1_tags?.length || 0}</div>
            </div>
            
            <div style={styles.card}>
              <div style={styles.label}>H2 Tags</div>
              <div style={styles.value}>{seo_metrics.h2_tags?.length || 0}</div>
            </div>
            
            <div style={styles.card}>
              <div style={styles.label}>H3 Tags</div>
              <div style={styles.value}>{seo_metrics.h3_tags?.length || 0}</div>
            </div>
            
            <div style={styles.card}>
              <div style={styles.label}>Internal Links</div>
              <div style={styles.value}>{seo_metrics.internal_links?.length || 0}</div>
            </div>
            
            <div style={styles.card}>
              <div style={styles.label}>External Links</div>
              <div style={styles.value}>{seo_metrics.external_links?.length || 0}</div>
            </div>
          </div>
        </div>

        {recommendations && recommendations.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Recommendations ({recommendations.length})</h3>
            <div style={styles.recommendationsList}>
              {recommendations.map((rec, index) => (
                <div 
                  key={index} 
                  style={{
                    ...styles.recommendation,
                    ...getPriorityStyle(rec.priority)
                  }}
                >
                  <h4 style={styles.recommendationTitle}>{rec.title}</h4>
                  <p style={styles.recommendationDescription}>{rec.description}</p>
                  <div style={styles.recommendationDetails}>
                    <span>Priority: {rec.priority}</span>
                    {rec.impact_score && (
                      <span>Impact Score: {(rec.impact_score * 100).toFixed(0)}%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CrawlReport