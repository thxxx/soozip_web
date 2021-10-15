import React, {useState, useEffect} from 'react'
import './Sections/QnAPage.css'
import Button from '@mui/material/Button';
import {Input} from 'antd'
import { dbService } from '../../tools/fbase';
import {authService} from '../../tools/fbase';
import CommentContainer from '../../tools/CommentContainer';
import { Link } from 'react-router-dom'

const InformationPage = (props) => {
    const User = authService.currentUser;
    const [update, setUpdate] = useState(false);
    const [information, setInformation] = useState({});
    const [info, setInfo] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getThisInformation();
        getThisQnaInfo();
    },[update, loading])

    const getThisInformation = async () => {
        let data;
        const dbinfo = await dbService
        .collection("informations")
        .doc(props.match.params.id)
        .get()
        .then(snapshot => data = {...snapshot.data(), id:snapshot.id})

        const dbgallery = await dbService
            .collection("users")
            .where("userId", "==", data.creatorId)
            .get()
        
        let dbgal = dbgallery.docs.map(doc => {return({...doc.data(), gal_id:doc.id})})
        
        setInformation({...data, galId:dbgal[0].gal_id, galleryName:dbgal[0].galleryName, displayName:dbgal[0].displayName})

        setLoading(true);
        //     // set이 붙는 함수를 쓸 때 값이 아니라 함수를 전달할 수 있다.
    }

    const getThisQnaInfo = async () => {
        if(loading){
            const dbinfos = await dbService.collection("users")
            .where("userId", "==", information.creatorId)
            .get();

            let dbinfo = dbinfos.docs.map(doc => {return({...doc.data(), id:doc.id})})
            setInfo(dbinfo[0]);
        }
    }


    const addLike = async () => {
        // 좋아요를 누른 적 있는지 체크해야한다.
        const dbLike = await dbService
            .collection("informations_like")
            .where("creatorId", "==", User.uid)
            .where("informationId", "==", information.id)
            .get();
        const db_like = dbLike.docs.map(doc => {return({...doc.data(), id:doc.id})});
        console.log("dbLike", db_like)

        if(db_like.length === 0){
            const likeOne = {
                creatorId: User.uid,
                informationId: information.id
            }
            await dbService.collection("informations_like").add(likeOne)

            await dbService.doc(`informations/${information.id}`).update({
                like_num:information.like_num + 1,
            });
            alert("I like it!");
            setUpdate(!update);
        }else{
            alert("이미 좋아요를 눌렀습니다.")
        }
    }
    return (
        <div className="QnAContainer">
            <div className="QnAInfo">
                <div className="top-container">
                    <span className="qna">정보</span>
                    <span className="ask">
                        <div style={{paddingLeft:'2%'}}>
                            <span style={{fontSize:'13px', color:'rgb(255,255,255,0.8)'}}>무엇에 관한 정보인가요?</span>
                        </div>
                        <div>
                            <span style={{fontSize:'14px', marginLeft:'4%'}}>{information.type}</span><span style={{marginLeft:'0px', color:'rgb(255,255,255,0.8)', fontSize:'13px'}}>의</span>
                            <span style={{fontSize:'14px', marginLeft:'1%'}}>{information.category}</span><span style={{marginLeft:'0px', color:'rgb(255,255,255,0.8)', fontSize:'13px'}}>에 관한 정보</span>
                        </div>
                    </span>
                </div>
                <div className="title-container">
                    <div className="box-title">제목</div>
                    <div className="box-body">{information.title}</div>
                </div>
                <div className="desc-container">
                    <div className="box-title">정보 내용</div>
                    <div className="box-body">{information.desc}</div>
                </div>
                <div className="num-of-like" >
                    {information.like_num}명이 유용하다고 평가했습니다.
                </div>
                <div className="info-container">
                    <span onClick={addLike} className="galleryName">유용한 정보라면 클릭!</span>
                    <Link to={{
                        pathname:`/gallery/${information.galId}`
                    }}  className="displayName">{info.displayName} 님이 공유↗</Link>
                </div>
            </div>
            {/* 댓글을 달고 보여주는 공간 */}
            {/* <div style={{width:'100%'}}> */}
                { loading && <CommentContainer category="i_comments" contentId={information.id} userId={information.userId} contentLikeNum={information.comment_num} />}
            {/* </div> */}
        </div>
    )
}

export default InformationPage
