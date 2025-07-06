import { Link } from 'react-router-dom'

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    background: '#2563eb',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  nav: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none'
  },
  navLinks: {
    display: 'flex',
    gap: '2rem'
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background 0.2s'
  },
  main: {
    flex: 1,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    width: '100%'
  },
  footer: {
    background: '#f3f4f6',
    padding: '2rem 0',
    textAlign: 'center',
    color: '#6b7280'
  }
}

function Layout({ children }) {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <nav style={styles.nav}>
          <Link style={styles.logo} to="/">RankRocket</Link>
          <div style={styles.navLinks}>
            <Link style={styles.navLink} to="/">Home</Link>
            <Link style={styles.navLink} to="/dashboard">Dashboard</Link>
          </div>
        </nav>
      </header>
      <main style={styles.main}>
        {children}
      </main>
      <footer style={styles.footer}>
        <p>&copy; 2024 RankRocket. Enhance your website's search engine indexing.</p>
      </footer>
    </div>
  )
}

export default Layout