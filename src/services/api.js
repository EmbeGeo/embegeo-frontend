// src/services/api.js
// API 기본 설정 및 공통 요청 처리

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// 공통 fetch 함수
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, { ...defaultOptions, ...options })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// LiveCam 관련 API
export const liveCamAPI = {
  // 라이브 카메라 데이터 조회
  getData: () => fetchAPI('/live-cam'),
  
  // 라이브 카메라 타임스탬프 및 프레임드롭 정보
  getStats: () => fetchAPI('/live-cam/stats'),
}

// Record 관련 API
export const recordsAPI = {
  // 모든 기록 조회
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters)
    return fetchAPI(`/records?${params.toString()}`)
  },

  // 특정 날짜의 기록 조회
  getByDate: (date) => fetchAPI(`/records/date/${date}`),

  // 검색
  search: (query) => fetchAPI(`/records/search?q=${encodeURIComponent(query)}`),

  // 기록 조회 (필터 포함)
  getRecords: (options = {}) => {
    const { date, search, page = 1, limit = 14 } = options
    const params = new URLSearchParams({
      ...(date && { date }),
      ...(search && { search }),
      page,
      limit,
    })
    return fetchAPI(`/records?${params.toString()}`)
  },

  // 단일 기록 조회
  getById: (id) => fetchAPI(`/records/${id}`),

  // 기록 생성 (백엔드에서 필요시)
  create: (data) => fetchAPI('/records', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // 기록 수정
  update: (id, data) => fetchAPI(`/records/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // 기록 삭제
  delete: (id) => fetchAPI(`/records/${id}`, {
    method: 'DELETE',
  }),
}

export default {
  liveCamAPI,
  recordsAPI,
}
