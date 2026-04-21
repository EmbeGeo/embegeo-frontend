/* src/components/Header.jsx */

import './Header.css'
import { useNavigate } from 'react-router-dom'

import databaseIcon from '../assets/database.png'
import graphIcon from '../assets/graph.png'
import homeIcon from '../assets/home.png'
import easyGeoLogo from '../assets/easyGeo.png'

export default function Header() {
  const navigate = useNavigate()

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <header className="header">
      <div className="logo">
        <img src={easyGeoLogo} alt="EasyGeo Logo" className="logo-image" />
      </div>
      <nav className="nav">
        <button className="nav-btn" onClick={() => handleNavigation('/records')}>
          <img src={databaseIcon} alt="Database" className="nav-icon" />
          DataBase
        </button>
        <button className="nav-btn" onClick={() => handleNavigation('/graph')}>
          <img src={graphIcon} alt="Graph" className="nav-icon" />
          Graph
        </button>
        <button className="nav-btn" onClick={() => handleNavigation('/')}>
          <img src={homeIcon} alt="Home" className="nav-icon" />
          Home
        </button>
      </nav>
    </header>
  )
}