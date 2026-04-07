/* src/components/LiveCam.jsx */

import './LiveCam.css'

export default function LiveCam() {
  return (
    <div className="live-cam-section">
      <div className="camera-title">
        <span className="camera-icon">📷</span>
        <h2>Live Cam Screen</h2>
      </div>

      <img
        src="https://images.unsplash.com/photo-1523206489230-c012a1b44bc1?auto=format&fit=crop&w=900&q=80"
        alt="Live Camera"
        className="camera-image"
      />

      <div className="info-boxes">
        <div className="info-box">
          <span className="info-label">Time</span>
        </div>
        <div className="info-box">
          <span className="info-label">Frame Drops</span>
        </div>
      </div>
    </div>
  )
}