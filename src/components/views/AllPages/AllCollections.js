import React from 'react'
import {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import { dbService } from '../../tools/fbase';
import CollectionCard from '../LandingPage/Sections/CollectionCard'
import { types } from '../../tools/types'
import Button from '@mui/material/Button';
import {firebaseInstance, authService, GoogleAuthProvider} from '../../tools/fbase';
import './All.css'

function AllCollections() {
    const [collections, setCollections] = useState([]);
    const [type, setType] = useState("전체");
    const [loading, setLoading] = useState(false);

    const getRealAllCollections = async () => {
        const collectionDatas = await dbService
            .collection("collections")
            .orderBy("like_num", "desc")
            .get(); // uid를 creatorId로 줬었으니까.
        let collectionData = collectionDatas.docs.map(doc => {
            return({...doc.data(), id:doc.id})
        });
        if(type==="전체"){
            setCollections(collectionData);
        }else{
            collectionData = collectionData.filter(item => item.type === type|| item.type === "전체")
            setCollections(collectionData);
        }
        setLoading(true);
    }

    const collectionTable = collections.map((item, index) => {
        return(
            <CollectionCard item={item} key={index}/>
        )
    })

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
        getRealAllCollections();
    },[type])


    if(loading){
        return (
            <div className="landingcontainer">
            <div className="all-table-title">
                    <span>전체 컬렉션들 입니다</span>
            </div>

            <div className="type-title" style={{backgroundColor:'rgba(0,0,0,0)', color:'#060b26', marginTop:'1%'}}>
                원하는 카테고리를 골라보세요.
            </div>
            <div className="type-table23" style={{backgroundColor:'rgba(0,0,0,0)'}}>
                {typeTable}
            </div>


            <div className="qna-table-container">
                <div className="landing-qna-table">
                    {collectionTable}
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

export default AllCollections
