import './TagUI.css'
import { useEffect, useState } from "react";
import { Tags } from "../App";
import {getAllTags, Tag } from "../WaifuApi";

interface Props{
    visibleUI: Boolean,
    setVisibleUI(bool: boolean): any,
    tags: Tags,
    setTags(tags: Tags): void
}

export default function TagUI(props: Props){
    let [tagStates, setTagStates] = useState<number[]>([]);
    let [allTags, setAllTags] = useState<Tag[]>([])
    let [isNsfw, setIsNsfw] = useState(false);

    useEffect(()=>{    
        getAllTags().then(list =>{
            let tmpTagStates: number[] = [];
            let tmpAllTags: Tag[] = [];
            list.forEach(tag => {
                tmpTagStates.push(1);
                tmpAllTags.push(tag);
            })
            setAllTags(tmpAllTags);
            setTagStates(tmpTagStates);
        });
    },[]);

    const onTagChangeHandler = (e:any) =>{
        // console.log(e.target.dataset.index);
        let tmpTagStates = tagStates.concat([]);
        tmpTagStates[e.target.dataset.index] = e.target.valueAsNumber;
        setTagStates(tmpTagStates);
    }

    const submitHandler = ()=> {
        props.setVisibleUI(false);
        let selected_tags: string[] = [];
        let excluded_tags: string[] = [];
        tagStates.forEach((state, index) => {
            // console.log(state, index)
            if(state===2){
                selected_tags.push(allTags[index].name);
            }
            if(state===0){
                excluded_tags.push(allTags[index].name);
            }
        });
        let tmpTags = {selected: selected_tags, excluded: excluded_tags}
        if(JSON.stringify(tmpTags) != JSON.stringify(props.tags)){
            props.setTags(tmpTags);
        }
    }

    const toggleNsfw = ()=>{
        setIsNsfw(!isNsfw);
    }

    return (
    <div className={`tag-ui ${props.visibleUI ? 'visible':'hidden'}`}>
        <div className='tag-ui-header'>
            {"Excluded, optional or Included Tags"}    
        </div>
        {
            allTags.length ===0?
            <div className='loading-icon app-loading'></div>:
            <div className='tag-list'>
            {
            allTags.map((tag, index) => {
                return (
                <div className='tag' key={tag.name}>
                    <input 
                        type='range'
                        id={tag.name}
                        name={tag.name}
                        data-index={index}
                        min={0}
                        max={2}
                        value={tagStates[index]}
                        onChange={onTagChangeHandler}
                    />   
                    <label htmlFor={tag.name}>
                        {tag.name}
                    </label>     
                </div>)
            })
            }  
            <button onClick={submitHandler}>Submit</button>
        </div>
        }
    </div>
    );
}