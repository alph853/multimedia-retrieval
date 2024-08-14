import { createContext, useRef, useState } from "react";


export const GlobalContext = createContext(null);

export default function GlobalState({children}){
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
    ]);
     const [files, setFiles] = useState([])
    const [inputBox,setInputBox] = useState(["text"]);
    const [closeBoard, setCloseBoard] = useState(true);
    function handleClick(event) {
      const value = event.currentTarget.getAttribute("data-value")
      setInputBox((pInputBox) => [...pInputBox,value])
      console.log(inputBox)
    }
    function removeInput(event){
        const deleteId = parseInt(event.currentTarget.getAttribute("cur-id"));
        console.log(deleteId);
        setInputBox(i=>i.filter((_,index)=>index!==deleteId))
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
          setFiles
        }}
      >
        {children}
      </GlobalContext.Provider>
    )
}