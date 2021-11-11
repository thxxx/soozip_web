import React from 'react'
import {useState, useEffect} from 'react'
import { dbService } from '../../tools/fbase';
import CollectionCard from '../LandingPage/Sections/CollectionCard'
import TypeTable from '../../tools/TypeTable'
import {firebaseInstance, authService, GoogleAuthProvider} from '../../tools/fbase';
import './All.css'

function AllCollections() {
    const [collections, setCollections] = useState([]);
    const [type, setType] = useState("전체");
    const [loading, setLoading] = useState(false);

    const getRealAllCollections = async () => {
        const collectionDatas = await dbService
            .collection("collections")
            .orderBy("created", "desc")
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

    useEffect(() => {
        getRealAllCollections();
    },[type])

    const array_hot = () => {
        const result = collections.sort(function (a, b) {
            return b.like_num - a.like_num;
        });
        setCollections(result);
    }


    const array_new = () => {
        const result = collections.sort(function (a, b) {
            const ad = new Date(a.created)
            const bd = new Date(b.created)
            return bd - ad;
        });
        setCollections(result);
    }

    if(loading){
        return (
            <div className="landingcontainer">
            <div className="all-table-title">
                    <span>전체 컬렉션</span>
                    <span style={{fontSize:'18px'}}>soozip가들의 추억과 개성이 가득 담긴 컬렉션입니다. </span>
            </div>
            <div className="all-table">
                <div style={{width:'20%'}}>
                <TypeTable setType={setType}/>
                </div>
                <div className="all-galleries-container">

                    <span className="soozip-gury-filter" style={{justifyContent:'start', margin:'2%'}}>
                        <button className="soozip-gury-select" onClick={array_hot}>핫한 수집거리</button>
                        <button className="soozip-gury-select" onClick={array_new}>Hit! 수집거리</button>
                    </span>
                    <div className="qna-table-container" style={{margin:'0%', padding:'0%'}}>
                        <div className="landing-qna-table" style={{margin:'0%', padding:'0%'}}>
                            {collectionTable}
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

export default AllCollections
