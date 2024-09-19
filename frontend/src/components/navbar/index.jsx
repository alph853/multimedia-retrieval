import { useContext, useEffect } from "react"
import logo from "../../assets/logo.png"
import classes from "./styles.module.css"
import { useNavigate } from "react-router-dom"
import { GlobalContext } from "../../context"
import axios from "axios"

export default function Navbar() {
  const navigate = useNavigate()
  const { uploadFiles, setUploadFiles } = useContext(GlobalContext)

  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        resolve({
          [file.name.split(".")[0]]: e.target.result,
        })
      }
      reader.readAsText(file)
    })
  }

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files)
    const fileContents = {}

    for (const file of files) {
      const content = await readFile(file)
      Object.assign(fileContents, content) 
    }

    setUploadFiles(fileContents)
  }
  useEffect(()=>{
    console.log(uploadFiles)
    if(Object.keys(uploadFiles).length!==0){
      axios.post("https://promoted-strictly-narwhal.ngrok-free.app/upload_queries",uploadFiles)
      .then(res=>{
        console.log(res.data);
      })
      .catch(err=>{
        console.log(err.message)
      })
    }
  },[uploadFiles])
  return (
    <div className={classes.navbar}>
      <div>
        <a href="/">
          <img src={logo} alt="logo" name="logo" className={classes.image} />
        </a>
      </div>
      <div style={{ display: "flex" }}>
        <ul className={classes.list}>
          <li>Media retrieval</li>
          <li>Getting Started</li>
          <li>
            <input
              type="file"
              multiple
              accept=".txt"
              onChange={handleFileChange}
            />
          </li>
          <li onClick={() => navigate("/history")}>Get Search History</li>
        </ul>
      </div>
    </div>
  )
}
