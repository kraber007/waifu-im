import React, {useState, useEffect} from "react";
import { Image0 } from "../WaifuApi";
import './Grid.css'

interface Props{
    imageList: Image0[]
}

interface LoadedImage{
    url: string,
    width: number,
    height: number
}

export default function Grid(props: Props){

    let [loadedImageList, setLoadedImageList] = useState<LoadedImage[]>([]);

    useEffect(()=>{
        console.log('useEffect called') 
        if(loadedImageList.length >= props.imageList.length){
            return;
        }
        console.log(loadedImageList);
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

    return (
        <div className="grid-container">
            {loadedImageList.map(image => {
                return(
                    <div>
                        <img src={image.url} />
                    </div>
                );
            })}
        </div>
    );
}