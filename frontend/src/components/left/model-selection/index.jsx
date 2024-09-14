import classes from './styles.module.css'

export default function ModelSelection() {
  return (
    <div className={classes.whole}>
      <div>
        <div className={classes.model}>
          <p>
            <input type="radio" name="model" /> <span>Model 1</span>
          </p>
          <p>
            <input type="radio" name="model" /> <span>Model 2</span>
          </p>
          <p>
            <input type="radio" name="model" /> <span>Model 3</span>
          </p>
          <p>
            <input type="radio" name="model" /> <span>Model 4</span>
          </p>
        </div>
        <p className={classes.numberInput}>
          Number
          <div>
            <input type="number" name="model-input" onChange={() => {}}></input>
          </div>
        </p>
      </div>
      <div className={classes.btn}>
        <button style={{backgroundColor: 'var(--bg-reset)'}}>Reset</button><br></br>
        <button style={{backgroundColor: 'var(--bg-submit)'}}>Search</button>
      </div>
    </div>
  )
}
