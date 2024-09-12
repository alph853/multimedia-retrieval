import { useContext, useEffect, useState } from "react"
import classes from "./styles.module.css"
import { GlobalContext } from "../../../context"
import Skeleton from "react-loading-skeleton"

export default function Image({ src, id, yt_link , style}) {
  const { images,setImages, selectedImage, setSelectedImage, imageQueue, setImageQueue, selectBtn, setSelectBtn, searchResponse, setSearchResponse} = useContext(GlobalContext)

  const [hiddenImage, setHiddenImage] = useState(false)
  const [ans,setAns] = useState("");
  const [test, setTest] = useState("");

  useEffect(()=>{
    console.log(ans);
  },[ans])

  function handleAnswer(e){
    const updatedImages = [...images]
    updatedImages[id].answer = e.target.value
    setImages(updatedImages);
    console.log(images);
    setAns(e.target.value);
  }
  function handleClick() {
    const updatedQueue = {...imageQueue};
    if (!updatedQueue[selectBtn]) {
      updatedQueue[selectBtn] = []
    }
    updatedQueue[selectBtn].push(searchResponse[selectBtn][id]);
    setImageQueue(updatedQueue);
    searchResponse[selectBtn].splice(id, 1)
    console.log(imageQueue)
  }

  const handleImageClick = (e) => {
    if (e.ctrlKey) {
      // Corrected typo: e.ctrlKey
      e.preventDefault() // Prevent default behavior
      if (yt_link) {
        window.open(`${yt_link}`, "_blank") // Open the YouTube link in a new tab
      } else {
        console.error("YouTube link is not provided.")
      }
    } else {
      setSelectedImage(id)
    }
  }

  return (
    <div
      className={
        hiddenImage === true
          ? ` ${classes.image} ${classes.hidden}`
          : `${classes.image}`
      }
      style={style}
    >
      <label onClick={handleClick}> {id + 1} </label>
      <img src={src["img_path"]||<Skeleton/>} onClick={handleImageClick} />
      <p onClick={() => setHiddenImage(!hiddenImage)}>{src["format"]}</p>
      {
        <input
          type="text"
          className={ans === "" ? classes.hidden1 : ""}
          onChange={handleAnswer}
        />
      }
    </div>
  )
}