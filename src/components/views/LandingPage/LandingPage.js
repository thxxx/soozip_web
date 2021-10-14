import React from 'react'
import {useState, useEffect} from 'react'
import './Sections/LandingPage.css'
import GalleryCard from '../../tools/GalleryCard'
import BigGalleryList from './Sections/BigGalleryList'
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import { app } from '../../tools/fbase';
import { dbService } from '../../tools/fbase';
import QnACard from './Sections/QnACard'
import CollectionCard from './Sections/CollectionCard'
import { types } from '../../tools/types'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {firebaseInstance, authService, GoogleAuthProvider} from '../../tools/fbase';

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

const LandingPage = ({isLoggedIn}) => {
    const [galleries, setGalleries] = useState([]);
    const [collections, setCollections] = useState([]);
    const [qnas, setQnas] = useState([]);
    const [informations, setInformations] = useState([]);
    const [type, setType] = useState("전체");
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
        
    }

    const handleClose = () => setOpen(false);


    const onSocialClick = async (e) => {
        //지금은 구글 로그인 밖에 없기때문에 굳이 구분하는 flow를 만들지 않는다.
        let provider = new firebaseInstance.auth.GoogleAuthProvider();
        const data = await authService.signInWithPopup(provider);
        
    }

    const getAllCollections = async () => {
        const galleryDatas = await dbService
            .collection("users")
            .orderBy("like_num", "desc")
            .limit(6)
            .get(); // uid를 creatorId로 줬었으니까.
        let galleryData = galleryDatas.docs.map(doc => {
            return({...doc.data(), id:doc.id})
        });
        if(type==="전체"){
            setGalleries(galleryData);
        }else{
            galleryData = galleryData.filter(item => item.typess.includes(type) || item.typess.includes("전체"))
            setGalleries(galleryData);
        }
    }

    const getRealAllCollections = async () => {
        const collectionDatas = await dbService
            .collection("collections")
            .orderBy("like_num", "desc")
            .limit(10)
            .get(); // uid를 creatorId로 줬었으니까.
        let collectionData = collectionDatas.docs.map(doc => {
            return({...doc.data(), id:doc.id})
        });
        if(type==="전체"){
            setCollections(collectionData);
        }else{
            collectionData = collectionData.filter(item => item.type === type|| item.type === "전체")
            setCollections(collectionData);
        }
    }

    const getAllQnAs = async () => {
        const qnaDatas = await dbService
            .collection("qnas")
            .limit(6)
            .get(); // uid를 creatorId로 줬었으니까.

        let qnaData = qnaDatas.docs.map(doc => {
            return({...doc.data(), id:doc.id})
        });
        if(type==="전체"){
            setQnas(qnaData);
        }else{
            qnaData = qnaData.filter(item => item.type === type || item.type === "전체")
            setQnas(qnaData);
        }
    }

    useEffect(() => {
        getAllCollections();
        getRealAllCollections();
        getAllQnAs();
    },[type])

    const galleryTable = galleries.map((item, index) => {
        return(
            <GalleryCard data={item} key={index}/>
            )
        })

    const qnaTable = qnas.map((item, index) => {
        return(
            <QnACard data={item} key={index} />
        )
    })

    const typeTable = types.map((item, index) => {
        let backColor = "#dddddd"
        if(item === type){
            backColor = "#ff0000"
        }
        return(
            <div className="typeOne" key={index} style={{backgroundColor: `${backColor}`}}>
                <Button onClick={() => {setType(item);}} style={{color:'black', fontSize:'12px'}}>{item}</Button>
            </div>
        )
    })

    const collectionTable = collections.map((item, index) => {
        return(
            <CollectionCard item={item} key={index}/>
        )
    })

    // 빅 갤러리 리스트에 ContextAPI로 넘겨주기
    if(galleries.length > 0){
    return (
        <div className="landingcontainer">
            <div className="type-title">원하는 카테고리를 골라보세요.</div>
            <div className="type-table23">
                {typeTable}
            </div>
            <BigGalleryList />
            <p>안녕하세요 랜딩페이지입니다!</p>

            <div className="qna-table-container">
                <div className="qna-table-title">
                    <span>갤러리들 입니다</span>
                    <Link to="allgalleries" className="more-look-button">갤러리 더보기 ></Link>
                </div>
                <div className="landing-qna-table">
                    {galleryTable}
                </div>
            </div>

            <div className="qna-table-container">
                <div className="qna-table-title">
                    <span>컬렉션들 입니다</span>
                    <Link to="allcollections" className="more-look-button">컬렉션 더보기 ></Link>
                </div>
                <div className="landing-qna-table">
                    {collectionTable}
                </div>
            </div>

            <div className="information-table">
                <p className="qna-title">
                    🍯 꿀정보 교환소
                </p>
            </div>
            <div className="qna-table-container">
                <div className="qna-table-title">
                    <span>🙋🏻 QnA 거래소</span>
                    <Link to="allqnas" className="more-look-button">QnA 더보기 ></Link>
                </div>
                <div className="landing-qna-table">
                    {qnaTable}
                </div>
            </div>
            {isLoggedIn ? <>
            <Link to="upload" className="upload-button">컬렉션 등록하기</Link> 
            <Link to="uploadQnA" className="upload-button" style={{right:300}}>질문 등록하기</Link> 
            <Link to="uploadInformation" className="upload-button" style={{right:800}}>정보 등록하기</Link> 
            </>: 
            <span className="upload-button" onClick={handleOpen}>컬렉션 등록하기</span>
            }
            
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
    }else{
        return(<div>대기</div>)
    }

}

export default LandingPage
