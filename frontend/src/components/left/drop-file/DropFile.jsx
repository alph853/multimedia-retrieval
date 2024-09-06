import React, { useCallback, useContext, useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import "./index.css"
import { FaCloudUploadAlt } from "react-icons/fa"
import { GlobalContext } from "../../../context"

function MyDropzone() {
  const { selectedFrame, inputBox, setInputBox } = useContext(GlobalContext)
  const [newFile, setNewFile] = useState(null) // Temporary state to hold the new file
  const [previewUrl, setPreviewUrl] = useState(null) // State to manage the preview URL

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        // Handle the new file
        const file = acceptedFiles[0]
        const newPreviewUrl = URL.createObjectURL(file)
        setPreviewUrl(newPreviewUrl)

        // Store the new file in local state
        setNewFile({ file, previewUrl: newPreviewUrl })

        // Update the inputBox state with the new image path for the selected frame
        setInputBox((prevInputBox) => {
          return prevInputBox.map((item, index) => {
            if (index === selectedFrame) {
              return {
                ...item,
                data: {
                  ...item.data,
                  img_path: newPreviewUrl, // Set the new image path
                  name: file.name,
                  size: file.size,
                },
              }
            }
            return item
          })
        })
      }
    },
    [setInputBox, selectedFrame]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1, // Only allow one file
    accept: "image/*", // Only accept image files
  })

  // Clean up the object URL when the component unmounts or when `previewUrl` changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        //URL.revokeObjectURL(previewUrl) // Clean up the old preview URL
      }
    }
  }, [previewUrl])

  // Get the current frame's file information
  const currentFrame = inputBox[selectedFrame]
  const currentFrameImgPath = currentFrame?.data?.img_path
  const currentFrameName = currentFrame?.data?.name
  const currentFrameSize = currentFrame?.data?.size

  return (
    <form>
      <div {...getRootProps()} className="dropZone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p style={{ fontSize: "12px", fontWeight: "500" }}>
            Drop the file here ...
          </p>
        ) : currentFrameImgPath ? (
          <ul style={{ listStyle: "none" }}>
            <li className="file-list">
              <div className="img">
                <img
                  src={currentFrameImgPath} // Display the image path from inputBox
                  alt={currentFrameName || "Uploaded Preview"}
                  width={30} // Adjust width as needed
                  height={30} // Adjust height as needed
                  id="image"
                />
              </div>
              <div className="img-info">
                <p style={{ fontWeight: "600" }}>{currentFrameName}</p>
                <p style={{ marginTop: "-10px" }}>
                  {Math.round(currentFrameSize / 1024)} KB
                </p>
              </div>
            </li>
          </ul>
        ) : (
          <div className="input">
            <FaCloudUploadAlt style={{ width: "30px", height: "30px" }} />
            <p
              style={{ marginTop: "0px", fontSize: "12px", fontWeight: "500" }}
            >
              Drag & Drop your file here or Click to browse file
            </p>
          </div>
        )}
      </div>
      {newFile && (
        <button
          className="submit-btn"
          type="button"
          onClick={() => setNewFile(null)}
        >
          Submit
        </button>
      )}
    </form>
  )
}

export default MyDropzone
