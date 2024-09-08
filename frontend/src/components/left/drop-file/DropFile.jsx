import React, { useCallback, useContext, useState } from "react"
import { useDropzone } from "react-dropzone"
import "./index.css"
import { FaCloudUploadAlt } from "react-icons/fa"
import { GlobalContext } from "../../../context"

function MyDropzone() {
  const {files,setFiles} = useContext(GlobalContext);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles?.length) {
        setFiles((f) => [
          ...f,
          ...acceptedFiles.map((file) => {
            return Object.assign(file, { preview: URL.createObjectURL(file) })
          }),
        ])
      }
    },
    [files]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <form>
      <div {...getRootProps()} className="dropZone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p style={{ fontSize: "12px", fontWeight: "500" }}>
            Drop the files here ...
          </p>
        ) : files.length === 0 ? (
          <div className="input">
            <FaCloudUploadAlt style={{ width: "30px", height: "30px" }} />
            <p
              style={{ marginTop: "0px", fontSize: "12px", fontWeight: "500" }}
            >
              Drag & Drop your file here or Click to browse file
            </p>
          </div>
        ) : (
            <ul style={{ listStyle: "none" }}>
              {files.map((file) => (
                
                <li key={file.name} className="file-list">
                  <div className="img">
                  {console.log(file)}
                    <img
                      src={file.preview}
                      alt=""
                      width={30}
                      height={30}
                      id="image"
                    />
                  </div>
                  <div className="img-info">
                    <p style={{ fontWeight: "600" }}>{file.name}</p>
                    <p style={{ marginTop: "-10px" }}>{file.size}B</p>
                  </div>
                </li>
              ))}
            </ul>
        )}
      </div>
      {
        files.length>0?<button className="submit-btn">
          Submit
        </button>:null
      }
    </form>
  )
}

export default MyDropzone
