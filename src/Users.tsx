import { IUser } from "./models/user"
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import { useState } from "react"

import './Users.css'


type UsersProps = {
    users: IUser[]
}

function Users(props: UsersProps) {
    const [open, setOpen] = useState(false)

    const toggleOpen = () => {
        setOpen(!open)
    }
    return (
        <div className="users">
            <div className="toggle" onClick={toggleOpen}>
                <p>Zalogowani <span className="text-green">({props.users.length})</span></p>
                {open ? <FaAngleDown /> : <FaAngleUp />}
            </div>
            {open && <div className="users-list">
                {props.users.map((user: IUser) => (
                    <p>{user.name}</p>
                ))}
            </div>}
        </div>
    )
}

export default Users