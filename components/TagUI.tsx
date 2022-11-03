import styles from "./TagUI.module.css";
import { useEffect, useState } from "react";
import { Tags } from "../pages";
import { getAllTags, Tag } from "../WaifuApi";
import React from "react";

interface Props {
  visibleUI: Boolean;
  setVisibleUI(bool: boolean): any;
  tags: Tags;
  setTags(tags: Tags): void;
  isNsfw: number;
  setIsNsfw(val: number): void;
}

export default function TagUI(props: Props) {
  let [tagStates, setTagStates] = useState<number[]>([]);
  let [nsfwUIState, setNsfwUIState] = useState(props.isNsfw);
  let [allTags, setAllTags] = useState<{ sfw: Tag[]; nsfw: Tag[] }>({
    sfw: [],
    nsfw: [],
  });

  useEffect(() => {
    getAllTags().then((data) => {
      let tmpTagStates: number[] = [];
      let tmpAllTags: { sfw: Tag[]; nsfw: Tag[] } = { sfw: [], nsfw: [] };
      data.sfw.forEach((tag) => {
        tmpTagStates.push(1);
        tmpAllTags.sfw.push(tag);
      });
      data.nsfw.forEach((tag) => {
        tmpTagStates.push(1);
        tmpAllTags.nsfw.push(tag);
      });
      setAllTags(tmpAllTags);
      setTagStates(tmpTagStates);
    });
  }, []);

  const onTagChangeHandler = (e: any) => {
    // console.log(e.target.dataset.index);
    let tmpTagStates = tagStates.concat([]);
    tmpTagStates[e.target.dataset.index] = e.target.valueAsNumber;
    setTagStates(tmpTagStates);
  };

  const submitHandler = () => {
    props.setVisibleUI(false);
    let selected_tags: string[] = [];
    let excluded_tags: string[] = [];
    let allTagsList = allTags.sfw.concat(allTags.nsfw);
    tagStates.forEach((state, index) => {
      if (!nsfwUIState && allTagsList[index].is_nsfw == true) {
        return;
      }
      if (state === 2) {
        selected_tags.push(allTagsList[index].name);
      }
      if (state === 0) {
        excluded_tags.push(allTagsList[index].name);
      }
    });
    let tmpTags = { selected: selected_tags, excluded: excluded_tags };
    if (JSON.stringify(tmpTags) != JSON.stringify(props.tags)) {
      props.setTags(tmpTags);
    }
    if (nsfwUIState !== props.isNsfw) {
      props.setIsNsfw(nsfwUIState);
    }
  };

  const onNsfwChangeHandler = (e: any) => {
    setNsfwUIState(e.target.valueAsNumber);
  };

  return (
    <div
      className={`${styles.tag_ui} ${
        props.visibleUI ? styles.visible : styles.hidden
      }`}
    >
      <div className={styles.tag_ui_header}>
        {"Excluded, optional or Included Tags"}
      </div>
      {allTags.sfw.length === 0 ? (
        <div className={`${styles.loading_icon} ${styles.app_loading}`}></div>
      ) : (
        <div className={styles.tag_list}>
          {allTags.sfw.map((tag, index) => {
            return (
              <div className={styles.tag} key={tag.name}>
                <input
                  type="range"
                  id={tag.name}
                  name={tag.name}
                  data-index={index}
                  min={0}
                  max={2}
                  value={tagStates[index]}
                  onChange={onTagChangeHandler}
                />
                <label htmlFor={tag.name}>{tag.name}</label>
              </div>
            );
          })}
          <hr />
          <div className={styles.tag} key={"nsfw-toggler"}>
            <input
              type="range"
              id={"nsfw-toggler"}
              name={"nsfw-toggler"}
              min={0}
              max={2}
              value={nsfwUIState}
              onChange={onNsfwChangeHandler}
            />
            <label htmlFor={"nsfw-toggler"}>{"NSFW"}</label>
          </div>

          <div
            className={`${styles.nsfw_tags} ${
              nsfwUIState ? styles.nsfw_visible : styles.nsfw_hidden
            }`}
          >
            <hr />
            {allTags.nsfw.map((tag, index) => {
              return (
                <div className={styles.tag} key={tag.name}>
                  <input
                    type="range"
                    id={tag.name}
                    name={tag.name}
                    data-index={allTags.sfw.length + index}
                    min={0}
                    max={2}
                    value={tagStates[allTags.sfw.length + index]}
                    onChange={onTagChangeHandler}
                  />
                  <label htmlFor={tag.name}>{tag.name}</label>
                </div>
              );
            })}
          </div>

          <button onClick={submitHandler}>Submit</button>
        </div>
      )}
    </div>
  );
}
