// src/pages/PreviousRecords.jsx

import { useState, useEffect } from 'react'
import '../styles/PreviousRecords.css'
import { sensorAPI } from '../services/api'
import DateTimeModal from '../components/DateTimeModal'
import useSensorSocket from '../hooks/useSensorSocket'

const SENSOR_LABELS = [
  { key: 'iso_temp_pv',       label: 'ISO 온도 PV',     unit: '°C'  },
  { key: 'iso_temp_sv',       label: 'ISO 온도 SV',     unit: '°C'  },
  { key: 'iso_pump_speed',    label: 'ISO 펌프 속도',   unit: 'rpm' },
  { key: 'iso_press',         label: 'ISO 압력',        unit: 'bar' },
  { key: 'pol1_temp_pv',      label: 'POL1 온도 PV',   unit: '°C'  },
  { key: 'pol1_temp_sv',      label: 'POL1 온도 SV',   unit: '°C'  },
  { key: 'pol1_pump_speed',   label: 'POL1 펌프 속도',  unit: 'rpm' },
  { key: 'pol1_press',        label: 'POL1 압력',       unit: 'bar' },
  { key: 'pol2_temp_pv',      label: 'POL2 온도 PV',   unit: '°C'  },
  { key: 'pol2_temp_sv',      label: 'POL2 온도 SV',   unit: '°C'  },
  { key: 'pol2_pump_speed',   label: 'POL2 펌프 속도',  unit: 'rpm' },
  { key: 'pol2_press',        label: 'POL2 압력',       unit: 'bar' },
  { key: 'hot_water_temp_pv', label: '온수 온도 PV',    unit: '°C'  },
  { key: 'hot_water_temp_sv', label: '온수 온도 SV',    unit: '°C'  },
]

export default function PreviousRecords() {
  const [sensor, setSensor] = useState(null)
  const [isRealtime, setIsRealtime] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDateTime, setSelectedDateTime] = useState(null)

  const { data: wsData } = useSensorSocket()

  useEffect(() => {
    sensorAPI.getLatest()
      .then((res) => setSensor(res.data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (isRealtime && wsData) setSensor(wsData)
  }, [wsData, isRealtime])

  const handleDateTimeConfirm = async (dateTime) => {
    setIsModalOpen(false)
    setIsRealtime(false)
    setSelectedDateTime(dateTime)

    setLoading(true)
    setError(null)
    try {
      const endTime = `${dateTime.year}-${dateTime.month}-${dateTime.day}T${dateTime.hour}:${dateTime.minute}:59`
      const endDate = new Date(endTime)
      const startDate = new Date(endDate.getTime() - 60 * 1000)
      const startTime = startDate.toISOString().slice(0, 19)

      const res = await sensorAPI.getRange(startTime, endTime, 50)
      const records = res.data?.data || []
      if (records.length > 0) {
        setSensor(records[records.length - 1])
      } else {
        setSensor(null)
        setError('해당 시간에 데이터가 없습니다')
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const handleRefresh = () => {
    if (isRealtime) {
      sensorAPI.getLatest()
        .then((res) => setSensor(res.data))
        .catch(() => {})
    } else if (selectedDateTime) {
      handleDateTimeConfirm(selectedDateTime)
    }
  }

  const handleRealtimeMode = () => {
    setIsRealtime(true)
    setSelectedDateTime(null)
    setError(null)
    sensorAPI.getLatest()
      .then((res) => setSensor(res.data))
      .catch(() => {})
  }

  const timestamp = sensor?.recorded_at
    ? new Date(sensor.recorded_at).toLocaleString('ko-KR')
    : '-'

  const timeLabel = isRealtime
    ? `실시간 | ${timestamp}`
    : selectedDateTime
      ? `${selectedDateTime.year}.${selectedDateTime.month}.${selectedDateTime.day} ${selectedDateTime.hour}:${selectedDateTime.minute} 조회`
      : timestamp

  return (
    <main className="previous-records-container">
      <div className="records-header-box">
        <div className="records-header-row">
          <div className="records-header">
            <h2>이전 기록</h2>
          </div>
          <div className="header-actions">
            <span className="selected-time-label">{timeLabel}</span>
            <button className="search-open-btn" onClick={() => setIsModalOpen(true)}>
              시간 조회
            </button>
            {!isRealtime && (
              <button className="refresh-btn" onClick={handleRealtimeMode}>
                실시간
              </button>
            )}
            <button className="refresh-btn" onClick={handleRefresh}>
              새로고침
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <DateTimeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDateTimeConfirm}
        />
      )}

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="db-loading">로딩 중...</div>
      ) : (
        <div className="db-sensor-grid">
          {SENSOR_LABELS.map(({ key, label, unit }) => (
            <div key={key} className="db-sensor-item">
              <span className="db-sensor-label">{label}</span>
              <span className="db-sensor-value">
                {sensor != null ? (sensor[key] != null ? `${sensor[key]} ${unit}` : `- ${unit}`) : '-'}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
