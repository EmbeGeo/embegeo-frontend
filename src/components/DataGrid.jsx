/* src/components/DataGrid.jsx */

import './DataGrid.css'

export default function DataGrid() {
  const data = Array(14).fill(null)

  return (
    <div className="data-grid-section">
      <div className="grid-header">
        <h2>현재 기록</h2>
      </div>

      <div className="date-display">
        <span>2026-04-10</span>
      </div>

      <div className="grid-container">
        {data.map((_, index) => (
          <div key={index} className="grid-item"></div>
        ))}
      </div>
    </div>
  )
}