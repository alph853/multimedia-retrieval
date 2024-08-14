import classes from './styles.module.css'

export default function Image({src}){
    return <div className={classes.image}>
        <img src={src}/>
    </div>
}