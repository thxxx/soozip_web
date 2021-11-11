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

const LandingPage = ({isLoggedIn, userObj}) => {
    const [galleries, setGalleries] = useState([]);
    const [collections, setCollections] = useState([]);
    const [populars, setPopulars] = useState([]);
    const [mine, setMine] = useState([]);
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
            .limit(8)
            .get(); // uid를 creatorId로 줬었으니까.
        let galleryData = galleryDatas.docs.map(doc => {
            return({...doc.data(), id:doc.id})
        });

        const galleryDatass = await dbService
            .collection("users")
            .orderBy("hit_num", "desc")
            .limit(4)
            .get(); // uid를 creatorId로 줬었으니까.
        let galleryDatae = galleryDatass.docs.map(doc => {
            return({...doc.data(), id:doc.id})
        });
        setPopulars(galleryDatae);

        if(isLoggedIn){
            const galleryDatasss = await dbService
                .collection("users")
                .where("userId", "==", userObj.uid)
                .get(); // uid를 creatorId로 줬었으니까.
            let galleryDataee = galleryDatasss.docs.map(doc => {
                return({...doc.data(), id:doc.id})
            });
            setMine(galleryDataee);
        }

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
                .orderBy("created", "asc")
                .limit(12)
                .get(); // uid를 creatorId로 줬었으니까.
            let collectionData = collectionDatas.docs.map(doc => {
                return({...doc.data(), id:doc.id})
            });
            setCollections(collectionData);
        }else{
            const collectionDatas = await dbService
                .collection("collections")
                .orderBy("created", "asc")
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

    const galleryTablePopular = populars.map((item, index) => {
        return(
            <>
            <div style={{display: "flex", flexDirection: "column", color:'#62A1B0'}}>
            <span>{index+1}등</span>
            <GalleryCard data={item} key={index}/>
            </div>
            </>
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
            <TypeTable top="40%" setType={setType} type={type}/>

            <div className="landing-bottom-container-right">
                <div className="gallery-rankings">
                    {/* <GalleryRankingList /> */}
                </div>

                <div className="qna-table-container">
                    <div className="qna-table-title">
                        <div style={{display:'flex', flexDirection:'column'}}>
                            <span>위클리 콘테스트 🏝</span>
                            <span style={{fontSize:'14px'}}>
                                이번주의 인기 갤러리! 4등까지는 매주 특별 선물이 제공됩니다. Hit 수에 따라 결정
                            </span>
                        </div>
                        <Link to="allgalleries" className="more-look-button" style={{marginLeft:'10%'}}>+ 수집공간 더보기</Link>
                    </div>
                    <div className="landing-qna-table">
                        {galleryTablePopular}
                    </div>
                </div>

                <div className="qna-table-container">
                    <div className="qna-table-title">
                        <div style={{display:'flex', flexDirection:'column'}}>
                            <span>수집공간 ⛺️</span>
                            <span style={{fontSize:'14px'}}>
                                Soozip가들의 개성 넘치는 수집공간을 둘러보세요
                            </span>
                        </div>
                        <Link to="allgalleries" className="more-look-button" style={{marginLeft:'10%'}}>+ 수집공간 더보기</Link>
                    </div>
                    <div className="landing-qna-table">
                        {galleryTable}
                    </div>
                </div>

                <div className="qna-table-container">
                    <div className="qna-table-title">
                        <div style={{display:'flex', flexDirection:'column'}}>
                            <span>💎 컬렉션</span>
                            <span style={{fontSize:'14px'}}>
                                Soozip가들의 감각넘치는 아이템을 구경해보세요.
                            </span>
                        </div>
                    </div>
                    <div className="landing-qna-table">
                        {collectionTable}
                    </div>
                    <Link to="allcollections" className="more-look-button" style={{marginTop:'20px'}}>+ 컬렉션 더보기</Link>
                </div>
{/* 
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
                </div> */}
            </div>
            </div>

            {isLoggedIn ? <>
            {mine.length == 0 ? <>
            <Link to="profile" className="upload-button">갤러리 생성하기</Link>
             </> : 
            <Link to="upload" className="upload-button">컬렉션 등록하기</Link> 
            }
            {/* <Link to="uploadQnA" className="upload-button" style={{right:300}}>질문 등록하기</Link> 
            <Link to="uploadInformation" className="upload-button" style={{right:800}}>정보 등록하기</Link>  */}
            </>: 
            <span className="upload-button" onClick={handleOpen}>컬렉션 등록하기</span>
            }
            <LoginModal open={open} setOpen={setOpen}/>
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
