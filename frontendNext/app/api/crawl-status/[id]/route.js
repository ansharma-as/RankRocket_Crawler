import { NextResponse } from 'next/server'
import axios from 'axios'

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:8000'

export async function GET(request, { params }) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      )
    }

    // Make request to backend API
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/crawl-status/${id}`,
      {
        timeout: 5000,
      }
    )

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Get crawl status error:', error.message)
    
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data?.detail || 'Backend error' },
        { status: error.response.status }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch crawl status' },
      { status: 500 }
    )
  }
}