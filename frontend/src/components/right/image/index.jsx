import { useContext, useState } from "react"
import classes from "./styles.module.css"
import { GlobalContext } from "../../../context"

export default function Image({ src, id, width, height , style}) {
  const { images, selectedImage, imagesTemp, setImageTemp, setSelectedImage, imageQueue, setImageQueue } = useContext(GlobalContext)

  const [hiddenImage, setHiddenImage] = useState(false)

  function handleImageClick() {
    setSelectedImage((i) => (i = id))
  }
  function handleClick() {
    imageQueue.push(images[id]);
    setImageQueue([...imageQueue])
    selectedImage(images.splice(id, 1))
  }

  return (
    <div className = { hiddenImage === true ? ` ${classes.image} ${classes.hidden}`: `${classes.image}`} style={style}>
      <label onClick={handleClick}> {id + 1} </label>
      <img src={src["img_path"]} onClick={handleImageClick} />
      <p onClick={() => setHiddenImage(true)}>{src['scene_id']}</p>
    </div>
  )
}
