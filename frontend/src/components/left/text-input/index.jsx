import { useContext, useEffect } from 'react'
import classes from './styles.module.css'
import { GlobalContext } from '../../../context'
import axios from 'axios'


export default function TextInput({id}){
  const {removeInput, setInputBox, selectedFrame, inputBox, tagAssistant, setTagAssistant, handleClick} = useContext(GlobalContext)
  const handleInputChange = e =>{
    setInputBox((prevInputBox) => {
      const updatedInputBox = [...prevInputBox]
      updatedInputBox[selectedFrame] = {
        ...updatedInputBox[selectedFrame],
        data: {
          ...updatedInputBox[selectedFrame].data,
          text: e.target.value,
        },
      }
      return updatedInputBox
    })
  }
  const handleTagAssistant = e => {
    axios.post("https://amazed-seasnail-uniformly.ngrok-free.app/assistant",{
        "type": "tag",
        "query": inputBox[selectedFrame].data.text,
    })
      .then (res => {
        const updateTagAssistant = {...tagAssistant}
        updateTagAssistant[selectedFrame] = res.data
        setTagAssistant(updateTagAssistant)
      })
      .catch (err => console.log(err))
      handleClick(e)
  }
  useEffect(() => {
    console.log(tagAssistant)
  }, [tagAssistant])
    return (
      <div className={classes.textInput}>
        <textarea name="text-input-user" onChange={handleInputChange} value={inputBox[selectedFrame].data.text}/>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
          <div className={classes.model}>
            <button >Prompt Assistant</button>
            <button style={{marginTop: "10px"}} onClick={handleTagAssistant} data-value="tag" >Tag Assistant</button>
          </div>
          <div className={classes.btn}>
            <button style={{backgroundColor: "#22253489"}}>Translate</button>
            <button cur-id={id} onClick={removeInput}  style={{marginTop: "10px", backgroundColor : "var(--bg-reset)"}}>Exit</button>
          </div>
        </div>
      </div>
    )
}
