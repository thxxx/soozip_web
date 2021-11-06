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
        setLoading(true);

        const dbSimilarDatas = await dbService
            .collection("collections")
            .where("type", "==", dbcol.type)
            .where("title", "!=", dbcol.title)
            .limit(5)
            .get()
    
        let dbsim = dbSimilarDatas.docs.map(doc => {
            return({...doc.data(), id:doc.id})
        });
        
        setSimilarItem(dbsim)
        //     // set이 붙는 함수를 쓸 때 값이 아니라 함수를 전달할 수 있다.
        console.log(dbsim)
    }

    useEffect(() => {
        getThisCollection();
    },[update])

    const addLike = async () => {
        if(!User){
            alert("로그인해야 좋아요가 가능합니다.")
        }
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
            <TypeTable top="12%"/>
            <div className="one-collection-body-right">
                        <span className="one-collection-gallery-owner">
                            <Link to={{
                                    pathname:`/gallery/${item.galId}`
                                }} className="gallery-link">
                            <span style={{width:'100%', display:'flex', justifyContent:'start', fontSize:'13px'}}>
                                <span style={{fontWeight:'600', color:'#4060AB'}}>{item.galleryCollectionNum}</span>개의 수집품이 전시되어있고 <span style={{fontWeight:'600', color:'#4060AB'}}>{item.galleryLikeNum}</span>번 수집되셨습니다.
                            </span>
                            <span className="gallery-title" style={{fontSize:'18px', marginTop:'5px'}}>
                                {item.galleryName}
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
                        </div>
                        <div className="collection-title-bottom">
                            <span className="collection-owner">{item.displayName}님의 애정이 담긴 물건입니다 - </span>
                            <span className="collection-date">{Date(item.created)}</span>
                        </div>
                    </div>
                    <div className="image-container">
                        <img src={item.attachmentURL} className="image" />
                    </div>
                    <div className="collection-desc">
                        <span className="desc-head">{item.displayName}님의 정성이 담긴 설명</span>
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
                                <FaIcons.FaRegHeart color="white" size="30px"/>
                                <span className="like-desc">{item.like_num}</span>
                            </span>
                        </span>
                    </div>
                </div>
                { loading && <CommentContainer category="c_comments" contentId={item.id} contentLikeNum={item.comment_num}/> }
            </div>
            <div className="one-collection-right-right">
                <div className="similar-collections-container">
                    <span className="similar-collections-title">
                        👀 비슷한 컬렉션들을 구경해보세요.
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
                            }} className="similar-collections-one" onClick={() => {
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
