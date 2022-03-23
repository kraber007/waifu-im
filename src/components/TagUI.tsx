import './TagUI.css'
import { useEffect, useState } from "react";
import { Tags } from "../App";
import { getAllTags, Tag } from "../WaifuApi";

interface TagIntf{
    [key:string] : boolean[]
}

interface Props{
    visibleUI: Boolean,
    setVisibleUI(bool: boolean): any,
    tags: Tags,
    setTags(tags: Tags): void
}

export default function TagUI(props: Props){
    let [tagStates, setTagStates] = useState<TagIntf[]>([]);
    let [tagList, setTagList] = useState<Tag[]>([]);          //list of all possible tags
    let [isNsfw, setIsNsfw] = useState(false);

    useEffect(()=>{    
        getAllTags().then(tagList => {
          let tmpTagStates: TagIntf[] = [];
          let tmpTagList: Tag[] = [];
          tagList.forEach(tag => {
            let tmp:TagIntf = {};
            tmp[tag.name] = [false, true, false];
            tmpTagStates.push(tmp);
            tmpTagList.push(tag);
          });
          setTagStates(tmpTagStates);
          setTagList(tmpTagList);
        });
    },[])

    const onTagChangeHandler = (e:any) =>{
    let tmpTagStates = tagStates.concat([]);
    tmpTagStates.forEach(tag => {
        if(tag[e.target.name]){
        tag[e.target.name] = [false, false, false];
        tag[e.target.name][e.target.id.charAt(0)] = true;
        }
    });
    setTagStates(tmpTagStates);
    }

    const submitHandler = ()=> {
        props.setVisibleUI(false);
        let selected_tags: string[] = [];
        let excluded_tags: string[] = [];
        tagStates.forEach(tag => {
            if(tag[Object.keys(tag)[0]][0]){
                selected_tags.push(Object.keys(tag)[0]);
            }
            if(tag[Object.keys(tag)[0]][2]){
                excluded_tags.push(Object.keys(tag)[0]);
            }
        });
        let tmpTags = {selected: selected_tags, excluded: excluded_tags}
        if(JSON.stringify(tmpTags) != JSON.stringify(props.tags)){
            props.setTags(tmpTags);
        }
    }

    const toggleNsfw = ()=>{
        console.log('toggle called')
        setIsNsfw(!isNsfw);
    }

    return (
    <div className={`tag-list ${props.visibleUI ? 'visible':'hidden'}`}>
        {"Include, Optional, Exclude : Tag Name"}
        {
          tagList.map((tag, index) => {
            return (
            <div className='tag'>
              <input 
                type='radio'
                id={`0-include-${tag.name}`} 
                name={tag.name} 
                checked={tagStates[index][tag.name][0]} 
                onChange={onTagChangeHandler}
              />
              <input 
                type='radio'
                id={`1-nothing-${tag.name}`} 
                name={tag.name} 
                checked={tagStates[index][tag.name][1]} 
                onChange={onTagChangeHandler}
              />
              <input 
                type='radio'
                id={`2-exclude-${tag.name}`} 
                name={tag.name} 
                checked={tagStates[index][tag.name][2]} 
                onChange={onTagChangeHandler}
              />
              {tag.name}
            </div>)
          })
        }  
        {/* <input type='range' min={0} max={2}></input> */}
        <button onClick={submitHandler}>Submit</button>
    </div>
    );
}