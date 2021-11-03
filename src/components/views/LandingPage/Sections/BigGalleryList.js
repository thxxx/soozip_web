import React, {useState} from 'react'
import GalleryCard from '../../../tools/GalleryCard'
import './BigGalleryList.css'

let slide_first = require('../../../img/slide_first.png')

const gallery = [
    {
        title:"🐹 연희동의 올드 트래포드",
        owner:"김호진",
        nums:65,
        id:1
    }
]

const SLIDEMAXNUM = 4;

const BigGalleryList = () => {
    const [num, setNum] = useState(1);

    const moveLeft = () => {
        if(num>1){
            setNum(num - 1)
        }else if(num === 1){
            setNum(SLIDEMAXNUM);
        }
    }

    const moveRight = () => {
        if(num<SLIDEMAXNUM){
            setNum(num + 1)
        }else if(num === SLIDEMAXNUM){
            setNum(1);
        }
    }

    const middleShow = () => {
        switch(num){
            case 1:
                return(
                    <div style={{color:'white'}}>
                        갤러리
                    </div>
                )
                break;
            case 2:
                return(
                    <div style={{color:'white'}}>
                        qna
                    </div>
                )
                break;
            case 3:
                return(
                    <div style={{color:'white'}}>
                        설명
                    </div>
                )
                break;
            case 4:
                return(
                    <div style={{color:'white'}}>
                        왜??
                    </div>
                )
                break;
            case 5:
                return(
                    <div style={{color:'white'}}>
                        정보
                    </div>
                )
                break;
        }
    }

    return (
        <div className="BigGalleryContainer">
            <span className="slide-move-button" onClick={moveLeft}> 〈 </span>
            <span className="slide-middle">{middleShow()}</span>
            <span className="slide-move-button" onClick={moveRight}> 〉 </span>
        </div>
    )
}

export default BigGalleryList
