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
import { sensorAPI } from '../services/api'
import DateTimeModal from '../components/DateTimeModal'
import '../styles/Graph.css'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend)

const FIELDS = [
  { key: 'iso_temp_pv',       label: 'ISO 온도 PV',    unit: '°C',  color: '#e74c3c' },
  { key: 'iso_temp_sv',       label: 'ISO 온도 SV',    unit: '°C',  color: '#ff6b6b' },
  { key: 'iso_pump_speed',    label: 'ISO 펌프속도',   unit: 'rpm', color: '#e67e22' },
  { key: 'iso_press',         label: 'ISO 압력',       unit: 'bar', color: '#f39c12' },
  { key: 'pol1_temp_pv',      label: 'POL1 온도 PV',  unit: '°C',  color: '#27ae60' },
  { key: 'pol1_temp_sv',      label: 'POL1 온도 SV',  unit: '°C',  color: '#2ecc71' },
  { key: 'pol1_pump_speed',   label: 'POL1 펌프속도', unit: 'rpm', color: '#16a085' },
  { key: 'pol1_press',        label: 'POL1 압력',     unit: 'bar', color: '#1abc9c' },
  { key: 'pol2_temp_pv',      label: 'POL2 온도 PV',  unit: '°C',  color: '#2980b9' },
  { key: 'pol2_temp_sv',      label: 'POL2 온도 SV',  unit: '°C',  color: '#74b9ff' },
  { key: 'pol2_pump_speed',   label: 'POL2 펌프속도', unit: 'rpm', color: '#6c5ce7' },
  { key: 'pol2_press',        label: 'POL2 압력',     unit: 'bar', color: '#a29bfe' },
  { key: 'hot_water_temp_pv', label: '온수 온도 PV',  unit: '°C',  color: '#d35400' },
  { key: 'hot_water_temp_sv', label: '온수 온도 SV',  unit: '°C',  color: '#fd79a8' },
]

function getNow() {
  const now = new Date()
  return {
    year:   now.getFullYear().toString(),
    month:  (now.getMonth() + 1).toString().padStart(2, '0'),
    day:    now.getDate().toString().padStart(2, '0'),
    hour:   now.getHours().toString().padStart(2, '0'),
    minute: now.getMinutes().toString().padStart(2, '0'),
  }
}

function calcStats(records, key) {
  const vals = records.map(r => r[key]).filter(v => v != null)
  if (!vals.length) return null
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length
  return {
    min: min.toFixed(2),
    max: max.toFixed(2),
    avg: avg.toFixed(2),
    variation: (max - min).toFixed(2),
  }
}

function addOneMinute(dt) {
  const pad = n => n.toString().padStart(2, '0')
  let m = parseInt(dt.minute) + 1
  let h = parseInt(dt.hour)
  if (m >= 60) { m = 0; h = (h + 1) % 24 }
  return `${dt.year}-${dt.month}-${dt.day}T${pad(h)}:${pad(m)}:00`
}

