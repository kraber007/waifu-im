import { useEffect, useState } from 'react';
import './App.css';
import Grid from './components/Grid';
import GridStagger from './components/GridStagger';
import Single from './components/Single';
import {Image, Tag, getSfwTags, getNsfwTags, getAllTags, getRandomImages} from './WaifuApi';

interface TagIntf{
  [key:string] : boolean[]
}

function App() {
  let [urlList, setUrlList] = useState<string[]>([]);
  let [tagStates, setTagStates] = useState<TagIntf[]>([]);
  let [tagList, setTagList] = useState<Tag[]>([]);
  let [visibleUI, setVisibleUI] = useState(false);

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
    toggleUI();
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
    getRandomImages(selected_tags, excluded_tags)
    .then(list => {
      let temp:string[] = [];
      list.forEach(image => temp.push(image.url));
      setUrlList(temp);
    });
  }

  const toggleUI = ()=> {
    setVisibleUI(!visibleUI);
  }
  
  return (
    <div className="App">
      <Single urlList={urlList} index={2}/>
      <button onClick={toggleUI}>{visibleUI? 'Hide Tags':'Select Tags'}</button>
      <div className={`tag-list ${visibleUI ? 'visible':'hidden'}`}>
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
        <button onClick={submitHandler}>Submit</button>
      </div>
      <GridStagger urlList={urlList} />
    </div>
  );
}

export default App;
