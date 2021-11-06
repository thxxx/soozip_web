import React from 'react'
import {Link} from 'react-router-dom';
import {dbService} from '../../../tools/fbase';
import {stService} from '../../../tools/fbase'

const CollectionCard = ({item}) => {
    const onClickDelete = async () => {
        const ok = window.confirm("Are you sure you want to delete?");
        if(ok){
            //delete 파일도 같이 지워져야만 한다.
            await dbService.doc(`collections/${item.id}`).delete();
            await stService.refFromURL(item.attachmentURL).delete(); // URL만 가지고도 refence를 획들할 수 있게 해준다.
        }else{

        }
    }
    return (
        <div className="one-collection-container2-short-height">
            <Link to={{
                pathname:`/CollectionPage/${item.id}`,
                state:{
                    data:item
                }
            }} className="one-collection">
                {/* 실수로 파일을 삭제했을때를 대비 */}
                {item.attachmentURL && <img src={item.attachmentURL}  className="collection-img"/>}
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
    )
}

export default CollectionCard;
