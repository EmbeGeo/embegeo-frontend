/* src/components/DataGrid.jsx */

import { useState, useEffect } from 'react'
import './DataGrid.css'

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
        {data.map((_, index) => (
          <div key={index} className="grid-item"></div>
        ))}
      </div>
    </div>
  )
}