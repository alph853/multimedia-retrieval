import { createContext, useRef, useState } from "react"

export const GlobalContext = createContext(null)

export default function GlobalState({ children }) {
  const [images, setImages] = useState([
    "https://i.pinimg.com/564x/c2/03/1a/c2031aba64613cd5a2381e85ed437c60.jpg",
    "https://i.pinimg.com/564x/d8/76/12/d876125c31bf48fca36ecadebb19b551.jpg",
    "https://i.pinimg.com/564x/a5/59/e3/a559e3e59fd9a38d909f5e016050e229.jpg",
    "https://i.pinimg.com/564x/b1/e7/90/b1e79090a5095f66834488313f5cb798.jpg",
    "https://i.pinimg.com/564x/b9/1e/9c/b91e9cbc180fb1920e91f94c221a6775.jpg",
    "https://i.pinimg.com/564x/76/b8/15/76b8152add4f59b641b1fef3d22c950a.jpg",
    "https://i.pinimg.com/736x/a0/96/93/a09693a30fbd234a37603ccc4756520f.jpg",
    "https://i.pinimg.com/736x/5f/93/73/5f9373cc2e4f4e219612ed4426923116.jpg",
    "https://i.pinimg.com/564x/b3/c2/8a/b3c28a61907847512541ce0983c06217.jpg",
  ])
  
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
  const [closeBoard, setCloseBoard] = useState(true)
  const [searchResponse, setSearchResponse] = useState([])
  const [selectedFrame, setSelectedFrame] = useState(0)
  const [selectedImage, setSelectedImage] = useState(null)
  const [numImg,setNumImg] =  useState(0);
  const [canvasH,setCanvasH] = useState(0);
  const [canvasW,setCanvasW] = useState(0);
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
  // const [files, setFiles] = useState([])
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
        setCanvasW
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
