// src/components/DateTimeModal.jsx

import { useState, useRef, useEffect } from 'react'
import './DateTimeModal.css'

export default function DateTimeModal({ isOpen, onClose, onConfirm, initialDateTime }) {
  const [year, setYear] = useState(initialDateTime.year || '2026')
  const [month, setMonth] = useState(initialDateTime.month || '04')
  const [day, setDay] = useState(initialDateTime.day || '10')
  const [hour, setHour] = useState(initialDateTime.hour || '00')
  const [minute, setMinute] = useState(initialDateTime.minute || '00')

  const handleConfirm = () => {
    onConfirm({
      year,
      month,
      day,
      hour,
      minute
    })
    onClose()
  }

  const handleCancel = () => {
    // 초기값으로 리셋
    setYear(initialDateTime.year || '2026')
    setMonth(initialDateTime.month || '04')
    setDay(initialDateTime.day || '10')
    setHour(initialDateTime.hour || '00')
    setMinute(initialDateTime.minute || '00')
    onClose()
  }

  if (!isOpen) return null

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
              onChange={setYear}
              options={Array.from({ length: 31 }, (_, i) => (2000 + i).toString())}
            />
            <WheelPicker
              label="월"
              value={month}
              onChange={setMonth}
              options={Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'))}
            />
            <WheelPicker
              label="일"
              value={day}
              onChange={setDay}
              options={Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'))}
            />
            <WheelPicker
              label="시"
              value={hour}
              onChange={setHour}
              options={Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))}
            />
            <WheelPicker
              label="분"
              value={minute}
              onChange={setMinute}
              options={Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))}
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
  const [selectedIndex, setSelectedIndex] = useState(options.indexOf(value))

  useEffect(() => {
    const index = options.indexOf(value)
    if (index !== -1) {
      setSelectedIndex(index)
      scrollToIndex(index)
    }
  }, [value, options])

  const scrollToIndex = (index) => {
    if (containerRef.current) {
      const itemHeight = 40
      const containerHeight = containerRef.current.clientHeight
      const scrollTop = index * itemHeight - (containerHeight / 2) + (itemHeight / 2)
      containerRef.current.scrollTop = scrollTop
    }
  }

  const handleScroll = () => {
    if (containerRef.current) {
      const itemHeight = 40
      const scrollTop = containerRef.current.scrollTop
      const containerHeight = containerRef.current.clientHeight
      const centerOffset = containerHeight / 2 - itemHeight / 2
      const index = Math.round((scrollTop + centerOffset) / itemHeight)
      const clampedIndex = Math.max(0, Math.min(options.length - 1, index))

      if (clampedIndex !== selectedIndex) {
        setSelectedIndex(clampedIndex)
        onChange(options[clampedIndex])
      }
    }
  }

  const handleItemClick = (index) => {
    setSelectedIndex(index)
    onChange(options[index])
    scrollToIndex(index)
  }

  return (
    <div className="wheel-picker">
      <div className="wheel-label">{label}</div>
      <div className="wheel-container" ref={containerRef} onScroll={handleScroll}>
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
