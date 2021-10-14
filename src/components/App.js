import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import {HashRouter as Router, Route} from "react-router-dom";
import LandingPage from './views/LandingPage/LandingPage';
import GalleryPage from './views/GalleryPage/GalleryPage';
import NavBar from './views/NavBar/NavBar';
import AppRouter from './Router';
import {app, authService} from './tools/fbase';
import * as AiIcons from 'react-icons/ai';

function App() {
  console.log("auth", authService.currentUser ) //User 또는 null을 반환한다. 공식문서 잘 읽어서 쓰기! 로그인 여부 파악에 사용.
  const [init, setInit] = useState(false);
  // firebase가 유저를 읽어오기까지 기다려야 한다.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    //Add observers for changes to the user's sign-in state.
    authService.onAuthStateChanged((user) => {
      if(user){
        setIsLoggedIn(true);
        setUserObj(user);
      }else{
        setIsLoggedIn(false);
        setUserObj(user);
      }
      setInit(true);
    });
  }, [])
  
  return (
    <>
    {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj}/> : "Initializing..."}
    <footer className="footer">
      <div className="footer-item">
        <a href="https://www.instagram.com/soozip_ga/" className="insta"><AiIcons.AiOutlineInstagram/> Instagram</a>
        <a href="https://www.instagram.com/soozip_ga/" className="insta" style={{marginLeft:'3%'}}>문의하기</a>
      </div>
      <div className="footer-item">&copyright by soozip {new Date().getFullYear()}</div>
      </footer>
    </>
  );
}

export default App;
