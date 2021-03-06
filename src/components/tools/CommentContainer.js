import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom';
import {Input} from 'antd'
import {authService, firebaseInstance, dbService} from './fbase';
import './CommentContainer.css'
import LoginModal from './Modal/LoginModal'
import { useHistory } from "react-router-dom";

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

const CommentContainer = ({category, contentId, userId, contentLikeNum, displayName, setLoading, hasGallery}) => {
    const [update, setUpdate] = useState(false);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [open, setOpen] = useState(false);
    const User = authService.currentUser;
    let history = useHistory();

    useEffect(() => {
        getThisComments();
    },[update])

    const handleOpen = () => {
        setOpen(true);
    }

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
                .where("informationId", "==", contentId)
                .orderBy("created", "desc")
                .get();
                setComments(dbcomments.docs.map(doc => {return({...doc.data(), id:doc.id})}));
                break;
            }
        }
    }

    const uploadComment = async () => {
        // ????????? ??? ???????????? ??????.
        if(!User){
            handleOpen();
            return;
        }
        if(!hasGallery){
            alert("?????? ???????????? ????????????????????????.");
            history.push('/profile');
            return;
        }

        const [usersId, galleryName, galleryColor] = await getCommenterGalleryId(User.uid)

        switch(category){
            case "c_comments":{
                const commentOne = {
                    creatorId:User.uid, // ????????? ????????? ?????? ?????????
                    collectionId:contentId, // ????????? ?????? ???????????? ?????????
                    comment:comment,
                    displayName:User.displayName,
                    created:Date.now(),
                    galleryId:usersId, // ????????? ????????? ????????? ????????? ????????? ?????????.
                    galleryName,
                    galleryColor
                };

                if(comment.length < 3){
                    alert("3?????? ?????? ??????????????? ?????????.")
                    return;
                }
                await dbService.collection(category).add(commentOne)
                .then((docRef) => {console.log("????????? ???", docRef.id)});
                await dbService.doc(`collections/${contentId}`).update({
                    comment_num:contentLikeNum + 1,
                });
                break;
            }
            case "g_comments":{
                const commentOne = {
                    creatorId:User.uid, // ????????? ????????? ?????? ?????????
                    userId:contentId, // ????????? ?????? ???????????? ?????????
                    comment:comment,
                    displayName:User.displayName,
                    created:Date.now(),
                    galleryId:usersId, // ????????? ????????? ????????? ????????? ????????? ?????????.
                    galleryName,
                    galleryColor
                };

                if(comment.length < 3){
                    alert("3?????? ?????? ??????????????? ?????????.")
                    return;
                }

                await dbService.collection(category).add(commentOne)
                .then((docRef) => {console.log("????????? ???", docRef.id)});
                await dbService.doc(`users/${contentId}`).update({
                    comment_num:contentLikeNum + 1,
                });
                break;
            }
            case "i_comments":{
                const commentOne = {
                    creatorId:User.uid,
                    comment:comment,
                    displayName:User.displayName,
                    created:Date.now(),
                    like_num:0,
                    informationId:contentId,
                    galleryId:usersId, // ????????? ????????? ????????? ????????? ????????? ?????????.
                    galleryName,
                    galleryColor
                };

                if(comment.length < 3){
                    alert("3?????? ?????? ??????????????? ?????????.")
                    return;
                }

                await dbService.collection("i_comments").add(commentOne)
                    .then((docRef) => {console.log("????????? ???", docRef.id)});
                await dbService.doc(`informations/${contentId}`).update({
                    comment_num:contentLikeNum + 1,
                });
                
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
                    galleryId:usersId, // ????????? ????????? ????????? ????????? ????????? ?????????.
                    galleryName,
                    galleryColor
                };

                if(comment.length < 3){
                    alert("3?????? ?????? ??????????????? ?????????.")
                    return;
                }

                await dbService.collection("qna_comments").add(commentOne)
                .then((docRef) => {console.log("????????? ???", docRef.id)});
                await dbService.doc(`qnas/${contentId}`).update({
                    comment_num:contentLikeNum + 1,
                });
                break;
            }
        }

        alert("?????? ??????!")
        setComment("");
        setUpdate(!update);
    }


    const likeComment = async (item) => {
        // ???????????? ?????? ??? ????????? ??????????????????.
        const dbLike = await dbService
            .collection("qna_comments_like")
            .where("creatorId", "==", User.uid)
            .where("qnaId", "==", item.id)
            .get();
        const db_like = dbLike.docs.map(doc => {return({...doc.data(), id:doc.id})});

        if(db_like.length === 0){
            const likeOne = {
                creatorId: User.uid,
                qnaId: item.id
            }
            await dbService.collection("qna_comments_like").add(likeOne)

            await dbService.doc(`qna_comments/${item.id}`).update({
                like_num:item.like_num + 1
            });
            alert("????????? ????????????. ");
            setUpdate(!update);
        }else{
            const ok = window.confirm("?????? ???????????? ??????????????????. ?????????????????????????");
            
            if(ok){
                await dbService.doc(`qna_comments_like/${db_like[0].id}`).delete();

                await dbService.doc(`qna_comments/${item.id}`).update({
                    like_num:item.like_num - 1,
                });
                alert("?????? ????????????!");
                setUpdate(!update);
            }else{
                return;
            }
        }
    }
    
    const deleteComment = async (item) => {
        const ok = window.confirm("Are you sure you want to delete?");
        if(ok){
            //delete ????????? ?????? ??????????????? ??????.
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
                    await dbService.doc(`informations/${contentId}`).update({
                        comment_num:contentLikeNum - 1,
                    });
                    break;
                }
                case "qna_comments":{
                    await dbService.doc(`qnas/${contentId}`).update({
                        comment_num:contentLikeNum - 1,
                    });
                    break;
                }
            }
            alert("?????? ????????????. ");
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
                dateResult = hour + "?????? ???"
            }else{
                dateResult = day + "??? ???"
            }
        }else{
            dateResult = month + "??? ???"
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
                    }} className="comment-move" onClick={() => {setLoading(false);window.scrollTo({top:0, left:100, behavior:'smooth'});}}>
                        <p style={{margin:'3px'}}><span style={{color:'gray'}}>??????</span> {item.displayName}</p>
                        <p style={{margin:'3px'}}>{item.galleryName} </p>
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
                        ????
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

    {/* ????????? ?????? ???????????? ?????? */}
    return (
        <div className="comment-container">
            { category === "g_comments" ? 
                <div className="comment-title">
                    ????????????
                </div> : null
            }
            <div className="comment-body-container">
                <div className="comment-table-container">
                    {commentTable}
                </div>
            </div>

            <div className="comment-input-container">
                <Input value={comment} onChange={e => setComment(e.currentTarget.value)} placeholder="????????? ???????????????." className="comment-input"/>
                <span className="comment-send" onClick={uploadComment} >
                    ??????
                </span>
            </div>
            <LoginModal open={open} setOpen={setOpen} />
        </div>
    )
}

export default CommentContainer
