import React, {useState, useEffect} from "react";
import { Image0 } from "../WaifuApi";
import './GridStagger.css'

interface Props{
    imageList: Image0[]
    handleImageClick(index: number): void
}

interface LoadedImage{
    url: string,
    width: number,
    height: number
}

export default function GridStagger(props: Props){

    let [loadedImageList, setLoadedImageList] = useState<LoadedImage[]>([]);
    let [windowWidth, setWindowWidth] = useState(window.innerWidth);
    window.onresize = ()=>{
        clearTimeout((window as any).resizeTimeout);
        (window as any).resizeTimeout = setTimeout(function(){
            setWindowWidth(window.innerWidth-10);
        })
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
                height: img.height
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
    let minWidth = 300;
    let numColoumns = Math.floor(windowWidth/minWidth); 
    let width = minWidth + (windowWidth%minWidth)/numColoumns;
    let sets = [0];
    for(let i=0; i<numColoumns-1; ++i){
        sets.push(0);
    }
    return (
        <div className="stagger-container">
            {
                loadedImageList.map((image, index) => {
                let minIndex = findMinIndex(sets);
                let left = minIndex*width;
                let top = sets[minIndex];
                sets[minIndex] += (image.height/image.width)*width;
                return(
                    <div 
                        style={{top: `${top}px`, left: `${left}px`, width: `${width}px`}}
                        onClick={()=>props.handleImageClick(index)}    
                    >
                        <img src={image.url} />
                    </div>
                );
            })}
        </div>
    );
}