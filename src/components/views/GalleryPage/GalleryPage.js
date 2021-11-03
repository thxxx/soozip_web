import React, {useEffect, useState,useRef} from 'react'
import './Sections/GalleryPage.css'
import { dbService } from '../../tools/fbase';
import OneCollection from '../../tools/OneCollection';
import {authService} from '../../tools/fbase';
import CollectionList from './Sections/CollectionList';
import CommentContainer from '../../tools/CommentContainer';
import * as FaIcons from 'react-icons/fa';
import Button from '@mui/material/Button';
import * as AiIcons from 'react-icons/ai';
import {Link} from 'react-router-dom'

const GalleryPage = (props) => {
    const targets = useRef(null);
    const [update, setUpdate] = useState(false);
    const [collections, setCollections] = useState([]);
    const [item, setItem] = useState({});
    const [loading, setLoading] = useState(false);
    const [now, setNow] = useState("");
    const User = authService.currentUser;
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const scrollDown = () => {
        // const target = document.getElementById('second')
        targets.current.scrollIntoView({behavior: 'smooth'})
    }

    const handleOpen = () => {
        setOpen(true);
        
    }
    const handleClose = () => setOpen(false);

    const editOpen = () => {
        setIsEditing(!isEditing);
    }

    // useEffect안에서 async를 하기 위해서 이렇게 따로 함수로 빼서 한다.
    // getThisCollections(); 이건 옛날방식이다?ㅠㅠ
    const getThisCollections = async () => {
        if(loading === true){
            const dbcollections = await dbService
            .collection("collections")
            .where("creatorId", "==", item.userId)
            .get();
            setCollections(dbcollections.docs.map(doc => {
                return({...doc.data(), id:doc.id})        
                }
            ));
        }
        //     // set이 붙는 함수를 쓸 때 값이 아니라 함수를 전달할 수 있다.
    }
    const getThisGallery = async () => {
        const dbgallery = await dbService
        .collection("users")
        .doc(props.match.params.id)
        .get()
        .then(snapshot => setItem({...snapshot.data(), id:snapshot.id}));
        //     // set이 붙는 함수를 쓸 때 값이 아니라 함수를 전달할 수 있다.
        setLoading(true);
        setNow(props.match.params.id)
    }

    useEffect(() => {
        if(now !== props.match.params.id){
            setLoading(false);
        }
        // if(props.location.state === undefined){
        //     props.history.push("/")       
        // }
        getThisGallery();
        getThisCollections(); // 이건 옛날방식이다?ㅠㅠ
        // 이 방법이 re-render하지 않아서 더 빠르다.
    },[update, loading, props.match.params.id])

    const addLike = async () => {
        // 좋아요를 누른 적 있는지 체크해야한다.
        const dbLike = await dbService
            .collection("users_like")
            .where("creatorId", "==", User.uid)
            .where("galleryId", "==", item.id)
            .get();
        const db_like = dbLike.docs.map(doc => {return({...doc.data(), id:doc.id})});
        console.log("dbLike", db_like)

        if(db_like.length === 0){
            const likeOne = {
                creatorId: User.uid,
                galleryId: item.id
            }
            await dbService.collection("users_like").add(likeOne)

            await dbService.doc(`users/${item.id}`).update({
                like_num:item.like_num + 1,
            });
            alert("I like it!");
            setUpdate(!update);
        }else{
            const ok = window.confirm("이미 좋아요를 누르셨습니다. 취소하시겠습니까?");
            console.log(db_like[0].id);
            
            if(ok){
                await dbService.doc(`users_like/${db_like[0].id}`).delete();

                await dbService.doc(`users/${item.id}`).update({
                    like_num:item.like_num - 1,
                });
                alert("취소 했습니다!");
                setUpdate(!update);
            }else{
                return;
            }
        }
    }

    
    return (
        <div className="gallery-container" style={{ background:`linear-gradient(to right, ${item.left_color} 30%, ${item.right_color})`}}>
            <div className="gallery-header">
                { User ? item.userId === User.uid && 
                <span className="if-my-gallery">
                    이곳은 내 갤러리 입니다.
                    { isEditing ? <Button onClick={editOpen} style={{backgroundColor:'blue'}}>완료하기</Button> : <>
                        <span onClick={editOpen} className="collection-delete-button">컬렉션 삭제하기</span>
                        <Link to='/profile' className="collection-delete-button" style={{backgroundColor:'black'}}>갤러리 정보수정</Link>
                        </>
                    }
                </span> : null
                }
                <span className="gallery-owner" style={{backgroundColor:`${item.color}`}}>
                    <div>
                        <span className="font">{item.displayName}</span>님의 공간입니다.
                    </div>
                    <span className="gallery-title">
                        {item.galleryName}
                    </span>
                </span>
                <div className="title-info">
                    <p><span>{item.collection_num}개의 컬렉션이 전시되어있고 </span><span> {item.like_num}명이 좋아합니다. </span><span s tyle={{marginLeft:'10%'}}> {item.comment_num}개의 댓글</span></p>
                </div>
                <div className="gallery-type-table">
                    {loading && item.typess.map((item, index) => {
                        return (
                            <span key={index} className="tag">{item}</span>
                        )
                    })}
                </div>
                <div className="galley-info">
                    {item.desc}
                </div>
            </div>
            <div className="collection-list">
                <CollectionList collections={collections} mainColor={"rgba(0,0,0,0)"} isEditing={isEditing}/>
            </div>
            {/* 비슷한 갤러리 추천 공간 */}
            <div>
                
            </div>

            <hr color="black"/>
            {/* 댓글을 달고 보여주는 공간 */}

            <div ref={targets} ></div>

            { loading && <CommentContainer category="g_comments" contentId={item.id} userId={item.userId} contentLikeNum={item.comment_num} displayName={item.displayName}/>}
            
            <span className="side-actions">
                <span className="action-component" onClick={addLike}>
                    <FaIcons.FaRegHeart color="5555ff" size="30px"/>
                    <span className="num">{item.like_num}</span>
                </span>
                <span className="action-component" onClick={scrollDown}>댓글 {item.comment_num}</span>
            </span>
        </div>
    )
}

export default GalleryPage
