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
    const [searchKeyword, setSearchKeyword] = useState("");

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
                <input className="searchBar" placeholder="검색하기" value={searchKeyword} onChange={e => setSearchKeyword(e.currentTarget.value)}/>
                <span>
                    <Link to={{
                        pathname:`/searchPage/${searchKeyword}`
                    }}>검색</Link>
                </span>
                <span className="nav-on">
                    <Link to="soozip_description" className="site_description_button">사이트 소개</Link>
                    {isLoggedIn ? <span onClick={onLogOutClick} className="login_button">로그아웃</span> : <span onClick={onSocialClick} className="login_button">로그인</span>}
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
                            }else if(isLoggedIn && item.title === "내 갤러리"){
                                if(userObj.hasOwnProperty("gal_id")){
                                    return(
                                        <li key={index} className={item.cName}>
                                            <Link to={{
                                                pathname:`/gallery/${userObj.gal_id}`
                                            }}>
                                                {item.icon}
                                                <span>{item.title}</span>
                                            </Link>
                                        </li>
                                    )
                                }else{
                                    return(
                                        <li key={index} className={item.cName}>
                                            <Link to={{
                                                pathname:`/profile`
                                            }}>
                                                {item.icon}
                                                <span>{item.title}</span>
                                            </Link>
                                        </li>
                                    )

                                }
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
                            <a href="https://6cetqycakbc.typeform.com/to/oRcv6Qdu" target="_black">
                                🙋🏻 <span>의견 제공 및 문의하기</span>
                            </a>
                        </li>
                        <li className="nav-text">
                            <a href="https://www.instagram.com/soozip_ga/" target="_black">
                                <AiIcons.AiOutlineInstagram/> <span>Instagram</span>
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
