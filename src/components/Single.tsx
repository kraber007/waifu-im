import { Image0 } from '../WaifuApi'
import './Single.css'
import React, {useEffect, useState} from 'react';

interface Props{
    imageList: Image0[],
    index: number,
    extraClass: string,
    closeSingle(index: number): void
}

export default function Single(props: Props){

    let [index, setIndex] = useState(props.index);

    useEffect(()=>{
        setIndex(props.index);
    },[props.index]);

    if(props.imageList.length <= index){
        console.log("Single have less length ImageList");
        return <div></div>
    }
    const handleLR = (delta: number)=>{
        if(index+delta<0 || index+delta>=props.imageList.length){
            console.log('end of the list')
            return;
        }
        setIndex(index+delta);
    }

    const handleTouch = (ev: React.TouchEvent)=>{
        if(ev.touches.length !== 1){
            return;
        }
        let x1= ev.changedTouches[0].pageX;
        let y1= ev.changedTouches[0].pageY;
        console.log(ev);
        ev.target.addEventListener('touchend', (ev2:any)=>{
            console.log(ev2);
            let x2= ev2.changedTouches[0].pageX;
            let y2= ev2.changedTouches[0].pageY;
            if(x2-x1 > 30){
                handleLR(-1);
            }
            else if(x1-x2 > 30){
                handleLR(1);
            }
        }, {once: true})
    }
    return (
        <div
            className={`single ${props.extraClass}`}
            style={{backgroundColor: `${props.imageList[index].dominant_color}dd`}}
        >
            <button id={'closeSingle'} onClick={()=>props.closeSingle(0)}>Close</button>
            <button id={'leftSingle'} onClick={()=> handleLR(-1)}>{"<"}</button>
            <img src={props.imageList[index].url} onTouchStart={(ev)=>handleTouch(ev)}/>  
            <button id={'rightSingle'} onClick={()=> handleLR(+1)}>{">"}</button> 
        </div>
    )
}