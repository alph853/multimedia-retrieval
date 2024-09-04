import { useContext } from 'react'
import classes from './styles.module.css'
import { GlobalContext } from '../../../context'

export default function ModelSelection() {
  const {numImg,setNumImg} = useContext(GlobalContext);

  return (
    <div className={classes.whole}>
      <div>
        <div className={classes.model}>
          <p>
            <input type="radio" name="model-1" /> <span>Model 1</span>
          </p>
          <p>
            <input type="radio" name="model-2" /> <span>Model 2</span>
          </p>
          <p>
            <input type="radio" name="model-3" /> <span>Model 3</span>
          </p>
          <p>
            <input type="radio" name="model-4" /> <span>Model 4</span>
          </p>
        </div>
        <p className={classes.numberInput}>
          Number{" "}
          <span>
            <input type="number" name="model-input" onChange={e =>{setNumImg(e.target.value);console.log(numImg)}}></input>
          </span>
        </p>
      </div>
      <div className={classes.btn}>
        <button>Reset</button><br></br>
        <button style={{marginTop:'10px'}}>Search</button>
      </div>
    </div>
  )
}
