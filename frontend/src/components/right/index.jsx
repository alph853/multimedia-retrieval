import { useContext, useEffect } from "react"
import Bar from "./Bar"
import Image from "./image"
import classes from "./styles.module.css"
import { GlobalContext } from "../../context"


export default function Right() {
  const { images, setImages } = useContext(GlobalContext)

  return (
    <div style={{ flex: "0 0 68%", marginLeft: "15px" }}>
      <Bar></Bar>
      <div className={classes.imageContainer}>
        {images.map((image, idx) => (
          <Image src={image} id={idx} ></Image>
        ))}
      </div>
    </div>
  )
}
