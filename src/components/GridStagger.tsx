import React, { useState, useEffect, useRef } from "react";
import { Image0 } from "../WaifuApi";
import "./GridStagger.css";
import { initialBackgroundColor } from "../colors";

interface Props {
  imageList: Image0[];
  handleImageClick(index: number): void;
  focusIndex: number;
  setFooterColor: any;
}

export default function GridStagger(props: Props) {
  let scrollRef = useRef(null);
  let [windowWidth, setWindowWidth] = useState(window.innerWidth - 29);
  let [containerHeight, setContainerHeight] = useState(0);
  let [backgroundGradient, setBackgroundGradient] = useState(
    initialBackgroundColor
  );

  const imgList = useRef(new Array());

  useEffect(() => {
    loadNext(0);
  }, [props.imageList]);

  const loadNext = (index: number) => {
    if (index >= imgList.current.length || !imgList.current[index]) {
      return;
    }
    imgList.current[index].src = imgList.current[index].dataset.src;
    imgList.current[index].onload = () => loadNext(index + 1);
    imgList.current[index].onloadfail = () => loadNext(index + 1);
  };

  window.onresize = () => {
    clearTimeout((window as any).resizeTimeout);
    (window as any).resizeTimeout = setTimeout(function () {
      setWindowWidth(window.innerWidth - 20);
    }, 50);
  };
  useEffect(() => {
    if (scrollRef !== null && scrollRef.current !== null) {
      (scrollRef.current as any).scrollIntoView(); //{behavior: 'smooth'}
    }
  }, [props.focusIndex]);

  const findMinIndex = (arr: number[]) => {
    let i = 0;
    let last = arr[0];
    arr.forEach((val, index) => {
      if (val < last) {
        i = index;
        last = val;
      }
    });
    return i;
  };
  const findContainerHeight = (arr: number[]): number => {
    let last = arr[0];
    arr.forEach((val) => {
      if (val > last) {
        last = val;
      }
    });
    return last;
  };
  const handleLastImageLoad = () => {
    let height = findContainerHeight(sets);
    if (height != containerHeight) {
      setContainerHeight(height);
      setBackgroundGradient(gradient);
      // console.log(gradient);
    }
  };
  let minWidth = 300;
  let numColoumns = Math.floor(windowWidth / minWidth);
  let width = minWidth + (windowWidth % minWidth) / numColoumns;
  let sets = [0];
  for (let i = 0; i < numColoumns - 1; ++i) {
    sets.push(0);
  }
  let gradient = "linear-gradient(to bottom";
  let lastTop = -1000;
  return (
    <div
      className="stagger-container"
      style={{ height: `${containerHeight}px`, background: backgroundGradient }}
    >
      {props.imageList.map((image, index) => {
        let minIndex = findMinIndex(sets);
        let left = minIndex * width;
        let top = sets[minIndex];
        sets[minIndex] += (image.height / image.width) * width;
        let scale = width / image.width;
        if (top - lastTop > 200) {
          gradient += `,${image.dominant_color} ${top}px`;
          lastTop = top;
          props.setFooterColor(image.dominant_color);
        }
        if (index === props.imageList.length - 1) {
          if (top == 0) {
            gradient += `,${props.imageList[0].dominant_color} ${1}px`;
          }
          gradient += ")";
          handleLastImageLoad();
        }
        return (
          <div
            ref={props.focusIndex === index ? scrollRef : null}
            key={index + image.url}
            style={{
              transform: `translateX(${left}px) translateY(${top}px) scale(${scale},${scale})`,
              width: `${image.width}px`,
            }}
            onClick={() => props.handleImageClick(index)}
          >
            <img
              data-src={image.url}
              style={{
                background: image.dominant_color,
                aspectRatio: `${image.width / image.height}`,
              }}
              ref={(element) => (imgList.current[index] = element)}
            />
          </div>
        );
      })}
    </div>
  );
}
