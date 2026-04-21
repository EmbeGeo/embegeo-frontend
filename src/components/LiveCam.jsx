/* src/components/LiveCam.jsx */
import './LiveCam.css'
import liveCamScreenImage from '../assets/live_cam_screen.png'
import useSensorSocket from '../hooks/useSensorSocket'

export default function LiveCam() {
  const { data, connected } = useSensorSocket()

  const timeStr = data?.timestamp
    ? new Date(data.timestamp).toLocaleTimeString('ko-KR')
    : '-'
  const errorCount = data?.error_count ?? '-'

  return (
    <div className="live-cam-section">
      <div className="camera-title">
        <img src={liveCamScreenImage} alt="Live Camera Icon" className="camera-icon-image" />
        <h2>Live Cam Screen</h2>
        <span style={{ marginLeft: 8, fontSize: 12, color: connected ? '#3ecfcf' : '#aaa' }}>
          {connected ? '● 연결됨' : '○ 연결 중...'}
        </span>
      </div>

      <img
        src="https://images.unsplash.com/photo-1523206489230-c012a1b44bc1?auto=format&fit=crop&w=900&q=80"
        alt="Live Camera"
        className="camera-image"
      />

      <div className="info-boxes">
        <div className="info-box">
          <span className="info-label">Time</span>
          <span className="info-value">{timeStr}</span>
        </div>
        <div className="info-box">
          <span className="info-label">Error Count</span>
          <span className="info-value">{errorCount}</span>
        </div>
      </div>
    </div>
  )
}
