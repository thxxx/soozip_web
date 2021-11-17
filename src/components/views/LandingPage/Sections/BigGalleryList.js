import React, {useState, useEffect} from 'react'
import './BigGalleryList.css'

import slide_first from '../../../img/slide_first.png'
import slide_second from '../../../img/slide_second.png'
import slide_third from '../../../img/slide_third.png'
import slide_fourth from '../../../img/slide_fourth.png'

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

    useEffect(() => {
        setTimeout(() => {
            moveRight();
        },8000)
    })
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
                        <img src={slide_first} className="slide-images"/>
                    </div>
                )
                break;
            case 2:
                return(
                    <div style={{color:'white'}}>
                        <img src={slide_second} className="slide-images"/>
                    </div>
                )
                break;
            case 3:
                return(
                    <div style={{color:'white'}}>
                        <img src={slide_third} className="slide-images"/>
                    </div>
                )
                break;
            case 4:
                return(
                    <div style={{color:'white'}}>
                        <img src={slide_fourth} className="slide-images"/>
                    </div>
                )
                break;
        }
    }

    return (
        <div className="BigGalleryContainer">
            <span className="slide-move-button-left" onClick={moveLeft}> 〈 </span>
            <span className="slide-middle">{middleShow()}</span>
            <span className="slide-move-button-right" onClick={moveRight}> 〉 </span>
        </div>
    )
}

export default BigGalleryList
