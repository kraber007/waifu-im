import { Image0 } from '../WaifuApi'
import './SingleSlider.css'
import React, {useEffect, useState} from 'react';
import { LoadedImage } from '../App';

interface Props{
    loadedImageList: LoadedImage[],
    index: number,
    extraClass: string,
    closeSingle(index: number): void
}

export default function SingleSlider(props: Props){

    let [index, setIndex] = useState(props.index);

    useEffect(()=>{
        setIndex(props.index);
    },[props.index]);

    if(props.loadedImageList.length <= index){
        console.log("Single have less length ImageList");
        return <div></div>
    }
    const handleLR = (delta: number)=>{
        if(index+delta<0 || index+delta>=props.loadedImageList.length){
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
    // let img = []
    // if(index == -1){
    //     img.push(<img  onTouchStart={(ev)=>handleTouch(ev)}/>);
    // }
    // else{
    //     img.push(<img src={props.imageList[index].url} onTouchStart={(ev)=>handleTouch(ev)}/>);
    // }
    // ${props.loadedImageList[index].color}
    return (
        <div
            className={`single-slider ${props.extraClass}`}
        >
            <button id={'closeSingle'} onClick={()=>props.closeSingle(0)}>Close</button>
            <button id={'leftSingle'} onClick={()=> handleLR(-1)}>{"<"}</button>
            <div className='image-row'
                style={{backgroundColor: '#ccc'}}
            >
                {
                    props.loadedImageList.map(image => {
                        return (
                            <div className='image'>
                                <img src={image.url} />    
                            </div>
                        )
                    })
                }
            </div>  
            <button id={'rightSingle'} onClick={()=> handleLR(+1)}>{">"}</button> 
        </div>
    )
}