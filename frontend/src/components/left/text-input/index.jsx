import { useContext } from 'react'
import classes from './styles.module.css'
import { GlobalContext } from '../../../context'


export default function TextInput({id}){
  const {removeInput, setInputBox, selectedFrame} = useContext(GlobalContext)
  const handleInputChange = e =>{
    setInputBox((prevInputBox) => {
      const updatedInputBox = [...prevInputBox]
      updatedInputBox[selectedFrame] = {
        ...updatedInputBox[selectedFrame],
        data: {
          ...updatedInputBox[selectedFrame].data,
          text: e.target.value, // Update drawImg with the new imgData
        },
      }
      console.log(updatedInputBox)
      return updatedInputBox
    })
  }
    return (
      <div className={classes.textInput}>
        <textarea name="text-input-user" onChange={handleInputChange}/>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
          <div className={classes.model}>
            {/* <input type="radio" name="prompt" />
            <label for="radio1">Prompt Assistant</label> */}
            <button>Prompt Assistant</button>
            {/* <br></br> */}
            {/* <input type="radio" name="tag" />
            <label for="radio2">Tag Assistant</label> */}
            <button style={{marginTop: "10px"}}>Tag Assistant</button>
          </div>
          <div className={classes.btn}>
            <button style={{backgroundColor: "#22253489"}}>Translate</button>
            {/* <br /> */}
            <button cur-id={id} onClick={removeInput}  style={{marginTop: "10px", backgroundColor : "var(--bg-reset)"}}>Exit</button>
          </div>
        </div>
      </div>
    )
}