export default function Graph() {
  const [dt, setDt]           = useState(getNow)
  const [records, setRecords] = useState([])
  const [active, setActive]   = useState(() => new Set(FIELDS.map(f => f.key)))
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [modalOpen, setModalOpen]       = useState(false)
  const [fieldModalOpen, setFieldModalOpen] = useState(false)
  const [pendingActive, setPendingActive]   = useState(() => new Set(FIELDS.map(f => f.key)))

  useEffect(() => { fetchData() }, [])

  const fetchDataWith = async (target) => {
    setLoading(true)
    setError(null)
    try {
      const start = `${target.year}-${target.month}-${target.day}T${target.hour}:${target.minute}:00`
      const end   = addOneMinute(target)
      const res   = await sensorAPI.getRange(start, end, 1000)
      setRecords(res.data?.data || [])
    } catch (err) {
      setError(err.message)
      setRecords([])
    }
    setLoading(false)
  }

  const fetchData = () => fetchDataWith(dt)

  const toggleField = (key) =>
    setActive(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  const labels = records.map(r => {
    const d = new Date(r.recorded_at)
    return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`
  })

  const chartData = {
    labels,
    datasets: FIELDS
      .filter(f => active.has(f.key))
      .map(f => ({
        label: f.label,
        data: records.map(r => r[f.key]),
        borderColor: f.color,
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        pointRadius: records.length > 30 ? 0 : 3,
        tension: 0.3,
      })),
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const field = FIELDS.find(f => f.label === ctx.dataset.label)
            return ` ${ctx.dataset.label}: ${ctx.parsed.y} ${field?.unit ?? ''}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { maxTicksLimit: 12, color: '#555', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { color: '#555', font: { size: 11 } },
      },
    },
  }

  const handleModalConfirm = (newDt) => {
    setDt(newDt)
    // 모달에서 확인 후 바로 조회
    fetchDataWith(newDt)
  }

  return (
    <main className="graph-container">

      {/* ── 상단 헤더 + 조회 컨트롤 ── */}
      <div className="graph-header-row">
        <h2>기록 그래프</h2>
        <div className="graph-controls">
          <span className="selected-time">
            {dt.year}.{dt.month}.{dt.day} {dt.hour}:{dt.minute} ~ {addOneMinute(dt).slice(11, 16)}
          </span>
          <button className="search-open-btn" onClick={() => setModalOpen(true)}>시간 조회</button>
          <button
            className="field-select-btn"
            onClick={() => { setPendingActive(new Set(active)); setFieldModalOpen(true) }}
          >
            항목 선택 ({active.size}/{FIELDS.length})
          </button>
          <button className="refresh-btn" onClick={fetchData}>새로고침</button>
        </div>
      </div>

      {modalOpen && (
        <DateTimeModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleModalConfirm}
          initialDateTime={dt}
        />
      )}


      {/* ── 항목 선택 모달 ── */}
      {fieldModalOpen && (
        <div className="field-modal-overlay" onClick={() => setFieldModalOpen(false)}>
          <div className="field-modal" onClick={e => e.stopPropagation()}>
            <div className="field-modal-header">
              <span>항목 선택</span>
              <button className="field-modal-close" onClick={() => setFieldModalOpen(false)}>×</button>
            </div>
            <div className="field-modal-actions">
              <button onClick={() => setPendingActive(new Set(FIELDS.map(f => f.key)))}>전체 선택</button>
              <button onClick={() => setPendingActive(new Set())}>전체 해제</button>
            </div>
            <div className="field-modal-list">
              {FIELDS.map(f => (
                <label key={f.key} className="field-modal-item">
                  <input
                    type="checkbox"
                    checked={pendingActive.has(f.key)}
                    onChange={() => {
                      setPendingActive(prev => {
                        const next = new Set(prev)
                        next.has(f.key) ? next.delete(f.key) : next.add(f.key)
                        return next
                      })
                    }}
                  />
                  <span className="field-modal-dot" style={{ background: f.color }} />
                  <span className="field-modal-label">{f.label}</span>
                  <span className="field-modal-unit">{f.unit}</span>
                </label>
              ))}
            </div>
            <div className="field-modal-footer">
              <button className="field-modal-cancel" onClick={() => setFieldModalOpen(false)}>취소</button>
              <button className="field-modal-confirm" onClick={() => { setActive(pendingActive); setFieldModalOpen(false) }}>확인</button>
            </div>
          </div>
        </div>
      )}

      {error && <div className="graph-error-message">API 오류: {error}</div>}

      {/* ── 차트 ── */}
      <div className="chart-wrapper">
        {loading ? (
          <div className="chart-placeholder">로딩 중...</div>
        ) : records.length === 0 ? (
          <div className="chart-placeholder">해당 시간대 데이터가 없습니다</div>
        ) : active.size === 0 ? (
          <div className="chart-placeholder">항목을 선택해 주세요</div>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>

      {/* ── 변동 통계 테이블 ── */}
      {records.length > 0 && active.size > 0 && (
        <div className="stats-table-wrapper">
          <div className="stats-title">
            구간 통계 &nbsp;
            <span className="stats-range">
              {dt.year}.{dt.month}.{dt.day} {dt.hour}:{dt.minute}:00
              &nbsp;→&nbsp;
              {addOneMinute(dt).replace('T', ' ')}
            </span>
            <span className="stats-count">({records.length}건)</span>
          </div>
          <table className="stats-table">
            <thead>
              <tr>
                <th>항목</th>
                <th>최솟값</th>
                <th>최댓값</th>
                <th>평균</th>
                <th>변동폭</th>
                <th>단위</th>
              </tr>
            </thead>
            <tbody>
              {FIELDS.filter(f => active.has(f.key)).map(f => {
                const s = calcStats(records, f.key)
                return (
                  <tr key={f.key}>
                    <td>
                      <div className="stat-label-cell">
                        <span className="stat-dot" style={{ background: f.color }} />
                        {f.label}
                      </div>
                    </td>
                    <td>{s?.min ?? '-'}</td>
                    <td>{s?.max ?? '-'}</td>
                    <td>{s?.avg ?? '-'}</td>
                    <td className={s && parseFloat(s.variation) > 0 ? 'variation-nonzero' : ''}>
                      {s?.variation ?? '-'}
                    </td>
                    <td className="unit-cell">{f.unit}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

    </main>
  )
}
