import { useContext} from "react"
import classes from "./styles.module.css"
import { GlobalContext } from "../../../context"

export default function OcrInput({ id }) {
  const { removeInput, setInputBox, selectedFrame, inputBox } =
    useContext(GlobalContext)
  const handleInputChange = (e) => {
    setInputBox((prevInputBox) => {
      const updatedInputBox = [...prevInputBox]
      updatedInputBox[selectedFrame] = {
        ...updatedInputBox[selectedFrame],
        data: {
          ...updatedInputBox[selectedFrame].data,
          ocr: e.target.value,
        },
      }
      return updatedInputBox
    })
  }
  return (
    <div className={classes.textInput}>
      <textarea
        name="text-input-user"
        onChange={handleInputChange}
        value={inputBox[selectedFrame].data.ocr}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >

        <div className={classes.btn}>
          <button style={{ backgroundColor: "#22253489" }}>Translate</button>
          <button
            cur-id={id}
            onClick={removeInput}
            style={{ marginTop: "10px", backgroundColor: "var(--bg-reset)" }}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  )
}
