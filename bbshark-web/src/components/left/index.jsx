import { useContext, useState } from "react";
import ModelSelection from "./model-selection";
import classes from './styles.module.css'
import TextInput from "./text-input";
import { GlobalContext } from "../../context";
import DrawInput from "./draw-input";


function render(type,prop){
    switch(type){
        case "text":
            return <TextInput id={prop}/>
            break;
        case "image": 
            return <DrawInput id={prop}/>
            break;
        case "tag":
            return <TextInput id={prop}/>
            break;
        default: 
            return null;
    }
}
export default function Left(){
    const {inputBox,setInputBox} = useContext(GlobalContext);

    return (
      <div style={{ flex: "0 0 26%", marginLeft: "25px" }}>
        <ModelSelection></ModelSelection>
        <hr></hr>
        <div className={classes.input}>
            {inputBox.map((item,index) => render(item,index))}</div>
      </div>
    )
}