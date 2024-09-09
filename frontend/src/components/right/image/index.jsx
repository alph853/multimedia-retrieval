import { useContext } from "react"
import classes from "./styles.module.css"
import { GlobalContext } from "../../../context"

export default function Image({ src, id, yt_link }) {
  const { setSelectedImage } = useContext(GlobalContext)

  // Handle image click
  const handleImageClick = (e) => {
    if (e.ctrlKey) {
      // Corrected typo: e.ctrlKey
      e.preventDefault() // Prevent default behavior
      if (yt_link) {
        window.open(yt_link, "_blank") // Open the YouTube link in a new tab
      } else {
        console.error("YouTube link is not provided.")
      }
    } else {
      setSelectedImage(id) // Set the selected image if Ctrl is not pressed
    }
  }

  return (
    <div className={classes.image}>
      <img src={src} alt={src} onClick={handleImageClick} />
    </div>
  )
}
