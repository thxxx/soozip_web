import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import {HashRouter as Router, Route} from "react-router-dom";
import AppRouter from './Router';
import {app, authService, dbService} from './tools/fbase';
import * as AiIcons from 'react-icons/ai';
import {connect} from 'react-redux'

function App() {
  console.log("APP.js에서 동작 / auth", authService.currentUser ) //User 또는 null을 반환한다. 공식문서 잘 읽어서 쓰기! 로그인 여부 파악에 사용.
  console.log("auth", authService.currentUser ) //User 또는 null을 반환한다. 공식문서 잘 읽어서 쓰기! 로그인 여부 파악에 사용.
  const [init, setInit] = useState(false);
  // firebase가 유저를 읽어오기까지 기다려야 한다.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  const getMyGallery = async (user) => {

    const dbgallery = await dbService
      .collection("users")
      .where("userId", "==", user.uid)
      .get()

    let dbgal = [{gal_id:1}]
    dbgal = dbgallery.docs.map(doc => {return({...doc.data(), gal_id:doc.id})})
    if(dbgallery.length > 0){
      setUserObj({...user, gal_id:dbgal[0].gal_id})
    }else{
      setUserObj({...user, gal_id:1})
    }
    setInit(true);
  }

  useEffect(() => {
    //Add observers for changes to the user's sign-in state.
    authService.onAuthStateChanged((user) => {
      if(user){
        setIsLoggedIn(true);
        getMyGallery(user);
      }else{
        setIsLoggedIn(false);
        setUserObj({...user, gal_id:1});
        setInit(true);
      }
    });
  }, [])
  
  return (
    <>
    {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj}/> : "Initializing..."}
    <footer className="footer">
      <div className="footer-item">
        <a href="https://www.instagram.com/soozip_ga/" className="insta"><AiIcons.AiOutlineInstagram/> Instagram</a>
        <a href="https://6cetqycakbc.typeform.com/to/oRcv6Qdu" className="insta" style={{marginLeft:'3%'}}>문의하기</a>
      </div>
      <div className="footer-item">&copyright by soozip {new Date().getFullYear()}</div>
      </footer>
    </>
  );
}

export default connect()(App);
