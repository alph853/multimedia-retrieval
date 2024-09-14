import {
  FaPlus,
  FaCommentAlt,
  FaImage,
  FaTags,
  FaCloud,
  FaExpand,
} from "react-icons/fa"
import classes from "./styles.module.css"
import { useContext } from "react"
import { GlobalContext } from "../../context"

export default function SideBar() {
  const { inputBox, setInputBox, handleClick, setSelectedFrame } =
    useContext(GlobalContext)

  return (
    <div className={classes.sideBar}>
      <p>
        <FaPlus
          onClick={() => {
            if (inputBox.length >= 5) {
              alert("You have reached the limitation")
            } else {
              setSelectedFrame(inputBox.length)
              setInputBox((fr) => [
                ...fr,
                {
                  render: ["text"],
                  data: {
                    text: "",
                    img_path: "",
                    tag: [],
                  },
                },
              ])
            }
          }}
          style={{ background: "black" }}
        ></FaPlus>
      </p>
      <p data-value="text" onClick={handleClick}>
        <FaCommentAlt style={{ background: "black" }}></FaCommentAlt>
      </p>
      <p data-value="image" onClick={handleClick}>
        <FaImage style={{ background: "black" }}></FaImage>
      </p>
      <p data-value="tag" onClick={handleClick}>
        <FaTags style={{ background: "black" }}></FaTags>
      </p>
      <p>
        <FaCloud style={{ background: "black" }}></FaCloud>
      </p>
      <p data-value="ocr" onClick={handleClick}>
        <FaExpand style={{ background: "black" }}></FaExpand>
      </p>
    </div>
  )
}
