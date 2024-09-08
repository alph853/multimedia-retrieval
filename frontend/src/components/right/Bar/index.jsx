import {useContext, useState } from 'react';
import classes from "./styles.module.css"
import { GlobalContext } from "../../../context"

export default function Bar(){
    const [inputValue, setInputValue ] = useState("")
    const [inputFilter, setInputFilter ] = useState("")
    const {images, setImages ,imageQueue, setImageQueue, checkFilter, setCheckFilter, imagesTemp, setImageTemp} = useContext(GlobalContext)

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
    return <div className={classes.bar}>
        <div className={classes.btn}>
            <input 
                type='number' 
                placeholder='Number'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button 
                style={{marginLeft: '10px'}} 
                onClick={handleImage}
            >
                Sort
            </button>
        </div>
        <div className={classes.right}>
            <input 
                type='text' 
                placeholder='Filter'
                value={inputFilter}
                onChange={(e) => {setInputFilter(e.target.value)}}
                style={{width: "90px"}}
            />
            <button 
                style={{marginLeft: '10px'}} 
                onClick={handleFilter}
            >
                Filter
            </button>
            {checkFilter ? (<button style={{marginLeft: '10px', backgroundColor: "var(--bg-reset)"}} onClick={noFilter}>noFilter</button>) : (null)}
        </div>
    </div>
}