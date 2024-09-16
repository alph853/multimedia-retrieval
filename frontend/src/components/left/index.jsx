import { useContext, useEffect, useState } from "react"
import ModelSelection from "./model-selection"
import classes from "./styles.module.css"
import TextInput from "./text-input"
import { GlobalContext } from "../../context"
import DrawInput from "./draw-input"
import axios from "axios"
import SideBar from "../../components/side-bar"
import TagInput from "./tag-input"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import OcrInput from "./ocr-input"

function render(type, prop) {
  switch (type) {
    case "text":
      return <TextInput id={prop} style = {{with: "500px"}}/>
    case "image":
      return <DrawInput id={prop} style = {{with: "500px"}}/>
    case "tag":
      return <TagInput id={prop} style = {{with: "500px"}}/>
    case "ocr":
      return <OcrInput id={prop} style={{ with: "500px" }} />
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
    setNumImg,
    canvasW,
    canvasH,
    setImages,
    images,
  } = useContext(GlobalContext)
  function handleDeleteFrame() {
    setInputBox((i) => (i = inputBox.filter((_, idx) => idx !== selectedFrame)))
    setSelectedFrame(0)
  }
  const [loading,setLoading] = useState(false);
  const handleSearchBE = () => {
    setLoading(true)
    const obj = {}
    console.log("Fetch: ", inputBox)
    inputBox.forEach((input, index) => {
      const key = (index + 1).toString()
      const { text, img_path, drawImg, tag,ocr} = input.data
      obj[key] = {
        txt:text,
        img:img_path.length > 0? img_path : null,
        ocr:ocr==""?null:ocr,
        idx:null,
        tag:tag?tag:null,
        asr:null,
        obj:drawImg?.length?{
          "canvasSize":{"h":canvasH,"w":canvasW},
          "dragObject":drawImg.map(obj=>({ 
              class: obj.imageName,
              position: {
                xTop: obj.x,
                xBottom: obj.x + obj.width,
                yTop: obj.y,
                yBottom: obj.y + obj.height
            }
          })),
          "drawColor":[]
        }:null
      }
    })
    console.log(obj)

    axios
      .post("http://localhost:8000/search", {
        number: numImg,
        search_space_idx: [],
        number_of_frames: inputBox.length,
        frame_info: obj,
      }
    ) 
      .then((res) => {
        setSearchResponse((s) => JSON.parse(res.data))
        toast.success("Search completed successfully!")
      })
      .catch((err) => {
        console.error("Search failed:", err) // Optional: log the error for debugging
        toast.error(
          `Search failed: ${err.message || "An unknown error occurred"}`
        )
      })
      .finally(() => {
        setLoading(false) // Always reset loading state
      })
    }
  const detectKeyDown = (e) => {
    // if(e.ctrlKey && e.key ==='Enter'){
    //   e.preventDefault();
    //   handleSearchBE();
    // }
  };
  useEffect(()=>{
    document.addEventListener('keydown',detectKeyDown,true)
  })
  
  return (
    <div style={{height: "100%", display: "flex", justifyItems: "center", alignItems: "center"}}>
      <div>
        <SideBar></SideBar>
      </div>
      <div style={{ flex: "0 0 26%", marginLeft: "25px" }}>
        {/* <ModelSelection></ModelSelection> */}
        {/* <hr></hr> */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "5px",
              marginTop: "20px"
            }}
          >
            <div className={classes.select}>
              {inputBox.map((_, idx) => (
                <button
                  className={ selectedFrame === idx ? `${classes.btn} ${classes.selected}` : `${classes.btn}` }
                  style={{ }}
                  onClick={() => setSelectedFrame((fr) => (fr = idx))}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <div>
              <input type="number" name="model-input" className={classes.inputNumber} onChange={(e) => setNumImg(e.target.value)} defaultValue={1} placeholder="Number"></input>
              <button className={classes.submitBtn} style={{backgroundColor: "var(--bg-submit)"}} onClick={handleSearchBE}>
                Submit
              </button>
            </div>
          </div>
          <div className={classes.input} style={{paddingRight: "10px"}}>
            {inputBox.map((item, index) => {
              if (index === selectedFrame) {
                return item.render.map((i, idx) => render(i, idx))
              }
            })}
            <button
              className={classes.submitBtn}
              style={{ marginTop: "20px", marginLeft: "220px", backgroundColor: "var(--bg-reset)" }}
              onClick={handleDeleteFrame}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
