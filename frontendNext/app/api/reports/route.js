import { NextResponse } from 'next/server'
import axios from 'axios'

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:8000'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const skip = searchParams.get('skip') || '0'
    const limit = searchParams.get('limit') || '10'

    // Make request to backend API
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/reports?skip=${skip}&limit=${limit}`,
      {
        timeout: 10000,
      }
    )

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Get reports error:', error.message)
    
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data?.detail || 'Backend error' },
        { status: error.response.status }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}