import './SingleSwiper.css'
import React, {useEffect, useState} from 'react';
import { LoadedImage } from '../App';
import {Swiper, SwiperSlide} from 'swiper/react'
import { Pagination, Navigation, Virtual} from 'swiper';
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

interface Props{
    loadedImageList: LoadedImage[],
    index: number,
    visibleSingle: boolean,
    closeSingle(index: number): void,
    handleLoadMore(): void,
    numAllImages: number
}

export default function SingleSwiper(props: Props){

    let [index, setIndex] = useState(props.index);
    let [swiperIndex, setSwiperIndex] = useState(props.index);

    useEffect(()=>{
        setIndex(props.index);
    },[props.index]);

    if(!props.visibleSingle || props.loadedImageList.length < index){
        // console.log("Single have less length ImageList");
        return <div></div>
    }

    const handleSlideChange = (swiper: any)=>{
        // console.log('slide changed')
        setSwiperIndex(swiper.activeIndex);
        
    }

    return (
        <div className={`single-swiper`} style={{
            visibility: `${props.visibleSingle? 'visible':'hidden'}`, 
            backgroundColor: `${swiperIndex < props.loadedImageList.length? props.loadedImageList[swiperIndex].color : props.loadedImageList[swiperIndex-1].color}`}}>
            <button id={'close-single'} onClick={()=>props.closeSingle(0)}>Close</button>
            <Swiper
                initialSlide={props.index}
                navigation={true}
                grabCursor={true}
                pagination={{type: 'fraction', clickable: true}}
                modules={[Pagination, Navigation, Virtual]}
                onSlideChange={handleSlideChange}
                virtual={{addSlidesAfter: 3, addSlidesBefore: 2}}
            >
                {
                    props.loadedImageList.map((image, index) => {
                        return (
                            <SwiperSlide
                                key={index+image.url}
                                virtualIndex={index}    
                            >
                                <div className='slide-div'>
                                    <img src={image.url} />    
                                </div>
                            </SwiperSlide>
                        )
                    })
                }
                <SwiperSlide>
                    <div className='single-last slide-div'>
                        {
                            props.loadedImageList.length < props.numAllImages ?
                            <div className='loading-icon single-loading'></div>:
                            <button id='single-load-more' onClick={props.handleLoadMore}>Load more</button>
                        }    
                    </div>
                </SwiperSlide>
            </Swiper>
             
        </div>
    )
}