import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../../context";
import classes from './styles.module.css';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6";

export default function ImageSlider() {
  const { images, selectedImage, setSelectedImage, searchResponse, selectBtn, allKeyFrame} = useContext(GlobalContext);
  const [,LX, VX, ] = searchResponse[selectBtn][selectedImage]['scene_id'].split('/');

  const arrayScroll = allKeyFrame[LX][VX].sort()
  console.log(arrayScroll)
  console.log(searchResponse[selectBtn][selectedImage]['img_path'])
  const [select, setSelect] = useState(arrayScroll.indexOf(searchResponse[selectBtn][selectedImage]['img_path'].slice(1)))

  function handleImageClick(id) {
    setSelect(id);
  }

  function showPreviousImg() {
    if (select === 0) {
      setSelect(arrayScroll.length - 1);
    } else {
      setSelect(select - 1);
    }
    console.log(select)
  }

  function showNextImg() {
    if (select === arrayScroll.length - 1) {
      setSelect(0);
    } else {
      setSelect(select + 1);
    }
    console.log(select)
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'ArrowDown') {
        showNextImg();
      } else if (event.key === 'ArrowUp') {
        showPreviousImg();
      }
    }
    console.log(LX)
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [select, arrayScroll.length]);



  return (
    <div className={classes.slider_container}>
      <div className={classes.data_container}>
        <div className={classes.image_left}>
          <p>{arrayScroll[select]}</p>
          <div>
            <img src={`./public/images/${arrayScroll[select]}`} style={{height: "500px"}}/>
          </div>
          <div className={classes.btn_container}>
            <button onClick={showPreviousImg}>
              <FaChevronUp style={{ backgroundColor: "#212A37" }} />
            </button>
            <button onClick={showNextImg}>
              <FaChevronDown style={{ backgroundColor: "#212A37" }} />
            </button>
          </div>
        </div>

        <div className={classes.image_right}>
          {arrayScroll.map((image, idx) => (
            <img
              key={idx}
              src={`./public/images/${image}`}
              className={
                idx === select
                  ? `${classes.selected} ${classes.img}`
                  : classes.img
              }
              onClick={() => handleImageClick(idx)}
            />
          ))}
        </div>
      </div>

      <div className={classes.image_footer}>
        <button type="checkbox" style={{width: "30px", background: "white"}}/>
      </div>

      <div className={classes.close}>
        <FaRegCircleXmark onClick={() => setSelectedImage(null)} />
      </div>
    </div>
  );
}
