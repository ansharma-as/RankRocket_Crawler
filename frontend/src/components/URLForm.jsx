import { useState } from 'react'
import { useMutation } from 'react-query'
import axios from 'axios'

const styles = {
  formContainer: {
    background: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    margin: '2rem 0'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  label: {
    fontWeight: '600',
    color: '#374151'
  },
  input: {
    padding: '0.75rem',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '1rem',
    transition: 'border-color 0.2s'
  },
  inputFocus: {
    outline: 'none',
    borderColor: '#2563eb'
  },
  button: {
    background: '#2563eb',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  buttonDisabled: {
    background: '#9ca3af',
    cursor: 'not-allowed'
  },
  status: {
    padding: '1rem',
    borderRadius: '6px',
    marginTop: '1rem'
  },
  statusSuccess: {
    background: '#dcfce7',
    color: '#166534',
    border: '1px solid #bbf7d0'
  },
  statusError: {
    background: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca'
  },
  statusLoading: {
    background: '#dbeafe',
    color: '#1e40af',
    border: '1px solid #bfdbfe'
  }
}

function URLForm({ onSuccess }) {
  const [url, setUrl] = useState('')
  
  const submitMutation = useMutation(
    async (urlData) => {
      const response = await axios.post('http://localhost:8000/api/v1/submit-url', {
        url: urlData
      })
      return response.data
    },
    {
      onSuccess: (data) => {
        setUrl('')
        if (onSuccess) {
          onSuccess(data)
        }
      }
    }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (url.trim()) {
      submitMutation.mutate(url.trim())
    }
  }

  return (
    <div style={styles.formContainer}>
      <h2>Analyze Your Website</h2>
      <p>Enter your website URL to get a comprehensive SEO analysis</p>
      
      <form style={styles.form} onSubmit={handleSubmit}>
        <label style={styles.label} htmlFor="url">Website URL</label>
        <input
          style={styles.input}
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
          disabled={submitMutation.isLoading}
        />
        
        <button 
          style={{
            ...styles.button,
            ...(submitMutation.isLoading || !url.trim() ? styles.buttonDisabled : {})
          }}
          type="submit" 
          disabled={submitMutation.isLoading || !url.trim()}
        >
          {submitMutation.isLoading ? 'Analyzing...' : 'Analyze Website'}
        </button>
      </form>
      
      {submitMutation.isLoading && (
        <div style={{...styles.status, ...styles.statusLoading}}>
          <strong>Analyzing your website...</strong>
          <p>This may take a few moments while we crawl and analyze your site.</p>
        </div>
      )}
      
      {submitMutation.isSuccess && (
        <div style={{...styles.status, ...styles.statusSuccess}}>
          <strong>Analysis started!</strong>
          <p>Submission ID: {submitMutation.data.submission_id}</p>
          <p>Check the dashboard to view your results when ready.</p>
        </div>
      )}
      
      {submitMutation.isError && (
        <div style={{...styles.status, ...styles.statusError}}>
          <strong>Analysis failed!</strong>
          <p>{submitMutation.error?.response?.data?.detail || 'An error occurred'}</p>
        </div>
      )}
    </div>
  )
}

export default URLForm