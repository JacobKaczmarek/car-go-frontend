import { BaseSyntheticEvent, createRef, useEffect, useState } from 'react'
import ReactPlayer from 'react-player';
import Queue from './Queue';
import Controlls from './Controlls';
import { io, Socket } from 'socket.io-client';

import './App.css'
import { ISong } from './models/song';
import Login from './Login';
import Users from './Users';
import { IUser } from './models/user';

function App() {
  const [link, setLink] = useState('')
  const [playing, setPlaying] = useState(true)
  const [queue, setQueue] = useState<ISong[]>([])
  const [users, setUsers] = useState<IUser[]>([])
  const [socket, setSocket] = useState<Socket>()
  const [loginDialogVisible, setLoginDialogVisible] = useState(true);
  
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
    // const socket = io("wss://savage-radio.pl:8080")
    const socket = io("ws://192.168.1.7:8080/")

    socket.on('init', (data) => {
      setQueue(data.queue)
      setUsers(data.users)

      if (data.queue.length) {
        changeLink(data.queue[0].id)
      }
    })

    socket.on('users', (data) => {
      setUsers(data)
    })

    socket.on('update', (q) => {
      setQueue(q)

      if (q.length == 1) {
        changeLink(q[0].id)
      }
    })

    socket.on('skip', (q) => {
      
      if (q.length) {
        changeLink(q[0].id)
      } else {
        setLink('')
      }

      setQueue(q)
    })

    setSocket(socket)
  }

  const handleStop = () => {
    if (queue.length < 2) {
      setLink('')
    }

    nextSong()
  }

  const addToQueue = (song: ISong) => {
    if (!socket) return

    socket.emit('add', song)
  }

  const skip = () => {
    socket?.emit('skip')
  }

  const handleLogin = (name: string) => {
    socket?.emit('register', name)
    setLoginDialogVisible(false);
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

      <Controlls addSong={addToQueue} skip={skip}></Controlls>

      <Queue songs={ queue }></Queue>
      <Users users={users} />
      {loginDialogVisible && <Login handleLogin={handleLogin}/>}
    </div>
  )
}

export default App
