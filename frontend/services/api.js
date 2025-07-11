// API service layer for RankRocket backend integration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || error.message || 'API request failed');
  }
  return response.json();
};

// Basic Crawl APIs
export const crawlApi = {
  // Submit URL for crawling
  submitUrl: async (url) => {
    const response = await fetch(`${BACKEND_URL}/api/v1/submit-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    return handleResponse(response);
  },

  // Check crawl status
  checkStatus: async (submissionId) => {
    const response = await fetch(`${BACKEND_URL}/api/v1/crawl-status/${submissionId}`);
    return handleResponse(response);
  },
};

// Reports APIs
export const reportsApi = {
  // Get SEO report
  getReport: async (submissionId) => {
    const response = await fetch(`${BACKEND_URL}/api/v1/report/${submissionId}`);
    return handleResponse(response);
  },

  // Get all reports
  getAllReports: async (skip = 0, limit = 10) => {
    const response = await fetch(`${BACKEND_URL}/api/v1/reports?skip=${skip}&limit=${limit}`);
    return handleResponse(response);
  },
};

// Advanced Crawl Scheduling APIs
export const advancedApi = {
  // Schedule single crawl
  scheduleCrawl: async (url, priority = 'medium', frequency = 'daily', customInterval = null) => {
    const response = await fetch(`${BACKEND_URL}/api/v1/advanced/schedule-crawl`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, priority, frequency, custom_interval: customInterval }),
    });
    return handleResponse(response);
  },

  // Bulk schedule crawls
  bulkSchedule: async (urls, priority = 'medium', frequency = 'weekly') => {
    const response = await fetch(`${BACKEND_URL}/api/v1/advanced/bulk-schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls, priority, frequency }),
    });
    return handleResponse(response);
  },

  // Get scheduled crawls
  getScheduledCrawls: async (status = null) => {
    const url = status 
      ? `${BACKEND_URL}/api/v1/advanced/scheduled-crawls?status=${status}`
      : `${BACKEND_URL}/api/v1/advanced/scheduled-crawls`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  // Get crawl statistics
  getCrawlStatistics: async () => {
    const response = await fetch(`${BACKEND_URL}/api/v1/advanced/crawl-statistics`);
    return handleResponse(response);
  },
};

// Analytics & Trending APIs
export const analyticsApi = {
  // Get SEO trends
  getTrends: async (url = null, days = 30) => {
    const queryParams = new URLSearchParams({ days: days.toString() });
    if (url) queryParams.append('url', url);
    
    const response = await fetch(`${BACKEND_URL}/api/v1/advanced/analytics/trends?${queryParams}`);
    return handleResponse(response);
  },

  // Compare domains
  compareDomains: async (urls) => {
    const response = await fetch(`${BACKEND_URL}/api/v1/advanced/analytics/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls }),
    });
    return handleResponse(response);
  },

  // Keyword analysis
  getKeywordAnalysis: async (url) => {
    const encodedUrl = encodeURIComponent(url);
    const response = await fetch(`${BACKEND_URL}/api/v1/advanced/analytics/keywords/${encodedUrl}`);
    return handleResponse(response);
  },

  // Performance dashboard
  getDashboard: async () => {
    const response = await fetch(`${BACKEND_URL}/api/v1/advanced/analytics/dashboard`);
    return handleResponse(response);
  },
};

// Report Generation APIs
export const reportGenerationApi = {
  // Generate comprehensive report
  generateReport: async (submissionId, formatType = 'json') => {
    const response = await fetch(`${BACKEND_URL}/api/v1/advanced/generate-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submission_id: submissionId, format_type: formatType }),
    });
    return handleResponse(response);
  },
};

// Indexing Support APIs
export const indexingApi = {
  // Generate sitemap
  generateSitemap: async (domain, includeImages = true, includeVideos = false) => {
    const response = await fetch(`${BACKEND_URL}/api/v1/advanced/generate-sitemap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        domain, 
        include_images: includeImages, 
        include_videos: includeVideos 
      }),
    });
    return handleResponse(response);
  },

  // Generate robots.txt
  generateRobotsTxt: async (domain, sitemapUrls = []) => {
    const response = await fetch(`${BACKEND_URL}/api/v1/advanced/generate-robots-txt?domain=${domain}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sitemap_urls: sitemapUrls }),
    });
    return handleResponse(response);
  },

  // Analyze internal linking
  analyzeInternalLinking: async (domain) => {
    const response = await fetch(`${BACKEND_URL}/api/v1/advanced/internal-linking/${domain}`);
    return handleResponse(response);
  },

  // Check indexing status
  checkIndexingStatus: async (urls) => {
    const response = await fetch(`${BACKEND_URL}/api/v1/advanced/check-indexing-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls }),
    });
    return handleResponse(response);
  },
};

// Search Engine Submission APIs
export const searchEngineApi = {
  // Submit URLs to search engines
  submitToSearchEngines: async (urls, searchEngines = ['google', 'bing']) => {
    const response = await fetch(`${BACKEND_URL}/api/v1/advanced/submit-to-search-engines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls, search_engines: searchEngines }),
    });
    return handleResponse(response);
  },

  // Submit sitemap to search engines
  submitSitemap: async (sitemapUrl, siteUrl, searchEngines = ['google', 'bing']) => {
    const response = await fetch(`${BACKEND_URL}/api/v1/advanced/submit-sitemap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        sitemap_url: sitemapUrl, 
        site_url: siteUrl, 
        search_engines: searchEngines 
      }),
    });
    return handleResponse(response);
  },

  // Get search performance
  getSearchPerformance: async (siteUrl, days = 30) => {
    const encodedUrl = encodeURIComponent(siteUrl);
    const response = await fetch(`${BACKEND_URL}/api/v1/advanced/search-performance/${encodedUrl}?days=${days}`);
    return handleResponse(response);
  },

  // Get submission history
  getSubmissionHistory: async (searchEngine = null, days = 30) => {
    const queryParams = new URLSearchParams({ days: days.toString() });
    if (searchEngine) queryParams.append('search_engine', searchEngine);
    
    const response = await fetch(`${BACKEND_URL}/api/v1/advanced/submission-history?${queryParams}`);
    return handleResponse(response);
  },

  // Check Google indexing status
  checkGoogleIndexingStatus: async (url) => {
    const encodedUrl = encodeURIComponent(url);
    const response = await fetch(`${BACKEND_URL}/api/v1/advanced/indexing-status/${encodedUrl}`);
    return handleResponse(response);
  },
};

// Utility functions
export const utils = {
  // Validate URL format
  isValidUrl: (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  },

  // Format date for display
  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // Get SEO score color
  getSeoScoreColor: (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  },

  // Get priority color
  getPriorityColor: (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  },
};

// Default export with all APIs
export default {
  crawl: crawlApi,
  reports: reportsApi,
  advanced: advancedApi,
  analytics: analyticsApi,
  reportGeneration: reportGenerationApi,
  indexing: indexingApi,
  searchEngine: searchEngineApi,
  utils,
};