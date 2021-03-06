import React, {useState, useEffect} from 'react'
import './Sections/CollectionPage.css'
import CommentContainer from '../../tools/CommentContainer'
import {dbService} from '../../tools/fbase'
import {authService} from '../../tools/fbase';
import { Link } from 'react-router-dom'
import * as FaIcons from 'react-icons/fa';
import TypeTable from '../../tools/TypeTable'

const CollectionPage = (props) => {
    // const history = useHistory();
    const [item, setItem] = useState({});
    const [loading, setLoading] = useState(false);
    const [update, setUpdate] = useState(false);
    const [similarItem, setSimilarItem] = useState([]);
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
        setItem({...dbcol, 
            galId:dbgal[0].gal_id, 
            galleryName:dbgal[0].galleryName, 
            galleryTypes:dbgal[0].typess, 
            displayName:dbgal[0].displayName,
            galleryCollectionNum:dbgal[0].collection_num,
            galleryLikeNum:dbgal[0].like_num,
            galleryDesc:dbgal[0].desc,
        })

        const dbSimilarDatas = await dbService
            .collection("collections")
            .where("type", "==", dbcol.type)
            .where("title", "!=", dbcol.title)
            .get()
    
        let dbsim = dbSimilarDatas.docs.map(doc => {
            return({...doc.data(), id:doc.id})
        });

        const dbsims = [];
        let randomNum;
        let randomNumList = [];
        while(dbsims.length < 5 && dbsims.length !== dbsim.length ){
            randomNum = Math.floor(Math.random() * dbsim.length);
            if(randomNumList.includes(randomNum)){
                continue;
            }
            dbsims.push(dbsim[randomNum]);
            randomNumList.push(randomNum);
        }
        //     // set??? ?????? ????????? ??? ??? ?????? ????????? ????????? ????????? ??? ??????.
        setSimilarItem(dbsims);
        setLoading(true);
    }

    useEffect(() => {
        if(loading === false){
            window.scrollTo({top:0, left:0, behavior:'smooth'});
        }
        getThisCollection();
    },[update])

    const addLike = async () => {
        if(!User){
            alert("??????????????? ???????????? ???????????????.")
        }
        // ???????????? ?????? ??? ????????? ??????????????????.
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
            alert("???????????? ??????????????????!");
            setUpdate(!update);
        }else{
            alert("?????? ???????????? ???????????????.")
        }
    }

    return (
        <div className="one-collection-container">
            <TypeTable top="12%"/>
            <div className="one-collection-body-right">
                        <span className="one-collection-gallery-owner">
                            <Link to={{
                                    pathname:`/gallery/${item.galId}`
                                }} className="gallery-link">
                            <span style={{width:'100%', display:'flex', justifyContent:'start', fontSize:'13px'}}>
                                <span style={{fontWeight:'600', color:'#4060AB'}}>{item.galleryCollectionNum}</span>?????? ???????????? ?????????????????? <span style={{fontWeight:'600', color:'#4060AB'}}>{item.galleryLikeNum}</span>??? ?????????????????????.
                            </span>
                            <span className="gallery-title" style={{fontSize:'18px', marginTop:'5px'}}>
                                {item.galleryName} ???
                            </span>
                            <div className="gallery-type-table">
                                {loading && item.galleryTypes.map((item, index) => {
                                    return (
                                        <span key={index} className="tag">{item}</span>
                                    )
                                })}
                            </div>
                            </Link>
                        </span>

                <div className="one-collection-body">
                    <div className="collection-top">
                            {item.favorite ? 
                                <span style={{color:'rgb(252, 71, 101)'}}>Favorite !</span> :
                                null
                            }
                        <div className="collection-title-top">
                            <span className="collection-title">{item.title}</span>
                            <span>{item.type}</span>
                        </div>
                        <div className="collection-title-bottom">
                            <span className="collection-owner">{item.displayName}?????? ????????? ?????? ??????????????? - </span>
                            <span className="collection-date">{Date(item.created)}</span>
                        </div>
                    </div>
                    <div className="image-container">
                        <img src={item.attachmentURL} className="image" />
                    </div>
                    <div className="collection-desc">
                        <span className="desc-head">{item.displayName}?????? ????????? ?????? ??????</span>
                        <span className="desc-body">{item.desc}</span>
                        <span className="hashtags-container">
                            {item.hashtags ? item.hashtags.map((item, index) => {
                                return (
                                    <span key={index} className="hashtags-one"># {item}</span>
                                )
                            }):null}
                        </span>
                        <span className="like-container">
                            <span onClick={addLike} className="collection-like-button">
                                <span className="like-desc">{item.like_num}?????? Hit!</span>
                            </span>
                        </span>
                    </div>
                </div>
                { loading && <CommentContainer category="c_comments" contentId={item.id} contentLikeNum={item.comment_num}/> }
            </div>
            <div className="one-collection-right-right">
                <div className="similar-collections-container">
                    <span className="similar-collections-title">
                        ???? ????????? ??????????????? ??????????????????.
                    </span>
                    <div className="similar-collections-list">
                    {similarItem.map((item, index) => {
                        let date = new Date(item.created);
                        let now = new Date();
                        return (
                            <Link to={{
                                pathname:`/CollectionPage/${item.id}`,
                                state:{
                                    data:item
                                }
                            }} className="similar-collections-one" key={index} onClick={() => {
                                setUpdate(!update);
                                window.scrollTo({top:0, left:100, behavior:'smooth'});
                                }}>
                                {(date.getDate()-now.getDate()) < 2 ? <span style={{color:'rgb(252, 71, 101)'}}>new</span> : null}
                                <div>
                                    <img src={`${item.attachmentURL}`} className="similar-collections-one-img"/>
                                </div>
                                {item.title}
                            </Link>
                        )
                    })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CollectionPage
