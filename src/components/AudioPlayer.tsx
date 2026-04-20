'use client'

import { useRef, useState, useEffect } from 'react'

interface AudioPlayerProps {
  src: string
  title?: string
}

export default function AudioPlayer({ src, title = '音頻' }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Don't render anything if no src
  if (!src) return null

  // Cleanup: pause audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      try {
        audio.play()
      } catch (err) {
        // play() rejected (autoplay blocked, etc.)
        setIsPlaying(false)
      }
    }
  }

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (audio) setCurrentTime(audio.currentTime)
  }

  const handleLoadedMetadata = () => {
    const audio = audioRef.current
    if (audio) {
      setDuration(audio.duration)
      setIsLoaded(true)
    }
  }

  const handleError = () => {
    setHasError(true)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    const bar = e.currentTarget
    if (!audio || !isLoaded || !duration) return
    const rect = bar.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    audio.currentTime = ratio * duration
  }

  const handleProgressKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !isLoaded || !duration) return
    const step = 5 // seconds per arrow key press
    if (e.key === 'ArrowRight') {
      audio.currentTime = Math.min(audio.currentTime + step, duration)
    } else if (e.key === 'ArrowLeft') {
      audio.currentTime = Math.max(audio.currentTime - step, 0)
    }
  }

  const formatTime = (seconds: number) => {
    if (!seconds || !isFinite(seconds)) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  if (hasError) {
    return (
      <div className="audio-player error" style={styles.container}>
        <span style={styles.errorText}>音頻無法播放</span>
      </div>
    )
  }

  return (
    <div className="audio-player" style={styles.container}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="metadata"
      />
      
      <button onClick={togglePlay} style={styles.button} aria-label={isPlaying ? '暫停' : '播放'}>
        {isPlaying ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <div style={styles.time}>{formatTime(currentTime)}</div>

      <div
        style={styles.progressBar}
        onClick={handleSeek}
        onKeyDown={handleProgressKeyDown}
        role="slider"
        aria-label={title}
        aria-valuenow={Math.round(currentTime)}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        tabIndex={isLoaded ? 0 : -1}
      >
        <div style={{ ...styles.progressFill, width: `${progress}%` }} />
      </div>

      <div style={styles.time}>{formatTime(duration)}</div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#f0ede8',
    borderRadius: '12px',
    fontFamily: 'system-ui, sans-serif',
  },
  button: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    color: '#6B7A64',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'background 0.2s',
    flexShrink: 0,
  },
  time: {
    fontSize: '13px',
    color: '#666',
    fontVariantNumeric: 'tabular-nums',
    minWidth: '36px',
    textAlign: 'center',
    flexShrink: 0,
  },
  progressBar: {
    flex: 1,
    height: '6px',
    backgroundColor: '#ddd',
    borderRadius: '3px',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6B7A64',
    borderRadius: '3px',
    transition: 'width 0.1s linear',
  },
  errorText: {
    fontSize: '14px',
    color: '#999',
    fontStyle: 'italic',
  },
}
