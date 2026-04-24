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
  const [volume, setVolume] = useState(1)
  const [prevVolume, setPrevVolume] = useState(1)

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    if (newVolume > 0) {
      setPrevVolume(newVolume)
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    if (volume > 0) {
      setPrevVolume(volume)
      setVolume(0)
      audioRef.current.volume = 0
    } else {
      setVolume(prevVolume)
      audioRef.current.volume = prevVolume
    }
  }

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

      <button onClick={toggleMute} style={styles.volumeButton} aria-label={volume === 0 ? '取消靜音' : '靜音'}>
        {volume === 0 ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          </svg>
        ) : volume < 0.5 ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        )}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={handleVolumeChange}
        style={styles.volumeSlider}
        aria-label="音量"
      />
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
    flexWrap: 'wrap',
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
    flex: '1 1 120px',
    height: '6px',
    backgroundColor: '#ddd',
    borderRadius: '3px',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  },
  volumeButton: {
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
  volumeSlider: {
    width: '70px',
    height: '6px',
    accentColor: '#6B7A64',
    cursor: 'pointer',
    flexShrink: 0,
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
