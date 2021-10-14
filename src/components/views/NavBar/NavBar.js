import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import './Sections/NavBar.css'
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SideBarData } from './Sections/SideBarData';
import { IconContext } from 'react-icons';
import {firebaseInstance, authService, GoogleAuthProvider} from '../../tools/fbase';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    borderRadius: '15px',
    border: '1px solid rgba(0,0,0,0.1)',
    boxShadow: 24,
    p: 4,
};


const NavBar = ({isLoggedIn, userObj}) => {
    const [sidebar, setSidebar] = useState(false);
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
        
    }

    const handleClose = () => setOpen(false);

    const showSidebar = () => {
        setSidebar(!sidebar);
        console.log("사이드바 인 아웃");
    }

    const onLogOutClick = () => {
        console.log("로그아웃")
        authService.signOut();
    }

    const onSocialClick = async (e) => {
        //지금은 구글 로그인 밖에 없기때문에 굳이 구분하는 flow를 만들지 않는다.
        let provider = new firebaseInstance.auth.GoogleAuthProvider();
        const data = await authService.signInWithPopup(provider);
    }

    return (
        <div>
            <div className="header">
                <span>
                    <Link to="/" className="nav-title">Soozip</Link>
                </span>
                <span className="nav-on">
                    {isLoggedIn ? <button onClick={onLogOutClick} className="inout-button">로그아웃</button> : <button onClick={onSocialClick}>로그인</button>}
                    {userObj ? <p style={{fontWeight:700}}>{userObj.displayName}</p> : null}
                    <Link to="#" className="menu-bars">
                        <FaIcons.FaBars onClick={showSidebar} />
                    </Link>
                </span>
            </div>
                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                    <ul className="nav-menu-items" onClick={showSidebar}>
                        <li className="navbar-toggle">
                            <Link to="#" className='menu-bars'>
                                <AiIcons.AiOutlineClose/>
                            </Link>
                        </li>
                        {SideBarData.map((item, index) => {
                            if(!isLoggedIn && item.title === "내 갤러리"){
                                return(
                                    <li key={index} className={item.cName}>
                                        <span to={item.path} onClick={handleOpen}>
                                            {item.icon}
                                            <span style={{color:'white'}}>{item.title}</span>
                                        </span>
                                    </li>
                                )
                            }else if(!isLoggedIn && item.title === "my likes"){
                                return(
                                    <li key={index} className={item.cName}>
                                        <span to={item.path} onClick={handleOpen}>
                                            {item.icon}
                                            <span style={{color:'white'}}>{item.title}</span>
                                        </span>
                                    </li>
                                )
                            }else{
                                return (
                                <li key={index} className={item.cName}>
                                    <Link to={item.path}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                                )
                            }
                        })}
                        <li className="nav-text">
                            <a href="https://naver.com" target="_black">
                                <AiIcons.AiOutlineInstagram/> Instagram
                            </a>
                        </li>
                    </ul>
                </nav>

            {/* 아래는 수정용 모달. */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                <div className="update-body">
                    <span style={{width: '100%'}}>
                    <p className="login-desc">3초만에 로그인하고 시작하기</p>

                    </span>
                    <span style={{width: '100%'}}>
                        <button onClick={onSocialClick} className="google-login">Google 로그인</button>
                    </span>
                    <div style={{width: '100%', display:'flex', justifyContent:'end'}}>
                    <Button onClick={handleClose} style={{ marginLeft:10, color:'black',backgroundColor:'#993333', width:'10%'}}>
                        닫기
                    </Button>
                    </div>
                </div>
                </Box>
            </Modal>
        </div>
    )
}

export default NavBar
