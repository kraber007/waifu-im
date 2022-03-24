import React, {useState, useEffect} from "react";
import { Image0 } from "../WaifuApi";
import './GridStagger.css'
import {LoadedImage} from '../App'

interface Props{
    loadedImageList: LoadedImage[],
    handleImageClick(index: number): void,
    freshStart: Boolean,
    setFreshStart: any,
    setFooterColor: any,
}

export default function GridStagger(props: Props){

    let [windowWidth, setWindowWidth] = useState(window.innerWidth-20);
    let [containerHeight, setContainerHeight] = useState(0);
    let [backgroundGradient, setBackgroundGradient] = useState('#062C30');

    window.onresize = ()=>{
        clearTimeout((window as any).resizeTimeout);
        (window as any).resizeTimeout = setTimeout(function(){
            setWindowWidth(window.innerWidth-20);
        }, 50)
    }

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
        return last;
    }
    const handleLastImageLoad = ()=>{
        let height = findContainerHeight(sets);
        if(height != containerHeight){
            setContainerHeight(height);
            setBackgroundGradient(gradient);
            // console.log(gradient);
        }
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
                props.loadedImageList.map((image, index) => {
                    let minIndex = findMinIndex(sets);
                    let left = minIndex*width;
                    let top = sets[minIndex];
                    sets[minIndex] += (image.height/image.width)*width;
                    let scale = width/image.width;
                    if(top - lastTop > 200){
                        gradient += `,${(image.color)} ${top}px`;
                        lastTop = top;
                        console.log('calling footer color set')
                        // setTimeout(()=>props.setFooterColor(image.color), 0);
                    }
                    if(index === props.loadedImageList.length-1){
                        if(top == 0){
                            gradient += `,${(props.loadedImageList[0].color)} ${1}px`;
                        }
                        gradient += ')'
                        handleLastImageLoad();
                    }
                    return(
                        <div key={image.url}
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
        </div>
    );
}