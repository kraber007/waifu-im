import { useEffect, useState } from 'react';
import './App.css';
import { initialBackgroundColor } from './colors';
// import Grid from './components/Grid';
import GridStagger from './components/GridStagger';
// import Single from './components/Single';
import SingleSwiper from './components/SingleSwiper';
import TagUI from './components/TagUI';
import {Image0, Tag, getSfwTags, getNsfwTags, getAllTags, getRandomImages} from './WaifuApi';

export interface Tags{
  selected: string[],
  excluded: string[]
}

function App() {
  let [tags, setTags] = useState<Tags>({selected: [], excluded: []})
  let [isNsfw, setIsNsfw] = useState(0); //possible values 0,1,2
  let [imageList, setImageList] = useState<Image0[]>([]);
  let [visibleUI, setVisibleUI] = useState(false);
  let [visibleSingle, setVisibleSingle] = useState(false);
  let [indexSingle, setIndexSingle] = useState(0);
  let [headerColor, setHeaderColor] = useState(initialBackgroundColor);
  let [footerColor, setFooterColor] = useState(initialBackgroundColor);

  useEffect(()=>{ 
    if(imageList.length > 0){
      setHeaderColor(imageList[0].dominant_color);
    }
  }, [imageList]);

  useEffect(()=>{
    getRandomImages(tags.selected, tags.excluded, [], isNsfw)
    .then(list => {
      let tmpImageList:Image0[] = [];
      list.forEach(image => tmpImageList.push(image));
      setImageList(tmpImageList);
    });
  }, [tags, isNsfw]);

  const toggleUI = ()=> {      //toggle tag select UI
    setVisibleUI(!visibleUI);
  }
  
  const handleImageClick = (index: number)=>{
    setIndexSingle(index);
    setVisibleSingle(true);
  }
  const handleCloseSingle = (swiperIndex: number)=>{
    setIndexSingle(swiperIndex);
    setVisibleSingle(false);
  }

  // useEffect(()=>{
  //   if(visibleSingle){
  //     document.getElementsByClassName('single-slider')[0].requestFullscreen();
  //   }
  //   else{
  //     document.exitFullscreen();
  //   }
  // },[visibleSingle])

  const handleLoadMore = ()=>{
    let excluded_files = imageList.map(image => image.file);
    getRandomImages(tags.selected, tags.excluded, excluded_files, isNsfw)
    .then(list => {
      setImageList(imageList.concat(list));
    });
  }
  
  if(visibleSingle){
    return (
      <SingleSwiper
        imageList={imageList} 
        index={indexSingle}
        visibleSingle={visibleSingle}
        handleCloseSingle={handleCloseSingle}
        handleLoadMore={handleLoadMore}
        numAllImages={imageList.length}
      />
    )
  }
  return (
    <div className="App" style={{
      backgroundColor: footerColor,
    }}> 
      <div style={{textAlign: 'center', padding: "10px", backgroundColor: headerColor}}>
        <button id='btn-select-tags' onClick={toggleUI}>{visibleUI? 'Hide Tags':'Select Tags'}</button>
      </div>
      <TagUI 
        visibleUI={visibleUI}
        setVisibleUI={setVisibleUI}
        tags={tags}
        setTags={setTags}
        isNsfw={isNsfw}
        setIsNsfw={setIsNsfw}
      />
      <GridStagger 
        imageList={imageList}
        focusIndex={indexSingle}
        handleImageClick={handleImageClick}  
        setFooterColor={setFooterColor}
      />
      <div style={{
        textAlign: 'center', 
        padding: "10px", 
        backgroundColor: footerColor,
      }}>
        {/* {
          loadedImageList.length < imageList.length || imageList.length==0 ?
          <div className='loading-icon app-loading'></div>:
          <button id='btn-load-more' onClick={handleLoadMore}>Load More</button>
        }  */}
        <button id='btn-load-more' onClick={handleLoadMore}>Load More</button>
      </div>
    </div>
  );
}

export default App;
