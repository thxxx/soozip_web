import React from 'react'
import {useState, useEffect} from 'react'
import GalleryCard from '../../tools/Cards/GalleryCard'
import { Link } from 'react-router-dom';
import { dbService } from '../../tools/fbase';
import Button from '@mui/material/Button';
import TypeTable from '../../tools/TypeTable'
import './All.css'

function AllGalleries() {
    const [galleries, setGalleries] = useState([]);
    const [type, setType] = useState("전체");
    const [loading, setLoading] = useState(false);
    const [update, setUpdate] = useState(false);

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
        setLoading(true);
    }

    useEffect(() => {
        getAllCollections();
    },[type])

    const galleryTable = galleries.map((item, index) => {
        return(
            <GalleryCard data={item} key={index}/>
            )
        })

    const array_hot = () => {
        const result = galleries.sort(function (a, b) {
            return b.like_num - a.like_num;
        });
        setGalleries(result);
        setUpdate(!update);
    }

    const array_new = () => {
        const result = galleries.sort(function (a, b) {
            return b.hit_num - a.hit_num;
        });
        setGalleries(result);
        setUpdate(!update);
    }

    if(loading){
        return (
            <div className="landingcontainer">
            <div className="all-table-title">
                    <span style={{fontSize:'2rem'}}>전체 수집공간 ⛪️</span>
                    <span style={{fontSize:'14px', margin:'3px', marginLeft:'1%'}}>soozip가들 각각의 개성 넘치는 수집공간을 감상해보세요. </span>
                    <span style={{fontSize:'14px', margin:'3px', marginLeft:'1%'}}> 컬렉션을 등록해서 내 개성을 표현하고, </span>
                    <span style={{fontSize:'14px', margin:'3px', marginLeft:'1%'}}> 좋아요, Hit, 댓글로 소통해요 </span>
            </div>
            <div className="all-table">
                <div style={{width:'20%'}}>
                <TypeTable setType={setType}/>
                </div>
                <div className="all-galleries-container">

                    <span className="soozip-gury-filter" style={{justifyContent:'start', margin:'2%'}}>
                        <button className="soozip-gury-select" onClick={array_hot}>핫한 수집공간</button>
                        <button className="soozip-gury-select" onClick={array_new}>Hit! 수집공간</button>
                    </span>
                    <div className="qna-table-container" style={{margin:'0%', padding:'0%'}}>
                        <div className="landing-qna-table" style={{margin:'0%', padding:'0%'}}>
                            {galleryTable}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }else{
        return(
        <div>
            로딩중..
        </div>
        )
    }
}

export default AllGalleries
