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
        ></FaPlus>
      </p>
      <p data-value="text" onClick={handleClick}>
        <FaCommentAlt></FaCommentAlt>
      </p>
      <p data-value="image" onClick={handleClick}>
        <FaImage></FaImage>
      </p>
      <p data-value="tag" onClick={handleClick}>
        <FaTags></FaTags>
      </p>
      <p>
        <FaCloud></FaCloud>
      </p>
      <p>
        <FaExpand></FaExpand>
      </p>
    </div>
  )
}
