/* src/App.jsx */

import './App.css'
import Header from './components/Header'
import LiveCam from './components/LiveCam'
import DataGrid from './components/DataGrid'

function App() {
  return (
    <div className="page-shell">
      <div className="page-inner">
        <Header />
        <main className="main-content">
          <div className="left-panel">
            <LiveCam />
          </div>
          <div className="right-panel">
            <DataGrid />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App