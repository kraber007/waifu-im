import { useEffect, useState } from 'react';
import './App.css';
import Grid from './components/Grid';
import GridStagger from './components/GridStagger';
import Single from './components/Single';
import {Image0, Tag, getSfwTags, getNsfwTags, getAllTags, getRandomImages} from './WaifuApi';

interface TagIntf{
  [key:string] : boolean[]
}

function App() {
  let [selectedTags, setSelectedTags] = useState<string[]>([]);
  let [excludedTags, setExcludedTags] = useState<string[]>([]);
  let [imageList, setImageList] = useState<Image0[]>([]);
  let [tagStates, setTagStates] = useState<TagIntf[]>([]);
  let [tagList, setTagList] = useState<Tag[]>([]);
  let [visibleUI, setVisibleUI] = useState(false);
  let [visibleSingle, setVisibleSingle] = useState(false);
  let [indexSingle, setIndexSingle] = useState(0);
  // let [freshStart, setFreshStart] = useState(true);

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
    setSelectedTags(selected_tags);
    setExcludedTags(excluded_tags);
    console.log(selectedTags);
  }

  useEffect(()=>{
    getRandomImages(selectedTags, excludedTags)
    .then(list => {
      let tmpImageList:Image0[] = [];
      list.forEach(image => tmpImageList.push(image));
      setImageList(tmpImageList);
    });
  }, [selectedTags, excludedTags]);

  const toggleUI = ()=> {      //toggle tag select UI
    setVisibleUI(!visibleUI);
  }
  
  const handleImageClick = (index: number)=>{
    setIndexSingle(index);
    setVisibleSingle(!visibleSingle);
    console.log(imageList.length);
  }

  const handleLoadMore = ()=>{
    let excluded_files:string[] = [];
    imageList.forEach(image =>  excluded_files.push(image.file));
    getRandomImages(selectedTags, excludedTags, excluded_files)
    .then(list => {
      setImageList(imageList.concat(list));
    });
  }

  return (
    <div className="App">
      <Single 
        imageList={imageList} 
        index={indexSingle}
        extraClass={visibleSingle ? 'visible':'hidden'}
        closeSingle={handleImageClick}
      />
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
      <GridStagger 
        imageList={imageList}
        handleImageClick={handleImageClick}  
      />
      <button onClick={handleLoadMore}>Load More</button>
    </div>
  );
}

export default App;
