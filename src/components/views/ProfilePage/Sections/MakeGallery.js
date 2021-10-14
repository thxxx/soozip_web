import React, {useState} from 'react'
import { dbService } from '../../../tools/fbase'
import {useHistory} from 'react-router-dom'
import Select from 'react-select'
import {types} from '../../../tools/types'
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const MakeGallery = ({userObj}) => {
    const history = useHistory();
    const [galleryName, setGalleryName] = useState("");
    const [typess, setTypess] = useState([]);
    const [type, setType] = useState("");
    const [color, setColor] = useState("#f0f0f0");
    const [desc, setDesc] = useState("");

    const submitGallery = async e => {
        e.preventDefault();
        console.log(galleryName, color, desc, userObj.uid);
        const galleryOne = {
            galleryName,
            color,
            desc,
            userId:userObj.uid,
            displayName:userObj.displayName,
            like_num:0,
            comment_num:0,
            collection_num:0,
            typess:typess
        };

        await dbService.collection("users").add(galleryOne);
        alert("갤러리 생성!");
        history.go(0);
    }

    return (
        <div className="uploadcontainer">
            <div className="uploadIncontainer">
                <form onSubmit={submitGallery}>
                    <p className="thanks"> 갤러리 생성하기 </p>
                    <p className="add-thanks">나만의 개성이 가득담긴 공간을 만들어보세요 </p>
                    <p className="inputLabel">갤러리 이름</p>
                    <p className="inputLabel">ex. 🗽방구석 호그와트</p>
                    <input autoSize={{ minRows: 1, maxRows: 2 }} placeholder="갤러리 이름" 
                        className="nameInput" 
                        value={galleryName} 
                        onChange={(e) => {setGalleryName(e.currentTarget.value)}}>
                    </input>

                    <p className="inputLabel">컬렉션에 대한 나만의 설명을 적어주세요</p>
                    <input 
                        className="nameInput" 
                        value={desc} 
                        onChange={(e) => {setDesc(e.currentTarget.value)}}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        placeholder="설명을 작성해주세요"
                    ></input>
                    <div style={{marginTop:'10%'}}>
                    <p className="inputLabel" style={{fontSize:"15px"}}>갤러리의 타입을 선택해주세요</p>
                    <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        options={types} 
                        onChange={e => {setTypess(e); console.log(e)}}
                        isMulti
                    />
                        {/* <Select options={types} onChange={e => {setType(e.label); console.log(e.label)}} /> */}
                    </div>
                    <div style={{marginTop:'10%'}}>
                    <p className="inputLabel" style={{fontSize:"15px"}}>나의 공간의 메인 색상을 정해보세요</p>
                        <input type="color" value={color} onChange={e => setColor(e.currentTarget.value)}/>
                    </div>
                    
                    <div>
                    <button className="inputButton" onClick={submitGallery}>등록하기</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default MakeGallery
