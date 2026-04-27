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
      </div>

      <img
        src="https://images.unsplash.com/photo-1523206489230-c012a1b44bc1?auto=format&fit=crop&w=900&q=80"
        alt="Live Camera"
        className="camera-image"
      />

      <div className="info-boxes">
        <div className="info-box">
          <span className="info-label">Time</span>
          <span className="info-value" style={{ alignSelf: 'center' }}>{timeStr}</span>
        </div>
        <div className="info-box">
          <span className="info-label">Connection</span>
          <span className="info-value" style={{ color: connected ? '#16a34a' : '#dc2626', fontSize: 18, alignSelf: 'center' }}>
            {connected ? '● 연결됨' : '○ 연결 끊김'}
          </span>
        </div>
      </div>
    </div>
  )
}
