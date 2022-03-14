import React from "react";
import './Grid.css'

interface Props{
    urlList: string[]
}

export default function Grid(props: Props){
    return (
        <div className="grid-container">
            {props.urlList.map(url => {
                let img = new Image();
                img.onload = function(){
                    console.log(`${img.width} X ${img.height}`);
                }
                img.src = url;
                console.log(url);
                return <img src={url} />;
            })}
        </div>
    );
}