// src/pages/PreviousRecords.jsx

import { useState, useEffect } from 'react'
import '../styles/PreviousRecords.css'
import { recordsAPI } from '../services/api'

export default function PreviousRecords() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState('2026-04-10')
  const [filteredRecords, setFilteredRecords] = useState([])

  // 초기 데이터 로드
  useEffect(() => {
    fetchRecords()
  }, [])

  // 날짜 또는 검색 조건 변경 시 필터링
  useEffect(() => {
    applyFilters()
  }, [records, selectedDate, searchQuery])

  const fetchRecords = async () => {
    setLoading(true)
    setError(null)
    try {
      // 백엔드 API 호출 - 나중에 실제 엔드포인트로 변경
      const data = await recordsAPI.getRecords({
        date: selectedDate,
        limit: 100,
      })
      setRecords(data.records || Array(14).fill(null))
    } catch (err) {
      console.error('Failed to fetch records:', err)
      // 개발 중에는 더미 데이터 사용
      setRecords(Array(14).fill(null))
      setError(err.message)
    }
    setLoading(false)
  }

  const applyFilters = () => {
    let filtered = records

    // 날짜별 필터링
    if (selectedDate) {
      // 실제 백엔드에서는 이미 필터링되어 반환됨
      // 클라이언트 측 백업 필터링
      filtered = filtered.filter((record) => {
        if (!record) return true // null 데이터는 표시
        return record.date === selectedDate
      })
    }

    // 검색 쿼리 필터링
    if (searchQuery.trim()) {
      filtered = filtered.filter((record) => {
        if (!record) return false
        const query = searchQuery.toLowerCase()
        return (
          record.title?.toLowerCase().includes(query) ||
          record.description?.toLowerCase().includes(query) ||
          record.location?.toLowerCase().includes(query)
        )
      })
    }

    setFilteredRecords(filtered)
  }

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleRefresh = () => {
    fetchRecords()
  }

  return (
    <main className="previous-records-container">
      <div className="records-header">
        <h2>이전 기록</h2>
      </div>

      <div className="controls-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="검색"
            className="search-input"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="date-picker-section">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="date-display"
          />
        </div>

        <button className="refresh-btn" onClick={handleRefresh}>
          새로고침
        </button>
      </div>

      {error && (
        <div className="error-message">
          API 연결 중: {error}. 더미 데이터를 표시합니다.
        </div>
      )}

      <div className="records-grid">
        {loading ? (
          <div className="loading-message">로딩 중...</div>
        ) : filteredRecords.length > 0 ? (
          filteredRecords.map((record, index) => (
            <div key={index} className="record-item">
              {record && (
                <>
                  <div className="record-title">{record.title}</div>
                  <div className="record-details">
                    {record.description}
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="no-records-message">기록이 없습니다</div>
        )}
      </div>
    </main>
  )
}
