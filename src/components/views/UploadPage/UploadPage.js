import React, {useState} from 'react'
import './Sections/UploadPage.css'
import Button from '@material-ui/core/Button';
import { Input } from 'antd';
import { dbService } from '../../tools/fbase'
import { stService } from '../../tools/fbase'
import { v4 as uuidv4 } from 'uuid';
import Select from 'react-select'
import { typeSelect } from '../../tools/types'

const { TextArea } = Input;


function UploadPage({userObj}) {
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [attachment, setAttachment] = useState("")
    const [type, setType] = useState("all")
    const [favorite, setFavorite] = useState(false)
    const [tag, setTag] = useState("")
    const [tags, setTags] = useState([])

    const submit = async (e) => {
        e.preventDefault();
        console.log("Asdqw");
        if( title.length < 2 || desc.length < 2){
            alert('3글자 이상 입력해주세요.')
            return
        } 
        // 사진을 먼저 업로드하고 그 URL을 받아서 데이터로 넣어줘야한다.
        const attachmentRef = stService.ref().child(`${userObj.uid}/${uuidv4()}`)
        const response = await attachmentRef.putString(attachment, "data_url");
        const attachmentURL = await response.ref.getDownloadURL();
        const collectionOne = {
            title,
            desc,
            created:Date(),
            creatorId:userObj.uid, // uid가 아이디를 뜻함.
            attachmentURL:attachmentURL,
            like_num:0,
            comment_num:0,
            type:type,
            favorite:favorite,
            hashtags:tags,
        };

        await dbService.collection("collections").add(collectionOne);

        let gallery;
        const dbGal = await dbService.collection("users")
        .where("userId", "==", userObj.uid)
        .get();
        
        gallery = dbGal.docs.map(doc => {return({...doc.data(), id:doc.id})})

        await dbService.doc(`users/${gallery[0].id}`)
        .update({collection_num : gallery[0].collection_num+1})

        // uploadDataSave.push({
        //     "서비스 명" : title,
        //     "설명 " : desc,
        //     "이유":reason,
        // });
        // localStorage.setItem("id", title)
        alert("컬렉션 등록이 완료되었습니다.")
        setTitle("")
        setDesc("")
        setAttachment("")
        return;
    }

    const onFileChange = (e) => {
        const {target:{files},} = e;
        const oneFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => { // 로딩이 끝날 때 실행한다는 뜻.
            const {currentTarget:{result}} = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(oneFile);
    }

    const changeTag = (e) => {
        if(e.currentTarget.value.includes(" ")){
            setTags([...tags, e.currentTarget.value])
            setTag("")
        }else{
            setTag(e.currentTarget.value)
        }
    }

    const deleteTag = (item) => {
        let modifiedTags = tags.filter(d => d !== item)
        console.log("삭제", item)
        setTags([...modifiedTags])
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
                    <div style={{marginTop:'10%'}}>
                    <p className="inputLabel" style={{fontSize:"15px"}}>컬렉션의 종류를 선택해주세요</p>
                        <Select options={typeSelect} onChange={e => {setType(e.label); console.log(e.label)}} style={{color:'black'}}/>
                    </div>
                    {/* Favorite 여부 */}
                    <div style={{marginTop:'1%', flexDirection:'row', display: 'flex', justifyContent:'start', alignItems:'center'}}>
                        <p className="inputLabel" style={{fontSize:"15px"}}>가장 좋아하는 컬렉션이라면 체크해주세요</p>
                        <input type="checkbox" id="c_box" value={favorite} onChange={e => {setFavorite(e.currentTarget.value);}}/>
                    </div>

                    {/* 해시태그 받기*/}
                    <div style={{marginTop:'1%'}}>
                        <p className="inputLabel" style={{fontSize:"15px"}}>해시태그를 설정해주세요 (스페이스바를 누르면 해시태그가 구분됩니다.)</p>
                        {tags.map((item, index) => {
                            return(
                                <span key={index}>#{item} <span style={{cursor:'pointer'}} onClick={() => deleteTag(item)}>x</span></span>
                            )
                        })}
                        <input style={{marginTop:'1%'}} autoSize={{ minRows: 1, maxRows: 2 }} placeholder="해시태그" className="nameInput" value={tag} onChange={changeTag}></input>
                    </div>

                    <div style={{marginTop:'10%'}}>
                        <input type="file" accept="image/*" className="file-input" onChange={onFileChange}/>
                        {attachment && 
                        <div>
                            <img src={attachment} className="col-image"/>
                        </div>}
                    </div>
                    <div>
                    <button className="inputButton" onClick={submit}>등록하기</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UploadPage
