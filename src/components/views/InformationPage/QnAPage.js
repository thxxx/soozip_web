import React, {useState, useEffect} from 'react'
import './Sections/QnAPage.css'
import Button from '@mui/material/Button';
import {Input} from 'antd'
import { dbService } from '../../tools/fbase';
import {authService} from '../../tools/fbase';
import CommentContainer from '../../tools/CommentContainer';
import { Link } from 'react-router-dom'

const QnAPage = (props) => {
    const User = authService.currentUser;
    const [update, setUpdate] = useState(false);
    const [qna, setQna] = useState({});
    const [info, setInfo] = useState({});
    const [loading, setLoading] = useState(false);

    const getThisQnA = async () => {
        let data;
        const dbqna = await dbService
        .collection("qnas")
        .doc(props.match.params.id)
        .get()
        .then(snapshot => data = {...snapshot.data(), id:snapshot.id})

        const dbgallery = await dbService
            .collection("users")
            .where("userId", "==", data.creatorId)
            .get()
        
        let dbgal = dbgallery.docs.map(doc => {return({...doc.data(), gal_id:doc.id})})
        
        setQna({...data, galId:dbgal[0].gal_id, galleryName:dbgal[0].galleryName, displayName:dbgal[0].displayName})

        setLoading(true);
        //     // set이 붙는 함수를 쓸 때 값이 아니라 함수를 전달할 수 있다.
    }

    const getThisQnaInfo = async () => {
        if(loading){
            const dbinfos = await dbService.collection("users")
            .where("userId", "==", qna.creatorId)
            .get();

            let dbinfo = dbinfos.docs.map(doc => {return({...doc.data(), id:doc.id})})
            setInfo(dbinfo[0]);
        }
    }

    useEffect(() => {
        getThisQnA();
        getThisQnaInfo();
    },[update, loading])

    return (
        <div className="QnAContainer">
            <div className="QnAInfo">
                <div className="top-container">
                    <span className="qna">QnA</span>
                    <span className="ask">
                        <div style={{paddingLeft:'2%'}}>
                            <span style={{fontSize:'13px', color:'rgb(255,255,255,0.8)'}}>무엇이 궁금한가요?</span>
                        </div>
                        <div>
                            <span style={{fontSize:'14px', marginLeft:'4%'}}>{qna.type}</span><span style={{marginLeft:'0px', color:'rgb(255,255,255,0.8)', fontSize:'13px'}}>에 관한 질문</span>
                            <span style={{fontSize:'14px', marginLeft:'1%'}}>{qna.category}</span><span style={{marginLeft:'0px', color:'rgb(255,255,255,0.8)', fontSize:'13px'}}>가 궁금해요</span>
                        </div>
                    </span>
                </div>
                <div className="title-container">
                    <div className="box-title">질문 제목</div>
                    <div className="box-body">{qna.title}</div>
                </div>
                <div className="desc-container">
                    <div className="box-title">질문 내용</div>
                    <div className="box-body">{qna.desc}</div>
                </div>
                <div className="info-container">
                    <Link to={{
                        pathname:`/gallery/${qna.galId}`
                    }} className="galleryName">{info.galleryName}</Link>
                    <Link to={{
                        pathname:`/gallery/${qna.galId}`
                    }}  className="displayName">{info.displayName} 님의 질문↗</Link>
                </div>
            </div>
            {/* 댓글을 달고 보여주는 공간 */}
            {/* <div style={{width:'100%'}}> */}
                { loading && <CommentContainer category="qna_comments" contentId={qna.id} userId={qna.userId} contentLikeNum={qna.comment_num} />}
            {/* </div> */}
        </div>
    )
}

export default QnAPage
