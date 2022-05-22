import { ISong } from "./models/song"
import Song from "./Song"

import './Queue.css'

type QueueProps = {
    songs: ISong[],
}

function Queue(props: QueueProps) {

    return (
        <div className="queue">
            {props.songs.map((song: ISong, index: number) => (
                <Song song={song} key={index}></Song>
            ))}
        </div>
    )
}

export default Queue
