import { useContext, useState } from "react"
import classes from "./styles.module.css"
import { GlobalContext } from "../../../context"

export default function Image({ src, id, yt_link , style}) {
  const { images, selectedImage, setSelectedImage, imageQueue, setImageQueue } = useContext(GlobalContext)

  const [hiddenImage, setHiddenImage] = useState(false)

  // function handleImageClick() {
  //   setSelectedImage((i) => (i = id))
  // }
  function handleClick() {
    imageQueue.push(images[id]);
    setImageQueue([...imageQueue])
    selectedImage(images.splice(id, 1))
  }
  // (parseInt(hours) * 3600) + (parseInt(minutes) * 60);

  const handleImageClick = (e) => {
    const [minutes, second] = src['timeframe'].split(':')
    if (e.ctrlKey) {
      // Corrected typo: e.ctrlKey
      e.preventDefault() // Prevent default behavior
      if (yt_link) {
        window.open(`${yt_link}&t=${minutes}m${second}s`, "_blank") // Open the YouTube link in a new tab
      } else {
        console.error("YouTube link is not provided.")
      }
    } else {
      setSelectedImage(id) // Set the selected image if Ctrl is not pressed
    }
  }

  return (
    <div className = { hiddenImage === true ? ` ${classes.image} ${classes.hidden}`: `${classes.image}`} style={style}>
      <label onClick={handleClick}> {id + 1} </label>
      <img src={src["img_path"]} onClick={handleImageClick} />
      <p onClick={() => setHiddenImage(!hiddenImage)}>{src['format']}</p>
    </div>
  )
}
