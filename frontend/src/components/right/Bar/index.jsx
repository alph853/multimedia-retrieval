import {useContext, useState } from 'react';
import classes from "./styles.module.css"
import { GlobalContext } from "../../../context"

export default function Bar(){
    const [inputValue, setInputValue ] = useState("")
    const [inputFilter, setInputFilter ] = useState("")
    const {images, setImages ,imageQueue, setImageQueue, checkFilter, setCheckFilter, imagesTemp, setImageTemp,selector,setSelector} = useContext(GlobalContext)
    function handleSubmitCsv(){
        const csvRows = []

        images.forEach((image) => {
          const [column1, column2] = image.format.split(", ")
          if(selector){
            csvRows.push(`${column1},${column2}`);
          }else{

          if(image.answer!=="") csvRows.push(`${column1},${column2},${image.answer}`)
          }
        })

        const csvString = csvRows.join("\n")
        const blob = new Blob([csvString], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "output.csv"
        link.click()
        URL.revokeObjectURL(url)
    }
    function handleImage() {
        images.splice(inputValue - 1, 0, ...imageQueue);
        console.log(images)
        setImages([...images])
        setImageQueue([])
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
        (checkFilter === false) ? setImageTemp(images) : null;
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
        setImageTemp(images)
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
      </div>
    )
}