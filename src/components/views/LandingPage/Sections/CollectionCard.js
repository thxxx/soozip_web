import React from 'react'
import {Link} from 'react-router-dom';

const CollectionCard = ({item}) => {

    return (
        <div style={{margin:'1%'}}>
            {item.favorite ? 
            <div className="one-collection-container2-short-height-favorite">
                <Link to={{
                    pathname:`/CollectionPage/${item.id}`,
                    state:{
                        data:item
                    }
                }} className="one-collection" onClick={() => {
                    window.scrollTo({top:0, left:100, behavior:'smooth'});
                }}>
                    {/* 실수로 파일을 삭제했을때를 대비 */}
                    {item.attachmentURL && <img src={item.attachmentURL}  className="collection-img-short-height"/>}
                    <div className="one-collection-info" style={{display: "flex"}}>
                        <span className="title">
                            {item.title}
                        </span>
                        <span className="like">
                            {item.like_num}
                        </span>
                    </div>
                </Link>
            </div> 
            : 
            <div className="one-collection-container2-short-height">
                <Link to={{
                    pathname:`/CollectionPage/${item.id}`,
                    state:{
                        data:item
                    }
                }} className="one-collection">
                    {/* 실수로 파일을 삭제했을때를 대비 */}
                    {item.attachmentURL && <img src={item.attachmentURL}  className="collection-img-short-height"/>}
                    <div className="one-collection-info" style={{display: "flex"}}>
                        <span className="title">
                            {item.title}
                        </span>
                        <span className="like">
                            {item.like_num}
                        </span>
                    </div>
                </Link>
            </div> 
            
            }
        </div>
    )
}

export default CollectionCard;
