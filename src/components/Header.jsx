/* src/components/Header.jsx */

import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <span className="logo-icon">◆</span>
        <span className="logo-text">Easy<span className="logo-gray">Geo</span></span>
      </div>
      <nav className="nav">
        <button className="nav-btn">🗄️ DataBase</button>
        <button className="nav-btn">📊 Graph</button>
        <button className="nav-btn">🏠 Home</button>
      </nav>
    </header>
  )
}