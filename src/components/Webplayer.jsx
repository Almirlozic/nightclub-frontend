"use client"
import { useRef, useState } from "react"

export default function Webplayer({ src, title, artist }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

const songs = [
  { title: "Black Box Funky", src: "/assets/media/black-box-funky.mp3" },
  { title: "Euphoria",        src: "/assets/media/euphoria.mp3" },
  { title: "Fashion Red Tape", src: "/assets/media/fashion-red-tape.mp3" },
]

const [currentSong, setCurrentSong] = useState(songs[0])

  function togglePlay() {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }


function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}


  return (
    <div>
      <audio
        ref={audioRef}
        src={currentSong.src}
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
      />
      <p>{currentSong.title} — {artist}</p>
      <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
      <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
    </div>
  )
}