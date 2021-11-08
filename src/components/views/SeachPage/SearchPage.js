import React from 'react'
import {useState, useEffect} from 'react'
import GalleryCard from '../../tools/Cards/GalleryCard'
import { Link } from 'react-router-dom';
import { dbService } from '../../tools/fbase';
import CollectionCard from '../LandingPage/Sections/CollectionCard'
import TypeTable from '../../tools/TypeTable'

const SearchPage = (props) => {
    const [galleries, setGalleries] = useState([]);
    const [collections, setCollections] = useState([]);
    const [type, setType] = useState("전체");
    const [loading, setLoading] = useState(false);
    // const [update, setUpdate] = useState(false);
    // const [page, setPage] = useState(1);

    useEffect(() => {
        console.log(props.match.params.id)
        console.log(typeof(props.match.params.id))
    },[])

    const getAllCollections = async () => {
        const galleryDatas = await dbService
            .collection("users")
            .orderBy("like_num", "desc")
            .limit(12)
            .get(); // uid를 creatorId로 줬었으니까.
        const galleryData = galleryDatas.docs.map(doc => {
            return({...doc.data(), id:doc.id})
        });
    }

    const getRealAllCollections = async () => {
        if(type==="전체"){
            const collectionDatas = await dbService
                .collection("collections")
                .orderBy("created", "desc")
                .get(); // uid를 creatorId로 줬었으니까.
            const collectionData = collectionDatas.docs.map(doc => {
                return({...doc.data(), id:doc.id})
            });
            setCollections(collectionData.filter(doc => doc.title.includes(props.match.params.id) || doc.desc.includes(props.match.params.id) ));
        }else{
            const collectionDatas = await dbService
                .collection("collections")
                .orderBy("like_num", "desc")
                .where("type", "==", type)
                .limit(10)
                .get(); // uid를 creatorId로 줬었으니까.
            const collectionData = collectionDatas.docs.map(doc => {
                return({...doc.data(), id:doc.id})
            });
            setCollections(collectionData);
        }
        setLoading(true);
    }

    useEffect(() => {
        // getAllCollections();
        getRealAllCollections();
    },[type, props.match.params.id])

    const galleryTable = galleries.map((item, index) => {
        return(
            <GalleryCard data={item} key={index}/>
            )
        })

        const collectionTable = collections.map((item, index) => {
        return(
            <CollectionCard item={item} key={index}/>
        )
    })

    // 빅 갤러리 리스트에 ContextAPI로 넘겨주기
    if( loading ){
    return (
        <div className="landingcontainer">
            <div className="landing-bottom-container">
            <TypeTable top="15%"/>

            <div className="landing-bottom-container-right">
                <div className="gallery-rankings">
                    {/* <GalleryRankingList /> */}
                </div>

                <div className="qna-table-container">
                    <div className="qna-table-title">
                        <div style={{display:'flex', flexDirection:'column'}}>
                            <span>'{props.match.params.id}'에 대한 검색결과입니다.</span>
                            <span style={{fontSize:'14px'}}>
                                수집가들의 개성 넘치는 수집공간을 둘러보세요
                            </span>
                        </div>
                    </div>
                    <div className="landing-qna-table">
                        {collectionTable}
                    </div>
                </div>
            </div>
            </div>
{/* 
            {props.isLoggedIn ? <>
            <Link to="upload" className="upload-button">컬렉션 등록하기</Link> 
            </>: 
            <span className="upload-button" onClick={handleOpen}>컬렉션 등록하기</span>
            } */}

        </div>
        )
    }else{
        return(
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', fontSize:'30px', fontFamily:'EliceBold', height:'100%'}}>
            로딩중
        </div>)
    }

}

export default SearchPage
