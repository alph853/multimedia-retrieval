import React, { useRef, useState, useEffect, useContext } from "react"
import "./index.css"
import { BsBrush, BsEraser } from "react-icons/bs"
import { FaRegCircleXmark } from "react-icons/fa6"
import { GlobalContext } from "../../../../context"
import { icons } from "./helper/icons"
import { importImages } from "./helper/importImg"

const DrawingBoard = () => {
  const [images, setImages] = useState({})
  const [isDrawing, setIsDrawing] = useState(false)
  const [selectedTool, setSelectedTool] = useState("brush")
  const [brushWidth, setBrushWidth] = useState(5)
  const [selectedColor, setSelectedColor] = useState("#000")
  const [snapshot, setSnapshot] = useState(null)
  const [prevMouseX, setPrevMouseX] = useState(0)
  const [prevMouseY, setPrevMouseY] = useState(0)
  const {closeBoard, setCloseBoard, files, setFiles} = useContext(GlobalContext)
  const [showMore, setShowMore] = useState(true)
  const [imageData, setImageData] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const loadImages = async () => {
      const importedImages = await importImages(icons)
      setImages(importedImages)
    }
    loadImages()
  }, [])

  const setCanvasBackground = (ctx, canvas) => {
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = selectedColor
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    setCanvasBackground(ctx, canvas)
  }, [])

  const startDraw = (e) => {
    if (selectedTool === "brush" || selectedTool === "eraser") {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      setIsDrawing(true)
      setPrevMouseX(e.nativeEvent.offsetX)
      setPrevMouseY(e.nativeEvent.offsetY)
      ctx.beginPath()
      ctx.lineWidth = brushWidth
      ctx.strokeStyle = selectedColor
      ctx.fillStyle = selectedColor
      setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height))
    } else if (selectedTool === "move") {
      handleMouseDown(e)
    }
  }

  const drawing = (e) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.putImageData(snapshot, 0, 0)
    if (selectedTool === "brush" || selectedTool === "eraser") {
      ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
      ctx.stroke()
    }
  }

  const handleMouseDown = (e) => {
    const x = e.nativeEvent.offsetX
    const y = e.nativeEvent.offsetY
    const image = imageData.find(
      (img) =>
        x >= img.x &&
        x <= img.x + img.width &&
        y >= img.y &&
        y <= img.y + img.height
    )

    if (image) {
      setSelectedImage(image)
      setPrevMouseX(x)
      setPrevMouseY(y)
      canvasRef.current.style.cursor = "move"
    }
  }

  const handleMouseMove = (e) => {
    if (selectedTool === "move" && selectedImage) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      const x = e.nativeEvent.offsetX
      const y = e.nativeEvent.offsetY
      const dx = x - prevMouseX
      const dy = y - prevMouseY

      const newImageData = imageData.map((img) =>
        img === selectedImage ? { ...img, x: img.x + dx, y: img.y + dy } : img
      )

      setImageData(newImageData)
      setPrevMouseX(x)
      setPrevMouseY(y)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setCanvasBackground(ctx, canvas)
      newImageData.forEach((img) => {
        ctx.drawImage(img.img, img.x, img.y, img.width, img.height)
      })
    } else if (isDrawing) {
      drawing(e)
    }
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
    setSelectedImage(null)
    canvasRef.current.style.cursor = "default"
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setCanvasBackground(ctx, canvas)
    setImageData([])
  }

  const saveImg = () => {
    const canvas = canvasRef.current
    canvas.toBlob(function(blob) {
      if (blob) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const file = {
          blob,
          size: blob.size,
          name: "image_"+ `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`,
          preview: URL.createObjectURL(blob),
        };
        setFiles((prevFiles) => [...prevFiles, file]);
      }
      console.log(file);
    }, 'image/png')
    setCloseBoard(true)
  }

  const handleDrag = (e) => {
    e.dataTransfer.setData("text/plain", e.currentTarget.id)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const icon = e.dataTransfer.getData("text/plain")
    if (!icon || !images[icon]) return
    const x = e.nativeEvent.offsetX
    const y = e.nativeEvent.offsetY
    const img = new Image()
    img.src = images[icon]
    img.onload = () => {
      const scale = 0.5 // Scale down to 50% of the original size
      const width = img.width * scale
      const height = img.height * scale
      ctx.drawImage(img, x - width / 2, y - height / 2, width, height)
      setImageData([
        ...imageData,
        { img, x: x - width / 2, y: y - height / 2, width, height },
      ])
    }
  }

  const handleDragOver = (e) => e.preventDefault()

  return (
    <div className="body">
      <div className="container">
        <section className="tools-board">
          <div className="row">
            <label className="title">Shapes</label>
            <ul className="options icons" style={{padding : "0px"}}>
              {!showMore
                ? icons.slice(0, 28).map((icon) => (
                    <li key={icon}>
                      <img
                        src={images[icon]}
                        alt={icon}
                        id={icon}
                        onClick={() => setSelectedTool(icon)}
                        draggable
                        onDragStart={handleDrag}
                      />
                    </li>
                  ))
                : icons.map((icon) => (
                    <li key={icon}>
                      <img
                        src={images[icon]}
                        alt={icon}
                        id={icon}
                        onClick={() => setSelectedTool(icon)}
                        draggable
                        onDragStart={handleDrag}
                        style={{filter: "invert(100%)", backgroundColor: "transparent"}}
                      />
                    </li>
                  ))}
            </ul>
          </div>

          <div className="row">
            <label className="title">Options</label>
            <ul className="options" style={{padding : "0px"}}>
              <li
                className={`option tool ${
                  selectedTool === "brush" ? "active" : ""
                }`}
                id="brush"
                onClick={() => setSelectedTool("brush")}
              >
                <BsBrush className="fa"></BsBrush>
                <span>Brush</span>
              </li>
              <li
                className={`option tool ${
                  selectedTool === "eraser" ? "active" : ""
                }`}
                id="eraser"
                onClick={() => setSelectedTool("eraser")}
              >
                <BsEraser className="fa"></BsEraser>
                <span>Eraser</span>
              </li>
              <li
                className={`option tool ${
                  selectedTool === "move" ? "active" : ""
                }`}
                id="move"
                onClick={() => setSelectedTool("move")}
              >
                <div>Width</div>
              </li>
              <li className="option">
                <input
                  type="range"
                  id="size-slider"
                  min="1"
                  max="30"
                  value={brushWidth}
                  onChange={(e) => setBrushWidth(e.target.value)}
                />
              </li>
            </ul>
          </div>

          <div className="row colors">
            <label className="title">Colors</label>
            <ul className="options" style={{padding : "0px"}}>
              <li
                className={`option ${
                  selectedColor === "#000" ? "selected" : ""
                }`}
                style={{ backgroundColor: "#000" }}
                onClick={() => setSelectedColor("#000")}
              ></li>
              <li
                className={`option ${
                  selectedColor === "#ff0000" ? "selected" : ""
                }`}
                style={{ backgroundColor: "#ff0000" }}
                onClick={() => setSelectedColor("#ff0000")}
              ></li>
              <li
                className={`option ${
                  selectedColor === "#00ff00" ? "selected" : ""
                }`}
                style={{ backgroundColor: "#00ff00" }}
                onClick={() => setSelectedColor("#00ff00")}
              ></li>
              <li
                className={`option ${
                  selectedColor === "#0000ff" ? "selected" : ""
                }`}
                style={{ backgroundColor: "#0000ff" }}
                onClick={() => setSelectedColor("#0000ff")}
              ></li>
              <li className="option" style={{ backgroundColor: selectedColor }}>
                <input
                  type="color"
                  value={selectedColor}
                  id="color-picker"
                  onChange={(e) => setSelectedColor(e.target.value)}
                />
              </li>
            </ul>
          </div>

          <div className="row buttons">
            <button className="clear-canvas" onClick={clearCanvas}>
              Clear Canvas
            </button>
            <button className="save-img" onClick={saveImg}>
              Save As Image
            </button>
          </div>
        </section>

        <section className="drawing-board">
          <canvas
            ref={canvasRef}
            onMouseDown={startDraw}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          ></canvas>
        </section>
      </div>
      <FaRegCircleXmark
        style={{
          fontSize: "20px",
          cursor: "pointer",
          position: "relative",
          top: "-265px",
          left: "-35px",
          zIndex: "100",
          borderRadius: "50%"
        }}
        onClick={() => setCloseBoard(true)}
      ></FaRegCircleXmark>
    </div>
  )
}

export default DrawingBoard
