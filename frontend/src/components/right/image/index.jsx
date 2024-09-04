import { useContext } from "react"
import classes from "./styles.module.css"
import { GlobalContext } from "../../../context"

export default function Image({ src, id, width, height }) {
  const { images, selectedImage, setSelectedImage } = useContext(GlobalContext)

  // Image slider
  function handleImageClick() {
    setSelectedImage((i) => (i = id))
  }
  return (
    <div className={classes.image}>
      <img src={src} onClick={handleImageClick} />
    </div>
  )
}
