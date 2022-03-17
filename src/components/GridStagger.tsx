import React, {useState, useEffect} from "react";
import { Image0 } from "../WaifuApi";
import './GridStagger.css'

interface Props{
    imageList: Image0[],
    handleImageClick(index: number): void,
    freshStart: Boolean,
    setFreshStart: any
}

interface LoadedImage{
    url: string,
    width: number,
    height: number,
    color: string
}

export default function GridStagger(props: Props){

    let [loadedImageList, setLoadedImageList] = useState<LoadedImage[]>([]);
    let [windowWidth, setWindowWidth] = useState(window.innerWidth-20);
    let [containerHeight, setContainerHeight] = useState(0);
    let [backgroundGradient, setBackgroundGradient] = useState('#b00b69');

    useEffect(()=>{
        if(!props.freshStart){
            return;
        }
        setLoadedImageList([]);
        props.setFreshStart(false);
    },[props.freshStart])

    window.onresize = ()=>{
        clearTimeout((window as any).resizeTimeout);
        (window as any).resizeTimeout = setTimeout(function(){
            setWindowWidth(window.innerWidth-20);
        }, 50)
    }

    useEffect(()=>{ 
        if(loadedImageList.length >= props.imageList.length){
            return;
        }
        let img = new Image();
        img.onload = ()=> {
            let tmp = loadedImageList.concat([{
                url: props.imageList[loadedImageList.length].url,
                width: img.width,
                height: img.height,
                color: props.imageList[loadedImageList.length].dominant_color
            }])
            setLoadedImageList(tmp);
        }
        img.src = props.imageList[loadedImageList.length].url;
    }, [loadedImageList, props.imageList]);

    const findMinIndex = (arr: number[])=>{
        let i = 0;
        let last = arr[0];
        arr.forEach((val, index)=>{
            if(val<last){
                i = index;
                last = val;
            }
        })
        return i;
    }
    const findContainerHeight = (arr:number[]):number =>{
        let last = arr[0];
        arr.forEach(val=>{
            if(val > last){
                last = val;
            }
        })
        // console.log(arr);
        // console.log(last);
        return last;
    }
    const handleLastImageLoad = ()=>{
        let height = findContainerHeight(sets);
        if(height != containerHeight){
            setContainerHeight(height);
            setBackgroundGradient(gradient);
        }
    }
    function getCC(color: string) :string {
        let amount = -50;
        return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)); 
    }
    let minWidth = 300;
    let numColoumns = Math.floor(windowWidth/minWidth); 
    let width = minWidth + (windowWidth%minWidth)/numColoumns;
    let sets = [0];
    for(let i=0; i<numColoumns-1; ++i){
        sets.push(0);
    }
    let gradient = 'linear-gradient(to bottom'
    let lastTop = -1000;
    return (
        <div 
            className="stagger-container" 
            style={{height: `${containerHeight}px`, background: backgroundGradient}} 
        >
            {
                loadedImageList.map((image, index) => {
                    let minIndex = findMinIndex(sets);
                    let left = minIndex*width;
                    let top = sets[minIndex];
                    sets[minIndex] += (image.height/image.width)*width;
                    let scale = width/image.width;
                    if(top - lastTop > 200){
                        gradient += `,${getCC(image.color)} ${top}px`;
                        lastTop = top;
                    }
                    if(index === loadedImageList.length-1){
                        gradient += ')'
                        handleLastImageLoad();
                    }
                    return(
                        <div 
                            style={{
                                transform: `translateX(${left}px) translateY(${top}px) scale(${scale},${scale})`,
                                width: `${image.width}px`
                            }}
                            onClick={()=>props.handleImageClick(index)}    
                        >
                            <img src={image.url} />
                        </div>
                    );
                })
            }  
            {/* {()=>{
                
                return <div></div>
            }} */}
        </div>
    );
}