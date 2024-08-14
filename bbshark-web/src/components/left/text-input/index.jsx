import { useContext } from 'react'
import classes from './styles.module.css'
import { GlobalContext } from '../../../context'


export default function TextInput({id}){
  const {removeInput} = useContext(GlobalContext)
    return (
      <div className={classes.textInput}>
        <textarea name="text-input-user" />
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