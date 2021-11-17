import React from 'react'
import './DescriptionPage.css'
import {Link} from 'react-router-dom'

import first from './gallery.png'

function HelpPage() {
    return (
        <div className="desc_container">
            <div className="desc_container_inside">
            <div className="desc_top">
                <div className="desc_top_title">
                함께 만들어가는 Soozip
                </div>
                <div className="desc_top_main" style={{display:'flex', flexDirection:'column'}}>
                <span style={{marginTop:'10px'}}>Soozip은 오로지 수집가들이 모여서 놀기위한 플랫폼입니다.</span>
                <span style={{marginTop:'10px'}}>아직까지 Ver 1.0이기 때문에 별다른 기능이 없지만 </span>
                <span style={{marginTop:'10px'}}>차근차근 추가하게될 기능에 있어서 다양한 의견을 받고싶습니다. </span>
                </div>
            </div>
            <div style={{marginTop:'10%', marginBottom:'-10%'}}>
                <div style={{fontWeight:'700', fontSize:'24px'}}>
                    다음에 추가되었으면 하는 기능 ✨
                </div>
            </div>
            <div className="desc_mid" style={{display:'flex', flexDirection:'row', width:'150%', marginLeft:'-25%'}}>
                <div className="desc_one_func">
                    <div className="desc_one_func_title">
                    거래 기능
                    </div>
                    <div className="desc_one_func_desc">
                        유저간에 원하는 아이템을 직접 거래할 수 있도록 합니다.
                    </div>
                </div>
                <div className="desc_one_func">
                    <div className="desc_one_func_title">
                    질문과 답변
                    </div>
                    <div className="desc_one_func_desc">
                    궁금한 사항에 대해서 질문하고, Deep한 정보를 서로 공유할 수 있게 합니다.
                    </div>
                </div>
                <div className="desc_one_func">
                    <a href="https://6cetqycakbc.typeform.com/to/oRcv6Qdu" className="desc_one_func_title" style={{color:'black', fontSize:'20px'}}>
                    의견으로 제시하기 →
                    </a>
                </div>
            </div>
            </div>
        </div>
    )
}

export default HelpPage
