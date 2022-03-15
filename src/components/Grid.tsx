import React from "react";
import './Grid.css'
import {Image} from '../WaifuApi'

interface Props{
    imageList: Image[]
}

export default function Grid(props: Props){
    return (
        <div className="grid-container">
            {props.imageList.map(image => {
                // let img = new Image();
                // img.onload = function(){
                //     console.log(`${img.width} X ${img.height}`);
                // }
                // img.src = image.url;
                let style = {backgroundColor: image.dominant_color}
                return (
                    // <div style={style}>
                    <div>
                        <img src={image.url} />
                    </div>
                );
            })}
        </div>
    );
}