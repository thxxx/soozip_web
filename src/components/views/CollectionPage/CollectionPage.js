import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import './Sections/CollectionPage.css'
import CommentContainer from '../../tools/CommentContainer'
import {dbService} from '../../tools/fbase'
import Button from '@mui/material/Button';
import {authService} from '../../tools/fbase';
import {types} from '../../tools/types'
import { Link } from 'react-router-dom'
import * as FaIcons from 'react-icons/fa';

const CollectionPage = (props) => {
    // const history = useHistory();
    const [item, setItem] = useState({});
    const [loading, setLoading] = useState(false);
    const [update, setUpdate] = useState(false);
    const User = authService.currentUser;

    const getThisCollection = async () => {
        let dbcol;
        const dbCollection = await dbService
            .collection("collections")
            .doc(props.match.params.id)
            .get()
            .then(snapshot => dbcol = {...snapshot.data(), id:snapshot.id})
        const dbgallery = await dbService
            .collection("users")
            .where("userId", "==", dbcol.creatorId)
            .get()
        let dbgal = dbgallery.docs.map(doc => {return({...doc.data(), gal_id:doc.id})})
        setItem({...dbcol, galId:dbgal[0].gal_id, galleryName:dbgal[0].galleryName, displayName:dbgal[0].displayName})
        setLoading(true);
        //     // set이 붙는 함수를 쓸 때 값이 아니라 함수를 전달할 수 있다.
    }

    useEffect(() => {
        getThisCollection();
    },[update])

    const addLike = async () => {
        // 좋아요를 누른 적 있는지 체크해야한다.
        const dbLike = await dbService
            .collection("collections_like")
            .where("creatorId", "==", User.uid)
            .where("collectionId", "==", item.id)
            .get();
        const db_like = dbLike.docs.map(doc => {return({...doc.data(), id:doc.id})});
        console.log("dbLike", db_like)

        if(db_like.length === 0){
            const likeOne = {
                creatorId: User.uid,
                collectionId: item.id
            }
            await dbService.collection("collections_like").add(likeOne)

            await dbService.doc(`collections/${item.id}`).update({
                like_num:item.like_num + 1,
            });
            alert("I like it!");
            setUpdate(!update);
        }else{
            alert("이미 좋아요를 눌렀습니다.")
        }
    }

    return (
        <div className="one-collection-container">
            <div className="one-collection-body">
                <div className="collection-top">
                    <div className="gallery-name">
                        <Link to={{
                            pathname:`/gallery/${item.galId}`
                        }} className="gallery-link">{item.galleryName} ↗</Link>
                    </div>
                    <div className="collection-title-top">
                        <span className="collection-title">{item.title}</span>
                        <div style={{width:'20%', display:'flex', justifyContent:'end', paddingRight:'2%'}}>
                            <span className="type-one">{item.type}</span>
                        </div>
                    </div>
                </div>
                <div className="image-container">
                    <img src={item.attachmentURL} className="image" />
                </div>
                <div className="colection-desc">
                    <span className="desc-head">설명</span>
                    <span className="desc-body">{item.desc}</span>
                    <span className="like-container">
                        <div className="left-like-container">
                            <span className="more-button">갤러리의 다른 컬렉션 둘러보기</span>
                        </div>
                        <span onClick={addLike} className="collection-like-button">
                            <FaIcons.FaRegHeart color="white" size="30px"/>
                            <span className="like-desc">{item.like_num}</span>
                        </span>
                    </span>
                </div>
            </div>
            { loading && <CommentContainer category="c_comments" contentId={item.id} contentLikeNum={item.comment_num}/> }
        </div>
    )
}

export default CollectionPage
