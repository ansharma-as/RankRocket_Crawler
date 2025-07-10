# RankRocket Backend API Documentation

## Overview

RankRocket is a comprehensive SEO crawling and analysis platform that helps websites improve their search engine rankings through legitimate optimization techniques. This document contains all available API endpoints with example CURL requests.

**Base URL**: `http://localhost:8000`

---

## Table of Contents

1. [Basic Crawl APIs](#basic-crawl-apis)
2. [Reports APIs](#reports-apis)
3. [Advanced Crawl Scheduling](#advanced-crawl-scheduling)
4. [Analytics & Trending](#analytics--trending)
5. [Report Generation](#report-generation)
6. [Indexing Support](#indexing-support)
7. [Search Engine Submission](#search-engine-submission)

---

## Basic Crawl APIs

### 1. Submit URL for Crawling

**Endpoint**: `POST /api/v1/submit-url`

**Description**: Submit a URL for crawling and SEO analysis

```bash
curl -X POST "http://localhost:8000/api/v1/submit-url" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com"
  }'
```

**Response**:
```json
{
  "submission_id": "507f1f77bcf86cd799439011",
  "url": "https://example.com",
  "status": "pending",
  "message": "URL submitted for crawling"
}
```

### 2. Check Crawl Status

**Endpoint**: `GET /api/v1/crawl-status/{submission_id}`

**Description**: Check the status of a submitted crawl

```bash
curl -X GET "http://localhost:8000/api/v1/crawl-status/507f1f77bcf86cd799439011"
```

**Response**:
```json
{
  "submission_id": "507f1f77bcf86cd799439011",
  "url": "https://example.com",
  "status": "completed",
  "submitted_at": "2024-01-15T10:30:00Z",
  "completed_at": "2024-01-15T10:32:15Z",
  "error_message": null
}
```

---

## Reports APIs

### 3. Get SEO Report

**Endpoint**: `GET /api/v1/report/{submission_id}`

**Description**: Get detailed SEO report for a completed crawl

```bash
curl -X GET "http://localhost:8000/api/v1/report/507f1f77bcf86cd799439011"
```

**Response**:
```json
{
  "submission_id": "507f1f77bcf86cd799439011",
  "url": "https://example.com",
  "seo_metrics": {
    "title": "Example Domain",
    "meta_description": "Example domain for documentation",
    "h1_tags": ["Example Domain"],
    "load_time": 1.25,
    "page_size": 15678,
    "mobile_friendly": true,
    "ssl_enabled": true
  },
  "recommendations": [
    {
      "type": "meta_description",
      "priority": "medium",
      "title": "Meta Description Too Short",
      "description": "Your meta description could be more descriptive"
    }
  ],
  "crawled_at": "2024-01-15T10:32:15Z"
}
```

### 4. Get All Reports

**Endpoint**: `GET /api/v1/reports`

**Description**: Get list of all reports with pagination

```bash
curl -X GET "http://localhost:8000/api/v1/reports?skip=0&limit=10"
```

**Response**:
```json
{
  "reports": [
    {
      "submission_id": "507f1f77bcf86cd799439011",
      "url": "https://example.com",
      "crawled_at": "2024-01-15T10:32:15Z",
      "recommendations_count": 5,
      "seo_score": 78.5
    }
  ],
  "total": 1
}
```

---

## Advanced Crawl Scheduling

### 5. Schedule Single Crawl

**Endpoint**: `POST /api/v1/advanced/schedule-crawl`

**Description**: Schedule a crawl with priority and frequency settings

```bash
curl -X POST "http://localhost:8000/api/v1/advanced/schedule-crawl" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "priority": "high",
    "frequency": "daily",
    "custom_interval": null
  }'
```

**Response**:
```json
{
  "schedule_id": "507f1f77bcf86cd799439012",
  "message": "Crawl scheduled successfully",
  "url": "https://example.com",
  "priority": "high"
}
```

### 6. Bulk Schedule Crawls

**Endpoint**: `POST /api/v1/advanced/bulk-schedule`

**Description**: Schedule multiple URLs for crawling

```bash
curl -X POST "http://localhost:8000/api/v1/advanced/bulk-schedule" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://example.com",
      "https://example.com/about",
      "https://example.com/contact"
    ],
    "priority": "medium",
    "frequency": "weekly"
  }'
```

**Response**:
```json
{
  "schedule_ids": [
    "507f1f77bcf86cd799439013",
    "507f1f77bcf86cd799439014",
    "507f1f77bcf86cd799439015"
  ],
  "total_scheduled": 3,
  "message": "Crawls scheduled successfully"
}
```

### 7. Get Scheduled Crawls

**Endpoint**: `GET /api/v1/advanced/scheduled-crawls`

**Description**: Get list of scheduled crawls with optional status filter

```bash
curl -X GET "http://localhost:8000/api/v1/advanced/scheduled-crawls?status=pending"
```

**Response**:
```json
{
  "scheduled_crawls": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "url": "https://example.com",
      "priority": "high",
      "status": "pending",
      "next_crawl": "2024-01-16T10:00:00Z",
      "frequency": "daily"
    }
  ],
  "total": 1
}
```

### 8. Get Crawl Statistics

**Endpoint**: `GET /api/v1/advanced/crawl-statistics`

**Description**: Get crawl queue and processing statistics

```bash
curl -X GET "http://localhost:8000/api/v1/advanced/crawl-statistics"
```

**Response**:
```json
{
  "scheduled": 15,
  "processing": 3,
  "completed": 128,
  "failed": 2,
  "queue_size": 5
}
```

---

## Analytics & Trending

### 9. Get SEO Trends

**Endpoint**: `GET /api/v1/advanced/analytics/trends`

**Description**: Get SEO performance trends over time

```bash
curl -X GET "http://localhost:8000/api/v1/advanced/analytics/trends?url=https://example.com&days=30"
```

**Response**:
```json
{
  "period": "Last 30 days",
  "total_crawls": 25,
  "urls_analyzed": 1,
  "trends": {
    "dates": ["2024-01-01", "2024-01-02"],
    "seo_scores": [75.5, 78.2],
    "load_times": [1.2, 1.1],
    "issues_by_priority": {
      "high": [2, 1],
      "medium": [5, 4],
      "low": [3, 3]
    }
  },
  "insights": [
    "SEO score improved by 2.7 points",
    "Load time performance is excellent (1.15s)"
  ],
  "charts": {
    "seo_score_trend": "base64_encoded_chart_data",
    "load_time_trend": "base64_encoded_chart_data"
  }
}
```

### 10. Compare Domains

**Endpoint**: `POST /api/v1/advanced/analytics/compare`

**Description**: Compare SEO performance across multiple domains

```bash
curl -X POST "http://localhost:8000/api/v1/advanced/analytics/compare" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://example.com",
      "https://competitor.com",
      "https://another-site.com"
    ]
  }'
```

**Response**:
```json
{
  "comparison_data": {
    "https://example.com": {
      "seo_score": 78.5,
      "load_time": 1.2,
      "mobile_friendly": true,
      "ssl_enabled": true,
      "total_issues": 8
    },
    "https://competitor.com": {
      "seo_score": 65.2,
      "load_time": 2.8,
      "mobile_friendly": false,
      "ssl_enabled": true,
      "total_issues": 15
    }
  },
  "insights": [
    "Best SEO performance: https://example.com (78.5)",
    "Fastest loading: https://example.com (1.20s)"
  ],
  "chart": "base64_encoded_comparison_chart",
  "best_performing": {
    "seo_score": "https://example.com (78.5)",
    "load_time": "https://example.com (1.20s)"
  }
}
```

### 11. Keyword Analysis

**Endpoint**: `GET /api/v1/advanced/analytics/keywords/{url}`

**Description**: Analyze keyword performance for a specific URL

```bash
curl -X GET "http://localhost:8000/api/v1/advanced/analytics/keywords/https%3A%2F%2Fexample.com"
```

**Response**:
```json
{
  "url": "https://example.com",
  "analysis_period": "Last 10 crawls",
  "top_keywords": {
    "example": {
      "average_density": 2.5,
      "current_density": 2.8,
      "trend": "increasing",
      "appearances": 10
    },
    "domain": {
      "average_density": 1.8,
      "current_density": 1.6,
      "trend": "decreasing",
      "appearances": 10
    }
  },
  "keyword_opportunities": [
    "Consider increasing density for: documentation, guide, tutorial"
  ],
  "optimization_suggestions": [
    "Focus on long-tail keyword variations",
    "Ensure keywords appear in title and headings"
  ]
}
```

### 12. Performance Dashboard

**Endpoint**: `GET /api/v1/advanced/analytics/dashboard`

**Description**: Get overall performance dashboard with key metrics

```bash
curl -X GET "http://localhost:8000/api/v1/advanced/analytics/dashboard"
```

**Response**:
```json
{
  "period": "Last 30 days",
  "overview": {
    "total_crawls": 156,
    "unique_urls": 45,
    "avg_seo_score": 72.3,
    "total_issues": 234
  },
  "issues_breakdown": {
    "high": 23,
    "medium": 89,
    "low": 122
  },
  "performance_metrics": {
    "avg_load_time": 1.85,
    "avg_page_size": 245.6,
    "mobile_friendly_percentage": 78.5,
    "ssl_percentage": 95.2
  },
  "top_issues": [
    {
      "issue": "Missing Meta Description",
      "count": 15,
      "priority": "high"
    }
  ]
}
```

---

## Report Generation

### 13. Generate Comprehensive Report

**Endpoint**: `POST /api/v1/advanced/generate-report`

**Description**: Generate detailed reports in various formats

```bash
curl -X POST "http://localhost:8000/api/v1/advanced/generate-report" \
  -H "Content-Type: application/json" \
  -d '{
    "submission_id": "507f1f77bcf86cd799439011",
    "format_type": "json"
  }'
```

**Formats Available**: `json`, `pdf`, `excel`, `html`

**Response** (JSON format):
```json
{
  "metadata": {
    "report_id": "507f1f77bcf86cd799439020",
    "generated_at": "2024-01-15T11:00:00Z",
    "url": "https://example.com",
    "report_type": "comprehensive_seo_audit"
  },
  "executive_summary": {
    "overall_score": 78.5,
    "performance_grade": "B",
    "total_issues": 12,
    "issue_breakdown": {
      "high": 2,
      "medium": 6,
      "low": 4
    },
    "key_findings": [
      "Missing page title - critical for SEO",
      "Slow page load time (3.2s)"
    ]
  },
  "technical_seo": {
    "meta_tags": {
      "title": {
        "content": "Example Domain",
        "length": 14,
        "status": "needs_improvement"
      }
    }
  },
  "recommendations": {
    "high_priority": [
      {
        "title": "Add Missing Page Title",
        "description": "Your page is missing a title tag",
        "impact_score": 0.9
      }
    ]
  }
}
```

**PDF/Excel Response**:
```json
{
  "format": "pdf",
  "content": "base64_encoded_file_content",
  "filename": "seo_report_20240115_110000.pdf"
}
```

---

## Indexing Support

### 14. Generate Sitemap

**Endpoint**: `POST /api/v1/advanced/generate-sitemap`

**Description**: Generate XML sitemap for a domain

```bash
curl -X POST "http://localhost:8000/api/v1/advanced/generate-sitemap" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example.com",
    "include_images": true,
    "include_videos": false
  }'
```

**Response**:
```json
{
  "sitemap_id": "507f1f77bcf86cd799439021",
  "domain": "example.com",
  "url_count": 25,
  "xml_content": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">...</urlset>",
  "generated_at": "2024-01-15T11:05:00Z",
  "validation": {
    "valid": true,
    "errors": [],
    "warnings": [],
    "url_count": 25
  }
}
```

### 15. Generate Robots.txt

**Endpoint**: `POST /api/v1/advanced/generate-robots-txt`

**Description**: Generate robots.txt file for a domain

```bash
curl -X POST "http://localhost:8000/api/v1/advanced/generate-robots-txt?domain=example.com" \
  -H "Content-Type: application/json" \
  -d '{
    "sitemap_urls": ["https://example.com/sitemap.xml"]
  }'
```

**Response**:
```json
{
  "robots_id": "507f1f77bcf86cd799439022",
  "domain": "example.com",
  "content": "# Robots.txt generated by RankRocket\nUser-agent: *\nDisallow: /admin\nDisallow: /private\nCrawl-delay: 1\nSitemap: https://example.com/sitemap.xml",
  "generated_at": "2024-01-15T11:10:00Z",
  "recommendations": [
    "Block admin and login pages from search engines",
    "Set appropriate crawl delay to avoid overwhelming your server"
  ]
}
```

### 16. Analyze Internal Linking

**Endpoint**: `GET /api/v1/advanced/internal-linking/{domain}`

**Description**: Analyze and optimize internal linking structure

```bash
curl -X GET "http://localhost:8000/api/v1/advanced/internal-linking/example.com"
```

**Response**:
```json
{
  "domain": "example.com",
  "analysis": {
    "total_pages": 25,
    "total_internal_links": 156,
    "orphaned_pages": [
      "https://example.com/orphaned-page"
    ],
    "hub_pages": [
      {
        "url": "https://example.com/blog",
        "outgoing_links": 45
      }
    ],
    "authority_pages": [
      {
        "url": "https://example.com/home",
        "incoming_links": 20
      }
    ],
    "average_outgoing_links": 6.2
  },
  "recommendations": [
    "Link to 1 orphaned pages from relevant content",
    "Use descriptive anchor text for internal links"
  ]
}
```

### 17. Check Indexing Status

**Endpoint**: `POST /api/v1/advanced/check-indexing-status`

**Description**: Check if URLs are indexed in search engines

```bash
curl -X POST "http://localhost:8000/api/v1/advanced/check-indexing-status" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://example.com",
      "https://example.com/about"
    ]
  }'
```

**Response**:
```json
{
  "checked_at": "2024-01-15T11:15:00Z",
  "total_urls": 2,
  "results": {
    "https://example.com": {
      "url": "https://example.com",
      "google": {
        "indexed": true,
        "method": "site_search"
      },
      "bing": {
        "indexed": true,
        "method": "site_search"
      }
    }
  },
  "summary": {
    "indexed_urls": 2,
    "not_indexed_urls": 0,
    "indexing_rate": 100.0
  }
}
```

---

## Search Engine Submission

### 18. Submit URLs to Search Engines

**Endpoint**: `POST /api/v1/advanced/submit-to-search-engines`

**Description**: Submit URLs to Google and Bing for indexing

```bash
curl -X POST "http://localhost:8000/api/v1/advanced/submit-to-search-engines" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://example.com",
      "https://example.com/new-page"
    ],
    "search_engines": ["google", "bing"]
  }'
```

**Response**:
```json
{
  "message": "URL submission started",
  "urls_count": 2,
  "search_engines": ["google", "bing"]
}
```

### 19. Submit Sitemap to Search Engines

**Endpoint**: `POST /api/v1/advanced/submit-sitemap`

**Description**: Submit sitemap to search engines

```bash
curl -X POST "http://localhost:8000/api/v1/advanced/submit-sitemap" \
  -H "Content-Type: application/json" \
  -d '{
    "sitemap_url": "https://example.com/sitemap.xml",
    "site_url": "https://example.com",
    "search_engines": ["google", "bing"]
  }'
```

**Response**:
```json
{
  "sitemap_url": "https://example.com/sitemap.xml",
  "site_url": "https://example.com",
  "results": {
    "google": {
      "status": "success",
      "message": "Sitemap submitted to Google Search Console"
    },
    "bing": {
      "status": "success",
      "message": "Sitemap submitted to Bing Webmaster Tools"
    }
  }
}
```

### 20. Get Search Performance

**Endpoint**: `GET /api/v1/advanced/search-performance/{site_url}`

**Description**: Get search performance data from Google Search Console

```bash
curl -X GET "http://localhost:8000/api/v1/advanced/search-performance/https%3A%2F%2Fexample.com?days=30"
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "rows": [
      {
        "keys": ["example keyword", "https://example.com", "USA", "desktop"],
        "clicks": 125,
        "impressions": 2500,
        "ctr": 5.0,
        "position": 8.5
      }
    ]
  },
  "analysis": {
    "totals": {
      "clicks": 1250,
      "impressions": 25000,
      "ctr": 5.0,
      "average_position": 12.3
    },
    "top_queries": [
      {
        "query": "example keyword",
        "clicks": 125,
        "impressions": 2500,
        "ctr": 5.0,
        "position": 8.5
      }
    ]
  }
}
```

### 21. Get Submission History

**Endpoint**: `GET /api/v1/advanced/submission-history`

**Description**: Get search engine submission history

```bash
curl -X GET "http://localhost:8000/api/v1/advanced/submission-history?search_engine=google&days=30"
```

**Response**:
```json
{
  "period": "Last 30 days",
  "summary": {
    "total_submissions": 45,
    "successful_submissions": 42,
    "success_rate": 93.3
  },
  "by_search_engine": {
    "google": {
      "total": 25,
      "success": 24
    },
    "bing": {
      "total": 20,
      "success": 18
    }
  },
  "daily_breakdown": {
    "2024-01-15": {
      "total": 5,
      "success": 5
    }
  },
  "recent_submissions": [
    {
      "url": "https://example.com",
      "search_engine": "google",
      "status": "success",
      "submitted_at": "2024-01-15T11:20:00Z",
      "type": "url"
    }
  ]
}
```

### 22. Check Google Indexing Status

**Endpoint**: `GET /api/v1/advanced/indexing-status/{url}`

**Description**: Check detailed indexing status in Google Search Console

```bash
curl -X GET "http://localhost:8000/api/v1/advanced/indexing-status/https%3A%2F%2Fexample.com"
```

**Response**:
```json
{
  "status": "success",
  "indexed": true,
  "crawl_status": "CRAWLED",
  "last_crawl_time": "2024-01-15T10:30:00Z",
  "indexing_state": "INDEXING_ALLOWED",
  "page_fetch_state": "SUCCESSFUL",
  "details": {
    "inspectionResult": {
      "indexStatusResult": {
        "coverageState": "Submitted and indexed"
      }
    }
  }
}
```

---

## Complete CURL Collection Script

Here's a complete bash script that demonstrates all APIs:

```bash
#!/bin/bash

# RankRocket API Test Collection
BASE_URL="http://localhost:8000"

echo "=== RankRocket API Test Collection ==="

# 1. Submit URL for crawling
echo "1. Submitting URL for crawling..."
SUBMIT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/submit-url" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}')

SUBMISSION_ID=$(echo $SUBMIT_RESPONSE | jq -r '.submission_id')
echo "Submission ID: $SUBMISSION_ID"

# 2. Check crawl status
echo "2. Checking crawl status..."
curl -s -X GET "$BASE_URL/api/v1/crawl-status/$SUBMISSION_ID" | jq

# 3. Schedule a crawl
echo "3. Scheduling a crawl..."
curl -s -X POST "$BASE_URL/api/v1/advanced/schedule-crawl" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "priority": "high",
    "frequency": "daily"
  }' | jq

# 4. Bulk schedule crawls
echo "4. Bulk scheduling crawls..."
curl -s -X POST "$BASE_URL/api/v1/advanced/bulk-schedule" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": ["https://example.com", "https://example.com/about"],
    "priority": "medium"
  }' | jq

# 4b. Compare domains
echo "4b. Comparing domains..."
curl -s -X POST "$BASE_URL/api/v1/advanced/analytics/compare" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": ["https://example.com", "https://competitor.com"]
  }' | jq

# 5. Get analytics trends
echo "5. Getting analytics trends..."
curl -s -X GET "$BASE_URL/api/v1/advanced/analytics/trends?days=30" | jq

# 6. Generate sitemap
echo "6. Generating sitemap..."
curl -s -X POST "$BASE_URL/api/v1/advanced/generate-sitemap" \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "example.com",
    "include_images": true
  }' | jq

# 7. Generate robots.txt
echo "7. Generating robots.txt..."
curl -s -X POST "$BASE_URL/api/v1/advanced/generate-robots-txt?domain=example.com" | jq

# 8. Submit to search engines
echo "8. Submitting to search engines..."
curl -s -X POST "$BASE_URL/api/v1/advanced/submit-to-search-engines" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": ["https://example.com"],
    "search_engines": ["google", "bing"]
  }' | jq

# 9. Get performance dashboard
echo "9. Getting performance dashboard..."
curl -s -X GET "$BASE_URL/api/v1/advanced/analytics/dashboard" | jq

# 10. Generate comprehensive report
echo "10. Generating comprehensive report..."
curl -s -X POST "$BASE_URL/api/v1/advanced/generate-report" \
  -H "Content-Type: application/json" \
  -d '{
    "submission_id": "'$SUBMISSION_ID'",
    "format_type": "json"
  }' | jq

echo "=== API Test Collection Complete ==="
```

---

## Environment Variables

Create a `.env` file in your backend directory with the following variables:

```env
# Database
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=rankrocket

# API Keys (optional)
GOOGLE_SEARCH_CONSOLE_API_KEY=your_google_api_key
BING_WEBMASTER_API_KEY=your_bing_api_key
GOOGLE_ANALYTICS_API_KEY=your_analytics_key

# Redis (for background tasks)
REDIS_URL=redis://localhost:6379

# Crawler Settings
MAX_CONCURRENT_CRAWLS=10
CRAWL_TIMEOUT=30
USER_AGENT=RankRocket/1.0 (+https://rankrocket.com)
```

---

## Error Handling

All APIs return consistent error responses:

```json
{
  "detail": "Error message description"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

---

## Rate Limiting

The API implements rate limiting for search engine submissions:
- 1 second delay between URL submissions
- Maximum 1000 URLs per batch request
- Sitemap size limit: 50MB, 50,000 URLs

---

## Authentication

Currently, the API doesn't require authentication. In production, implement:
- API key authentication
- JWT tokens for user sessions
- Role-based access control