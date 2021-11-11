import React, {useEffect, useState} from 'react'
import './GalleryCard.css'
import { Link } from 'react-router-dom';

const GalleryCard = ({data}) => {

    return (
        <Link to={{
            pathname:`/gallery/${data.id}`,
            state:{
                data:data
            }
        }} className="move">
        <div className="gallery-card-container">
            <div className="gallery-card-container-top" style={{backgroundImage:`url(${data.mainImage})`, backgroundColor:`${data.color}`}}>
            <div className="gallery-card-container-top" style={{backgroundColor:'rgba(0,0,0,0.5)', height:'100%', width:'100%'}}>
                <div className="titlecon">
                    <p>{data.galleryName}</p>
                </div>
                <div className="types">
                    {data.typess && data.typess.map((item, index) => {
                        return (
                            <span className="gallery-card-type" key={index}># {item.slice(2,)}</span>
                        )
                    })}
                </div>   
                <div className="namecon">
                    <span>{data.collection_num}개의 컬렉션이 전시</span>
                    <div>
                    <span>{data.like_num}개의 좋아요</span>
                    <span>{data.hit_num}개의 HIT!</span>
                    </div>
                </div>
                </div>
            </div>
            <div className="gallery-card-bottom">
                <span>{data.displayName}님의 갤러리</span>
            </div>
        </div>
        </Link>
    )
}

export default GalleryCard
