import Report from '@/components/Report'

export async function generateMetadata({ params }) {
  const { id } = params

  try {
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/v1/report/${id}`, {
      next: { revalidate: 300 } // Cache for 5 minutes
    })
    
    if (response.ok) {
      const report = await response.json()
      return {
        title: `AI Analysis Report for ${report.url} - CrawlAI`,
        description: `Comprehensive AI-powered website analysis for ${report.url} with performance metrics, issues, and optimization recommendations`,
        openGraph: {
          title: `AI Analysis Report for ${report.url}`,
          description: `Comprehensive website analysis with AI-powered insights and recommendations`,
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: `AI Analysis Report for ${report.url}`,
          description: `Comprehensive website analysis with AI-powered insights`,
        }
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }

  return {
    title: 'AI Website Analysis Report - CrawlAI',
    description: 'View detailed AI-powered website analysis report with performance metrics, issues, and optimization recommendations',
    openGraph: {
      title: 'AI Website Analysis Report - CrawlAI',
      description: 'AI-powered website analysis with comprehensive insights and recommendations',
      type: 'website',
    }
  }
}

export default function ReportPage({ params }) {
  return <Report submissionId={params.id} />
}