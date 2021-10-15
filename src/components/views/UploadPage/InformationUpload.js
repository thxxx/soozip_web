import React, {useState} from 'react'
import './Sections/UploadPage.css'
import Button from '@material-ui/core/Button';
import { Input } from 'antd';
import { dbService } from '../../tools/fbase'
import { stService } from '../../tools/fbase'
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select'
import {types} from '../../tools/types'
import {typeSelect} from '../../tools/types'
import {categories} from '../../tools/types'


const InformationUpload = ({userObj}) =>  {
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [type, setType] = useState("")
    const [category, setCategory] = useState("")

    const submit = async (e) => {
        e.preventDefault();

        if( title.length < 3 || desc.length < 3){
            alert('3글자 이상 입력해주세요.')
            return
        } 

        // 사진을 먼저 업로드하고 그 URL을 받아서 데이터로 넣어줘야한다.
        const InformationOne = {
            title,
            desc,
            created:Date(),
            creatorId:userObj.uid, // uid가 아이디를 뜻함.
            like_num:0,
            comment_num:0,
            displayName:userObj.displayName,
            type:type,
            category:category,
        };

        await dbService.collection("informations").add(InformationOne);
        
        alert("질문 등록이 완료되었습니다.")
        setTitle("")
        setDesc("")
        return;
    }

    return (
        <div className="uploadcontainer">
            <div className="uploadIncontainer">
                <form onSubmit={submit}>
                    <p className="thanks"> 🍯 꿀팁 공유하기 </p>
                    <p className="add-thanks">어디서도 찾기힘든 정보를 다른사람들과 공유하세요</p>
                    <p className="inputLabel">제목</p>
                    <input autoSize={{ minRows: 1, maxRows: 2 }} placeholder="이름" className="nameInput1" value={title} onChange={(e) => {setTitle(e.currentTarget.value)}}></input>

                    <p className="inputLabel">내용</p>
                    <textarea 
                        className="nameInput" 
                        value={desc} 
                        onChange={(e) => {setDesc(e.currentTarget.value)}}
                        placeholder="설명을 작성해주세요"
                        style={{paddingTop:'10px'}}
                    ></textarea>
                    <div className="selections">
                        <div style={{width: '49%', marginTop:'-10px'}}>
                            <p className="input-label-select" style={{fontSize:"15px"}}>컬렉션의 종류를 선택해주세요</p>
                            <Select options={typeSelect} onChange={e => {setType(e.label); console.log(e.label)}} style={{color:'black'}}/>
                        </div>                  
                        <div style={{width: '49%', marginTop:'-10px', marginLeft:'1%'}}>
                            <p className="input-label-select" style={{fontSize:"15px"}}>정보의 종류를 선택해주세요</p>
                            <Select options={categories} onChange={e => {setCategory(e.label); console.log(e.label)}} style={{color:'black'}}/>
                        </div>
                    </div>

                    <div>
                    <button className="inputButton" onClick={submit}>등록하기</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default InformationUpload
