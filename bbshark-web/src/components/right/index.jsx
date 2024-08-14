import { useContext } from "react";
import Bar from "./Bar";
import Image from "./image";
import classes from './styles.module.css'
import { GlobalContext } from "../../context";

export default function Right(){
    const {images,setImages} = useContext(GlobalContext);
    return (
      <div style={{ flex: "0 0 68%", marginLeft: "15px" }}>
        <Bar></Bar>
        <div className={classes.imageContainer}>
          <Image src={images[0]}></Image>
          <Image src={images[1]}></Image>
          <Image src={images[2]}></Image>
          <Image src={images[3]}></Image>
          <Image src={images[4]}></Image>
          <Image src={images[5]}></Image>
          <Image src={images[6]}></Image>
          <Image src={images[7]}></Image>
          <Image src={images[8]}></Image>
        </div>
      </div>
    )
}