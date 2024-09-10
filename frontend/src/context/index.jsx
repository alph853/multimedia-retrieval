import { createContext, useRef, useState } from "react"

export const GlobalContext = createContext(null)

export default function GlobalState({ children }) {
  const [images, setImages] = useState([])
  const [files, setFiles] = useState([])
  const [inputBox, setInputBox] = useState([
    {
      render: ["text"],
      data: {
        text: "",
        img_path: "",
        drawImg:[],
        tag: [],
      },
    },
  ])
  const [searchResponse, setSearchResponse] = useState({
    all: [
      {
        img_path:
          "https://i.pinimg.com/564x/6d/c3/47/6dc3470f6698bc499f95a034654b450c.jpg",
        scene_id: "/L10/V006/196",
        frm_number: "15441",
        score: 0.4631200432777405,
        frm_id: 272834,
        format: "L10_V006, 15441",
        publish_date: "25/02/2024",
        watch_url: "https://youtube.com/watch?v=ZHsJ3eNoCvk&t=617s",
      },
    ],
  })
  const [closeBoard, setCloseBoard] = useState(true)
  const [selectedFrame, setSelectedFrame] = useState(0)
  const [selectedImage, setSelectedImage] = useState(null)
  const [numImg,setNumImg] =  useState(0);
  const [canvasH,setCanvasH] = useState(0);
  const [canvasW,setCanvasW] = useState(0);
  const [imagesTemp, setImageTemp] =  useState(images)
  const [imageQueue, setImageQueue] = useState([])
  const [checkFilter, setCheckFilter ] = useState(false)
  const [selectTag, setSelectTag] = useState([])
  function handleClick(event) {
    const value = event.currentTarget.getAttribute("data-value")
    if (
      inputBox[selectedFrame].render.findIndex((item) => item === value) === -1
    ) {
      const newInputBox = [...inputBox]
      const newFrameArray = [...newInputBox[selectedFrame].render]
      newFrameArray.push(value)
      newInputBox[selectedFrame].render = newFrameArray
      setInputBox((p) => (p = newInputBox))
      console.log(inputBox)
    } else {
      alert("Only one for each frame")
    }
  }
  function removeInput(event) {
    const deleteId = parseInt(event.currentTarget.getAttribute("cur-id"))
    console.log(deleteId)
    const newInputBox = [...inputBox]
    const newFrameArray = [...newInputBox[selectedFrame].render].filter(
      (_, index) => index !== deleteId
    )
    newInputBox[selectedFrame].render = newFrameArray
    setInputBox((i) => (i = newInputBox))
  }
  return (
    <GlobalContext.Provider
      value={{
        images,
        setImages,
        inputBox,
        setInputBox,
        handleClick,
        removeInput,
        closeBoard,
        setCloseBoard,
        files,
        setFiles,
        selectedFrame,
        setSelectedFrame,
        searchResponse,
        setSearchResponse,
        selectedImage,
        setSelectedImage,
        numImg,
        setNumImg,
        canvasH,
        canvasW,
        setCanvasH,
        setCanvasW,
        imagesTemp, 
        setImageTemp,
        imageQueue,
        setImageQueue,
        checkFilter, 
        setCheckFilter,
        selectTag, 
        setSelectTag
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
