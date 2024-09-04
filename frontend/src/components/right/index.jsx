import { useContext, useEffect } from "react"
import Bar from "./Bar"
import Image from "./image"
import classes from "./styles.module.css"
import { GlobalContext } from "../../context"
import axios from "axios"

export default function Right() {
  const { images, setImages } = useContext(GlobalContext)

  return (
    <div style={{ flex: "0 0 68%", marginLeft: "15px" }}>
      <Bar></Bar>
      <div className={classes.imageContainer}>
        {images.map((image, idx) => (
          <Image src={image} id={idx} width={250} height={150}></Image>
        ))}
      </div>
    </div>
  )
}
