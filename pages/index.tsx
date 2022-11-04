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

//TODO: TAGUI not reflecting changes made in selected tags
export default function Home() {
  console.log("----------------------begin render-------------------------");
  let initials = { tags: { selected: [], excluded: [] }, nsfw: 0, gif: 1 };
  let [tags, setTagsQ] = useState<Tags>(initials.tags);
  let [isNsfw, setIsNsfwQ] = useState(initials.nsfw); //possible values 0,1,2
  let [isGif, setIsGifQ] = useState(initials.gif); //possible values 0,1,2
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
    query.nsfw = JSON.stringify(value);
    router.push({ pathname: router.pathname, query: query }, undefined, {
      shallow: false,
    });
  };
  let setIsGif = (value) => {
    query.gif = JSON.stringify(value);
    router.push({ pathname: router.pathname, query: query }, undefined, {
      shallow: false,
    });
  };
  let setTags = (value) => {
    query.tags = JSON.stringify(value);
    console.log({ value, query });
    router.push({ pathname: router.pathname, query: query }, undefined, {
      shallow: false,
    });
  };

  useEffect(() => {
    if (!router.isReady) return;
    let query = router.query;
    console.log({ query });

    // if ("nsfw" in query) {
    //   setIsNsfwQ(JSON.parse(query["nsfw"]));
    // } else {
    //   setIsNsfwQ(initials["nsfw"]);
    // }
    // if ("gif" in query) {
    //   setIsGifQ(JSON.parse(query["gif"]));
    // } else {
    //   setIsGifQ(initials["gif"]);
    // }
    // if ("tags" in query) {
    //   setTagsQ(JSON.parse(query["tags"]));
    // } else {
    //   setTagsQ(initials["tags"]);
    // }

    if ("nsfw" in query) {
      console.log("AAAAAAAAAAAAAAAAAAA");
    } else {
      query["nsfw"] = JSON.stringify(initials["nsfw"]);
    }
    if ("gif" in query) {
      console.log("BBBBBBBBBBBBBBBBBBBBBBBBBB");
    } else {
      query["gif"] = JSON.stringify(initials["gif"]);
    }
    if ("tags" in query) {
      console.log("CCCCCCCCCCCCCCCCCCCCCCCCCc");
    } else {
      query["tags"] = JSON.stringify(initials["tags"]);
    }

    for (let key in router.query) {
      console.log(query[key]);
      let value = query[key];
      switch (key) {
        case "nsfw": {
          setIsNsfwQ(Number(value));
          break;
        }
        case "gif": {
          setIsGifQ(Number(value));
          break;
        }
        case "tags": {
          setTagsQ(JSON.parse(value));
          break;
        }
      }
      console.log("Parsing Query, key:", key, ", value:", value);
    }

    setQueryDone(true);
  }, [router.query]);

  // useEffect(() => {
  //   setCount(0);
  // }, [router.query.slug]);

  console.log({ isNsfw, isGif, tags });

  useEffect(() => {
    if (imageList.length > 0) {
      setHeaderColor(imageList[0].dominant_color);
    }
  }, [imageList]);

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
  }, [tags, isNsfw, isGif, queryDone]);

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
        {notFound ? (
          <div style={{ fontSize: "30px" }}>
            Nothing more to show <br /> Please change filters and tags
          </div>
        ) : (
          <></>
        )}
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
        isGif={isGif}
        setIsGif={setIsGif}
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
          <div>
            Nothing more to show <br /> Please change filters and tags
          </div>
        )}
      </div>
    </div>
  );
}
