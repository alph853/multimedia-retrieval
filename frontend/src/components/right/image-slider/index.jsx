import { useContext } from "react"
import { GlobalContext } from "../../../context"
import classes from './styles.module.css'
import { FaChevronDown,FaChevronUp, FaDownload, FaRedo, FaSearchPlus, FaUndo } from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6"
import Image from "../image";

export default function ImageSlider(){
    const {images,selectedImage,
          setSelectedImage} = useContext(GlobalContext);
          function handleImageClick(id) {
            setSelectedImage((i) => (i = id))
          }
    function showPreviousImg(){
      if(selectedImage===0){
        setSelectedImage(s=>s=images.length-1);
      }else{
        setSelectedImage(s=>s=selectedImage-1);
      }
      console.log(selectedImage);
    }
    function showNextImg(){
      if (selectedImage === images.length-1) {
        setSelectedImage((s) => (s = 0))
      } else {
        setSelectedImage((s) => (s = selectedImage +1))
      }
      console.log(selectedImage)
    }
    return (
      <div className={classes.slider_container}>
        <div className={classes.data_container}>
          <div className={classes.image_left}>
            <div>
              <img src={images[selectedImage]} />
            </div>

            <div className={classes.btn_container}>
              <button onClick={showPreviousImg}>
                <FaChevronUp></FaChevronUp>
              </button>
              <button onClick={showNextImg}>
                <FaChevronDown></FaChevronDown>
              </button>
            </div>
          </div>

          <div className={classes.image_right}>
            {images.map((image, idx) => (
              <img
                src={image}
                className={
                  idx === selectedImage
                    ? `${classes.selected} ${classes.img}`
                    : classes.img
                }
                onClick={()=>handleImageClick(idx)}
              ></img>
            ))}
          </div>
        </div>

        <div className={classes.image_footer}>
          <button>
            <FaDownload></FaDownload>
          </button>
          <div>
            <button>
              <FaUndo></FaUndo>
            </button>
            <button>
              <FaRedo></FaRedo>
            </button>
          </div>
          <button>
            <FaSearchPlus></FaSearchPlus>
          </button>
        </div>

        <div className={classes.close}>
          <FaRegCircleXmark onClick={()=>{setSelectedImage(null)}}></FaRegCircleXmark>
        </div>
      </div>
    )
}