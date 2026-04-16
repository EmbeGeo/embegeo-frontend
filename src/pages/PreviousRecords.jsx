// src/pages/PreviousRecords.jsx

import { useState, useEffect } from 'react'
import '../styles/PreviousRecords.css'
import { recordsAPI } from '../services/api'
import DateTimeModal from '../components/DateTimeModal'

export default function PreviousRecords() {

  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedHour, setSelectedHour] = useState('')
  const [selectedMinute, setSelectedMinute] = useState('')
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filteredRecords, setFilteredRecords] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 현재 시간으로 초기화 (마운트 시에만 한 번)
  useEffect(() => {
    const now = new Date()
    const year = now.getFullYear().toString()
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    const hour = now.getHours().toString().padStart(2, '0')
    const minute = now.getMinutes().toString().padStart(2, '0')
    
    setSelectedYear(year)
    setSelectedMonth(month)
    setSelectedDay(day)
    setSelectedHour(hour)
    setSelectedMinute(minute)
  }, [])

  // 초기 데이터 로드
  useEffect(() => {
    if (selectedYear) {
      fetchRecords()
    }
  }, [selectedYear, selectedMonth, selectedDay, selectedHour, selectedMinute])

  useEffect(() => {
    applyFilters()
  }, [records, selectedYear, selectedMonth, selectedDay, selectedHour, selectedMinute])

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

    setFilteredRecords(filtered)
  }

  const handleRefresh = () => {
    fetchRecords()
  }

  const handleOpenModal = () => {
    const now = new Date()
    setSelectedYear(now.getFullYear().toString())
    setSelectedMonth((now.getMonth() + 1).toString().padStart(2, '0'))
    setSelectedDay(now.getDate().toString().padStart(2, '0'))
    setSelectedHour(now.getHours().toString().padStart(2, '0'))
    setSelectedMinute(now.getMinutes().toString().padStart(2, '0'))
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
    setIsModalOpen(false)
  }

  return (
    <main className="previous-records-container">
      <div className="records-header-row">
        <div className="records-header">
          <h2>이전 기록</h2>
        </div>
        <div className="header-actions">
          <button className="search-open-btn" onClick={handleOpenModal}>
            시간 조회
          </button>
          <button className="refresh-btn" onClick={handleRefresh}>
            새로고침
          </button>
        </div>
      </div>

      {isModalOpen && (
        <DateTimeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleDateTimeConfirm}
          initialDateTime={{
            year: selectedYear,
            month: selectedMonth,
            day: selectedDay,
            hour: selectedHour,
            minute: selectedMinute,
          }}
        />
      )}

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
