import React, {useState, useEffect} from 'react'
import {app, authService} from '../../tools/fbase';
import {dbService } from '../../tools/fbase'
import {useHistory} from 'react-router-dom'
import CollectionList from '../GalleryPage/Sections/CollectionList';
import MakeGallery from './Sections/MakeGallery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Input from '@mui/material/Input';
import './Sections/ProfilePage.css'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    borderRadius: '15px',
    border: '1px solid rgba(0,0,0,0.1)',
    boxShadow: 24,
    p: 4,
};

const ProfilePage = (props) => {
    // 아직 갤러리를 만들지 않은 상태면 만들게 해야한다.
    // 갤러리를 만든 상태라면 불러온다.

    const User = authService.currentUser;
    const [userName, setUserName] = useState(props.userObj.displayName);
    const [galleryName, setGalleryName] = useState("");
    const [galleryDesc, setGalleryDesc] = useState("");
    const [galleryColor, setGalleryColor] = useState("");
    const [galleryTypes, setGalleryTypes] = useState([]);
    const [hasGallery, setHasGallery] = useState(true);
    const [loading, setLoading] = useState(false);
    const [myCollections, setMyCollections] = useState([]);
    const [myGallery, setMyGallery] = useState([]);
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [update, setUpdate] = useState(false);
    
    const handleOpen = () => {
        setOpen(true);
        
    }
    const handleClose = () => setOpen(false);

    const getMyCollections = async () => {
        const mydatas = await dbService
            .collection("collections")
            .where("creatorId", "==", props.userObj.uid)
            .get(); // uid를 creatorId로 줬었으니까.
        setMyCollections(mydatas.docs.map(doc => doc.data()));
    }

    // 갤러리 정보를 수정
    const getMyGallery = async () => {
        const myGalleryData = await dbService
            .collection("users")
            .where("userId", "==", props.userObj.uid)
            .get(); // uid를 creatorId로 줬었으니까.
        let myGallery = myGalleryData.docs.map(doc => {return({...doc.data(), id:doc.id})})
        setHasGallery(myGallery.length > 0);
        setMyGallery(myGallery[0]);
        if(myGallery.length > 0){
            await getMyCollections();
            setGalleryName(myGallery[0].galleryName);
            setGalleryDesc(myGallery[0].desc);
            setGalleryColor(myGallery[0].color);
            setGalleryTypes(myGallery[0].typess);
        }else{
            setMyCollections([]);
        }
        setLoading(true);
    }

    useEffect(() => {
        if(User === null){
            alert("로그인 하셔야 합니다.")
        }
        getMyGallery();
    },[update])

    const changeGalleryInto = async e => {
        e.preventDefault();
        if(props.userObj.displayName !== userName){
            // 이러면 업데이트
            await props.userObj.updateProfile({
                displayName: userName,
             });
        }
        await dbService.doc(`users/${myGallery.id}`)
        .update({
            color:galleryColor,
            desc:galleryDesc,
            galleryName:galleryName,
            displayName:userName
        })
        alert("수정이 완료되었습니다!")
        handleClose();
        setUpdate(!update);
    }

    const editOpen = () => {
        setIsEditing(!isEditing);
    }

    if(hasGallery){
        if(loading){
            return (
                <div>
                    <CollectionList collections={myCollections} isEditing={isEditing}/>
                    <Button onClick={handleOpen}>갤러리 수정하기</Button>
                    { isEditing ? <Button onClick={editOpen} style={{backgroundColor:'blue'}}>완료하기</Button> : 
                    <Button onClick={editOpen} style={{backgroundColor:'red'}}>삭제하기</Button>}
                    
                    <div className="galleryInfo">
                        프로필 
                        <p>
                        유저 명 : {User.displayName}
                        </p>
                        <p>
                        유저 이메일 : {User.email}
                        </p>
                        <p>
                        갤러리 : {myGallery.galleryName}
                        </p>
                        <p>
                        갤러리 설명 : {myGallery.desc}
                        </p>
                        <img src={User.photoURL} />
                    </div>

                    {/* 아래는 수정용 모달. */}
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                    <form onSubmit={changeGalleryInto}>
                        <Box sx={style}>
                        <div className="update-body">
                            <p className="starbucks">
                            <span style={{fontSize:19}}>☕️</span> 5분을 선정해서 스타벅스 기프티콘을 드립니다.
                            </p>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                이메일을 입력해주세요.
                            </Typography>
                            <input type="text" placeholder="My Name" value={userName} onChange={e => setUserName(e.target.value)}/>
                            <input type="text" placeholder="Gallery Name" value={galleryName} onChange={e => setGalleryName(e.target.value)}/>
                            <input type="text" placeholder="갤러리 설명" value={galleryDesc} onChange={e => setGalleryDesc(e.target.value)}/>
                            <input type="color" placeholder="갤러리 색" value={galleryColor} onChange={e => setGalleryColor(e.target.value)}/>
                        </div>
                        <div style={{marginTop:10}}>
                        <input type="submit" style={{backgroundColor:'#47b9ff', marginLeft:10, color:'white', width:'20%'}}  value="확인"/>
                        <Button onClick={handleClose} style={{ marginLeft:10, color:'black', width:'10%'}}>
                            닫기
                        </Button>
                        </div>
                        </Box>
                    </form>
                    </Modal>
                </div>
            )
        }else{
            return(
            <div>Loading...</div>
            )
        }
    }else{
        return(
            <MakeGallery userObj={props.userObj}/>
        )
    }
}

export default ProfilePage
