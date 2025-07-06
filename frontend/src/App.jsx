import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { HelmetProvider } from 'react-helmet-async'
import './App.css'

import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Report from './pages/Report'
import Layout from './components/Layout'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report/:submissionId" element={<Report />} />
          </Routes>
        </Layout>
      </HelmetProvider>
    </QueryClientProvider>
  )
}

export default App
