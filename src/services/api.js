// src/services/api.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://10.150.1.34:8000/api/v1'
const API_KEY = import.meta.env.VITE_API_KEY || ''

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      ...options.headers,
    },
  }

  const response = await fetch(url, { ...defaultOptions, ...options })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return await response.json()
}

// 센서 데이터 API
export const sensorAPI = {
  // 최신 센서 데이터 조회
  getLatest: () => fetchAPI('/sensor-data/latest'),

  // 시간 범위로 센서 데이터 조회
  // startTime, endTime: ISO 8601 문자열 (예: "2026-04-21T00:00:00")
  getRange: (startTime, endTime, limit = 100, offset = 0) => {
    const params = new URLSearchParams({ start_time: startTime, end_time: endTime, limit, offset })
    return fetchAPI(`/sensor-data/range?${params.toString()}`)
  },
}

// 통계 API
export const statisticsAPI = {
  // 일일 통계 조회 (date: "YYYY-MM-DD")
  getDaily: (date) => fetchAPI(`/statistics/daily?date=${date}`),

  // 최근 7일 요약
  getWeeklySummary: () => fetchAPI('/statistics/summary'),
}

export default { sensorAPI, statisticsAPI }
