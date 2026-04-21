// src/pages/PreviousRecords.jsx

import { useState, useEffect } from 'react'
import '../styles/PreviousRecords.css'
import { sensorAPI } from '../services/api'
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
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const now = new Date()
    setSelectedYear(now.getFullYear().toString())
    setSelectedMonth((now.getMonth() + 1).toString().padStart(2, '0'))
    setSelectedDay(now.getDate().toString().padStart(2, '0'))
    setSelectedHour(now.getHours().toString().padStart(2, '0'))
    setSelectedMinute(now.getMinutes().toString().padStart(2, '0'))
  }, [])

  useEffect(() => {
    if (selectedYear) fetchRecords()
  }, [selectedYear, selectedMonth, selectedDay, selectedHour, selectedMinute])

  const fetchRecords = async () => {
    setLoading(true)
    setError(null)
    try {
      // 선택한 시각 기준으로 앞 1시간 범위 조회
      const endTime = `${selectedYear}-${selectedMonth}-${selectedDay}T${selectedHour}:${selectedMinute}:00`
      const endDate = new Date(endTime)
      const startDate = new Date(endDate.getTime() - 60 * 60 * 1000)
      const startTime = startDate.toISOString().slice(0, 19)

      const res = await sensorAPI.getRange(startTime, endTime, 100)
      setRecords(res.data?.data || [])
    } catch (err) {
      console.error('Failed to fetch records:', err)
      setError(err.message)
      setRecords([])
    }
    setLoading(false)
  }

  const handleRefresh = () => fetchRecords()

  const handleOpenModal = () => {
    const now = new Date()
    setSelectedYear(now.getFullYear().toString())
    setSelectedMonth((now.getMonth() + 1).toString().padStart(2, '0'))
    setSelectedDay(now.getDate().toString().padStart(2, '0'))
    setSelectedHour(now.getHours().toString().padStart(2, '0'))
    setSelectedMinute(now.getMinutes().toString().padStart(2, '0'))
    setIsModalOpen(true)
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
          onClose={() => setIsModalOpen(false)}
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
        <div className="error-message">API 오류: {error}</div>
      )}

      <div className="records-grid">
        {loading ? (
          <div className="loading-message">로딩 중...</div>
        ) : records.length > 0 ? (
          records.map((record, index) => (
            <div key={record.id ?? index} className="record-item">
              <div className="record-title">
                {new Date(record.timestamp).toLocaleString('ko-KR')}
              </div>
              <div className="record-details">
                총 생산: {record.total_count}개 / 오류: {record.error_count}개
              </div>
            </div>
          ))
        ) : (
          <div className="no-records-message">기록이 없습니다</div>
        )}
      </div>
    </main>
  )
}
