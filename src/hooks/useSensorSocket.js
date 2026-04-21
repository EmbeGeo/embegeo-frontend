// src/hooks/useSensorSocket.js
import { useEffect, useRef, useState } from 'react'

const WS_URL = (import.meta.env.VITE_WS_URL || 'ws://10.150.1.34:8000') + '/ws/live'

export default function useSensorSocket() {
  const [data, setData] = useState(null)
  const [connected, setConnected] = useState(false)
  const wsRef = useRef(null)

  useEffect(() => {
    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    ws.onopen = () => setConnected(true)

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data)
        setData(parsed)
      } catch {
        // 파싱 실패 시 무시
      }
    }

    ws.onclose = () => setConnected(false)
    ws.onerror = () => setConnected(false)

    return () => {
      ws.close()
    }
  }, [])

  return { data, connected }
}
