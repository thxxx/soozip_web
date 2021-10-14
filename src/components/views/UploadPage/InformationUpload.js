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

const InformationUpload = ({userObj}) =>  {
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [type, setType] = useState("")

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
            type:type
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
                    <p className="thanks"> 내 컬렉션 등록하기 </p>
                    <p className="add-thanks">나만의 소중한 컬렉션을 남들과 공유해보세요</p>
                    <p className="inputLabel">제목</p>
                    <input autoSize={{ minRows: 1, maxRows: 2 }} placeholder="이름" className="nameInput" value={title} onChange={(e) => {setTitle(e.currentTarget.value)}}></input>

                    <p className="inputLabel">컬렉션에 대한 나만의 설명을 적어주세요</p>
                    <textarea 
                        className="nameInput" 
                        value={desc} 
                        onChange={(e) => {setDesc(e.currentTarget.value)}}
                        placeholder="설명을 작성해주세요"
                        style={{paddingTop:'10px'}}
                    ></textarea>
                    <div style={{marginTop:'5%'}}>
                    <p className="inputLabel" style={{fontSize:"15px"}}>컬렉션의 종류를 선택해주세요</p>
                        <Select options={typeSelect} onChange={e => {setType(e.label); console.log(e.label)}} style={{color:'black'}}/>
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
