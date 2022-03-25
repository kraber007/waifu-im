import { useEffect, useState } from 'react';
import './App.css';
// import Grid from './components/Grid';
import GridStagger from './components/GridStagger';
// import Single from './components/Single';
import SingleSwiper from './components/SingleSwiper';
import TagUI from './components/TagUI';
import {Image0, Tag, getSfwTags, getNsfwTags, getAllTags, getRandomImages} from './WaifuApi';

export interface LoadedImage{
  url: string,
  width: number,
  height: number,
  color: string
}

export interface Tags{
  selected: string[],
  excluded: string[]
}

function App() {
  let [tags, setTags] = useState<Tags>({selected: [], excluded: []})
  let [imageList, setImageList] = useState<Image0[]>([]);
  let [loadedImageList, setLoadedImageList] = useState<LoadedImage[]>([]);
  let [visibleUI, setVisibleUI] = useState(false);
  let [visibleSingle, setVisibleSingle] = useState(false);
  let [indexSingle, setIndexSingle] = useState(0);
  let [freshStart, setFreshStart] = useState(true);
  let [headerColor, setHeaderColor] = useState("062C30");
  let [footerColor, setFooterColor] = useState("062C30");

  useEffect(()=>{
    // console.log('useEffect called freshStart')
    // console.log(freshStart)
    if(!freshStart){
        return;
    }
    setLoadedImageList([]);
    setFreshStart(false);
  },[freshStart]);

  useEffect(()=>{ 
    // console.log('useEffect called Lists')
    // console.log({loadedImageList, imageList});
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
    // console.log('useEffect called tags');
    // console.log({tags});
    getRandomImages(tags.selected, tags.excluded)
    .then(list => {
      let tmpImageList:Image0[] = [];
      list.forEach(image => tmpImageList.push(image));
      setImageList(tmpImageList);
      setFreshStart(true);
    });
  }, [tags]);

  const toggleUI = ()=> {      //toggle tag select UI
    setVisibleUI(!visibleUI);
  }
  
  const handleImageClick = (index: number)=>{
    setIndexSingle(index);
    setVisibleSingle(true);
  }

  // useEffect(()=>{
  //   if(visibleSingle){
  //     document.getElementsByClassName('single-slider')[0].requestFullscreen();
  //   }
  //   else{
  //     document.exitFullscreen();
  //   }
  // },[visibleSingle])

  const handleCloseSingle = ()=>{
    setVisibleSingle(false);
  }

  const handleLoadMore = ()=>{
    let excluded_files:string[] = [];
    imageList.forEach(image =>  excluded_files.push(image.file));
    getRandomImages(tags.selected, tags.excluded, excluded_files)
    .then(list => {
      setImageList(imageList.concat(list));
    });
  }

  return (
    <div className="App" style={{backgroundColor: footerColor}}>
      <SingleSwiper
        loadedImageList={loadedImageList} 
        index={indexSingle}
        visibleSingle={visibleSingle}
        closeSingle={handleCloseSingle}
        handleLoadMore={handleLoadMore}
        numAllImages={imageList.length}
      />
      {/* <div style={{visibility: `${visibleSingle? 'hidden':'visible'}`}}> */}
        <div style={{textAlign: 'center', padding: "10px", backgroundColor: headerColor}}>
          <button id='btn-select-tags' onClick={toggleUI}>{visibleUI? 'Hide Tags':'Select Tags'}</button>
        </div>
        <TagUI 
          visibleUI={visibleUI}
          setVisibleUI={setVisibleUI}
          tags={tags}
          setTags={setTags}
        />
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
          <button id='btn-load-more' onClick={handleLoadMore}>Load More</button>
        </div>
      {/* </div> */}
    </div>
  );
}

export default App;
