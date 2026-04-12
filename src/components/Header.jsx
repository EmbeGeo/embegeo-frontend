/* src/components/Header.jsx */

import './Header.css'

import databaseIcon from '../assets/database.png'
import graphIcon from '../assets/graph.png'
import homeIcon from '../assets/home.png'
import easyGeoLogo from '../assets/easyGeo.png'

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src={easyGeoLogo} alt="EasyGeo Logo" className="logo-image" />
      </div>
      <nav className="nav">
        <button className="nav-btn">
          <img src={databaseIcon} alt="Database" className="nav-icon" />
          DataBase
        </button>
        <button className="nav-btn">
          <img src={graphIcon} alt="Graph" className="nav-icon" />
          Graph
        </button>
        <button className="nav-btn">
          <img src={homeIcon} alt="Home" className="nav-icon" />
          Home
        </button>
      </nav>
    </header>
  )
}