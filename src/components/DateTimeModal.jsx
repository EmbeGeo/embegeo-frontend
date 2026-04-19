// src/components/DateTimeModal.jsx

import { useState, useRef, useEffect } from 'react'
import './DateTimeModal.css'

export default function DateTimeModal({ isOpen, onClose, onConfirm, initialDateTime }) {
  // initialDateTime이 null일 때를 위한 안전한 기본값 (현재 시각 기준)
  const now = new Date()
  const defaultDateTime = {
    year: now.getFullYear().toString(),
    month: (now.getMonth() + 1).toString().padStart(2, '0'),
    day: now.getDate().toString().padStart(2, '0'),
    hour: now.getHours().toString().padStart(2, '0'),
    minute: now.getMinutes().toString().padStart(2, '0')
  }

  const safeInitialDateTime = initialDateTime || defaultDateTime

  const [dateTime, setDateTime] = useState(safeInitialDateTime)

  // 모달이 열릴 때 초기 시간으로 동기화
  useEffect(() => {
    if (isOpen && initialDateTime) {
      setDateTime(initialDateTime)
    }
  }, [isOpen, initialDateTime])

  const { year, month, day, hour, minute } = dateTime

  const handleYearChange = (newYear) => {
    setDateTime(prev => ({ ...prev, year: newYear }))
  }

  const handleMonthChange = (newMonth) => {
    setDateTime(prev => ({ ...prev, month: newMonth }))
  }

  const handleDayChange = (newDay) => {
    setDateTime(prev => ({ ...prev, day: newDay }))
  }

  const handleHourChange = (newHour) => {
    setDateTime(prev => ({ ...prev, hour: newHour }))
  }

  const handleMinuteChange = (newMinute) => {
    setDateTime(prev => ({ ...prev, minute: newMinute }))
  }

  const handleCancel = () => {
    // 초기값으로 리셋
    if (initialDateTime) {
      setDateTime(initialDateTime)
    } else {
      setDateTime(defaultDateTime)
    }
    onClose()
  }

  const handleConfirm = () => {
    onConfirm(dateTime)
    onClose()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>날짜 및 시간 선택</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="wheel-picker-container">
            <WheelPicker
              label="년"
              value={year}
              onChange={handleYearChange}
              options={['', '', ...Array.from({ length: 31 }, (_, i) => (2000 + i).toString()), '', '']}
            />
            <WheelPicker
              label="월"
              value={month}
              onChange={handleMonthChange}
              options={['', '', ...Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '00')), '', '']}
            />
            <WheelPicker
              label="일"
              value={day}
              onChange={handleDayChange}
              options={['', '', ...Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '00')), '', '']}
            />
            <WheelPicker
              label="시"
              value={hour}
              onChange={handleHourChange}
              options={['', '', ...Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '00')), '', '']}
            />
            <WheelPicker
              label="분"
              value={minute}
              onChange={handleMinuteChange}
              options={['', '', ...Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '00')), '', '']}
            />
          </div>

          <div className="preview-section">
            <span className="preview-label">선택된 시간:</span>
            <span className="preview-value">
              {year}년 {month}월 {day}일 {hour}시 {minute}분
            </span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn cancel-btn" onClick={handleCancel}>
            취소
          </button>
          <button className="modal-btn confirm-btn" onClick={handleConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

// Wheel Picker 컴포넌트
function WheelPicker({ label, value, onChange, options }) {
  const containerRef = useRef(null)
  const [selectedIndex, setSelectedIndex] = useState(() => {
    // 초기 selectedIndex를 안전하게 설정
    const index = options.indexOf(value)
    return index !== -1 ? index : 2
  })
  const [isDragging, setIsDragging] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const velocityRef = useRef(0)
  const lastYRef = useRef(0)

  // 초기화: 컴포넌트 마운트 시 한 번만 실행
  useEffect(() => {
    if (!isInitialized && containerRef.current) {
      const index = options.indexOf(value)
      const validIndex = index !== -1 ? index : 2
      setSelectedIndex(validIndex)
      scrollToIndex(validIndex, 0)
      setIsInitialized(true)
    }
  }, []) // 빈 의존성 배열로 마운트 시 한 번만 실행

  // value가 변경될 때는 선택된 인덱스만 업데이트 (스크롤하지 않음)
  useEffect(() => {
    if (isInitialized) {
      const index = options.indexOf(value)
      if (index !== -1 && index !== selectedIndex) {
        setSelectedIndex(index)
      }
    }
  }, [value, isInitialized])

  const scrollToIndex = (index, duration = 200) => {
    if (!containerRef.current) return

    const itemHeight = 40
    const containerHeight = containerRef.current.clientHeight
    const scrollTop = index * itemHeight - (containerHeight / 2 - itemHeight / 2)
    const target = Math.max(0, scrollTop)

    if (duration === 0) {
      containerRef.current.scrollTop = target
    } else {
      const current = containerRef.current.scrollTop
      const diff = target - current
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeProgress = progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress

        containerRef.current.scrollTop = current + diff * easeProgress

        if (progress < 1) requestAnimationFrame(animate)
      }
      animate()
    }
  }

  const handleScroll = () => {
    if (isDragging || !containerRef.current) return

    const itemHeight = 40
    const containerHeight = containerRef.current.clientHeight
    const scrollTop = containerRef.current.scrollTop
    const rawIndex = Math.round((scrollTop + containerHeight / 2 - itemHeight / 2) / itemHeight)
    const dataIndex = Math.max(2, Math.min(options.length - 3, rawIndex))

    if (dataIndex !== selectedIndex && options[dataIndex] !== '') {
      setSelectedIndex(dataIndex)
      onChange(options[dataIndex])
    }
  }

  const handleMouseDown = (e) => {
    setIsDragging(true)
    lastYRef.current = e.clientY || e.touches?.[0]?.clientY
    velocityRef.current = 0
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return

    const currentY = e.clientY || e.touches?.[0]?.clientY
    const deltaY = currentY - lastYRef.current

    velocityRef.current = deltaY
    lastYRef.current = currentY

    containerRef.current.scrollTop -= deltaY
  }

  const snapToNearest = () => {
    if (!containerRef.current) return

    const itemHeight = 40
    const containerHeight = containerRef.current.clientHeight
    const scrollTop = containerRef.current.scrollTop
    const rawIndex = Math.round((scrollTop + containerHeight / 2 - itemHeight / 2) / itemHeight)
    const dataIndex = Math.max(2, Math.min(options.length - 3, rawIndex))

    if (options[dataIndex] !== '') {
      scrollToIndex(dataIndex, 200)
      setSelectedIndex(dataIndex)
      onChange(options[dataIndex])
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)

    if (!containerRef.current) return

    if (Math.abs(velocityRef.current) > 2) {
      let velocity = velocityRef.current
      const friction = 0.95

      const momentum = () => {
        if (Math.abs(velocity) > 0.5) {
          containerRef.current.scrollTop -= velocity
          velocity *= friction
          requestAnimationFrame(momentum)
        } else {
          snapToNearest()
        }
      }
      momentum()
    } else {
      snapToNearest()
    }
  }

  const handleItemClick = (index) => {
    if (options[index] !== '') {
      setSelectedIndex(index)
      onChange(options[index])
      scrollToIndex(index)
    }
  }

  return (
    <div className="wheel-picker">
      <div className="wheel-label">{label}</div>
      <div
        className={`wheel-container ${isDragging ? 'dragging' : ''}`}
        ref={containerRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <div className="wheel-list">
          {options.map((option, index) => (
            <div
              key={index}
              className={`wheel-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleItemClick(index)}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
