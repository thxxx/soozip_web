import React from 'react'
import './QnACard.css'
import {Link} from 'react-router-dom'

const InformationCard = ({data}) => {
    return (
        <div className="qna-card-container">
            <Link to={{
                pathname:`/InformationPage/${data.id}`,
                state:{
                    data:data
                }
            }} className="link">

                <div>
                    <span style={{fontSize:'13px', marginLeft:'0%'}}>{data.type}</span><span style={{marginLeft:'0px', color:'rgb(0,0,0,0.8)', fontSize:'12px'}}>의 </span>
                    <span style={{fontSize:'13px', marginLeft:'2%'}}>{data.category}</span><span style={{marginLeft:'0px', color:'rgb(0,0,0,0.8)', fontSize:'12px'}}>에 관한 정보</span>
                </div>
                <div className="qna-card-title">{data.title}</div>     
                <div className="qna-card-info">       
                    <span>작성자 : {data.displayName} </span>
                    <span>|</span> 
                    <span>유용해요 수 : {data.like_num}</span>           
                </div>
            </Link>
        </div>
    )
}

export default InformationCard
