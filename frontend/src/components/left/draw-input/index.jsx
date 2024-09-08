import { useContext, useEffect, useRef, useState } from "react"
import classes from "./styles.module.css"
import { GlobalContext } from "../../../context"
import MyDropzone from "../drop-file/DropFile";

export default function DrawInput({id}) {
  const {removeInput,closeBoard, setCloseBoard,files,setFiles} = useContext(GlobalContext);

  function exitHandle(event){
    setFiles([])
    removeInput(event)
  }

  return (
    <div className={classes.drawing}>
      <div className={classes.canvas}>
        {files.length===0?
        <div className={classes.scrollContainer}>
          <p style={{ fontSize: "10px" }} className={classes.scrollText}>
            * Create your own image by clicking Draw button
          </p>
        </div>:null
        }
        <MyDropzone></MyDropzone>
      </div>
      <div className={classes.color}>
        <button onClick={() => setCloseBoard(false)}>Draw</button>
        <button onClick={()=>setFiles([])}>Reset</button>
        <br></br>
        <br></br>
        <br></br>
        <button
          style={{
            backgroundColor: "red",
            fontSize: "13px",
            padding: "3px 10px",
          }}
          cur-id={id}
          onClick={(event) => exitHandle(event)}
        >
          Exit
        </button>
      </div>
    </div>
  )
}
