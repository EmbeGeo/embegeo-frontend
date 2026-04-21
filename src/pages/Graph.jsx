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
import { statisticsAPI } from '../services/api'
import DateTimeModal from '../components/DateTimeModal'
import '../styles/Graph.css'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend)

const DAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

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
    fetchWeeklyData()
  }, [selectedYear, selectedMonth, selectedDay])

  const fetchWeeklyData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await statisticsAPI.getWeeklySummary()
      const dailyData = res.data?.daily_data || []
      // daily_data는 최근 7일 순서 (오래된 날부터) → MON~SUN 순서로 매핑
      const counts = dailyData.map((d) => d.total_count)
      // 7개 미만이면 앞을 0으로 채움
      while (counts.length < 7) counts.unshift(0)
      setWeeklyCounts(counts.slice(-7))
    } catch (err) {
      setError(err.message)
      setWeeklyCounts(Array(7).fill(0))
    }
    setLoading(false)
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
        label: '생산 수',
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
          label: (ctx) => ` ${ctx.parsed.y}개`,
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
          <button className="search-open-btn" onClick={() => setIsModalOpen(true)}>
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
        <div className="graph-error-message">API 오류: {error}</div>
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
