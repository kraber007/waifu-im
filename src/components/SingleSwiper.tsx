import "./SingleSwiper.css";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Virtual } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Image0 } from "../WaifuApi";

interface Props {
  imageList: Image0[];
  index: number;
  visibleSingle: boolean;
  handleCloseSingle(index: number): void;
  handleLoadMore(): void;
  numAllImages: number;
}

export default function SingleSwiper(props: Props) {
  let [swiperIndex, setSwiperIndex] = useState(props.index);

  useEffect(() => {
    setSwiperIndex(props.index);
  }, [props.index]);

  if (!props.visibleSingle) {
    return <div></div>;
  }
  if (props.imageList.length < swiperIndex) {
    return <div>an error has occured in singleSwiper file</div>;
  }

  const handleSlideChange = (swiper: any) => {
    setSwiperIndex(swiper.activeIndex);
  };

  return (
    <div
      className={`single-swiper`}
      style={{
        visibility: `${props.visibleSingle ? "visible" : "hidden"}`,
        backgroundColor: `${
          swiperIndex < props.imageList.length
            ? props.imageList[swiperIndex].dominant_color
            : props.imageList[swiperIndex - 1].dominant_color
        }`,
      }}
    >
      <button
        id={"close-single"}
        onClick={() => props.handleCloseSingle(swiperIndex)}
      >
        Close
      </button>
      <Swiper
        initialSlide={props.index}
        navigation={true}
        grabCursor={true}
        pagination={{ type: "fraction", clickable: true }}
        modules={[Pagination, Navigation, Virtual]}
        onSlideChange={handleSlideChange}
        virtual={{ addSlidesAfter: 1, addSlidesBefore: 0 }}
      >
        {props.imageList.map((image, index) => {
          return (
            <SwiperSlide key={index + image.url} virtualIndex={index}>
              <div className="slide-div">
                <img src={image.url} />
              </div>
            </SwiperSlide>
          );
        })}
        <SwiperSlide>
          <div className="single-last slide-div">
            {/* {
                            props.loadedImageList.length < props.numAllImages ?
                            <div className='loading-icon single-loading'></div>:
                            <button id='single-load-more' onClick={props.handleLoadMore}>Load more</button>
                        }    */}
            <button id="single-load-more" onClick={props.handleLoadMore}>
              Load more
            </button>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
