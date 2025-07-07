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
        title: `SEO Report for ${report.url} - RankRocket`,
        description: `SEO analysis report for ${report.url} with recommendations and insights`,
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }

  return {
    title: 'SEO Report - RankRocket',
    description: 'View detailed SEO analysis report with recommendations',
  }
}

export default function ReportPage({ params }) {
  return <Report submissionId={params.id} />
}