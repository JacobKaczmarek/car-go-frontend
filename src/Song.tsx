import { ISong } from "./models/song"

import "./Song.css"

type SongProps = {
    song: ISong
}

function Song(props: SongProps) {


    return (
        <div className="song-card">
            <img src={props.song.thumbnail} alt="" className="thumbnail" />

            <div className="info">
                <h4 className="title">{props.song.title}</h4>
                <p className="channel">{props.song.channel}</p>
            </div>
        </div>
    )
}

export default Song