import React, {useState, useEffect} from 'react'
import {app, authService} from '../../tools/fbase';
import {dbService } from '../../tools/fbase'
import MakeGallery from './Sections/MakeGallery';
import {useHistory} from 'react-router-dom'
import Select from 'react-select'
import {typeSelect} from '../../tools/types'
import makeAnimated from 'react-select/animated';
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";
import './Sections/MakeGallery.css'

const animatedComponents = makeAnimated();

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    borderRadius: '15px',
    border: '1px solid rgba(0,0,0,0.1)',
    boxShadow: 24,
    p: 4,
};

const ProfilePage = (props) => {
    // 아직 갤러리를 만들지 않은 상태면 만들게 해야한다.
    // 갤러리를 만든 상태라면 불러온다.

    const User = authService.currentUser;
    const [userName, setUserName] = useState(props.userObj.displayName);
    const [galleryName, setGalleryName] = useState("");
    const [galleryDesc, setGalleryDesc] = useState("");
    const [galleryColor, setGalleryColor] = useState("");
    const [galleryTypes, setGalleryTypes] = useState([]);
    const [hasGallery, setHasGallery] = useState(true);
    const [loading, setLoading] = useState(false);
    const [myCollections, setMyCollections] = useState([]);
    const [myGallery, setMyGallery] = useState([]);
    const [update, setUpdate] = useState(false);
    const [typess, setTypess] = useState([]);
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [showemoji, setShowemoji] = useState("none");
    const history = useHistory();
    const [boundary, setBoundary] = useState("")
    const [boundaries, setBoundaries] = useState([])
    
    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
        setGalleryName(emojiObject.emoji + galleryName);
      };

    const showEmojiSelect = () => {
        if(showemoji === 'none') {setShowemoji('flex')}
        else{setShowemoji('none')}
    }

    const getMyCollections = async () => {
        const mydatas = await dbService
            .collection("collections")
            .where("creatorId", "==", props.userObj.uid)
            .get(); // uid를 creatorId로 줬었으니까.
        setMyCollections(mydatas.docs.map(doc => doc.data()));
    }

    // 갤러리 정보를 수정
    const getMyGallery = async () => {
        const myGalleryData = await dbService
            .collection("users")
            .where("userId", "==", props.userObj.uid)
            .get(); // uid를 creatorId로 줬었으니까.
        let myGallery = myGalleryData.docs.map(doc => {return({...doc.data(), id:doc.id})})
        setHasGallery(myGallery.length > 0);
        setMyGallery(myGallery[0]);
        if(myGallery.length > 0){
            await getMyCollections();
            setGalleryName(myGallery[0].galleryName);
            setGalleryDesc(myGallery[0].desc);
            setGalleryColor(myGallery[0].color);
            setGalleryTypes(myGallery[0].typess);
            setBoundaries(myGallery[0].boundaries);
        }else{
            setMyCollections([]);
        }
        setLoading(true);
    }

    useEffect(() => {
        if(User === null){
            alert("로그인 하셔야 합니다.")
        }
        getMyGallery();
    },[update])

    const changeGalleryInto = async e => {
        e.preventDefault();
        if(props.userObj.displayName !== userName){
            // 이러면 업데이트
            await props.userObj.updateProfile({
                displayName: userName,
             });
        }
        await dbService.doc(`users/${myGallery.id}`)
        .update({
            color:galleryColor,
            desc:galleryDesc,
            galleryName:galleryName,
            displayName:userName,
            boundaries:boundaries,
        })
        alert("수정이 완료되었습니다!")
        setUpdate(!update);
        history.push('/');
    }


    const changeTypes = e => {
        let tts = [];
        e.forEach(i => {
            tts.push(i.label)
        });
        setTypess(tts)
    }

    const changeBoundary = (e) => {
        if(e.currentTarget.value.includes(" ")){
            setBoundaries([...boundaries, e.currentTarget.value])
            setBoundary("")
        }else{
            setBoundary(e.currentTarget.value)
        }
    }

    const deleteBoundaries = (item) => {
        let modifiedTags = boundaries.filter(d => d !== item)
        console.log("삭제", item)
        setBoundaries([...modifiedTags])
    }

    if(hasGallery){
        if(loading){
            return (
                <div className="uploadcontainer">
                    <div className="uploadIncontainer">
                        <form onSubmit={changeGalleryInto}>
                            <p className="thanks"> 갤러리 정보 수정하기 </p>
                            <p className="add-thanks">내 정보 및 갤러리 정보 수정</p>

        
                            <p className="inputLabel">닉네임을 설정하세요</p>
                            <input 
                                className="nameInput" 
                                value={userName} 
                                onChange={(e) => {setUserName(e.currentTarget.value)}}
                                autoSize={{ minRows: 3, maxRows: 5 }}
                                placeholder="닉네임 설정하기"
                            ></input>

                            <p className="inputLabel">갤러리 이름</p>
                            <p className="inputLabel">ex. 🗽방구석 호그와트</p>
        
                            <div style={{display:`${showemoji}`}}>
                                <Picker
                                    onEmojiClick={onEmojiClick}
                                    disableAutoFocus={true}
                                    groupNames={{ smileys_people: "PEOPLE" }}
                                    native
                                />
                            </div>
                            <span onClick={showEmojiSelect} className="emojiSelect" >이모지 선택하기 클릭</span>
                            <input autoSize={{ minRows: 1, maxRows: 2 }} placeholder="갤러리 이름" 
                                className="nameInput" 
                                value={galleryName} 
                                onChange={(e) => {setGalleryName(e.currentTarget.value)}}>
                            </input>
        
                            <p className="inputLabel">컬렉션에 대한 나만의 설명을 적어주세요</p>
                            <textarea 
                                className="nameInput" 
                                value={galleryDesc} 
                                onChange={(e) => {setGalleryDesc(e.currentTarget.value)}}
                                autoSize={{ minRows: 3, maxRows: 5 }}
                                placeholder="설명을 작성해주세요"
                            ></textarea>
                            <div style={{marginTop:'10%'}}>
                            <p className="inputLabel" style={{fontSize:"15px"}}>갤러리의 타입을 선택해주세요</p>
                            <Select
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                defaultValue={[typeSelect[4]]}
                                isMulti
                                options={typeSelect}
                                onChange={changeTypes}
                            />
                            </div>
                            <div style={{marginTop:'10%'}}>
                                <p className="inputLabel" style={{fontSize:"15px"}}>나의 공간의 메인 색상을 정해보세요</p>
                                <input type="color" value={galleryColor} onChange={e => setGalleryColor(e.currentTarget.value)}/>
                            </div>
                            {/* 해시태그 받기*/}
                            <div style={{marginTop:'1%'}}>
                                <p className="inputLabel" style={{fontSize:"15px"}}>수집공간의 방을 만들어주세요. (스페이스바를 누르면 방이 구분됩니다.)</p>
                                {
                                boundaries.length >= 1 ? boundaries.map((item, index) => {
                                    return(
                                        <span key={index}>#{item} <span style={{cursor:'pointer'}} onClick={() => deleteBoundaries(item)}>x</span></span>
                                    )
                                }) : null }
                                <input style={{marginTop:'1%'}} autoSize={{ minRows: 1, maxRows: 2 }} placeholder="해시태그" className="nameInput" value={boundary} onChange={changeBoundary}></input>
                            </div>
                            
                            <div>
                            <button className="inputButton" onClick={changeGalleryInto}>등록하기</button>
                            </div>
                        </form>
                    </div>
                </div>
            )
        }else{
            return(
            <div>Loading...</div>
            )
        }
    }else{
        return(
            <MakeGallery userObj={props.userObj}/>
        )
    }
}

export default ProfilePage