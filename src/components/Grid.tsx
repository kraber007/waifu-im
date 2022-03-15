import React, {useState, useEffect} from "react";
import './Grid.css'

interface Props{
    urlList: string[]
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