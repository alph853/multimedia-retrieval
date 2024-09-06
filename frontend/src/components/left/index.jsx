import { useContext, useEffect, useState } from "react"
import ModelSelection from "./model-selection"
import classes from "./styles.module.css"
import TextInput from "./text-input"
import { GlobalContext } from "../../context"
import DrawInput from "./draw-input"
import axios from "axios"

function render(type, prop) {
  switch (type) {
    case "text":
      return <TextInput id={prop} />
      break
    case "image":
      return <DrawInput id={prop} />
      break
    case "tag":
      return <TextInput id={prop} />
      break
    default:
      return null
  }
}

export default function Left() {
  const {
    inputBox,
    setInputBox,
    selectedFrame,
    setSelectedFrame,
    searchResponse,
    setSearchResponse,
    numImg,
    canvasW,
    canvasH
  } = useContext(GlobalContext)
  function handleDeleteFrame() {
    setInputBox((i) => (i = inputBox.filter((_, idx) => idx !== selectedFrame)))
    setSelectedFrame(0)
  }
  const handleSearchBE = () => {
      const obj = {}
      console.log("Fetch: ",inputBox)
      inputBox.forEach((input,index)=>{
        const key = (index+1).toString();
        const { text, img_path, drawImg,tag } = input.data
        obj[key] = {
          txt:text,
          img:img_path,
          ocr:null,
          idx:[],
          tag:tag,
          asr:null,
          obj:{
            "canvasSize":{"h":canvasH,"w":canvasW},
            "dragObject":drawImg?.map(obj=>({
               
                class: obj.imageName,
                position: {
                  xTop: obj.x,
                  xBottom: obj.x + obj.width,
                  yTop: obj.y,
                  yBottom: obj.y + obj.height
                
              }
            })),
            "drawColor":[]
          }
        }
      })
      console.log(obj);
    axios
      .post("http://localhost:5173/search", {
        number:numImg,
        search_space_idx:[], 
        number_of_frames:inputBox.length,
        frame_info:obj,
      })
      .then((res) => setSearchResponse((s) => (s = res)))
    console.log(searchResponse);
  }
  return (
    <div style={{ flex: "0 0 26%", marginLeft: "25px" }}>
      <ModelSelection></ModelSelection>
      <hr></hr>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "5px",
          }}
        >
          <div>
            {inputBox.map((_, idx) => (
              <button
                className={
                  selectedFrame === idx
                    ? `${classes.btn} ${classes.selected}`
                    : `${classes.btn}`
                }
                onClick={() => setSelectedFrame((fr) => (fr = idx))}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <div>
            <button className={classes.submitBtn} onClick={handleSearchBE}>
              Submit
            </button>
          </div>
        </div>
        <div className={classes.input}>
          {inputBox.map((item, index) => {
            if (index === selectedFrame) {
              return item.render.map((i, idx) => render(i, idx))
            }
          })}
          <button
            className={classes.submitBtn}
            style={{ marginTop: "20px", marginLeft: "220px" }}
            onClick={handleDeleteFrame}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
