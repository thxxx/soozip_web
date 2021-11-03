import React, {useState, useEffect} from 'react'
import { dbService } from '../../tools/fbase';
import {authService} from '../../tools/fbase';
import './Sections/LiksPage.css'
import {Link} from 'react-router-dom'

const LikePage = () => {
    const [clikes, setClikes] = useState([])
    const [glikes, setGlikes] = useState([])
    const [qclikes, setQclikes] = useState([])
    const [loading, setLoading] = useState(true)
    const User = authService.currentUser;

    const getCollectionLikes = async () => {
        const dbCollection = await dbService.collection("collections_like")
        .where("creatorId", "==", User.uid)
        .get();

        let clist = []

        let clikeList = dbCollection.docs.map(doc => {return({...doc.data(), id:doc.id})})
        clikeList.map(async (item, index) => {
            await dbService.collection("collections")
            .doc(item.collectionId)
            .get()
            .then(snapshot => { clist.push({...snapshot.data(), id:snapshot.id})})
        })
        setClikes(clist)
    }
    const getGalleryLikes = async () => {
        const dbGallery = await dbService.collection("users_like")
        .where("creatorId", "==", User.uid)
        .get();

        let glikeList = dbGallery.docs.map(doc => {return({...doc.data(), id:doc.id})});

        glikeList.map(async (item, index) => {
            await dbService.collection("users")
            .doc(item.galleryId)
            .get()
            .then(snapshot => {setGlikes([...glikes, {...snapshot.data(), id:snapshot.id}])})
        })
    }
    const getQnaCommentLikes = async () => {
        const dbQna = await dbService.collection("qna_comments_like")
        .where("creatorId", "==", User.uid)
        .get();

        setQclikes(dbQna.docs.map(doc => {return({...doc.data(), id:doc.id})}));
        setLoading(false);
    }

    useEffect(() => {
        setGlikes([]);
        setClikes([]);
        getCollectionLikes();
        getGalleryLikes();
        getQnaCommentLikes();
    },[loading])

    const glikesTable = glikes.map((item, index) => {

        return(
            <Link to={{
                pathname:`gallery/${item.id}`
            }}  key={index} className="gallery-like-one">
                <span className="gallery_owner"><span className="gangjo">{item.displayName}</span>님의 갤러리</span>
                <span className="likes-gallery-name">{item.galleryName}
                </span>
                <div className="gallery-info">
                    <span><span className="gangjo">{item.collection_num}</span> 개의 컬렉션 | </span>
                    <span><span className="gangjo">{item.like_num}</span> 개의 좋아요</span>
                </div>
            </Link>
        )
    })
    const clikesTable = clikes.map((item, index) => {
        return(
            <Link to={{
                pathname:`CollectionPage/${item.id}`
            }}  key={index} className="gallery-like-one">
                {/* <span className="gallery_owner"><span className="gangjo">{item.displayName}</span>님의 갤러리</span> */}
                <span className="likes-gallery-name">
                    {item.title}
                </span>
                <span className="likes-type">{item.type}</span>
                <div className="gallery-info">
                    <span><span className="gangjo">{item.comment_num}</span> 개의 댓글 | </span>
                    <span><span className="gangjo">{item.like_num}</span> 개의 좋아요</span>
                </div>
            </Link>
        )
    })

    return (
        <div className="my-like-container">
            <div className="my-like-back">
                <div className="like-title">
                    <p>
                        좋아요한 것들 목록이 쭉 나온다.
                    </p>
                </div>
                <div style={{width:'80%'}}>
                    <p className="info-title">갤러리 좋아요 한 것들</p>
                    {!loading && <>
                        {glikesTable}
                    </>}
                </div>
                <div style={{width:'80%'}}>
                    <p className="info-title">컬렉션 좋아요 한 것들</p>
                    {!loading && <>
                        {clikesTable}
                    </>}
                </div>
                <div style={{width:'80%'}}>
                    <p className="info-title">QnA 답변에 좋아요 한 것들</p>
                </div>
            </div>
        </div>
    )
}

export default LikePage
