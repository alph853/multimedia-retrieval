import { useContext, useState, useEffect } from "react";
import classes from "./styles.module.css";
import { GlobalContext } from "../../../context";
import { tag } from "../../../context/tag";
import trie from "trie-prefix-tree";

export default function TagInput({ id }) {
  const tagTrie = trie(tag);
  const [activeSearch, setActiveSearch] = useState(tag.slice(0, 50));

  const {removeInput, selectTag, setSelectTag, setInputBox, selectedFrame, setTagAssistant, tagAssistant} = useContext(GlobalContext);

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setActiveSearch(tag.slice(0, 50));
    } else {
      setActiveSearch(tagTrie.getPrefix(value));
    }
  };

  const handleClick = (tag) => {
    const slTag = {...selectTag};
    if (!slTag[selectedFrame]) {
      slTag[selectedFrame] = []
    }
    if (!slTag[selectedFrame].includes(tag)) {
      slTag[selectedFrame].push(tag)
    }
    setSelectTag(slTag);
    console.log(selectTag)
  };

  const handleRemoveTag = (index) => {
    // setSelectTag(prevTags => prevTags[selectedFrame].filter((_, idx) => idx !== index));\
    const slTag = {...selectTag};
    slTag[selectedFrame] = slTag[selectedFrame].filter((_, idx) => idx != index);
    setSelectTag(slTag);
    console.log(selectTag)
  };

  const handleExit = (e) => {
    removeInput(e)
    setSelectTag({});
  };

  const handleSubmit = () => {
    setInputBox((prevInputBox) => {
      const updatedInputBox = [...prevInputBox]
      updatedInputBox[selectedFrame] = {
        ...updatedInputBox[selectedFrame],
        data: {
          ...updatedInputBox[selectedFrame].data,
          tag: selectTag[selectedFrame],
        },
      }
      return updatedInputBox
    })
  }

  useEffect(() => {
    handleSubmit();
  }, [selectTag]);

  return (
    <div className={classes.tagInput}>
      <div className={classes.tagLeft}>
        <div className={classes.tagLeftTop}>
          <input
            type="text"
            className={classes.text1}
            placeholder="Query for tag"
            onChange={handleChange}
          />
          <div className={classes.topDetails}>
            <ul>
              {activeSearch.map((tag) => (
                <li key={tag} onClick={() => {handleClick(tag)}}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={classes.tagLeftBottom}>
          <input
            type="text"
            className={classes.text1}
            placeholder="Query to get tag recommend"
          />
          <div className={classes.bottomDetails}>
            <ul>
              {tagAssistant[selectedFrame]?.map((tag) => (
                <li key={tag} onClick={() => {handleClick(tag)}}>{tag}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className={classes.tagRight}>
        <div className={classes.tagRightSelect}>
          <ul>
            { (selectTag[selectedFrame]) && (selectTag[selectedFrame].map((tag, idx) => (
              <li key={tag} onClick={() => {handleRemoveTag(idx)}}>
                {tag}
              </li>
            )))
            }
          </ul>
        </div>
        <div className={classes.tagRightControl}>
          <button onClick={() => setSelectTag([])}>Reset</button>
          <button cur-id={id} onClick={(e) => handleExit(e)}>Exit</button>
        </div>
      </div>
    </div>
  );
}
