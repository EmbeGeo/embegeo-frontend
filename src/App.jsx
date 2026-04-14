/* src/App.jsx */

import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import PreviousRecords from './pages/PreviousRecords'

function App() {
  return (
    <Router>
      <div className="page-shell">
        <div className="page-inner">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/records" element={<PreviousRecords />} />
            <Route path="/graph" element={<div style={{ padding: '20px' }}>Graph 페이지 (개발 중)</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App