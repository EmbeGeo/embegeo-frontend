// src/pages/Home.jsx

import LiveCam from '../components/LiveCam'
import DataGrid from '../components/DataGrid'

export default function Home() {
  return (
    <main className="main-content">
      <div className="left-panel">
        <LiveCam />
      </div>
      <div className="right-panel">
        <DataGrid />
      </div>
    </main>
  )
}
