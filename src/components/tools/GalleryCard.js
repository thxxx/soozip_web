import React, {useEffect, useState} from 'react'
import './GalleryCard.css'
import { Image } from 'antd'
import { Link } from 'react-router-dom';

const GalleryCard = ({data}) => {

    return (
        <div className="gallery-card-container" style={{background:`linear-gradient(to right, white 60%, ${data.color})`}}>
            <Link to={{
                pathname:`/gallery/${data.id}`,
                state:{
                    data:data
                }
            }} className="move">
            {/* <img src='img/logo512.png' className="galleryimg"/> */}
            <div className="types">
                {data.typess && data.typess.map((item, index) => {
                    return (
                        <span className="gallery-card-type">{item}</span>
                    )
                })}
            </div>   
            <div className="titlecon">
                <p>{data.galleryName}</p>
            </div>
            <div className="namecon">
                <span>{data.displayName}님의 갤러리</span>
                <span>|</span>
                <span>{data.collection_num}개의 컬렉션</span>
            </div>
            </Link>
        </div>
    )
}

export default GalleryCard
