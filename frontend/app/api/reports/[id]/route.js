import { NextResponse } from 'next/server'
import axios from 'axios'

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:8000'

export async function GET(request, { params }) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      )
    }

    // Make request to backend API
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/report/${id}`,
      {
        timeout: 15000, // Longer timeout for detailed reports
      }
    )

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Get report error:', error.message)
    
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data?.detail || 'Backend error' },
        { status: error.response.status }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    )
  }
}