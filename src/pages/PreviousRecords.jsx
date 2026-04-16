// src/pages/PreviousRecords.jsx

import { useState, useEffect } from 'react'
import '../styles/PreviousRecords.css'
import { recordsAPI } from '../services/api'
import DateTimeModal from '../components/DateTimeModal'

export default function PreviousRecords() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedMonth, setSelectedMonth] = useState('04')
  const [selectedDay, setSelectedDay] = useState('10')
  const [selectedHour, setSelectedHour] = useState('00')
  const [selectedMinute, setSelectedMinute] = useState('00')
  const [filteredRecords, setFilteredRecords] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 초기 데이터 로드
  useEffect(() => {
    fetchRecords()
  }, [])

  // 날짜/시간 또는 검색 조건 변경 시 필터링
  useEffect(() => {
    applyFilters()
  }, [records, selectedYear, selectedMonth, selectedDay, selectedHour, selectedMinute, searchQuery])

  const fetchRecords = async () => {
    setLoading(true)
    setError(null)
    try {
      // 백엔드 API 호출 - 나중에 실제 엔드포인트로 변경
      const dateTime = `${selectedYear}-${selectedMonth}-${selectedDay} ${selectedHour}:${selectedMinute}`
      const data = await recordsAPI.getRecords({
        dateTime: dateTime,
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

    // 날짜/시간별 필터링
    const selectedDateTime = `${selectedYear}-${selectedMonth}-${selectedDay} ${selectedHour}:${selectedMinute}`
    if (selectedDateTime) {
      // 실제 백엔드에서는 이미 필터링되어 반환됨
      // 클라이언트 측 백업 필터링
      filtered = filtered.filter((record) => {
        if (!record) return true // null 데이터는 표시
        return record.dateTime === selectedDateTime
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleRefresh = () => {
    fetchRecords()
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleDateTimeConfirm = (dateTime) => {
    setSelectedYear(dateTime.year)
    setSelectedMonth(dateTime.month)
    setSelectedDay(dateTime.day)
    setSelectedHour(dateTime.hour)
    setSelectedMinute(dateTime.minute)
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

        <div className="datetime-picker-section">
          <button
            className="datetime-select-btn"
            onClick={handleOpenModal}
          >
            {selectedYear}년 {selectedMonth}월 {selectedDay}일 {selectedHour}시 {selectedMinute}분
          </button>
        </div>

        <button className="refresh-btn" onClick={handleRefresh}>
          새로고침
        </button>
      </div>

      <DateTimeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleDateTimeConfirm}
        initialDateTime={{
          year: selectedYear,
          month: selectedMonth,
          day: selectedDay,
          hour: selectedHour,
          minute: selectedMinute
        }}
      />

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
