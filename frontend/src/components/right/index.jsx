import { useContext, useEffect, useState } from "react"
import Bar from "./Bar"
import Image from "./image"
import classes from "./styles.module.css"
import { GlobalContext } from "../../context"
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
export default function Right() {
  const {images, setImages , imagesTemp, setImageTemp,imageQueue, setImageQueue, checkFilter, setCheckFilter, searchResponse, setSearchResponse, selectBtn, setSelectBtn} = useContext(GlobalContext)
  const [closeBoard, setCloseBoard] = useState(false)
  
  return (
    <div style={{ flex: "0 0 68%", marginLeft: "15px" }}>
      <Bar></Bar>
      {
        <ul style={{display: "flex"}} className={classes.ulbtn}>
          {Object.keys(searchResponse).map(key => (<div className={(selectBtn == key) ? `${classes.btn} ${classes.selected}` : `${classes.btn}`} onClick={() => setSelectBtn(key)}>{key}</div>))}
        </ul>
      }
      <hr></hr>
      {
        selectBtn === null ? null : (
          <div key={selectBtn}>
           {checkFilter == false ? (
                <div className={classes.imageContainer}>
                  {searchResponse[selectBtn].map((image, idx) => (
                    <Image src={image} id={idx} yt_link={image.watch_url}></Image>
                  ))}
                </div>
              ) : (
                <div className={classes.imageContainer}>
                  {imagesTemp.map((image, idx) => (
                    <Image src={image} id={idx} yt_link={image.watch_url}></Image>
                  ))}
                </div>
              )}
              <div className={classes.boxQueue}>
                {closeBoard ? (
                  <FaChevronLeft
                    className={classes.chevron}
                    onClick={() => {
                      setCloseBoard(false)
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      backgroundColor: "transparent",
                      alignItems: "center",
                    }}
                  >
                    <FaChevronRight
                      className={classes.chevron}
                      onClick={() => {
                        setCloseBoard(true)
                      }}
                    />
                    {((!imageQueue[selectBtn])) ? null : (
                      <div
                        style={{
                          padding: "20px",
                          backgroundColor: "#1a2330",
                          borderRadius: "10px",
                          marginRight: "30px",
                        }}
                      >
                        <div className={classes.lstBox}>
                          {Object.keys(imageQueue[selectBtn]).map( (key, idx) => 
                            <Image
                              key = {idx}
                              src = {imageQueue[selectBtn][key]}
                              id = {idx}
                              style={{ marginRight: "10px" }}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
        )
      }
    </div>
  )
}
