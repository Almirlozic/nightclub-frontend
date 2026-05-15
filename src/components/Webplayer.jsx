"use client"
import { useRef, useState } from "react"

export default function Webplayer({ src, title, artist }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

const songs = [
  { title: "Black Box Funky", src: "/assets/media/black-box-funky.mp3", thumbnail: "/assets/content-img/track1.jpg" },
  { title: "Euphoria",        src: "/assets/media/euphoria.mp3", thumbnail: "/assets/content-img/track2.jpg" },
  { title: "Fashion Red Tape", src: "/assets/media/fashion-red-tape.mp3", thumbnail: "/assets/content-img/track_thumb.jpg" },
  { title: "Rick", src: "/assets/media/rick.mp3", thumbnail: "/assets/content-img/track4.jpg" },
  { title: "ukendt", src: "/assets/media/ukendt.mp3", thumbnail: "/assets/content-img/track5.jpg" }
]

const [currentSong, setCurrentSong] = useState(songs[0])

  function togglePlay() {
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Kunne ikke afspille:", err))
    }
  }


function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}


  return (
    <div>
      <audio
        key={currentSong.src}
        ref={audioRef}
        src={currentSong.src}
        style={{ display: "none" }}
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
      />
      <img src={currentSong.thumbnail} alt={currentSong.title} />
      <p>{currentSong.title} — {currentSong.artist}</p>
      <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
      <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
      <ul>
        {songs.map((song, index) => (
          <li key={index} onClick={() => setCurrentSong(song)}>
            <img src={song.thumbnail} alt={song.title} width={60} height={60} />
            <span>{song.title}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}