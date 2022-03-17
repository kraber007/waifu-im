import { useEffect, useState } from 'react';
import './App.css';
import Grid from './components/Grid';
import GridStagger from './components/GridStagger';
import Single from './components/Single';
import SingleSlider from './components/SingleSlider';
import {Image0, Tag, getSfwTags, getNsfwTags, getAllTags, getRandomImages} from './WaifuApi';

interface TagIntf{
  [key:string] : boolean[]
}

export interface LoadedImage{
  url: string,
  width: number,
  height: number,
  color: string
}

function App() {
  let [selectedTags, setSelectedTags] = useState<string[]>([]);
  let [excludedTags, setExcludedTags] = useState<string[]>([]);
  let [imageList, setImageList] = useState<Image0[]>([]);
  let [loadedImageList, setLoadedImageList] = useState<LoadedImage[]>([]);
  let [tagStates, setTagStates] = useState<TagIntf[]>([]);
  let [tagList, setTagList] = useState<Tag[]>([]);
  let [visibleUI, setVisibleUI] = useState(false);
  let [visibleSingle, setVisibleSingle] = useState(false);
  let [indexSingle, setIndexSingle] = useState(0);
  let [freshStart, setFreshStart] = useState(true);
  let [headerColor, setHeaderColor] = useState("062C30");
  let [footerColor, setFooterColor] = useState("062C30");

  useEffect(()=>{
    console.log('useEffect called freshStart')
    console.log(freshStart)
    if(!freshStart){
        return;
    }
    setLoadedImageList([]);
    setFreshStart(false);
  },[freshStart]);

  useEffect(()=>{ 
    console.log('useEffect called Lists')
    console.log({loadedImageList, imageList});
    if(loadedImageList.length >= imageList.length){
        return;
    }
    if(loadedImageList.length > 0){
      setHeaderColor(loadedImageList[0].color);
    }
    let img = new Image();
    img.onload = ()=> {
        let tmp = loadedImageList.concat([{
            url: imageList[loadedImageList.length].url,
            width: img.width,
            height: img.height,
            color: imageList[loadedImageList.length].dominant_color
        }])
        setLoadedImageList(tmp);
    }
    img.src = imageList[loadedImageList.length].url;
  }, [loadedImageList, imageList]);


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
    if(JSON.stringify(selectedTags) != JSON.stringify(selected_tags) ||
       JSON.stringify(excludedTags) != JSON.stringify(excluded_tags)   )
    {
      setSelectedTags(selected_tags);
      setExcludedTags(excluded_tags);
    }
  }

  useEffect(()=>{
    console.log('useEffect called tags');
    console.log({selectedTags, excludedTags});
    getRandomImages(selectedTags, excludedTags)
    .then(list => {
      let tmpImageList:Image0[] = [];
      list.forEach(image => tmpImageList.push(image));
      setImageList(tmpImageList);
      setFreshStart(true);
    });
  }, [selectedTags, excludedTags]);

  const toggleUI = ()=> {      //toggle tag select UI
    setVisibleUI(!visibleUI);
  }
  
  const handleImageClick = (index: number)=>{
    setIndexSingle(index);
    setVisibleSingle(true);
  }

  useEffect(()=>{
    if(visibleSingle){
      document.getElementsByClassName('single-slider')[0].requestFullscreen();
    }
    else{
      document.exitFullscreen();
    }
  },[visibleSingle])

  const handleCloseSingle = ()=>{
    setVisibleSingle(false);
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
    <div className="App" style={{backgroundColor: footerColor}}>
      <SingleSlider
        loadedImageList={loadedImageList} 
        index={indexSingle}
        extraClass={visibleSingle ? 'visible':'hidden'}
        closeSingle={handleCloseSingle}
        handleLoadMore={handleLoadMore}
      />
      <div style={{textAlign: 'center', padding: "10px", backgroundColor: headerColor}}>
        <button onClick={toggleUI}>{visibleUI? 'Hide Tags':'Select Tags'}</button>
      </div>
      <div className={`tag-list ${visibleUI ? 'visible':'hidden'}`}>
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
        <button onClick={submitHandler}>Submit</button>
      </div>
      <GridStagger 
        loadedImageList={loadedImageList}
        handleImageClick={handleImageClick}  
        freshStart={freshStart}
        setFreshStart={setFreshStart}
        setFooterColor={setFooterColor}
      />
      <div style={{
        textAlign: 'center', 
        padding: "10px", 
        backgroundColor: footerColor,
      }}>
        <button onClick={handleLoadMore}>Load More</button>
      </div>
    </div>
  );
}

export default App;
