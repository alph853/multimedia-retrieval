import { useContext, useEffect, useRef, useState } from "react"
import classes from "./styles.module.css"
import { GlobalContext } from "../../../context"

export default function TagInput(){
    const {} = useContext(GlobalContext)
    return (
      <div className={classes.tagInput}>
        <div className={classes.tagLeft}>
          <div className = {classes.tagLeftTop}>
            <input type="text" className={classes.text1} placeholder="Query for tag"/>
            <div className={classes.topDetails}>
              <ul>
                <li>Dog</li>
                <li>Cat</li>
                <li>Cat</li>
                <li>Plant</li>
                <li>Dog</li>
                <li>Plant</li>
                <li>Dog</li>
                <li>Cat</li>
                <li>Cat</li>
                <li>Plant</li>
                <li>Dog</li>
                <li>Plant</li>
                <li>Dog</li>
                <li>Cat</li>
                <li>Cat</li>
                <li>Plant</li>
                <li>Dog</li>
                <li>Plant</li>
              </ul>
            </div>            
          </div>
          <div className = {classes.tagLeftBottom}>
            <input type="text" className={classes.text1} placeholder="Query to get tag recommend"/>
            <div className={classes.bottomDetails}>
              <ul>
                <li>Dog</li>
                <li>Cat</li>
                <li>Cat</li>
                <li>Plant</li>
                <li>Dog</li>
                <li>Plant</li>
                <li>Dog</li>
                <li>Cat</li>
                <li>Cat</li>
                <li>Plant</li>
                <li>Dog</li>
                <li>Plant</li>
                <li>Dog</li>
                <li>Cat</li>
                <li>Cat</li>
                <li>Plant</li>
                <li>Dog</li>
                <li>Plant</li>
              </ul>
            </div>
          </div>
        </div>
        <div className={classes.tagRight}>
          <div className = {classes.tagRightSelect}>
            <ul>
              <li>Dog</li>
              <li>Cat</li>
              <li>Cat</li>
              <li>Plant</li>
              <li>Dog</li>
              <li>Plant</li>
              <li>Dog</li>
              <li>Cat</li>
              <li>Cat</li>
              <li>Plant</li>
              <li>Dog</li>
              <li>Plant</li>
              <li>Dog</li>
              <li>Cat</li>
              <li>Cat</li>
              <li>Plant</li>
              <li>Dog</li>
              <li>Plant</li>
            </ul>
          </div>
          <div className = {classes.tagRightControl}>
            <button>Reset</button>
            <button>Exit</button>
          </div>
        </div>
      </div>
    )   
}