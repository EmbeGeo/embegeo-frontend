/* src/components/DataGrid.jsx */
import { useEffect, useState } from 'react'
import { sensorAPI } from '../services/api'
import useSensorSocket from '../hooks/useSensorSocket'
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
  const [sensor, setSensor] = useState(null)
  const { data: wsData } = useSensorSocket()

  useEffect(() => {
    sensorAPI.getLatest()
      .then((res) => setSensor(res.data))
      .catch(() => {})
  }, [])

  // WebSocket으로 실시간 데이터 수신 시 업데이트
  useEffect(() => {
    if (wsData) setSensor(wsData)
  }, [wsData])

  const timestamp = sensor?.timestamp
    ? new Date(sensor.timestamp).toLocaleDateString('ko-KR')
    : '-'

  return (
    <div className="data-grid-section">
      <div className="grid-header">
        <h2>현재 기록</h2>
      </div>

      <div className="date-display">
        <span>{timestamp}</span>
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
