import React from 'react'
import {useState, useEffect} from 'react'
import QnACard from '../LandingPage/Sections/QnACard'
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import { dbService } from '../../tools/fbase';
import { types } from '../../tools/types'
import { categorieslist } from '../../tools/types'
import Button from '@mui/material/Button';
import {firebaseInstance, authService, GoogleAuthProvider} from '../../tools/fbase';
import './All.css'

function AllInformations() {
    const [qnas, setQnas] = useState([]);
    const [type, setType] = useState("전체");
    const [category, setCategory] = useState("전체");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAllQnAs();
    },[type, category])

    const getAllQnAs = async () => {
        const qnaDatas = await dbService
            .collection("qnas")
            .get(); // uid를 creatorId로 줬었으니까.

        let qnaData = qnaDatas.docs.map(doc => {
            return({...doc.data(), id:doc.id})
        });
        if(type==="전체" && category === "전체"){
            setQnas(qnaData);
        }else if(type !== "전체" && category === "전체"){
            qnaData = qnaData.filter(item => item.type === type || item.type === "전체")
            setQnas(qnaData);
        }else if(type === "전체" && category !== "전체"){
            qnaData = qnaData.filter(item => item.category === category || item.category === "전체")
            setQnas(qnaData);
        }else{
            qnaData = qnaData.filter(item => item.type === type || item.type === "전체")
            qnaData = qnaData.filter(item => item.category === category || item.category === "전체")
            setQnas(qnaData);
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
    const categoryTable = categorieslist.map((item, index) => {
        let backColor = "#060b26"
        if(item === category){
            backColor = "#ff0000"
        }
        return(
            <div className="typeOne" key={index} style={{backgroundColor: `${backColor}`}}>
                <Button onClick={() => {setCategory(item);}} style={{color:'white', fontSize:'12px'}}>{item}</Button>
            </div>
        )
    })


    const qnaTable = qnas.map((item, index) => {
        return(
            <QnACard data={item} key={index} />
        )
    })

    if(loading){
        return (
            <div className="landingcontainer">
            <div className="all-table-title">
                    <span>전체 QnA</span>
                    <span style={{fontSize:'18px'}}>궁금한 점을 soozip가들에게 질문해보세요! </span>
            </div>

            <div className="type-title" style={{backgroundColor:'rgba(0,0,0,0)', color:'#060b26', marginTop:'1%'}}>
                원하는 카테고리를 골라보세요.
            </div>
            <div className="type-table23" style={{backgroundColor:'rgba(0,0,0,0)'}}>
                {typeTable}
            </div>

            <div className="type-table23" style={{backgroundColor:'rgba(0,0,0,0)'}}>
                {categoryTable}
            </div>


            <div className="qna-table-container">
                <div className="landing-qna-table">
                    {qnaTable}
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

export default AllInformations
