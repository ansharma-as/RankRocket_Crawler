import { NextResponse } from 'next/server'
import axios from 'axios'

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:8000'

export async function POST(request) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Make request to backend API
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/submit-url`,
      { url },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      }
    )

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Submit URL error:', error.message)
    
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data?.detail || 'Backend error' },
        { status: error.response.status }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to submit URL for analysis' },
      { status: 500 }
    )
  }
}