import classes from './styles.module.css'

export default function Bar(){
    return <div className={classes.bar}>
        <div className={classes.btn}>
            <button>Undo</button>
            <button style={{marginLeft:'10px'}}>Redo</button>
        </div>
        <div className={classes.right}>
            <a>Home</a>
            <input type="checkbox" name="all"/>
            <label for="all">Select All</label>
        </div>
    </div>
}