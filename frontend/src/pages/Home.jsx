import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import URLForm from '../components/URLForm'

const styles = {
  heroSection: {
    textAlign: 'center',
    padding: '4rem 0',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    margin: '-2rem -2rem 2rem -2rem'
  },
  heroTitle: {
    fontSize: '3rem',
    margin: '0 0 1rem 0',
    fontWeight: '700'
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    margin: '0 0 2rem 0',
    opacity: '0.9'
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    margin: '3rem 0'
  },
  featureCard: {
    background: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  featureTitle: {
    color: '#1e293b',
    margin: '0 0 1rem 0'
  },
  featureDescription: {
    color: '#64748b',
    margin: '0'
  }
}

function Home() {
  const navigate = useNavigate()

  const handleAnalysisSuccess = (data) => {
    navigate('/dashboard')
  }

  return (
    <>
      <Helmet>
        <title>RankRocket - Enhance Your Website's Search Engine Indexing</title>
        <meta name="description" content="Analyze your website's SEO performance and get actionable recommendations to improve search engine rankings." />
        <meta name="keywords" content="SEO, search engine optimization, website analysis, ranking, indexing" />
      </Helmet>
      
      <section style={styles.heroSection}>
        <h1 style={styles.heroTitle}>Boost Your Website's SEO</h1>
        <p style={styles.heroSubtitle}>
          Get comprehensive SEO analysis and actionable recommendations to improve your search engine rankings
        </p>
      </section>

      <URLForm onSuccess={handleAnalysisSuccess} />

      <div style={styles.featureGrid}>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🚀</div>
          <h3 style={styles.featureTitle}>Fast Analysis</h3>
          <p style={styles.featureDescription}>
            Get detailed SEO insights in seconds with our powerful crawling engine
          </p>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🎯</div>
          <h3 style={styles.featureTitle}>Actionable Insights</h3>
          <p style={styles.featureDescription}>
            Receive specific recommendations to improve your search rankings
          </p>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>📊</div>
          <h3 style={styles.featureTitle}>Detailed Reports</h3>
          <p style={styles.featureDescription}>
            Visual reports showing your website's SEO performance and opportunities
          </p>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🤖</div>
          <h3 style={styles.featureTitle}>AI-Powered</h3>
          <p style={styles.featureDescription}>
            Machine learning algorithms analyze your content structure and provide intelligent recommendations
          </p>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>⚡</div>
          <h3 style={styles.featureTitle}>Performance Monitoring</h3>
          <p style={styles.featureDescription}>
            Track page load times, size optimization, and technical SEO factors
          </p>
        </div>

        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🔗</div>
          <h3 style={styles.featureTitle}>Link Analysis</h3>
          <p style={styles.featureDescription}>
            Analyze internal and external link structures to improve site authority
          </p>
        </div>
      </div>
    </>
  )
}

export default Home