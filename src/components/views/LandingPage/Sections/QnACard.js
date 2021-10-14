import React from 'react'
import './QnACard.css'
import {Link} from 'react-router-dom'

const QnACard = ({data}) => {
    console.log(data)
    return (
        <div className="qna-card-container">
            <Link to={{
                pathname:`/QnAPage/${data.id}`,
                state:{
                    data:data
                }
            }} className="link">

                <div>
                    <span style={{fontSize:'13px', marginLeft:'0%'}}>{data.type}</span><span style={{marginLeft:'0px', color:'rgb(0,0,0,0.8)', fontSize:'12px'}}>에 관한 질문</span>
                    <span style={{fontSize:'13px', marginLeft:'2%'}}>{data.category}</span><span style={{marginLeft:'0px', color:'rgb(0,0,0,0.8)', fontSize:'12px'}}>가 궁금해요</span>
                </div>
                <div className="qna-card-title">{data.title}</div>     
                <div className="qna-card-info">       
                    <span>작성자 : {data.displayName} </span>
                    <span>|</span> 
                    <span>달린 답변 수 : {data.comment_num}</span>           
                </div>
            </Link>
        </div>
    )
}

export default QnACard
