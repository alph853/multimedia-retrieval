import { useContext, useEffect, useState } from "react"
import Bar from "./Bar"
import Image from "./image"
import classes from "./styles.module.css"
import { GlobalContext } from "../../context"
import axios from "axios"
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
export default function Right() {
  const {images, setImages , imagesTemp, setImageTemp,imageQueue, setImageQueue, checkFilter, setCheckFilter} = useContext(GlobalContext)
  const [closeBoard, setCloseBoard] = useState(false)
  return (
    <div style={{ flex: "0 0 68%", marginLeft: "15px" }}>
      <Bar></Bar>
      {checkFilter == false ? (
        <div className={classes.imageContainer}>
          {images.map((image, idx) => (
            <Image src={image} id={idx}></Image>
          ))}
        </div>
      ): (
        <div className={classes.imageContainer}>
          {imagesTemp.map((image, idx) => (
            <Image src={image} id={idx}></Image>
          ))}
        </div>
      )}
      <div className={classes.boxQueue}>
        {closeBoard ? (
          <FaChevronLeft className={classes.chevron} onClick={() => {setCloseBoard(false)}}/>
        ) : (
          <div style={{display: "flex", flexDirection: "row", backgroundColor: "transparent", alignItems: "center"}}>
            <FaChevronRight className={classes.chevron} onClick={() => {setCloseBoard(true)}}/>
              {imageQueue.length === 0 ? (null):(
                <div style={{padding: "20px", backgroundColor: "#1a2330", borderRadius: "10px", marginRight: "30px"}}>
                  <div className={classes.lstBox}>
                    {imageQueue.map((image, idx) => (
                      <Image
                        key={idx}t
                        src={image}
                        id={idx}
                        style={{ marginRight: "10px" }}
                      />
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
        
      </div>
    </div>
  )
}
