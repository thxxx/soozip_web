import React from 'react'
import './DescriptionPage.css'

import first from './gallery.png'

function DescriptionPage() {
    return (
        <div className="desc_container">
            <div className="desc_container_inside">
            <div className="desc_top">
                <div className="desc_top_title">
                Soozip 사이트 소개
                </div>
                <div className="desc_top_main">
                Soozip은 스마트한 수집가들을 위한 소셜 커뮤니티 플랫폼입니다. 🙋🏻‍♂️ <br/>
                내가 모으는 아이템들을 뽐내고, 다른 Soozip가들의 개성 넘치는 수집 공간을 구경하며 <br/>
                함께하는 수집의 즐거움을 경험해보세요. <br/>
                </div>
            </div>
            <div className="desc_mid">
                <div style={{paddingBottom:'6%'}}>
                    <div style={{color:'gray', fontSize:'13px'}}>
                        2021년 11월 10일 
                    </div>
                    <div style={{fontWeight:'700', fontSize:'24px'}}>
                        Soozip 1.0 주요 기능들 ✨
                    </div>
                </div>
                <div className="desc_one_func">
                    <div className="desc_one_func_title">
                    수집공간 꾸미기
                    </div>
                    <div className="desc_one_func_desc">
                    나만의 수집공간 속에
                    아이템을 전시하고
                    나의 작은 전시회를 열어보세요.
                    </div>
                    <img alt="2" src={first} className="example_image"/>
                </div>
                <div className="desc_one_func">
                    <div className="desc_one_func_title">
                    아이템 전시하기
                    </div>
                    <div className="desc_one_func_desc">
                    나의 수집 아이템을 다른 Soozip가들과 공유하고
                    이에 대한 감상을 나누어보세요.
                    </div>
                    <img alt="2" src="./gallery.png" className="example_image"/>
                </div>
                <div className="desc_one_func">
                    <div className="desc_one_func_title">
                    위클리 콘테스트
                    </div>
                    <div className="desc_one_func_desc">
                    이 주의 멋진 아이템을 투표하여
                    Soozip 컬렉션 콘테스트에 참여해보세요.
                    매주 지급되는 상품도 있답니다.
                    </div>
                </div>
                <div className="desc_one_func">
                    <div className="desc_one_func_title">
                    Soozip가들과 소통하기
                    </div>
                    <div className="desc_one_func_desc">
                    개성 넘치는 수집공간 속에서
                    Soozip가들의 수집품을 감상하고
                    다양한 의견을 주고 받아보세요.
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default DescriptionPage
