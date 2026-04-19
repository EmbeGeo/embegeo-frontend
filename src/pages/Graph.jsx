// src/pages/Graph.jsx

import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { recordsAPI } from '../services/api'
import DateTimeModal from '../components/DateTimeModal'
import '../styles/Graph.css'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend)

const DAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

function getMondayOfWeek(year, month, day) {
  const date = new Date(`${year}-${month}-${day}`)
  const dow = date.getDay()
  const diff = dow === 0 ? -6 : 1 - dow
  const monday = new Date(date)
  monday.setDate(date.getDate() + diff)
  return monday
}

function formatDate(date) {
  return date.toISOString().split('T')[0]
}

function getTodayParts() {
  const now = new Date()
  return {
    year: now.getFullYear().toString(),
    month: (now.getMonth() + 1).toString().padStart(2, '0'),
    day: now.getDate().toString().padStart(2, '0'),
    hour: now.getHours().toString().padStart(2, '0'),
    minute: now.getMinutes().toString().padStart(2, '0'),
  }
}

export default function Graph() {
  const today = getTodayParts()
  const [selectedYear, setSelectedYear] = useState(today.year)
  const [selectedMonth, setSelectedMonth] = useState(today.month)
  const [selectedDay, setSelectedDay] = useState(today.day)
  const [selectedHour, setSelectedHour] = useState(today.hour)
  const [selectedMinute, setSelectedMinute] = useState(today.minute)
  const [weeklyCounts, setWeeklyCounts] = useState(Array(7).fill(0))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (selectedYear) {
      fetchWeeklyData()
    }
  }, [selectedYear, selectedMonth, selectedDay])

  const fetchWeeklyData = async () => {
    setLoading(true)
    setError(null)
    try {
      const monday = getMondayOfWeek(selectedYear, selectedMonth, selectedDay)
      const counts = []
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday)
        d.setDate(monday.getDate() + i)
        const dateStr = formatDate(d)
        try {
          const data = await recordsAPI.getRecords({ date: dateStr, limit: 100 })
          counts.push((data.records || []).length)
        } catch {
          counts.push(0)
        }
      }
      setWeeklyCounts(counts)
    } catch (err) {
      setError(err.message)
      setWeeklyCounts(Array(7).fill(0))
    }
    setLoading(false)
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
    setIsModalOpen(false)
  }

  const chartData = {
    labels: DAY_LABELS,
    datasets: [
      {
        label: '기록 수',
        data: weeklyCounts,
        borderColor: '#3ecfcf',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointBackgroundColor: '#3ecfcf',
        pointBorderColor: '#3ecfcf',
        pointRadius: 4,
        tension: 0,
        fill: false,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y}건`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { color: '#333', font: { size: 12, weight: '600' } },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { color: '#555', font: { size: 11 }, precision: 0, stepSize: 1 },
        border: { display: false },
      },
    },
  }

  return (
    <main className="graph-container">
      <div className="graph-header-row">
        <div className="graph-header">
          <h2>기록 그래프</h2>
        </div>
        <div className="header-actions">
          <button className="search-open-btn" onClick={handleOpenModal}>
            시간 조회
          </button>
          <button className="refresh-btn" onClick={fetchWeeklyData}>
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
        <div className="graph-error-message">
          API 연결 중: {error}. 빈 데이터로 표시합니다.
        </div>
      )}

      <div className="chart-wrapper">
        {loading ? (
          <div className="loading-message">로딩 중...</div>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>
    </main>
  )
}
