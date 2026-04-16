/* src/components/LiveCam.jsx */

import { useState, useEffect } from 'react'
import './LiveCam.css'
import liveCamScreenImage from '../assets/live_cam_screen.png'

export default function LiveCam() {
  const [timeDisplay, setTimeDisplay] = useState('')
  const [frameDrops] = useState(0)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const minute = String(now.getMinutes()).padStart(2, '0')
      setTimeDisplay(`${month}월 ${day}일 ${minute}분`)
    }
    
    updateTime()
    const timer = setInterval(updateTime, 60000) // 매 분마다 업데이트
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="live-cam-section">
      <div className="camera-title">
        <img src={liveCamScreenImage} alt="Live Camera Icon" className="camera-icon-image" />
        <h2>Live Cam Screen</h2>
      </div>

      <img
        src="https://images.unsplash.com/photo-1523206489230-c012a1b44bc1?auto=format&fit=crop&w=900&q=80"
        alt="Live Camera"
        className="camera-image"
      />

      <div className="info-boxes">
        <div className="info-box">
          <div className="info-content">
            <span className="info-label">Time</span>
            <span className="info-value">{timeDisplay}</span>
          </div>
        </div>
        <div className="info-box">
          <div className="info-content">
            <span className="info-label">Frame Drops</span>
            <span className="info-value">{frameDrops}</span>
          </div>
        </div>
      </div>
    </div>
  )
}