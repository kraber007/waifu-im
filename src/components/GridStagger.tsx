import React, {useState, useEffect} from "react";
import './GridStagger.css'

interface Props{
    urlList: string[]
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
        console.log('useEffect called') 
        if(loadedImageList.length >= props.urlList.length){
            return;
        }
        console.log(loadedImageList);
        let img = new Image();
        img.onload = ()=> {
            let tmp = loadedImageList.concat([{
                url: props.urlList[loadedImageList.length],
                width: img.width,
                height: img.height
            }])
            setLoadedImageList(tmp);
        }
        img.src = props.urlList[loadedImageList.length];
    }, [loadedImageList, props.urlList]);

    const findMinIndex = (arr: number[])=>{
        let i = 0;
        let last = arr[0];
        arr.forEach((val, index)=>{
            if(val<last){
                i = index;
                last = val;
            }
        })
        console.log(i);
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
                loadedImageList.map(image => {
                let minIndex = findMinIndex(sets);
                let left = minIndex*width;
                let top = sets[minIndex];
                sets[minIndex] += (image.height/image.width)*width;
                return(
                    <div style={{top: `${top}px`, left: `${left}px`, width: `${width}px`}}>
                        <img src={image.url} />
                    </div>
                );
            })}
        </div>
    );
}