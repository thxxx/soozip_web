import React from 'react'
import {useState} from 'react'
import { Card, Row, Col, Image } from "antd";

const infos = [
    {
        title:'제목'
    }
]

const InformationPage = () => {

    const informationTable = () => {


    }
    return (
        <div className="InformationContainer">
            <p>꿀정보 🍯</p>
                <Row gutter={32, 16} style={{display:'inline-flex', textAlign:'center',justifyContent:'center', alignItems:'center', width:'100%', marginTop:'0%'}}>
                    {informationTable}
                </Row>
        </div>
    )
}

export default InformationPage
