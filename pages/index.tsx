import styles from "../styles/Home.module.css";
import React, { useCallback, useEffect, useState } from "react";
import GridStagger from "../components/GridStagger";
import SingleSwiper from "../components/SingleSwiper";
import TagUI from "../components/TagUI";
import { Image0, getRandomImages } from "../WaifuApi";
import { useRouter } from "next/router";
import { setConstantValue } from "typescript";

export interface Tags {
  selected: string[];
  excluded: string[];
}

let useWindowWidth = () => {
  let [windowWidth, setWindowWidth] = useState(500);
  useEffect(() => {
    setWindowWidth(window.innerWidth - 29);
    window.onresize = () => {
      clearTimeout((window as any).resizeTimeout);
      (window as any).resizeTimeout = setTimeout(function () {
        setWindowWidth(window.innerWidth - 20);
      }, 50);
    };
  }, []);
  return windowWidth;
};

let parseNumber = (str: string) => {
  if (!isNaN(Number(str))) {
    console.log("parseNumber: ", Number(str));
    return Number(str);
  } else {
    alert("invalid url query parameter");
  }
  return -1;
};

export const useQueryState = (key, initialState) => {
  const router = useRouter();
  const [state, setState] = useState(initialState);

  useEffect(() => {
    console.log(
      "useEffect called with key:",
      key,
      "with value:",
      parseNumber(router.query[key])
    );
    setState(parseNumber(router.query[key]));
  }, [router.query[key]]);

  const setQueryParams = (newValue) => {
    let newQuery = router.query;
    newQuery[key] = newValue;
    router.push({ pathname: router.pathname, query: newQuery }, undefined, {
      shallow: true,
    });
  };

  return [state, setQueryParams];
};

export default function Home() {
  console.log("----------------------begin render-------------------------");
  let [tags, setTags] = useState<Tags>({ selected: [], excluded: [] });
  // let [isNsfw, setIsNsfw] = useState(0); //possible values 0,1,2
  let [isNsfw, setIsNsfwQ] = useState(0); //possible values 0,1,2
  let [isGif, setIsGifQ] = useState(1); //possible values 0,1,2
  let [notFound, setNotFound] = useState(false);
  let [imageList, setImageList] = useState<Image0[]>([]);
  let [visibleUI, setVisibleUI] = useState(false);
  let [visibleSingle, setVisibleSingle] = useState(false);
  let [indexSingle, setIndexSingle] = useState(0);
  let [headerColor, setHeaderColor] = useState("#f3b5a6");
  let [footerColor, setFooterColor] = useState("#f3b5a6");
  let [queryDone, setQueryDone] = useState(false);
  let windowWidth = useWindowWidth();

  const router = useRouter();

  let query = router.query;
  let setIsNsfw = (value) => {
    query.nsfw = value;
    router.push({ pathname: router.pathname, query: query }, undefined, {
      shallow: true,
    });
  };
  let setIsGif = (value) => {
    query.gif = value;
    router.push({ pathname: router.pathname, query: query }, undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    if (!router.isReady) return;
    let query = router.query;
    console.log({ query });

    for (let key in router.query) {
      switch (key) {
        case "nsfw": {
          setIsNsfwQ(parseNumber(query[key]));
          break;
        }
        case "gif": {
          setIsGifQ(parseNumber(query[key]));
          break;
        }
      }
    }

    setQueryDone(true);
  }, [router.query]);

  console.log({ isNsfw, isGif, queryDone });

  useEffect(() => {
    if (!queryDone) return;
    if (imageList.length > 0) {
      setHeaderColor(imageList[0].dominant_color);
    }
  }, [imageList, queryDone]);

  useEffect(() => {
    if (!queryDone) return;
    getRandomImages(tags.selected, tags.excluded, [], isNsfw, isGif).then(
      (list) => {
        let tmpImageList: Image0[] = [];
        list.forEach((image) => tmpImageList.push(image));
        setImageList(tmpImageList);
        setNotFound(list.length == 0);
      }
    );
  }, [tags, isNsfw, queryDone]);

  const toggleUI = () => {
    //toggle tag select UI
    setVisibleUI(!visibleUI);
  };

  const handleImageClick = (index: number) => {
    setIndexSingle(index);
    setVisibleSingle(true);
  };
  const handleCloseSingle = (swiperIndex: number) => {
    console.log({ visibleSingle });
    setIndexSingle(swiperIndex);
    setVisibleSingle(false);
  };

  // useEffect(()=>{
  //   if(visibleSingle){
  //     document.getElementsByClassName(styles.single_slider)[0].requestFullscreen();
  //   }
  //   else{
  //     document.exitFullscreen();
  //   }
  // },[visibleSingle])

  const handleLoadMore = () => {
    let excluded_files = imageList.map((image) => image.image_id);
    getRandomImages(
      tags.selected,
      tags.excluded,
      excluded_files,
      isNsfw,
      isGif
    ).then((list) => {
      if (list.length == 0) {
        setNotFound(true);
        return;
      }
      setImageList(imageList.concat(list));
    });
  };

  if (!queryDone) {
    return (
      <div>Looking at url queries AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</div>
    );
  }

  if (visibleSingle) {
    return (
      <SingleSwiper
        imageList={imageList}
        index={indexSingle}
        visibleSingle={visibleSingle}
        handleCloseSingle={handleCloseSingle}
        handleLoadMore={handleLoadMore}
        numAllImages={imageList.length}
        notFound={notFound}
      />
    );
  }

  return (
    <div
      className={styles.container}
      style={{
        backgroundColor: footerColor,
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "10px",
          backgroundColor: headerColor,
        }}
      >
        <button id={styles.btn_select_tags} onClick={toggleUI}>
          {visibleUI ? "Hide Tags" : "Select Tags"}
        </button>
      </div>
      <TagUI
        visibleUI={visibleUI}
        setVisibleUI={setVisibleUI}
        tags={tags}
        setTags={setTags}
        isNsfw={isNsfw}
        setIsNsfw={setIsNsfw}
      />
      <GridStagger
        imageList={imageList}
        focusIndex={indexSingle}
        handleImageClick={handleImageClick}
        setFooterColor={setFooterColor}
        windowWidth={windowWidth}
      />
      <div
        style={{
          textAlign: "center",
          padding: "10px",
          backgroundColor: footerColor,
        }}
      >
        {!notFound ? (
          <button id={styles.btn_load_more} onClick={handleLoadMore}>
            Load More
          </button>
        ) : (
          <div>Nothing more to show</div>
        )}
      </div>
    </div>
  );
}
