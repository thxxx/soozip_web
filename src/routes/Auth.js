// 로그인 페이지
import React, {useState} from 'react'
import {firebaseInstance, authService, GoogleAuthProvider} from '../components/tools/fbase';

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
    }
    const onSocialClick = async (e) => {
        //지금은 구글 로그인 밖에 없기때문에 굳이 구분하는 flow를 만들지 않는다.
        let provider = new firebaseInstance.auth.GoogleAuthProvider();
        const data = await authService.signInWithPopup(provider);
        console.log("data", data);
    }
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} required />
                <input type="submit" value="Log in" />
            </form>
            <div>
                <button onClick={onSocialClick} name="google">
                    Continue with GoogleLogin
                </button>
            </div>
        </div>
)};
export default Auth;
// 이런식으로하면 자동 import된다.