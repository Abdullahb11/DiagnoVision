// Backend API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const API_ENDPOINTS = {
  analyze: `${API_BASE_URL}/api/analyze`,
  scanReportNotify: `${API_BASE_URL}/api/scan-report-notify`,
  health: `${API_BASE_URL}/health`
}

