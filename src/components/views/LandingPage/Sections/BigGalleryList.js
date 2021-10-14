import React from 'react'
import GalleryCard from '../../../tools/GalleryCard'
import './BigGalleryList.css'

const gallery = [
    {
        title:"🐹 연희동의 올드 트래포드",
        owner:"김호진",
        nums:65,
        id:1
    }
]
const BigGalleryList = () => {
    return (
        <div className="BigGalleryContainer">
            <div className="middle">
                <span> ll </span>
                <span><GalleryCard data={gallery[0]}/></span>
                <span> rr </span>
            </div>
        </div>
    )
}

export default BigGalleryList
