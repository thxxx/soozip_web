import React from 'react'
import {Link} from 'react-router-dom';
import './OneCollections.css';
import {dbService} from '../tools/fbase';
import {stService} from '../tools/fbase';

const OneCollection = ({item,isOwner, isEditing}) => {
    const onClickDelete = async () => {
        const ok = window.confirm("Are you sure you want to delete?");
        if(ok){

            const dbgallery = await dbService
            .collection("users")
            .where("userId", "==", item.creatorId)
            .get()
            
            let dbgal = dbgallery.docs.map(doc => {return({...doc.data(), gal_id:doc.id})})

            // collection 수도 1 낮추고
            await dbService.doc(`users/${dbgal[0].gal_id}`)
            .update({
                collection_num:dbgal[0].collection_num - 1
            })

            // 댓글 목록에서도 지워야한다.
            

            //delete 파일도 같이 지워져야만 한다.
            await dbService.doc(`collections/${item.id}`).delete();
            await stService.refFromURL(item.attachmentURL).delete(); // URL만 가지고도 refence를 획득할 수 있게 해준다.

            // like에서도 지워야됨.

            alert("삭제했습니다.")
        }else{

        }
    }
    return (
        <div className="one-collection-container2">
            <Link to={{
                pathname:`/CollectionPage/${item.id}`,
                state:{
                    data:item
                }
            }} className="one-collection">
                {/* 실수로 파일을 삭제했을때를 대비 */}
                {item.attachmentURL && <img src={item.attachmentURL}  className="collection-img"/>}
                <div className="collection-info" style={{display: "flex"}}>
                    <span className="title">
                        {item.title}
                    </span>
                    <span className="like">
                        {item.like_num}
                    </span>
                </div>
            </Link>
            {isOwner && isEditing ? <>
            <button onClick={onClickDelete}>Delete</button>
            {/* <button>Update</button> */}
            </> : null }
        </div>
    )
}

export default OneCollection