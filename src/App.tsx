import { BaseSyntheticEvent, createRef, useEffect, useState } from 'react'
import ReactPlayer from 'react-player';
import Queue from './Queue';

import './App.css'
import { ISong } from './models/song';

function App() {
  const apiUrl = 'https://youtube.googleapis.com/youtube/v3'
  const [link, setLink] = useState('')
  const [playing, setPlaying] = useState(true)
  const [queue, setQueue] = useState<ISong[]>([])
  const [query, setQuery] = useState('')
  const [socket, setSocket] = useState<WebSocket>()
  
  const playerRef = createRef<ReactPlayer>();

  const nextSong = () => {
    setQueue(queue.slice(1))
    changeLink(queue[1].id)
    skip()
    playerRef.current?.seekTo(0)
  }

  const changeLink = (id: string) => {
    setLink(`https://www.youtube.com/watch?v=${id}`)
  }

  const wsSetup = () => {
    const socket = new WebSocket("wss://savage-radio.pl:8080")

    socket.onopen = () => {
      console.log("Socket Connected")
    }

    socket.onmessage = (message) => {
      const q = JSON.parse(message.data)
      if (q.length > 0) {
        setQueue(q)

        console.log(q, queue)
        if (queue.length === 0 || q.length < queue.length) {
          console.log('skip it')
          changeLink(q[0].id)
        }
      }
    }

    socket.onclose = (event) => {
      console.log("Socket Closed Connection: ", event)
    }

    socket.onerror = (error) => {
      console.log("Socket error: ", error)
    }
    setSocket(socket)
  }

  const handleStop = () => {
    if (queue.length < 2) {
      setLink('')
    }

    nextSong()
  }

  const handleQueryChange = (q: BaseSyntheticEvent) => {
    setQuery(q.target.value)
  }

  const addToQueue = () => {
    if (!socket) return

    fetch(`${apiUrl}/search?q=${query}&key=${import.meta.env.VITE_API_KEY}`)
      .then(res => res.json())
      .then(res => fetch(`${apiUrl}/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${res.items[0].id.videoId}&key=${import.meta.env.VITE_API_KEY}`))
      .then(res => res.json())
      .then(res => {
        const song = {
          id: res.items[0].id,
          title: res.items[0].snippet.title,
          channel: res.items[0].snippet.channelTitle,
          thumbnail: res.items[0].snippet.thumbnails.standard.url
        } as ISong

        socket.send(JSON.stringify(song))
        setQuery('')
      })
    
  }

  const skip = () => {
    socket?.send('skip')
  }

  useEffect(() => {
    wsSetup();
  }, [])

  const config = {
    youtube: {
      playerVars: {
        start: 0,
        controlls: 0,
        modestbranding: 1,
      }
    }
  }

  return (
    <div className="app">
      <div className='player-wrapper'>
        <ReactPlayer
            ref={playerRef}
            className='react-player'
            url={link}
            width='100%'
            height='100%'
            playing={playing}
            onEnded={handleStop}
            config={config}
        />
      </div>

      <div className="controlls">
        <input
            type="text"
            value={query}
            className="input"
            onChange={handleQueryChange}
        ></input>

        <button
            onClick={addToQueue}
            className="btn"
        >
          Dodaj
        </button>

        <button
            onClick={skip}
            className="btn"
        >
          Skip
        </button>
      </div>

      <Queue songs={ queue }></Queue>
    </div>
  )
}

export default App
