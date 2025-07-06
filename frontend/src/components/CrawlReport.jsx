import styled from 'styled-components'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const ReportContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
`

const ReportHeader = styled.div`
  background: #f8fafc;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
`

const ReportTitle = styled.h2`
  margin: 0 0 0.5rem 0;
  color: #1e293b;
`

const ReportUrl = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
`

const ReportBody = styled.div`
  padding: 1.5rem;
`

const Section = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #334155;
  font-size: 1.25rem;
`

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`

const MetricCard = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
`

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;
`

const MetricValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
`

const RecommendationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const RecommendationCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 1rem;
  background: white;
  
  &.high {
    border-left: 4px solid #dc2626;
  }
  
  &.medium {
    border-left: 4px solid #d97706;
  }
  
  &.low {
    border-left: 4px solid #059669;
  }
`

const RecommendationTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: #1e293b;
  font-size: 1rem;
`

const RecommendationDescription = styled.p`
  margin: 0 0 0.5rem 0;
  color: #475569;
  font-size: 0.875rem;
`

const RecommendationDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #64748b;
`

const COLORS = ['#2563eb', '#dc2626', '#059669', '#d97706']

function CrawlReport({ report }) {
  if (!report) return null

  const { seo_metrics, recommendations } = report

  const headingData = [
    { name: 'H1', count: seo_metrics.h1_tags?.length || 0 },
    { name: 'H2', count: seo_metrics.h2_tags?.length || 0 },
    { name: 'H3', count: seo_metrics.h3_tags?.length || 0 },
  ]

  const linkData = [
    { name: 'Internal Links', value: seo_metrics.internal_links?.length || 0 },
    { name: 'External Links', value: seo_metrics.external_links?.length || 0 },
  ]

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <ReportContainer>
      <ReportHeader>
        <ReportTitle>SEO Analysis Report</ReportTitle>
        <ReportUrl>{report.url}</ReportUrl>
      </ReportHeader>
      
      <ReportBody>
        <Section>
          <SectionTitle>Key Metrics</SectionTitle>
          <MetricsGrid>
            <MetricCard>
              <MetricLabel>Page Title</MetricLabel>
              <MetricValue>{seo_metrics.title || 'Not Found'}</MetricValue>
            </MetricCard>
            
            <MetricCard>
              <MetricLabel>Meta Description</MetricLabel>
              <MetricValue>
                {seo_metrics.meta_description ? 
                  `${seo_metrics.meta_description.length} characters` : 
                  'Not Found'
                }
              </MetricValue>
            </MetricCard>
            
            <MetricCard>
              <MetricLabel>Page Size</MetricLabel>
              <MetricValue>{formatBytes(seo_metrics.page_size || 0)}</MetricValue>
            </MetricCard>
            
            <MetricCard>
              <MetricLabel>Load Time</MetricLabel>
              <MetricValue>{(seo_metrics.load_time || 0).toFixed(2)}s</MetricValue>
            </MetricCard>
            
            <MetricCard>
              <MetricLabel>Status Code</MetricLabel>
              <MetricValue>{seo_metrics.status_code || 'Unknown'}</MetricValue>
            </MetricCard>
            
            <MetricCard>
              <MetricLabel>Images</MetricLabel>
              <MetricValue>{seo_metrics.images?.length || 0}</MetricValue>
            </MetricCard>
          </MetricsGrid>
        </Section>

        <Section>
          <SectionTitle>Heading Structure</SectionTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={headingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </Section>

        <Section>
          <SectionTitle>Link Distribution</SectionTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={linkData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {linkData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Section>

        {recommendations && recommendations.length > 0 && (
          <Section>
            <SectionTitle>Recommendations ({recommendations.length})</SectionTitle>
            <RecommendationsList>
              {recommendations.map((rec, index) => (
                <RecommendationCard key={index} className={rec.priority}>
                  <RecommendationTitle>{rec.title}</RecommendationTitle>
                  <RecommendationDescription>{rec.description}</RecommendationDescription>
                  <RecommendationDetails>
                    <span>Priority: {rec.priority}</span>
                    {rec.impact_score && (
                      <span>Impact Score: {(rec.impact_score * 100).toFixed(0)}%</span>
                    )}
                  </RecommendationDetails>
                </RecommendationCard>
              ))}
            </RecommendationsList>
          </Section>
        )}
      </ReportBody>
    </ReportContainer>
  )
}

export default CrawlReport