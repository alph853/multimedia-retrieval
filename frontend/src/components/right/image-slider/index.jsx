import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../../context";
import classes from './styles.module.css';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6";
import axios from "axios"

export default function ImageSlider() {
  const { images, selectedImage, setSelectedImage, searchResponse, selectBtn, allKeyFrame, setSearchResponse} = useContext(GlobalContext);
  const [,LX, VX, ] = searchResponse[selectBtn][selectedImage]['scene_id'].split('/');

  const arrayScroll = allKeyFrame[LX][VX].sort()
  const [select, setSelect] = useState(arrayScroll.indexOf(searchResponse[selectBtn][selectedImage]['img_path']))

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

  const handleAddFrame = () => {
    const frameId = arrayScroll[select].split('.')[0]
    const updatedRespone = {...searchResponse};
    axios.get(`https://amazed-seasnail-uniformly.ngrok-free.app/get_frame_info/${frameId}`)
      .then(respone => {
        console.log(frameId)
        console.log(respone.data)
        updatedRespone[selectBtn].unshift(respone.data);
        setSearchResponse(updatedRespone);
        setSelectedImage(selectedImage + 1)
      })
      .catch(error => console.log(error))
  }



  return (
    <div className={classes.slider_container}>
      <div className={classes.data_container}>
        <div className={classes.image_left}>
          <p onClick={handleAddFrame} className={classes.title}>{arrayScroll[select]}</p>
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
