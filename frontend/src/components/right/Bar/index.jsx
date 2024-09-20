import {useContext, useState } from 'react';
import classes from "./styles.module.css"
import { GlobalContext } from "../../../context"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"

export default function Bar(){
    const [inputValue, setInputValue ] = useState("")
    const [inputFilter, setInputFilter ] = useState("")
    const [rows,setRows] = useState("")
    const [content,setContent] = useState([])
    const [editOpen,setEditOpen] = useState(false); 

    const {numImg,fileName,setFileName,images, setImages ,imageQueue, setImageQueue, checkFilter, setCheckFilter, imagesTemp, setImageTemp,selector,setSelector, searchResponse, setSearchResponse, selectBtn, setSelectBtn,inputBox} = useContext(GlobalContext)
    function handleSubmitCsv(){
        const csvRows = []
        
        console.log(searchResponse)

        searchResponse[selectBtn].forEach((image) => {
          const [column1, column2] = image.format.split(", ")
          if(selector){
            csvRows.push(`${column1},${column2}`);
          }else{
            if(image.answer) csvRows.push(`${column1},${column2},${image.answer}`)
          }
        })
        setContent(csvRows);
        const csvString = csvRows.join("\n")
        setRows(csvString);
        setEditOpen(true);
    }
    function handleImage() {
        searchResponse[selectBtn].splice(inputValue - 1, 0, ...imageQueue[selectBtn]);
        setSearchResponse({...searchResponse})
        setImageQueue({})
    }

    function filterArr(target, arr) {
        return arr.filter(item => {
            return item['scene_id'].split('/').filter(part => part !== '').includes(target)
        })
    }
    function handleSelectChange(e){
        console.log(e.target.value)
        if(e.target.value==="KIS"){
            setSelector(true);
        }else setSelector(false);
    }
    function handleFilter() {
        (checkFilter === false) ? setImageTemp(searchResponse[selectBtn]) : null;
        setCheckFilter(true)
        let i = 0
        const targetParts = inputFilter.split('/').filter(part => part !== '');
        while (i < targetParts.length) {
            setImageTemp(filterArr(targetParts[i], imagesTemp));
            i += 1
        }
    }

    function noFilter(){
        setCheckFilter(false)
        setImageTemp(searchResponse[selectBtn])
    }
    function handleFile(){
      const blob = new Blob([rows], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = fileName == "" ? "output.csv" : `${fileName}.csv`
      link.click()
      URL.revokeObjectURL(url)
      toast.dark("File csv downloaded")
      setEditOpen(false)
      const obj = {}
      inputBox.forEach((input, index) => {
        const key = (index + 1).toString()
        const { text, img_path, drawImg, tag, ocr } = input.data
        obj[key] = {
          txt: text,
          img: img_path.length > 0 ? img_path : null,
          ocr: ocr == "" ? null : ocr,
          idx: null,
          tag: tag ? tag : null,
          asr: null,
          obj: drawImg?.length
            ? {
                canvasSize: { h: canvasH, w: canvasW },
                dragObject: drawImg.map((obj) => ({
                  class: obj.imageName,
                  position: {
                    xTop: obj.x,
                    xBottom: obj.x + obj.width,
                    yTop: obj.y,
                    yBottom: obj.y + obj.height,
                  },
                })),
                drawColor: [],
              }
            : null,
        }
      })
      const rq = {
        request: {
          number: numImg,
          search_space_idx: [],
          number_of_frames: inputBox.length,
          frame_info: obj,
        },
        filename: fileName,
        csv_content: content,
      }
      console.log(rq);
      
      axios
        .post(
          "https://amazed-seasnail-uniformly.ngrok-free.app/add_history",
          rq
        )
        .then((res) => console.log(res))
        .catch((err) => console.log(err.message))
        
    }
    return (
      <div className={classes.bar}>
        <div className={classes.btn}>
          <input
            type="number"
            placeholder="Number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button style={{ marginLeft: "10px" }} onClick={handleImage}>
            Sort
          </button>
        </div>
        <div className={classes.right}>
          <input
            type="text"
            placeholder="Filter"
            value={inputFilter}
            onChange={(e) => {
              setInputFilter(e.target.value)
            }}
            style={{ width: "90px" }}
          />
          <input
            type="text"
            placeholder="File name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            style={{width:'100px',marginLeft:'10px'}}
          />
          <button style={{ marginLeft: "10px" }} onClick={handleFilter}>
            Filter
          </button>

          {checkFilter ? (
            <button
              style={{ marginLeft: "10px", backgroundColor: "var(--bg-reset)" }}
              onClick={noFilter}
            >
              noFilter
            </button>
          ) : null}
          <select className={classes.selection} onChange={handleSelectChange}>
            <option>KIS</option>
            <option>Q&A</option>
          </select>
          <button style={{ marginLeft: "10px" }} onClick={handleSubmitCsv}>
            Submit
          </button>
        </div>
        {editOpen && <div className={classes.modalContainer}>
          <textarea 
            value={rows}
            onChange={(e)=>setRows(e.target.value)}
          />
          <button onClick={handleFile}>Edit</button>
          </div>}
      </div>
    )
}