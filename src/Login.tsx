import { BaseSyntheticEvent, useState } from "react";

import './Login.css'

type LoginProps = {
    handleLogin: (name: string) => void,
}

function Login(props: LoginProps) {
    const [userName, setUserName] = useState<string>('')

    const handleInput = (e: BaseSyntheticEvent) => {
        setUserName(e.target.value);
    }

    return (
        <div className="backdrop">
            <div className="login-dialog">
                <h2>Podaj nazwę uytkownika</h2>

                <input type="text" onChange={handleInput}/>
                <button className="login-btn" onClick={() => props.handleLogin(userName)}>Zaloguj</button>
            </div>
        </div>
    )
}

export default Login;