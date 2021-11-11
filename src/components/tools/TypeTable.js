import React, {useState,useEffect} from 'react'
import { types } from './types'
import Button from '@mui/material/Button';
import './TypeTable.css'

function TypeTable({top, type, setType}) {

    useEffect(() => {
        console.log("타입테이블", type)
    },[])

    const typeTable = types.map((item, index) => {
        let backColor = "#000000"
        if(item === type){
            backColor = "#ff0000"
        }
        return(
            <div className="typeOne" key={index}>
                <Button onClick={() => {setType(item);}} style={{color: `${backColor}`, fontSize:'15px'}}>{item}</Button>
            </div>
        )
    })

    const typeTableMove = types.map((item, index) => {
        let backColor = "#000000"
        if(item === type){
            backColor = "#ff0000"
        }
        return(
            <div className="typeOne" key={index}>
                <Button onClick={() => {return;}} style={{color: `${backColor}`, fontSize:'15px'}}>{item}</Button>
            </div>
        )
    })

    if(type === undefined){
        return (
            <div className="landing-bottom-container-left">
                <div className="type-table23" style={{top:`${top}`}}>
                    <div className="type-title">수집할 카테고리</div>
                    <div className="type-table23-list">
                        {typeTableMove}
                    </div>
                </div>
            </div>
        )
    }else{
        return (
            <div className="landing-bottom-container-left">
                <div className="type-table23" style={{top:`${top}`}}>
                    <div className="type-title">수집할 카테고리</div>
                    <div className="type-table23-list">
                        {typeTable}
                    </div>
                </div>
            </div>
        )
    }
}

export default TypeTable
