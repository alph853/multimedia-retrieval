import { createContext, useRef, useState } from "react"

export const GlobalContext = createContext(null)

export default function GlobalState({ children }) {
  const [images, setImages] = useState([
      {
          "img_path": "https://i.pinimg.com/564x/d8/76/12/d876125c31bf48fca36ecadebb19b551.jpg",
          "scene_id": "/L01/V01/0",
          "frm_number": "0000",
          "score": "0.8234567890",
          "frm_id": 1000
      },
      {
          "img_path": "https://i.pinimg.com/564x/a5/59/e3/a559e3e59fd9a38d909f5e016050e229.jpg",
          "scene_id": "/L01/V01/1",
          "frm_number": "0001",
          "score": "0.6743210987",
          "frm_id": 1001
      },
      {
          "img_path": "https://i.pinimg.com/564x/b1/e7/90/b1e79090a5095f66834488313f5cb798.jpg",
          "scene_id": "/L01/V01/2",
          "frm_number": "0002",
          "score": "0.7123456789",
          "frm_id": 1002
      },
      {
          "img_path": "https://i.pinimg.com/564x/b9/1e/9c/b91e9cbc180fb1920e91f94c221a6775.jpg",
          "scene_id": "/L01/V01/3",
          "frm_number": "0003",
          "score": "0.6456789012",
          "frm_id": 1003
      },
      {
          "img_path": "https://i.pinimg.com/564x/76/b8/15/76b8152add4f59b641b1fef3d22c950a.jpg",
          "scene_id": "/L01/V01/4",
          "frm_number": "0004",
          "score": "0.7823456789",
          "frm_id": 1004
      },
      {
          "img_path": "https://i.pinimg.com/736x/a0/96/93/a09693a30fbd234a37603ccc4756520f.jpg",
          "scene_id": "/L01/V01/5",
          "frm_number": "0005",
          "score": "0.7345678901",
          "frm_id": 1005
      },
      {
          "img_path": "https://i.pinimg.com/736x/5f/93/73/5f9373cc2e4f4e219612ed4426923116.jpg",
          "scene_id": "/L01/V01/6",
          "frm_number": "0006",
          "score": "0.6987654321",
          "frm_id": 1006
      },
      {
          "img_path": "https://i.pinimg.com/564x/b3/c2/8a/b3c28a61907847512541ce0983c06217.jpg",
          "scene_id": "/L01/V01/7",
          "frm_number": "0007",
          "score": "0.7567890123",
          "frm_id": 1007
      },
      {
          "img_path": "https://i.pinimg.com/564x/c2/03/1a/c2031aba64613cd5a2381e85ed437c60.jpg",
          "scene_id": "/L01/V01/8",
          "frm_number": "0008",
          "score": "0.8123456789",
          "frm_id": 1008
      },
      {
          "img_path": "https://i.pinimg.com/564x/d8/76/12/d876125c31bf48fca36ecadebb19b551.jpg",
          "scene_id": "/L01/V01/9",
          "frm_number": "0009",
          "score": "0.6934567890",
          "frm_id": 1009
      },
      {
        "img_path": "https://i.pinimg.com/564x/d8/76/12/d876125c31bf48fca36ecadebb19b551.jpg",
        "scene_id": "/L02/V01/0",
        "frm_number": "0000",
        "score": "0.8234567890",
        "frm_id": 1000
    },
    {
        "img_path": "https://i.pinimg.com/564x/a5/59/e3/a559e3e59fd9a38d909f5e016050e229.jpg",
        "scene_id": "/L02/V01/1",
        "frm_number": "0001",
        "score": "0.6743210987",
        "frm_id": 1001
    },
    {
        "img_path": "https://i.pinimg.com/564x/b1/e7/90/b1e79090a5095f66834488313f5cb798.jpg",
        "scene_id": "/L02/V01/2",
        "frm_number": "0002",
        "score": "0.7123456789",
        "frm_id": 1002
    },
    {
        "img_path": "https://i.pinimg.com/564x/b9/1e/9c/b91e9cbc180fb1920e91f94c221a6775.jpg",
        "scene_id": "/L02/V01/3",
        "frm_number": "0003",
        "score": "0.6456789012",
        "frm_id": 1003
    },
    {
        "img_path": "https://i.pinimg.com/564x/76/b8/15/76b8152add4f59b641b1fef3d22c950a.jpg",
        "scene_id": "/L02/V01/4",
        "frm_number": "0004",
        "score": "0.7823456789",
        "frm_id": 1004
    },
    {
        "img_path": "https://i.pinimg.com/736x/a0/96/93/a09693a30fbd234a37603ccc4756520f.jpg",
        "scene_id": "/L02/V01/5",
        "frm_number": "0005",
        "score": "0.7345678901",
        "frm_id": 1005
    },
    {
        "img_path": "https://i.pinimg.com/736x/5f/93/73/5f9373cc2e4f4e219612ed4426923116.jpg",
        "scene_id": "/L02/V01/6",
        "frm_number": "0006",
        "score": "0.6987654321",
        "frm_id": 1006
    },
    {
        "img_path": "https://i.pinimg.com/564x/b3/c2/8a/b3c28a61907847512541ce0983c06217.jpg",
        "scene_id": "/L02/V01/7",
        "frm_number": "0007",
        "score": "0.7567890123",
        "frm_id": 1007
    },
    {
        "img_path": "https://i.pinimg.com/564x/c2/03/1a/c2031aba64613cd5a2381e85ed437c60.jpg",
        "scene_id": "/L02/V01/8",
        "frm_number": "0008",
        "score": "0.8123456789",
        "frm_id": 1008
    },
    {
        "img_path": "https://i.pinimg.com/564x/d8/76/12/d876125c31bf48fca36ecadebb19b551.jpg",
        "scene_id": "/L02/V01/9",
        "frm_number": "0009",
        "score": "0.6934567890",
        "frm_id": 1009
    }
  ])
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
  const [closeBoard, setCloseBoard] = useState(true)
  const [searchResponse, setSearchResponse] = useState([])
  const [selectedFrame, setSelectedFrame] = useState(0)
  const [selectedImage, setSelectedImage] = useState(null)
  const [numImg,setNumImg] =  useState(0);
  const [canvasH,setCanvasH] = useState(0);
  const [canvasW,setCanvasW] = useState(0);
  const [imagesTemp, setImageTemp] =  useState(images)
  const [imageQueue, setImageQueue] = useState([])
  const [checkFilter, setCheckFilter ] = useState(false)
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
        setCheckFilter
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
