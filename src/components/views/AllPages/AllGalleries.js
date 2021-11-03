import React from 'react'
import {useState, useEffect} from 'react'
import GalleryCard from '../../tools/GalleryCard'
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import { dbService } from '../../tools/fbase';
import { types } from '../../tools/types'
import Button from '@mui/material/Button';
import {firebaseInstance, authService, GoogleAuthProvider} from '../../tools/fbase';
import './All.css'

function AllGalleries() {
    const [galleries, setGalleries] = useState([]);
    const [type, setType] = useState("전체");
    const [loading, setLoading] = useState(false);

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


    const typeTable = types.map((item, index) => {
        let backColor = "#060b26"
        if(item === type){
            backColor = "#ff0000"
        }
        return(
            <div className="typeOne" key={index} style={{backgroundColor: `${backColor}`}}>
                <Button onClick={() => {setType(item);}} style={{color:'white', fontSize:'12px'}}>{item}</Button>
            </div>
        )
    })

    useEffect(() => {
        getAllCollections();
    },[type])

    const galleryTable = galleries.map((item, index) => {
        return(
            <GalleryCard data={item} key={index}/>
            )
        })

    if(loading){
        return (
            <div className="landingcontainer">
            <div className="all-table-title">
                    <span>전체 갤러리</span>
                    <span style={{fontSize:'18px'}}>soozip가들 각각의 개성 넘치는 갤러리를 감상해보세요. </span>
            </div>
            <div className="type-title" style={{backgroundColor:'rgba(0,0,0,0)', color:'#060b26', marginTop:'1%'}}>
            </div>
            <div className="type-title" style={{backgroundColor:'rgba(0,0,0,0)', color:'#060b26', marginTop:'1%'}}>
                원하는 카테고리를 골라보세요.
            </div>
            <div className="type-table23" style={{backgroundColor:'rgba(0,0,0,0)'}}>
                {typeTable}
            </div>


            <div className="qna-table-container">
                <div className="landing-qna-table">
                    {galleryTable}
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
