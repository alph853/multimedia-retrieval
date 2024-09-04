import { useContext } from 'react'
import classes from './styles.module.css'
import { GlobalContext } from '../../../context'


export default function TextInput({id}){
  const { removeInput, setInputBox, selectedFrame } = useContext(GlobalContext)
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

      return updatedInputBox
    })

  }
    return (
      <div className={classes.textInput} >
        <input name="text-input-user" type='text' onChange={handleInputChange}/>
        <div style={{ display: "flex", gap: "20px" }}>
          <div className={classes.model}>
            <input type="radio" name="prompt" />
            <label for="radio1">Prompt Assistant</label>
            <br></br>
            <input type="radio" name="tag" />
            <label for="radio2">Tag Assistant</label>
          </div>
          <div className={classes.btn}>
            <button>Translate</button>
            <br />
            <button cur-id={id} onClick={removeInput}>Exit</button>
          </div>
        </div>
      </div>
    )
}