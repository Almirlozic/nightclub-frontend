"use client"
import { useRef, useState } from "react"
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaRandom, FaVolumeUp } from "react-icons/fa"

const songs = [
  { title: "Black Box Funky", src: "/assets/media/black-box-funky.mp3", thumbnail: "/assets/content-img/track1.jpg" },
  { title: "Euphoria",        src: "/assets/media/euphoria.mp3",        thumbnail: "/assets/content-img/track2.jpg" },
  { title: "Fashion Red Tape", src: "/assets/media/fashion-red-tape.mp3", thumbnail: "/assets/content-img/track_thumb.jpg" },
  { title: "Rick",            src: "/assets/media/rick.mp3",            thumbnail: "/assets/content-img/track4.jpg" },
  { title: "Ukendt",         src: "/assets/media/ukendt.mp3",          thumbnail: "/assets/content-img/track5.jpg" },
]

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export default function Webplayer() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [currentIndex, setCurrentIndex] = useState(0)

  const currentSong = songs[currentIndex]

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

  function playNext() {
    setCurrentIndex((prev) => (prev + 1) % songs.length)
    setIsPlaying(false)
    setCurrentTime(0)
  }

  function playPrev() {
    setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length)
    setIsPlaying(false)
    setCurrentTime(0)
  }

  function handleSeek(e) {
    const newTime = (e.target.value / 100) * duration
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  function handleVolume(e) {
    const val = parseFloat(e.target.value)
    audioRef.current.volume = val
    setVolume(val)
  }

  function selectSong(index) {
    setCurrentIndex(index)
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="bg-black text-white py-10 px-6">
      {/* Title */}
      <div className="flex justify-center mb-8">
        <h2 className="text-white text-2xl font-bold tracking-widest border-2 border-red-600 px-10 py-3">
          NIGHT CLUB TRACK
        </h2>
      </div>

      {/* Player */}
      <div className="flex gap-6 items-start max-w-4xl mx-auto">
        {/* Thumbnail */}
        <img
          src={currentSong.thumbnail}
          alt={currentSong.title}
          className="w-48 h-48 object-cover shrink-0"
        />

        {/* Controls */}
        <div className="flex flex-col justify-center gap-4 w-full">
          <p className="text-sm font-semibold tracking-widest uppercase">{currentSong.title}</p>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 w-20">{formatTime(currentTime)} / {formatTime(duration)}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={handleSeek}
              className="flex-1 h-1 cursor-pointer appearance-none"
              style={{ background: `linear-gradient(to right, #dc2626 ${progress}%, #4b5563 ${progress}%)` }}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-6 text-lg">
            <button onClick={playPrev} className="hover:text-red-500 transition-colors">
              <FaStepBackward />
            </button>
            <button
              onClick={togglePlay}
              className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
            >
              {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
            </button>
            <button onClick={playNext} className="hover:text-red-500 transition-colors">
              <FaStepForward />
            </button>
            <button className="hover:text-red-500 transition-colors">
              <FaRandom />
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <FaVolumeUp className="text-gray-400" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolume}
                className="w-20 h-1 cursor-pointer appearance-none"
                style={{ background: `linear-gradient(to right, #dc2626 ${volume * 100}%, #4b5563 ${volume * 100}%)` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Song list carousel */}
      <div className="flex items-center gap-2 max-w-4xl mx-auto mt-8">
        <button onClick={playPrev} className="text-white hover:text-red-500 px-2 text-xl">&#8249;</button>
        <div className="flex gap-3 overflow-hidden flex-1">
          {songs.map((song, index) => (
            <div
              key={index}
              onClick={() => selectSong(index)}
              className="relative cursor-pointer shrink-0 w-32 h-24 overflow-hidden group"
            >
              <img
                src={song.thumbnail}
                alt={song.title}
                className="w-full h-full object-cover group-hover:opacity-70 transition-opacity"
              />
              {index === currentIndex && (
                <div className="absolute inset-0 border-2 border-red-600 flex items-center justify-center">
                  <FaPlay className="text-white text-xl drop-shadow" />
                </div>
              )}
              <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-xs text-white px-1 py-0.5 truncate">
                {song.title}
              </p>
            </div>
          ))}
        </div>
        <button onClick={playNext} className="text-white hover:text-red-500 px-2 text-xl">&#8250;</button>
      </div>

      <audio
        key={currentSong.src}
        ref={audioRef}
        src={currentSong.src}
        style={{ display: "none" }}
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onEnded={playNext}
      />
    </div>
  )
}
