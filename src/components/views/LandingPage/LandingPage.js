import React from 'react'
import {useState, useEffect} from 'react'
import './Sections/LandingPage.css'
import GalleryCard from '../../tools/Cards/GalleryCard'
import BigGalleryList from './Sections/BigGalleryList'
import GalleryRankingList from './Sections/GalleryRankingList'
import { Link } from 'react-router-dom';
import { dbService } from '../../tools/fbase';
import QnACard from './Sections/QnACard'
import InformationCard from './Sections/InformationCard'
import CollectionCard from './Sections/CollectionCard'
import TypeTable from '../../tools/TypeTable'
import LoginModal from '../../tools/Modal/LoginModal'

const LandingPage = ({isLoggedIn}) => {
    const [galleries, setGalleries] = useState([]);
    const [collections, setCollections] = useState([]);
    const [qnas, setQnas] = useState([]);
    const [informations, setInformations] = useState([]);
    const [type, setType] = useState("전체");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    }

    const getAllCollections = async () => {
        const galleryDatas = await dbService
            .collection("users")
            .orderBy("like_num", "desc")
            .limit(12)
            .get(); // uid를 creatorId로 줬었으니까.
        let galleryData = galleryDatas.docs.map(doc => {
            return({...doc.data(), id:doc.id})
        });
        if(type==="전체"){
            setGalleries(galleryData.slice(0,6));
        }else{
            galleryData = galleryData.filter(item => item.typess.includes(type) || item.typess.includes("전체"))
            setGalleries(galleryData.slice(0,6));
        }
    }

    const getRealAllCollections = async () => {
        if(type==="전체"){
            const collectionDatas = await dbService
                .collection("collections")
                .orderBy("like_num", "desc")
                .limit(10)
                .get(); // uid를 creatorId로 줬었으니까.
            let collectionData = collectionDatas.docs.map(doc => {
                return({...doc.data(), id:doc.id})
            });
            setCollections(collectionData);
        }else{
            const collectionDatas = await dbService
                .collection("collections")
                .orderBy("like_num", "desc")
                .where("type", "==", type)
                .limit(10)
                .get(); // uid를 creatorId로 줬었으니까.
            let collectionData = collectionDatas.docs.map(doc => {
                return({...doc.data(), id:doc.id})
            });
            setCollections(collectionData);
        }
    }

    const getAllInformations = async () => {
        if(type==="전체"){
            const infoDatas = await dbService
                .collection("informations")
                .limit(6)
                .get(); // uid를 creatorId로 줬었으니까.

            let infoData = infoDatas.docs.map(doc => {
                return({...doc.data(), id:doc.id})
            });
            setInformations(infoData);
        }else{
            const infoDatas = await dbService
                .collection("informations")
                .where("type", "==", type)
                .limit(6)
                .get(); // uid를 creatorId로 줬었으니까.

            let infoData = infoDatas.docs.map(doc => {
                return({...doc.data(), id:doc.id})
            });
            setInformations(infoData);
        }

        // if(type==="전체"){
        //     setInformations(infoData);
        // }else{
        //     infoData = infoData.filter(item => item.type === type || item.type === "전체")
        //     setInformations(infoData);
        // }
    }

    const getAllQnAs = async () => {
        if(type==="전체"){
            const qnaDatas = await dbService
                .collection("qnas")
                .limit(6)
                .get(); // uid를 creatorId로 줬었으니까.

            let qnaData = qnaDatas.docs.map(doc => {
                return({...doc.data(), id:doc.id})
            });
            setQnas(qnaData);
        }else{
            const qnaDatas = await dbService
                .collection("qnas")
                .where("type", "==", type)
                .limit(6)
                .get(); // uid를 creatorId로 줬었으니까.

            let qnaData = qnaDatas.docs.map(doc => {
                return({...doc.data(), id:doc.id})
            });
            setQnas(qnaData);

        }
        setLoading(true);
    }

    useEffect(() => {
        getAllCollections();
        getRealAllCollections();
        getAllInformations();
        getAllQnAs();
    },[type])

    const galleryRankingTable = galleries.map((item, index) => {
        return(
            <div>
                {item.title}
            </div>
            )
        })
    
    const galleryTable = galleries.map((item, index) => {
        return(
            <GalleryCard data={item} key={index}/>
            )
        })

    const qnaTable = qnas.map((item, index) => {
        return(
            <QnACard data={item} key={index} />
        )
    })

    const informationTable = informations.map((item, index) => {
        return(
            <InformationCard data={item} key={index} />
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
            <BigGalleryList />
            <div className="landing-bottom-container">
                <TypeTable top="50%"/>

            <div className="landing-bottom-container-right">
                <div className="gallery-rankings">
                    {/* <GalleryRankingList /> */}
                </div>

                <div className="qna-table-container">
                    <div className="qna-table-title">
                        <span>갤러리</span>
                        <Link to="allgalleries" className="more-look-button">+ 갤러리 더보기</Link>
                    </div>
                    <div className="landing-qna-table">
                        {galleryTable}
                    </div>
                </div>

                <div className="qna-table-container">
                    <div className="qna-table-title">
                        <span>컬렉션</span>
                        <Link to="allcollections" className="more-look-button">+ 컬렉션 더보기</Link>
                    </div>
                    <div className="landing-qna-table">
                        {collectionTable}
                    </div>
                </div>

                <div className="qna-table-container">
                    <div className="qna-table-title">
                        <span>🍯 꿀정보 교환소</span>
                        <Link to="allinformations" className="more-look-button">정보 더보기 ></Link>
                    </div>
                    <div className="landing-qna-table">
                        {informationTable}
                    </div>
                </div>

                <div className="qna-table-container">
                    <div className="qna-table-title">
                        <span>🙋🏻 QnA 거래소</span>
                        <Link to="allqnas" className="more-look-button">QnA 더보기 ></Link>
                    </div>
                    <div className="landing-qna-table">
                        {qnaTable}
                    </div>
                </div>
            </div>
            </div>

            {isLoggedIn ? <>
            <Link to="upload" className="upload-button">컬렉션 등록하기</Link> 
            <Link to="uploadQnA" className="upload-button" style={{right:300}}>질문 등록하기</Link> 
            <Link to="uploadInformation" className="upload-button" style={{right:800}}>정보 등록하기</Link> 
            </>: 
            <span className="upload-button" onClick={handleOpen}>컬렉션 등록하기</span>
            }

        </div>
        )
    }else{
        return(
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', fontSize:'30px', fontFamily:'EliceBold', height:'100%'}}>
            로딩중
        </div>)
    }

}

export default LandingPage
