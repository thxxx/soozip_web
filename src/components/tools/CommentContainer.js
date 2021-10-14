import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom';
import Button from '@mui/material/Button';
import {Input} from 'antd'
import { dbService } from './fbase';
import {authService} from './fbase';
import './CommentContainer.css'

const CommentContainer = ({category, contentId, userId, contentLikeNum}) => {
    const [update, setUpdate] = useState(false);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [gid, setGid] = useState("");
    const User = authService.currentUser;

    useEffect(() => {
        getThisComments();
    },[update])

    const getThisComments = async () => {
        let dbcomments;
        switch(category){
            case "c_comments":{
                dbcomments = await dbService
                .collection(category)
                .where("collectionId", "==", contentId)
                .orderBy("created", "desc")
                .get();
                setComments(dbcomments.docs.map(doc => {return({...doc.data(), id:doc.id})}));
                break;
            }
            case "g_comments":{
                dbcomments = await dbService
                .collection(category)
                .where("userId", "==", contentId)
                .orderBy("created", "desc")
                .get();
                setComments(dbcomments.docs.map(doc => {return({...doc.data(), id:doc.id})}));
                break;
            }
            case "qna_comments":{
                console.log(category, " 입니다.")
                dbcomments = await dbService
                .collection(category)
                .where("qnaId", "==", contentId)
                .orderBy("created", "desc")
                .get();
                setComments(dbcomments.docs.map(doc => {return({...doc.data(), id:doc.id})}));
                break;
            }
            case "i_comments":{
                dbcomments = await dbService
                .collection(category)
                .where("information_id", "==", contentId)
                .orderBy("created", "desc")
                .get();
                setComments(dbcomments.docs.map(doc => {return({...doc.data(), id:doc.id})}));
                break;
            }
        }
    }

    const uploadComment = async () => {
        // 로그인 한 유저여야 한다.

        const [usersId, galleryName, galleryColor] = await getCommenterGalleryId(User.uid)

        console.log(usersId, galleryName)

        switch(category){
            case "c_comments":{
                const commentOne = {
                    creatorId:User.uid, // 댓글을 작성한 유저 아이디
                    collectionId:contentId, // 댓글이 달린 컬렉션의 아이디
                    comment:comment,
                    displayName:User.displayName,
                    created:Date.now(),
                    galleryId:usersId, // 댓글을 작성한 유저가 소유한 갤러리 아이디.
                    galleryName,
                    galleryColor
                };

                if(comment.length < 3){
                    alert("3글자 이상 입력하셔야 합니다.")
                    return;
                }
                await dbService.collection(category).add(commentOne)
                .then((docRef) => {console.log("이걸로 함", docRef.id)});
                await dbService.doc(`collections/${contentId}`).update({
                    comment_num:contentLikeNum + 1,
                });
                break;
            }
            case "g_comments":{
                const commentOne = {
                    creatorId:User.uid, // 댓글을 작성한 유저 아이디
                    userId:contentId, // 댓글이 달린 갤러리의 아이디
                    comment:comment,
                    displayName:User.displayName,
                    created:Date.now(),
                    galleryId:usersId, // 댓글을 작성한 유저가 소유한 갤러리 아이디.
                    galleryName,
                    galleryColor
                };

                if(comment.length < 3){
                    alert("3글자 이상 입력하셔야 합니다.")
                    return;
                }

                await dbService.collection(category).add(commentOne)
                .then((docRef) => {console.log("이걸로 함", docRef.id)});
                await dbService.doc(`users/${contentId}`).update({
                    comment_num:contentLikeNum + 1,
                });
                break;
            }
            case "i_comments":{
                
                break;
            }
            case "qna_comments":{
                const commentOne = {
                    creatorId:User.uid,
                    comment:comment,
                    displayName:User.displayName,
                    created:Date.now(),
                    like_num:0,
                    qnaId:contentId,
                    galleryId:usersId, // 댓글을 작성한 유저가 소유한 갤러리 아이디.
                    galleryName,
                    galleryColor

                };

                if(comment.length < 3){
                    alert("3글자 이상 입력하셔야 합니다.")
                    return;
                }

                await dbService.collection("qna_comments").add(commentOne)
                .then((docRef) => {console.log("이걸로 함", docRef.id)});
                await dbService.doc(`qnas/${contentId}`).update({
                    comment_num:contentLikeNum + 1,
                });
                break;
            }
        }

        alert("댓글 작성!")
        setComment("");
        setUpdate(!update);
    }


    const likeComment = async (item) => {
        // 좋아요를 누른 적 있는지 체크해야한다.
        const dbLike = await dbService
            .collection("qna_comments_like")
            .where("creatorId", "==", User.uid)
            .where("qnaId", "==", item.id)
            .get();
        const db_like = dbLike.docs.map(doc => {return({...doc.data(), id:doc.id})});
        console.log("dbLike", db_like)

        if(db_like.length === 0){
            const likeOne = {
                creatorId: User.uid,
                qnaId: item.id
            }
            await dbService.collection("qna_comments_like").add(likeOne)

            await dbService.doc(`qna_comments/${item.id}`).update({
                like_num:item.like_num + 1
            });
            alert("누르기 했습니다. ");
            setUpdate(!update);
        }else{
            const ok = window.confirm("이미 좋아요를 누르셨습니다. 취소하시겠습니까?");
            console.log(db_like[0].id);
            
            if(ok){
                await dbService.doc(`qna_comments_like/${db_like[0].id}`).delete();

                await dbService.doc(`qna_comments/${item.id}`).update({
                    like_num:item.like_num - 1,
                });
                alert("취소 했습니다!");
                setUpdate(!update);
            }else{
                return;
            }
        }
    }
    
    const deleteComment = async (item) => {
        const ok = window.confirm("Are you sure you want to delete?");
        if(ok){
            //delete 파일도 같이 지워져야만 한다.
            await dbService.doc(`${category}/${item.id}`).delete();
            switch(category){
                case "c_comments":{
                    await dbService.doc(`collections/${contentId}`).update({
                        comment_num:contentLikeNum - 1,
                    });
                    break;
                }
                case "g_comments":{
                    await dbService.doc(`users/${contentId}`).update({
                        comment_num:contentLikeNum - 1,
                    });
                    break;
                }
                case "i_comments":{
                    break;
                }
            }
            alert("삭제 했습니다. ");
            setUpdate(!update);
        }else{

        }
    }

    const getCommenterGalleryId = async (creatorId) => {

        const dbGallery = await dbService.collection("users")
        .where("userId", "==", creatorId)
        .get();

        let result = dbGallery.docs.map(doc => {return({...doc.data(), id:doc.id})})

        if(result.length === 0){
            return "";
        }else{
            return [result[0].id, result[0].galleryName, result[0].color];
        }
    }

    const commentTable = comments.map((item,index) => {
        let isOwner = false;
        if(User){
            isOwner = item.creatorId === User.uid;
        }
        let date = new Date(item.created);
        let now = new Date();
        
        let day = now.getDate() - date.getDate();
        let month = now.getMonth() - date.getMonth();
        let hour = now.getHours() - date.getHours();

        let dateResult;
        if(month === 0){
            if(day===0){
                dateResult = hour + "시간 전"
            }else{
                dateResult = day + "일 전"
            }
        }else{
            dateResult = month + "달 전"
        }

        let likeColor = '#000000';
        if(category === "qna_comments" && item.like_num > 5){
            likeColor = 'rgb(145, 2, 2)'
        }else if(category === "qna_comments" && item.like_num > 5){
            likeColor = '#6705b8'
        }

        return(
            <div className="comment-one" key={index}>
                <span className="comment-body">
                    <Link to={{
                        pathname:`/gallery/${item.galleryId}`
                    }} className="comment-move">
                        <p style={{margin:'3px'}}><span style={{color:'gray'}}>작성</span> {item.displayName}</p>
                        <p style={{margin:'3px', color:`${item.galleryColor}`}}>{item.galleryName} </p>
                    </Link>
                    <div className="comment-body-body">
                        <p style={{margin:'0px', marginTop:'3px', color:'rgba(0,0,0,0.2)', fontSize:'12px', paddingLeft:'0%'}}>
                            {dateResult}
                        </p>
                        <p style={{margin:'0px'}}> {item.comment}</p>
                    </div>
                </span>
                <span className="buttons">
                    { category === "qna_comments" && <>
                    <span onClick={() => likeComment(item)} 
                        style={{backgroundColor:'#5555ff', fontSize:'12px', color:'white', margin:'2px'}} 
                        className="like-button">
                        👍
                    </span>
                    <span className="like-num" style={{color:`${likeColor}`}}>{item.like_num}</span>
                    </>}
                    
                    { isOwner && <>
                        <span onClick={() => deleteComment(item)} 
                            className="delete-button">X</span>
                    </>}
                </span>
            </div>
        )
    })

    {/* 댓글을 달고 보여주는 공간 */}
    return (
        <div className="comment-container">
            <div className="comment-body-container">
                {category === "g_comments" ? 
                <div className="comment-title">
                    <span style={{fontSize:'18px', color:'green'}}>갤러리 방명록</span>    공간에 대한 감상평을 남겨보세요!
                </div> : null}
                <div className="comment-input-container">
                    <Input value={comment} onChange={e => setComment(e.currentTarget.value)} placeholder="댓글을 입력하세요." className="comment-input"/>
                    <span className="comment-send" onClick={uploadComment} >
                        작성
                    </span>
                </div>
                <div className="comment-table-container">
                    {commentTable}
                </div>
            </div>
        </div>
    )
}

export default CommentContainer
