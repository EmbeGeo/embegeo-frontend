/* src/App.jsx */

import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import PreviousRecords from './pages/PreviousRecords'
import Graph from './pages/Graph'

function App() {
  return (
    <Router>
      <div className="page-shell">
        <div className="page-inner">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/records" element={<PreviousRecords />} />
            <Route path="/graph" element={<Graph />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App