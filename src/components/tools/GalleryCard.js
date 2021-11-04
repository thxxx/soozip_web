import React, {useEffect, useState} from 'react'
import './GalleryCard.css'
import { Image } from 'antd'
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
            <div className="gallery-card-container-top">
                
                <img src={data.mainImage} className="gallery-main-image"/>

                <div className="titlecon">
                    <p>{data.galleryName}</p>
                </div>
                <div className="types">
                    {data.typess && data.typess.map((item, index) => {
                        return (
                            <span className="gallery-card-type"># {item.slice(2,)}</span>
                        )
                    })}
                </div>   
                <div className="namecon">
                    <span>{data.collection_num}개의 컬렉션이 전시되어 있고</span>
                    <span>{data.like_num}개의 좋아요를 받았습니다.</span>
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
