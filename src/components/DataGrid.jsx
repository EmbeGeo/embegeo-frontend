/* src/components/DataGrid.jsx */

import { useState, useEffect } from 'react'
import './DataGrid.css'

const SENSOR_LABELS = [
  { key: 'iso_temp_pv',    label: 'ISO 온도 PV',    unit: '°C' },
  { key: 'iso_temp_sv',    label: 'ISO 온도 SV',    unit: '°C' },
  { key: 'iso_pump_speed', label: 'ISO 펌프 속도',  unit: 'rpm' },
  { key: 'iso_press',      label: 'ISO 압력',        unit: 'bar' },
  { key: 'pol1_temp_pv',   label: 'POL1 온도 PV',   unit: '°C' },
  { key: 'pol1_temp_sv',   label: 'POL1 온도 SV',   unit: '°C' },
  { key: 'pol1_pump_speed',label: 'POL1 펌프 속도', unit: 'rpm' },
  { key: 'pol1_press',     label: 'POL1 압력',       unit: 'bar' },
  { key: 'pol2_temp_pv',   label: 'POL2 온도 PV',   unit: '°C' },
  { key: 'pol2_temp_sv',   label: 'POL2 온도 SV',   unit: '°C' },
  { key: 'pol2_pump_speed',label: 'POL2 펌프 속도', unit: 'rpm' },
  { key: 'pol2_press',     label: 'POL2 압력',       unit: 'bar' },
  { key: 'mix_motor_speed',label: '믹서 모터 속도',  unit: 'rpm' },
  { key: 'total_count',    label: '총 생산 수',       unit: '개' },
]

export default function DataGrid() {
  const data = Array(14).fill(null)
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    setCurrentDate(`${year}년 ${month}월 ${day}일`)
  }, [])

  return (
    <div className="data-grid-section">
      <div className="grid-header">
        <h2>현재 기록</h2>
      </div>

      <div className="date-display">
        <span>{currentDate}</span>
      </div>

      <div className="grid-container">
        {SENSOR_LABELS.map(({ key, label, unit }) => (
          <div key={key} className="grid-item">
            <span className="grid-item-label">{label}</span>
            <span className="grid-item-value">
              {sensor ? `${sensor[key] ?? '-'} ${unit}` : '-'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
