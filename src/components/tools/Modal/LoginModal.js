import React, {useState, useEffect} from 'react'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {firebaseInstance, authService, GoogleAuthProvider} from '../fbase';
import * as FaIcons from 'react-icons/fa';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '15px',
    border: '1px solid rgba(0,0,0,0.1)',
    boxShadow: 24,
    p: 4,
};

const LoginModal = ({openDown}) => {
    const [open, setOpen] = useState(false);

    const handleClose = () => setOpen(false);

    const onSocialClick = async (e) => {
        //지금은 구글 로그인 밖에 없기때문에 굳이 구분하는 flow를 만들지 않는다.
        let provider = new firebaseInstance.auth.GoogleAuthProvider();
        const data = await authService.signInWithPopup(provider);
        handleClose();
    }

    return (
            <div>
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
                            <button onClick={onSocialClick} className="google-login"><FaIcons.FaGoogle /> <span> </span> Google 로그인</button>
                        </span>
                        <div style={{width: '100%', display:'flex', justifyContent:'end'}}>
                        <span onClick={handleClose} className="cancel-button">
                            취소하기
                        </span>
                        </div>
                    </div>
                    </Box>
                </Modal>
            </div>
    )
}

export default LoginModal
