import React from 'react'
import OneCollection from '../../../tools/OneCollection'
import {authService} from '../../../tools/fbase';
import './GalleryPage.css'

const CollectionList = ({collections, isEditing, mainColor}) => {
    const User = authService.currentUser;

    const collectionTable = collections.map((item, index) => {
        if(User !== null){
            return(
                <OneCollection item={item} isEditing={isEditing} isOwner={item.creatorId === User.uid} key={index}/>
            )
        }else{
            return(
                <OneCollection item={item} isEditing={isEditing} isOwner={false} key={index}/>
            )
        }
    })

    return (
        // <div className="collections-table" style={{backgroundColor:`${mainColor}`}}>
        <div className="collections-table2">
            {collectionTable}
        </div>
    )
}

export default CollectionList
