import { BaseSyntheticEvent, useState } from "react";
import { ISong } from "./models/song";
import { FaSearch, FaForward } from 'react-icons/fa'

import './Controlls.css'

type ControllsProps = {
    addSong: (song: ISong) => void,
    skip: () => void
}

function Controlls(props: ControllsProps) {
    const apiUrl = 'https://youtube.googleapis.com/youtube/v3'

    const [query, setQuery] = useState('')
    const [results, setResults] = useState<ISong[]>([])

    const handleQueryChange = (q: BaseSyntheticEvent) => {
        setQuery(q.target.value)
    }

    const handleSelection = (song: ISong) => {
        props.addSong(song)
        setResults([])
    }

    const search = () => {
        fetch(`${apiUrl}/search?q=${query}&part=snippet&type=video&key=${import.meta.env.VITE_API_KEY}`)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                const songs = res.items.map((song: any) => ({
                    id: song.id.videoId,
                    title: song.snippet.title,
                    channel: song.snippet.channelTitle,
                    thumbnail: song.snippet.thumbnails.standard?.url || song.snippet.thumbnails.high?.url
                } as ISong))

                setResults(songs)

                setQuery('')
            })
    }

    return (
        <div className="search">
            <div className="controlls">
                <input
                    type="text"
                    value={query}
                    className="input"
                    onChange={handleQueryChange}
                ></input>

                <button
                    onClick={search}
                    className="btn"
                >
                    <FaSearch />
                </button>

                <button
                    onClick={props.skip}
                    className="btn"
                >
                    <FaForward />
                </button>
            </div>

            <div className="results">
                {results.map((song: ISong, index: number) => (
                    <div key={index} onClick={() => handleSelection(song)} className="result">
                        <img src={song.thumbnail} alt="" className="thumbnail" />
                        <p className="title">{ song.title }</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Controlls;